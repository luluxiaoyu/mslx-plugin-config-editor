import request from 'mslx-request';
import type { PluginScanResult } from '../types/pluginConfig';

/**
 * 获取指定实例的插件与配置文件扫描列表
 */
export async function getPluginScanList(instanceId: number): Promise<PluginScanResult> {
  const res = await request.get({
    url: `/api/plugins/config-editor/instance/${instanceId}/list`
  });
  return (res?.data || res) as PluginScanResult;
}

/**
 * 读取指定配置文件内容
 */
export async function getConfigFileContent(instanceId: number, path: string): Promise<string> {
  const res = await request.get({
    url: `/api/plugins/config-editor/instance/${instanceId}/file-content`,
    params: { path }
  });
  return (res?.data !== undefined ? res.data : res) as string;
}

/**
 * 保存配置文件
 */
export async function saveConfigFile(
  instanceId: number, 
  path: string, 
  content: string, 
  createBackup = true
): Promise<any> {
  return await request.post({
    url: `/api/plugins/config-editor/instance/${instanceId}/save-file`,
    data: { path, content, createBackup }
  });
}

/**
 * 从 Jar 包提取原始默认模版
 */
export async function getJarDefaultTemplate(
  instanceId: number, 
  jarFileName: string, 
  internalPath = 'config.yml'
): Promise<string> {
  const res = await request.get({
    url: `/api/plugins/config-editor/instance/${instanceId}/jar-template`,
    params: { jarFileName, internalPath }
  });
  return (res?.data !== undefined ? res.data : res) as string;
}
