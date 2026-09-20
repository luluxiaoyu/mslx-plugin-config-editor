import type { ConfigDocMap, PluginConfigDocDefinition } from './types';

export * from './types';

// 使用 Vite 的 import.meta.glob 自动扫描并导入 plugins/ 目录下所有的插件配置翻译文件
const moduleMap = import.meta.glob<Record<string, any>>('./plugins/*.ts', { eager: true });

const registeredDefinitions: PluginConfigDocDefinition[] = [];

for (const [path, mod] of Object.entries(moduleMap)) {

  const def: PluginConfigDocDefinition | undefined =
    mod.default || mod.pluginConfigDoc || mod.definition;

  if (def && def.docs) {
    registeredDefinitions.push(def);
  } else if (mod.docs) {
    // 若仅导出了 docs，则以文件名作为默认插件标识
    const fileBaseName = path.split('/').pop()?.replace(/\.ts$/, '') || '';
    registeredDefinitions.push({
      pluginNames: [fileBaseName],
      fileNames: ['config.yml', 'config.yaml'],
      docs: mod.docs,
    });
  }
}

/**
 * 根据当前选中的插件信息和文件名，智能匹配对应的中文对照字典
 */
export function findConfigDocMap(pluginName?: string, fileName?: string): ConfigDocMap {
  const pName = (pluginName || '').toLowerCase().trim();
  const fName = (fileName || '').toLowerCase().trim();

  for (const def of registeredDefinitions) {
    // 1. 自定义匹配函数（最高优先级）
    if (def.match && def.match(pName, fName)) {
      return def.docs;
    }

    // 2. 插件名称匹配
    const matchPlugin =
      !def.pluginNames ||
      def.pluginNames.length === 0 ||
      def.pluginNames.some((name) => {
        const target = name.toLowerCase().trim();
        return pName === target || pName.includes(target) || fName.includes(target);
      });

    if (!matchPlugin) {
      continue;
    }

    // 3. 配置文件名匹配（未声明时默认匹配 config.yml 与 config.yaml）
    const allowedFiles =
      def.fileNames && def.fileNames.length > 0
        ? def.fileNames
        : ['config.yml', 'config.yaml'];

    const matchFile = allowedFiles.some((f) => {
      const target = f.toLowerCase().trim();
      return fName === target || fName.endsWith('/' + target);
    });

    if (matchFile) {
      return def.docs;
    }
  }

  return {};
}
