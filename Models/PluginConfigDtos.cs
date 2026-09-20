namespace MSLX.Plugin.Config.Editor.Models;

public class PluginScanResultDto
{
    public string PluginsPath { get; set; } = "plugins";
    public int TotalPlugins => Plugins.Count;
    public List<PluginInfoDto> Plugins { get; set; } = new();
}

public class PluginInfoDto
{
    public string JarFileName { get; set; } = string.Empty;
    public string PluginName { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Authors { get; set; } = new();
    public string MainClass { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public bool HasConfigDir { get; set; }
    public string ConfigDirPath { get; set; } = string.Empty;
    public List<PluginConfigFileDto> Files { get; set; } = new();
}

public class PluginConfigFileDto
{
    public string Name { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty;
    public string Extension { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public DateTime LastModifiedTime { get; set; }
}

public class SaveFileRequest
{
    public string Path { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool CreateBackup { get; set; } = true;
}
