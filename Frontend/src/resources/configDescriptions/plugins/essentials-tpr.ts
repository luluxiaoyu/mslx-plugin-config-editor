import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

/**
 * EssentialsX tpr.yml（随机传送）中文对照字典
 */
export const essentialsTprDocs: ConfigDocMap = {
  'default-location': {
    title: '默认随机传送位置',
    description: '/tpr（随机传送）命令默认使用的位置名称。\n- 默认 {world} 表示在玩家当前世界内随机传送。\n- 也可填写已用 /settpr 命令创建的传送位置名称。\n提示：大部分随机传送参数（如范围 max-range、冷却 cooldown、中心点等）不在此文件中，可用游戏内 /settpr 命令设置，设置后会保存到本文件。',
  },
  'excluded-biomes': {
    title: '排除的生物群系',
    description: '随机传送不会将玩家传送到这些生物群系（默认排除所有海洋和河流群系）。\n填写生物群系的英文 ID，如 deep_ocean、desert。\n完整群系 ID 列表见：https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Biome.html',
  },
  'max-range': {
    title: '最大传送范围 (方块)',
    description: '以传送中心点为圆心的最大随机传送半径（方块）。\n此键通常由 /settpr 命令写入本文件，也可手动添加。',
  },
  'min-range': {
    title: '最小传送范围 (方块)',
    description: '以传送中心点为圆心的最小随机传送半径（方块），防止玩家被传送到离中心太近的位置。\n此键通常由 /settpr 命令写入本文件，也可手动添加。',
  },
  'center': {
    title: '传送中心点',
    description: '随机传送的中心坐标（世界、X、Z）。\n此键通常由 /settpr 命令写入本文件，也可手动添加。',
  },
  'cooldown': {
    title: '传送冷却时间 (秒)',
    description: '同一玩家两次使用 /tpr 之间的冷却时间（秒）。\n此键通常由 /settpr 命令写入本文件，也可手动添加。',
  },
};

export const essentialsTprDefinition: PluginConfigDocDefinition = {
  pluginNames: ['essentials', 'ess'],
  fileNames: ['tpr.yml', 'tpr.yaml'],
  docs: essentialsTprDocs,
};

export default essentialsTprDefinition;
