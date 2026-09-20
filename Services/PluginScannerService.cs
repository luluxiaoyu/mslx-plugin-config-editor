using System.IO.Compression;
using System.Text.Json;
using System.Text.RegularExpressions;
using MSLX.Plugin.Config.Editor.Models;
using MSLX.SDK.Models;

namespace MSLX.Plugin.Config.Editor.Services;

public class PluginScannerService
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".yml", ".yaml", ".json", ".toml", ".properties", ".conf", ".txt", ".ini", ".cfg", ".xml", ".lang"
    };

    public PluginScanResultDto ScanInstancePlugins(McServerInfo.ServerInfo server)
    {
        var result = new PluginScanResultDto
        {
            PluginsPath = string.IsNullOrWhiteSpace(server.PluginsPath) ? "plugins" : server.PluginsPath
        };

        var serverBasePath = server.Base;
        if (string.IsNullOrEmpty(serverBasePath) || !Directory.Exists(serverBasePath))
        {
            return result;
        }

        var pluginsFullPath = Path.Combine(serverBasePath, result.PluginsPath);
        if (!Directory.Exists(pluginsFullPath))
        {
            return result;
        }

        // 获取所有的 jar 文件和 disabled 文件
        var jarFiles = Directory.GetFiles(pluginsFullPath, "*.jar", SearchOption.TopDirectoryOnly)
            .Concat(Directory.GetFiles(pluginsFullPath, "*.jar.disabled", SearchOption.TopDirectoryOnly))
            .ToList();

        // 获取 plugins 目录下的所有子文件夹
        var subDirs = Directory.GetDirectories(pluginsFullPath, "*", SearchOption.TopDirectoryOnly)
            .Select(d => new DirectoryInfo(d))
            .ToList();

        var matchedDirs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var jarPath in jarFiles)
        {
            var fileName = Path.GetFileName(jarPath);
            var isEnabled = !fileName.EndsWith(".disabled", StringComparison.OrdinalIgnoreCase);
            var cleanFileName = isEnabled 
                ? Path.GetFileNameWithoutExtension(fileName) 
                : Path.GetFileNameWithoutExtension(fileName.Substring(0, fileName.Length - ".disabled".Length));

            var pluginInfo = ParseJarManifest(jarPath);
            pluginInfo.JarFileName = fileName;
            pluginInfo.Enabled = isEnabled;

            if (string.IsNullOrWhiteSpace(pluginInfo.PluginName))
            {
                pluginInfo.PluginName = cleanFileName;
            }

            // 寻找匹配的数据文件夹
            var matchedDir = FindMatchingConfigDir(subDirs, pluginInfo.PluginName, cleanFileName);
            if (matchedDir != null)
            {
                pluginInfo.HasConfigDir = true;
                pluginInfo.ConfigDirPath = Path.GetRelativePath(serverBasePath, matchedDir.FullName).Replace('\\', '/');
                pluginInfo.Files = ScanConfigFiles(matchedDir.FullName, serverBasePath);
                matchedDirs.Add(matchedDir.FullName);
            }
            else
            {
                pluginInfo.HasConfigDir = false;
                pluginInfo.ConfigDirPath = Path.Combine(result.PluginsPath, pluginInfo.PluginName).Replace('\\', '/');
                pluginInfo.Files = new List<PluginConfigFileDto>();
            }

            result.Plugins.Add(pluginInfo);
        }

        // 按插件名称排序
        result.Plugins = result.Plugins.OrderBy(p => p.PluginName, StringComparer.OrdinalIgnoreCase).ToList();

        return result;
    }

    private DirectoryInfo? FindMatchingConfigDir(List<DirectoryInfo> subDirs, string pluginName, string cleanJarName)
    {
        // 1. 精确匹配插件名
        var dir = subDirs.FirstOrDefault(d => string.Equals(d.Name, pluginName, StringComparison.OrdinalIgnoreCase));
        if (dir != null) return dir;

        // 2. 精确匹配 jar 文件名（去后缀）
        dir = subDirs.FirstOrDefault(d => string.Equals(d.Name, cleanJarName, StringComparison.OrdinalIgnoreCase));
        if (dir != null) return dir;

        // 3. 模糊前缀匹配 (例如 EssentialsX-2.20.1 -> Essentials)
        dir = subDirs.FirstOrDefault(d => cleanJarName.StartsWith(d.Name + "-", StringComparison.OrdinalIgnoreCase) ||
                                          cleanJarName.StartsWith(d.Name + "_", StringComparison.OrdinalIgnoreCase));
        return dir;
    }

    private List<PluginConfigFileDto> ScanConfigFiles(string dirFullPath, string serverBasePath)
    {
        var list = new List<PluginConfigFileDto>();
        try
        {
            var files = Directory.GetFiles(dirFullPath, "*.*", SearchOption.AllDirectories);
            foreach (var filePath in files)
            {
                var ext = Path.GetExtension(filePath);
                if (!AllowedExtensions.Contains(ext)) continue;

                var fileInfo = new FileInfo(filePath);
                var relToDir = Path.GetRelativePath(dirFullPath, filePath).Replace('\\', '/');
                var relToServer = Path.GetRelativePath(serverBasePath, filePath).Replace('\\', '/');

                list.Add(new PluginConfigFileDto
                {
                    Name = relToDir,
                    RelativePath = relToServer,
                    Extension = ext.ToLowerInvariant(),
                    SizeBytes = fileInfo.Length,
                    LastModifiedTime = fileInfo.LastWriteTime
                });
            }
        }
        catch
        {
            // 忽略读取权限或 IO 异常
        }

        return list.OrderBy(f => f.Name, StringComparer.OrdinalIgnoreCase).ToList();
    }

    private PluginInfoDto ParseJarManifest(string jarPath)
    {
        var info = new PluginInfoDto();
        try
        {
            using var archive = ZipFile.OpenRead(jarPath);

            // 1. 尝试 Bukkit/Spigot: plugin.yml
            var bukkitEntry = archive.GetEntry("plugin.yml");
            if (bukkitEntry != null)
            {
                using var stream = bukkitEntry.Open();
                using var reader = new StreamReader(stream);
                var content = reader.ReadToEnd();
                ParseYamlManifest(content, info);
                return info;
            }

            // 2. 尝试 Paper: paper-plugin.yml
            var paperEntry = archive.GetEntry("paper-plugin.yml");
            if (paperEntry != null)
            {
                using var stream = paperEntry.Open();
                using var reader = new StreamReader(stream);
                var content = reader.ReadToEnd();
                ParseYamlManifest(content, info);
                return info;
            }

            // 3. 尝试 BungeeCord: bungee.yml
            var bungeeEntry = archive.GetEntry("bungee.yml");
            if (bungeeEntry != null)
            {
                using var stream = bungeeEntry.Open();
                using var reader = new StreamReader(stream);
                var content = reader.ReadToEnd();
                ParseYamlManifest(content, info);
                return info;
            }

            // 4. 尝试 Velocity: velocity-plugin.json
            var velocityEntry = archive.GetEntry("velocity-plugin.json");
            if (velocityEntry != null)
            {
                using var stream = velocityEntry.Open();
                using var doc = JsonDocument.Parse(stream);
                var root = doc.RootElement;
                if (root.TryGetProperty("name", out var nameEl)) info.PluginName = nameEl.GetString() ?? "";
                else if (root.TryGetProperty("id", out var idEl)) info.PluginName = idEl.GetString() ?? "";

                if (root.TryGetProperty("version", out var vEl)) info.Version = vEl.GetString() ?? "";
                if (root.TryGetProperty("description", out var dEl)) info.Description = dEl.GetString() ?? "";
                if (root.TryGetProperty("main", out var mEl)) info.MainClass = mEl.GetString() ?? "";
                if (root.TryGetProperty("authors", out var aEl) && aEl.ValueKind == JsonValueKind.Array)
                {
                    foreach (var a in aEl.EnumerateArray())
                    {
                        var str = a.GetString();
                        if (!string.IsNullOrEmpty(str)) info.Authors.Add(str);
                    }
                }
                return info;
            }

            // 5. 尝试 Fabric: fabric.mod.json
            var fabricEntry = archive.GetEntry("fabric.mod.json");
            if (fabricEntry != null)
            {
                using var stream = fabricEntry.Open();
                using var doc = JsonDocument.Parse(stream);
                var root = doc.RootElement;
                if (root.TryGetProperty("name", out var nEl)) info.PluginName = nEl.GetString() ?? "";
                else if (root.TryGetProperty("id", out var idEl)) info.PluginName = idEl.GetString() ?? "";
                if (root.TryGetProperty("version", out var vEl)) info.Version = vEl.GetString() ?? "";
                if (root.TryGetProperty("description", out var dEl)) info.Description = dEl.GetString() ?? "";
                return info;
            }
        }
        catch
        {
            // 忽略损坏包
        }

        return info;
    }

    private void ParseYamlManifest(string yamlContent, PluginInfoDto info)
    {
        var lines = yamlContent.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
        foreach (var rawLine in lines)
        {
            var line = rawLine.Trim();
            if (line.StartsWith("#") || !line.Contains(':')) continue;

            var colonIndex = line.IndexOf(':');
            var key = line.Substring(0, colonIndex).Trim();
            var val = line.Substring(colonIndex + 1).Trim().Trim('\'', '\"');

            if (string.Equals(key, "name", StringComparison.OrdinalIgnoreCase) && string.IsNullOrEmpty(info.PluginName))
            {
                info.PluginName = val;
            }
            else if (string.Equals(key, "version", StringComparison.OrdinalIgnoreCase) && string.IsNullOrEmpty(info.Version))
            {
                info.Version = val;
            }
            else if (string.Equals(key, "description", StringComparison.OrdinalIgnoreCase) && string.IsNullOrEmpty(info.Description))
            {
                info.Description = val;
            }
            else if (string.Equals(key, "main", StringComparison.OrdinalIgnoreCase) && string.IsNullOrEmpty(info.MainClass))
            {
                info.MainClass = val;
            }
            else if (string.Equals(key, "author", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(val))
            {
                info.Authors.Add(val);
            }
        }
    }
}
