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
 * 判断某个定义在给定插件名/文件名下的匹配级别
 * 2 = 精确匹配（插件名与别名完全一致，或文件名去扩展名后与别名一致）
 * 1 = 模糊匹配（插件名包含别名，仅限长度 >= 3 的别名，避免 'co'/'we' 等短别名误伤）
 * 0 = 不匹配
 */
function getPluginMatchLevel(def: PluginConfigDocDefinition, pName: string, fName: string): 0 | 1 | 2 {
  if (!def.pluginNames || def.pluginNames.length === 0) {
    return 2;
  }

  // 文件名去扩展名，作为插件名未知时的线索（如 luckperms.conf -> luckperms）
  // 注意：仅允许完全一致，严禁子串匹配，否则 config.yml 会被 'co' 这类短别名误命中
  const fStem = fName.replace(/\.[^.]*$/, '');

  let hasLoose = false;
  for (const name of def.pluginNames) {
    const target = name.toLowerCase().trim();
    if (!target) continue;
    // 精确匹配：插件名完全一致，或文件名主体完全一致
    if (pName === target || fStem === target) {
      return 2;
    }
    // 模糊匹配：仅较长别名允许子串包含（如 EssentialsXChat 命中 essentials）
    if (target.length >= 3 && pName && pName.includes(target)) {
      hasLoose = true;
    }
  }
  return hasLoose ? 1 : 0;
}

/**
 * 检查文件名是否在该定义声明的目标文件白名单内
 */
function matchFileName(def: PluginConfigDocDefinition, fName: string): boolean {
  const allowedFiles =
    def.fileNames && def.fileNames.length > 0
      ? def.fileNames
      : ['config.yml', 'config.yaml'];

  return allowedFiles.some((f) => {
    const target = f.toLowerCase().trim();
    return fName === target || fName.endsWith('/' + target);
  });
}

/**
 * 根据当前选中的插件信息和文件名，智能匹配对应的中文对照字典
 */
export function findConfigDocMap(pluginName?: string, fileName?: string): ConfigDocMap {
  const pName = (pluginName || '').toLowerCase().trim();
  const fName = (fileName || '').toLowerCase().trim();

  // 1. 自定义匹配函数（最高优先级）
  for (const def of registeredDefinitions) {
    if (def.match && def.match(pName, fName)) {
      return def.docs;
    }
  }

  // 2. 先尝试精确匹配，再降级到模糊匹配（防止短别名插件抢占其他插件的 config.yml）
  for (const minLevel of [2, 1] as const) {
    for (const def of registeredDefinitions) {
      if (getPluginMatchLevel(def, pName, fName) < minLevel) {
        continue;
      }
      if (matchFileName(def, fName)) {
        return def.docs;
      }
    }
  }

  return {};
}
