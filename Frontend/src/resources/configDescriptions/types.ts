export interface ConfigDocOption {
  value: string | number | boolean;
  label: string;
  description?: string;
}

export interface ConfigDocItem {
  title: string;
  description: string;
  options?: ConfigDocOption[];
}

export type ConfigDocMap = Record<string, ConfigDocItem>;

export interface PluginConfigDocDefinition {
  pluginNames?: string[];
  fileNames?: string[];
  match?: (pluginName: string, fileName: string) => boolean;
  docs: ConfigDocMap;
}
