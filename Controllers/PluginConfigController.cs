using Microsoft.AspNetCore.Mvc;
using MSLX.Plugin.Config.Editor.Models;
using MSLX.Plugin.Config.Editor.Services;
using MSLX.SDK.Models;

namespace MSLX.Plugin.Config.Editor.Controllers;

[ApiController]
[Route("api/plugins/config-editor")]
public class PluginConfigController : ControllerBase
{
    private readonly PluginScannerService _scannerService;
    private readonly ConfigTemplateService _templateService;

    public PluginConfigController(PluginScannerService scannerService, ConfigTemplateService templateService)
    {
        _scannerService = scannerService;
        _templateService = templateService;
    }

    [HttpGet("instance/{id}/list")]
    public IActionResult GetInstancePluginList(uint id)
    {
        var server = SDK.MSLX.Config.Servers.GetServer(id);
        if (server == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Code = 404,
                Message = "服务器实例不存在"
            });
        }

        try
        {
            var result = _scannerService.ScanInstancePlugins(server);
            return Ok(new ApiResponse<PluginScanResultDto>
            {
                Code = 200,
                Message = "获取成功",
                Data = result
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Code = 500,
                Message = $"扫描插件失败: {ex.Message}"
            });
        }
    }

    [HttpGet("instance/{id}/file-content")]
    public async Task<IActionResult> GetFileContent(uint id, [FromQuery] string path)
    {
        var server = SDK.MSLX.Config.Servers.GetServer(id);
        if (server == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Code = 404,
                Message = "服务器实例不存在"
            });
        }

        var (success, content, message) = await _templateService.ReadFileContentAsync(server.Base, path);
        if (!success)
        {
            return BadRequest(new ApiResponse<object>
            {
                Code = 400,
                Message = message ?? "读取文件失败"
            });
        }

        return Ok(new ApiResponse<string>
        {
            Code = 200,
            Message = "读取成功",
            Data = content ?? string.Empty
        });
    }

    [HttpPost("instance/{id}/save-file")]
    public async Task<IActionResult> SaveFile(uint id, [FromBody] SaveFileRequest request)
    {
        var server = SDK.MSLX.Config.Servers.GetServer(id);
        if (server == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Code = 404,
                Message = "服务器实例不存在"
            });
        }

        var (success, message) = await _templateService.SaveFileWithBackupAsync(
            server.Base, 
            request.Path, 
            request.Content, 
            request.CreateBackup);

        if (!success)
        {
            return BadRequest(new ApiResponse<object>
            {
                Code = 400,
                Message = message ?? "保存文件失败"
            });
        }

        return Ok(new ApiResponse<object>
        {
            Code = 200,
            Message = "保存成功",
            Data = new { backupCreated = request.CreateBackup }
        });
    }

    [HttpGet("instance/{id}/jar-template")]
    public async Task<IActionResult> GetJarTemplate(
        uint id, 
        [FromQuery] string jarFileName, 
        [FromQuery] string internalPath = "config.yml")
    {
        var server = SDK.MSLX.Config.Servers.GetServer(id);
        if (server == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Code = 404,
                Message = "服务器实例不存在"
            });
        }

        var pluginsPath = string.IsNullOrWhiteSpace(server.PluginsPath) ? "plugins" : server.PluginsPath;
        var (success, content, message) = await _templateService.GetJarTemplateAsync(
            server.Base, 
            pluginsPath, 
            jarFileName, 
            internalPath);

        if (!success)
        {
            return BadRequest(new ApiResponse<object>
            {
                Code = 400,
                Message = message ?? "提取模版失败"
            });
        }

        return Ok(new ApiResponse<string>
        {
            Code = 200,
            Message = "提取模版成功",
            Data = content ?? string.Empty
        });
    }
}
