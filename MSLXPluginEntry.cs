using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;
using MSLX.Plugin.Config.Editor.Services;
using MSLX.SDK;

[assembly: ApplicationPart("MSLX.Plugin.Config.Editor")]

namespace MSLX.Plugin.Config.Editor;

public class MSLXPluginEntry : IPlugin
{
    public static MSLXPluginEntry Instance { get; private set; } = null!;
    
    public string Id => "mslx-plugin-config-editor";
    public string Name => "插件可视化配置管理";
    public string Description => "在实例设置中可视化配置插件的配置文件，带有中文提示和选项渲染等高级功能。（欢迎贡献中文注释呀！）";
    public string Version => "1.0.3.1";
    public string Icon => "icon.png";
    public string MinSDKVersion => "1.6.4";
    public string Developer => "xiaoyu";
    public string AuthorUrl => "https://github.com/luluxiaoyu/mslx-plugin-config-editor";
    public string PluginUrl => "https://mslx-plugins.mslmc.net/plugins/mslx-plugin-config-editor";

    public void OnRegisterServices(IServiceCollection services)
    {
        services.AddSingleton<PluginScannerService>();
        services.AddSingleton<ConfigTemplateService>();
    }

    public void OnPluginInitialize(IServiceProvider serviceProvider)
    {
        Instance = this;
    }

    public void OnLoad()
    {
        SDK.MSLX.Logger.Info("[MSLX.Plugin.Config.Editor] 服务端插件配置中心加载成功！");
    }

    public void OnUnload()
    {
        SDK.MSLX.Logger.Info("[MSLX.Plugin.Config.Editor] 服务端插件配置中心已卸载。");
    }
}