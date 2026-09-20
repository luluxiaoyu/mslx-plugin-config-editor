using System.IO.Compression;
using System.Text;

namespace MSLX.Plugin.Config.Editor.Services;

public class ConfigTemplateService
{
    /// <summary>
    /// 从 Jar 包内提取默认配置文件
    /// <summary>
    /// 从 Jar 包内提取默认配置文件（支持 Jar-in-Jar 嵌套包深度扫描，如 LuckPerms 等）
    /// </summary>
    public async Task<(bool success, string? content, string? message)> GetJarTemplateAsync(
        string serverBasePath, 
        string pluginsRelPath, 
        string jarFileName, 
        string internalPath = "config.yml")
    {
        if (string.IsNullOrEmpty(serverBasePath) || !Directory.Exists(serverBasePath))
            return (false, null, "服务器实例目录不存在");

        var jarFullPath = Path.Combine(serverBasePath, pluginsRelPath, jarFileName);
        if (!File.Exists(jarFullPath))
            return (false, null, $"未找到目标 Jar 包文件: {jarFileName}");

        try
        {
            using var archive = ZipFile.OpenRead(jarFullPath);
            var content = await FindTemplateInArchiveAsync(archive, internalPath, 0);

            if (content == null)
            {
                return (false, null, $"Jar 包及嵌套包内未找到默认配置文件: {internalPath}");
            }

            return (true, content, null);
        }
        catch (Exception ex)
        {
            return (false, null, $"从 Jar 包读取模版失败: {ex.Message}");
        }
    }

    private async Task<string?> FindTemplateInArchiveAsync(ZipArchive archive, string internalPath, int depth)
    {
        if (depth > 2) return null;

        var targetFileName = Path.GetFileName(internalPath);

        // 1. 精确匹配全路径
        var entry = archive.GetEntry(internalPath) ?? 
                    archive.GetEntry(internalPath.TrimStart('/')) ??
                    archive.Entries.FirstOrDefault(e => string.Equals(e.FullName, internalPath, StringComparison.OrdinalIgnoreCase));

        // 2. 匹配文件名 (如 config.yml, messages.yml 等)
        if (entry == null && !string.IsNullOrEmpty(targetFileName))
        {
            entry = archive.Entries.FirstOrDefault(e => string.Equals(e.Name, targetFileName, StringComparison.OrdinalIgnoreCase));
        }

        // 3. 如果是查找 config.yml，增加常见默认配置文件名容错 (如 config.yaml, config.conf, luckperms.conf 等)
        if (entry == null && (targetFileName.Equals("config.yml", StringComparison.OrdinalIgnoreCase) || 
                              targetFileName.Equals("config.yaml", StringComparison.OrdinalIgnoreCase)))
        {
            entry = archive.Entries.FirstOrDefault(e => 
                string.Equals(e.Name, "config.yml", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(e.Name, "config.yaml", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(e.Name, "config.conf", StringComparison.OrdinalIgnoreCase) ||
                (e.Name.EndsWith(".conf", StringComparison.OrdinalIgnoreCase) && e.Name.Contains("config", StringComparison.OrdinalIgnoreCase)) ||
                string.Equals(e.Name, "luckperms.conf", StringComparison.OrdinalIgnoreCase));
        }

        if (entry != null)
        {
            using var stream = entry.Open();
            using var reader = new StreamReader(stream, Encoding.UTF8);
            return await reader.ReadToEndAsync();
        }

        // 4. 深入检索 Jar-in-Jar 嵌套包 (.jar / .jarinjar)
        var nestedEntries = archive.Entries
            .Where(e => e.FullName.EndsWith(".jar", StringComparison.OrdinalIgnoreCase) || 
                        e.FullName.EndsWith(".jarinjar", StringComparison.OrdinalIgnoreCase))
            .ToList();

        foreach (var nestedEntry in nestedEntries)
        {
            try
            {
                using var nestedStream = nestedEntry.Open();
                using var memStream = new MemoryStream();
                await nestedStream.CopyToAsync(memStream);
                memStream.Position = 0;

                using var nestedArchive = new ZipArchive(memStream, ZipArchiveMode.Read);
                var nestedContent = await FindTemplateInArchiveAsync(nestedArchive, internalPath, depth + 1);
                if (nestedContent != null)
                {
                    return nestedContent;
                }
            }
            catch
            {
                // 忽略非有效 zip 格式或被加密的嵌套条目
            }
        }

        return null;
    }

    /// <summary>
    /// 读取实例配置文件
    /// </summary>
    public async Task<(bool success, string? content, string? message)> ReadFileContentAsync(string serverBasePath, string relPath)
    {
        var (isSafe, fullPath, message) = CheckSafePath(serverBasePath, relPath);
        if (!isSafe || fullPath == null)
            return (false, null, message);

        if (!File.Exists(fullPath))
            return (false, null, "文件不存在");

        try
        {
            using var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var reader = new StreamReader(stream, Encoding.UTF8);
            var content = await reader.ReadToEndAsync();
            return (true, content, null);
        }
        catch (Exception ex)
        {
            return (false, null, $"读取文件失败: {ex.Message}");
        }
    }

    /// <summary>
    /// 保存配置文件并可选自动备份
    /// </summary>
    public async Task<(bool success, string? message)> SaveFileWithBackupAsync(
        string serverBasePath, 
        string relPath, 
        string newContent, 
        bool createBackup = true)
    {
        var (isSafe, fullPath, message) = CheckSafePath(serverBasePath, relPath);
        if (!isSafe || fullPath == null)
            return (false, message);

        try
        {
            // 确保目录存在
            var dir = Path.GetDirectoryName(fullPath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            // 自动生成备份
            if (createBackup && File.Exists(fullPath))
            {
                var bakPath = fullPath + ".bak";
                File.Copy(fullPath, bakPath, true);
            }

            await File.WriteAllTextAsync(fullPath, newContent, new UTF8Encoding(false));
            return (true, null);
        }
        catch (Exception ex)
        {
            return (false, $"保存文件失败: {ex.Message}");
        }
    }

    private (bool isSafe, string? fullPath, string? message) CheckSafePath(string serverBasePath, string relPath)
    {
        if (string.IsNullOrEmpty(serverBasePath) || string.IsNullOrEmpty(relPath))
            return (false, null, "路径参数不能为空");

        try
        {
            var combined = Path.GetFullPath(Path.Combine(serverBasePath, relPath));
            var root = Path.GetFullPath(serverBasePath);

            if (!combined.StartsWith(root, StringComparison.OrdinalIgnoreCase))
            {
                return (false, null, "非法路径：禁止越界访问实例目录外部");
            }

            return (true, combined, null);
        }
        catch (Exception ex)
        {
            return (false, null, $"路径校验异常: {ex.Message}");
        }
    }
}
