export interface PluginConfigFile {
  name: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
  lastModifiedTime: string;
}

export interface PluginInfo {
  jarFileName: string;
  pluginName: string;
  version: string;
  description: string;
  authors: string[];
  mainClass: string;
  enabled: boolean;
  hasConfigDir: boolean;
  configDirPath: string;
  files: PluginConfigFile[];
}

export interface PluginScanResult {
  pluginsPath: string;
  totalPlugins: number;
  plugins: PluginInfo[];
}
