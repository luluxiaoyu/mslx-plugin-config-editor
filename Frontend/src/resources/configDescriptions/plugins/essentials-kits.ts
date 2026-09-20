import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

/**
 * EssentialsX kits.yml 中文对照字典
 */
export const essentialsKitsDocs: ConfigDocMap = {
  'kits': {
    title: '礼包列表',
    description: '所有礼包的根节点，每个子键为一个礼包名称。\n- 如果此文件中没有定义礼包，插件会尝试从 config.yml 中复制。\n- 礼包名必须小写，权限和收费均按小写处理。\n- 也可以在 Essentials 插件目录下的 kits 子目录中拆分多个 .yml 文件管理礼包，格式与本文件相同。\n详细说明：https://wiki.ess3.net/wiki/Kits',
  },
  'kits.tools': {
    title: '示例礼包：tools（石制工具）',
    description: '默认自带的示例礼包，包含石剑、石铲、石镐、石斧，冷却 10 秒。\n- 使用权限：essentials.kits.tools\n- 可按此格式添加自己的礼包。',
  },
  'kits.tools.delay': {
    title: '礼包冷却时间 (秒)',
    description: '同一玩家两次领取该礼包之间的冷却时间（秒）。\n设为 -1 表示一次性礼包（每个玩家只能领取一次）。',
  },
  'kits.tools.items': {
    title: '礼包物品列表',
    description: '礼包包含的物品，每行一个物品，必须带数量。\n物品语法：- 物品[:耐久] 数量 [附魔:等级]... [元数据:值]...\n- 物品名可用英文 ID 或 Essentials 简写（如 dpickaxe = 钻石镐）。\n- 以 / 开头的条目为领取时执行的命令，可用 {USERNAME} 表示玩家用户名、{PLAYER} 表示显示名。\n物品元数据详见：https://wiki.ess3.net/wiki/Item_Meta',
  },
  'kits.dtools': {
    title: '示例礼包：dtools（钻石工具）',
    description: '默认自带的示例礼包，演示附魔、自定义名称、Lore 和颜色代码的用法，冷却 600 秒。\n- 领取时还会执行 /broadcast 广播命令。\n- 使用权限：essentials.kits.dtools',
  },
  'kits.dtools.delay': {
    title: '礼包冷却时间 (秒)',
    description: '同一玩家两次领取该礼包之间的冷却时间（秒）。\n设为 -1 表示一次性礼包。',
  },
  'kits.dtools.items': {
    title: '礼包物品列表',
    description: '演示复杂物品写法：\n- dpickaxe 1 efficiency:1 fortune:1 name:&4Gigadrill lore:... 带附魔、名称和 Lore 的钻石镐。\n- name/lore 中空格用下划线 _ 代替，Lore 用 | 分行，& 为颜色代码。\n- daxe:780 1 表示耐久为 780 的钻石斧。\n- /broadcast {USERNAME} ... 领取时执行的命令。',
  },
  'kits.notch': {
    title: '示例礼包：notch（Notch 头颅）',
    description: '默认自带的示例礼包，演示玩家头颅的写法（playerhead 1 player:Notch），冷却 6000 秒。',
  },
  'kits.notch.delay': {
    title: '礼包冷却时间 (秒)',
    description: '同一玩家两次领取该礼包之间的冷却时间（秒）。\n设为 -1 表示一次性礼包。',
  },
  'kits.notch.items': {
    title: '礼包物品列表',
    description: '包含一个指定玩家的头颅：playerhead 1 player:Notch。',
  },
  'kits.color': {
    title: '示例礼包：color（彩色书）',
    description: '默认自带的示例礼包，演示成书（writtenbook）的写法：书名、作者、Lore 与内容，冷却 6000 秒。',
  },
  'kits.color.delay': {
    title: '礼包冷却时间 (秒)',
    description: '同一玩家两次领取该礼包之间的冷却时间（秒）。\n设为 -1 表示一次性礼包。',
  },
  'kits.color.items': {
    title: '礼包物品列表',
    description: '包含一本成书：writtenbook 1 title:... author:... lore:... book:...。',
  },
  'kits.firework': {
    title: '示例礼包：firework（烟花）',
    description: '默认自带的示例礼包，演示烟花火箭的写法（颜色、形状、轨迹特效、飞行时间等），冷却 6000 秒。',
  },
  'kits.firework.delay': {
    title: '礼包冷却时间 (秒)',
    description: '同一玩家两次领取该礼包之间的冷却时间（秒）。\n设为 -1 表示一次性礼包。',
  },
  'kits.firework.items': {
    title: '礼包物品列表',
    description: '烟花火箭常用元数据：\n- name：自定义名称\n- color/fade：颜色/渐变色（如 red、yellow,orange）\n- type/shape：形状（creeper、star、large、ball 等）\n- effect：特效（trail 轨迹、twinkle 闪烁）\n- power：飞行时长等级',
  },
};

export const essentialsKitsDefinition: PluginConfigDocDefinition = {
  pluginNames: ['essentials', 'ess'],
  fileNames: ['kits.yml', 'kits.yaml'],
  docs: essentialsKitsDocs,
};

export default essentialsKitsDefinition;
