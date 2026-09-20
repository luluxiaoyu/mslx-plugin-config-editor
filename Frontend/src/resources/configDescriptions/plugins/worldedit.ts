import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

/**
 * WorldEdit config.yml 中文对照字典
 * 来源：EngineHub/WorldEdit worldedit-bukkit 默认配置
 */
export const worldeditConfigDocs: ConfigDocMap = {
  // 1. 操作限制 (Limits)
  'limits': {
    title: '操作限制总开关区',
    description: '限制玩家单次 WorldEdit 操作的规模，防止大操作把服务器卡崩。\n此分类下的所有数值，-1 均表示“不限制”。\n拥有 worldedit.limit.unrestricted 权限的玩家不受此限制。',
  },
  'limits.max-blocks-changed': {
    title: '单次修改方块数上限',
    description: '限制一条指令（如 //set、//replace）最多能改动多少方块。\n- default：普通玩家的默认上限。\n- maximum：上限的硬顶，即使有更高权限组也不能超过。\n- -1 表示不限制。建议普通玩家给个几万以内的值，防止误操作拖垮服务器。',
  },
  'limits.max-blocks-changed.default': {
    title: '默认修改方块数上限',
    description: '普通玩家单次指令最多可修改的方块数，默认 -1（不限制）。\n建议生存服设置一个保守值（如 10000），创造/建筑服可放宽。可通过权限组覆盖（worldedit.limit.blocks.*）。',
  },
  'limits.max-blocks-changed.maximum': {
    title: '修改方块数硬上限',
    description: '无论权限组如何设置都不能突破的绝对上限，默认 -1（不限制）。\n防止管理员误给过高权限导致超大操作卡服。',
  },
  'limits.vertical-height': {
    title: '最大垂直选区高度',
    description: '通过 //expand vert 或 //outset -v 等命令垂直扩展选区时的最大高度，默认 256。\n并非世界高度上限，只是防止一次选得过高。',
  },
  'limits.max-polygonal-points': {
    title: '多边形选区顶点数限制',
    description: '限制多边形（//sel poly）选区可使用的顶点数量。\n- default：普通玩家默认顶点数上限，-1 表示不限制。\n- maximum：硬上限，默认 20。顶点越多选区越复杂，占用计算越高。',
  },
  'limits.max-radius': {
    title: '最大操作半径',
    description: '限制以半径为参数的命令（如 //sphere、//cyl、/brush 系列）的最大半径，默认 -1（不限制）。\n防止玩家刷超大球体导致卡服。',
  },
  'limits.max-super-pickaxe-size': {
    title: '超级镐子最大范围',
    description: '超级镐子（// 或 /sp 模式）一次破坏的最大半径，默认 5。\n范围挖掘越大，对服务器瞬时压力越大。',
  },
  'limits.max-brush-radius': {
    title: '笔刷最大半径',
    description: '笔刷类命令（/brush）允许的最大半径，默认 5。\n笔刷每次点击都是一次完整操作，半径大时请同步限制 max-blocks-changed。',
  },
  'limits.butcher-radius': {
    title: '清怪命令半径限制',
    description: '限制 /butcher（清除周围生物）命令的默认与最大作用半径。\n- default：不带参数时的默认半径，-1 表示不限制（清全图，慎用）。\n- maximum：玩家手动指定的最大半径，-1 表示不限制。',
  },
  'limits.disallowed-blocks': {
    title: '禁止放置的方块列表',
    description: '玩家无法通过 WorldEdit 命令放置此列表中的方块（如基岩、TNT、床等），常用于防止熊孩子搞破坏。\n填写方块 ID（如 minecraft:bedrock）。清空改为 [] 即可解除全部限制。',
  },

  // 2. 物品栏消耗 (Use Inventory)
  'use-inventory': {
    title: '物品栏消耗模式',
    description: '开启后，玩家用 WorldEdit 放置方块会真实消耗其背包中的物品，破坏的方块也会掉落进背包。\n适合想给建筑师“半创造”体验的生存服。',
  },
  'use-inventory.enable': {
    title: '启用物品栏消耗',
    description: '是否启用物品栏消耗模式，默认 false。\n注意：此功能开发不完善，官方标记为实验性，开启前请自行测试。',
  },
  'use-inventory.allow-override': {
    title: '允许权限绕过消耗',
    description: '为 true 时，拥有 worldedit.inventory.unrestricted 权限的玩家可不受物品栏消耗限制。',
  },
  'use-inventory.creative-mode-overrides': {
    title: '创造模式自动绕过',
    description: '为 true 时，创造模式玩家自动忽略物品栏消耗（默认 false，即创造玩家也消耗）。',
  },

  // 3. 日志 (Logging)
  'logging': {
    title: '操作日志记录',
    description: '将玩家执行的 WorldEdit 命令写入日志文件，方便追查谁动了哪里。',
  },
  'logging.log-commands': {
    title: '记录命令日志',
    description: '是否把玩家执行的 WorldEdit 命令写入日志文件，默认 false。\n大型服务器建议开启以便追责，但会产生额外磁盘写入。',
  },
  'logging.file': {
    title: '日志文件名',
    description: '命令日志保存的文件名，默认 worldedit.log，存放在 WorldEdit 插件目录下。留空则输出到控制台。',
  },
  'logging.format': {
    title: '日志格式',
    description: '日志的输出格式（Java Formatter 格式串），包含日期、级别、消息等占位符。\n一般无需修改，保持默认即可。',
  },

  // 4. 超级镐子 (Super Pickaxe)
  'super-pickaxe': {
    title: '超级镐子设置',
    description: '超级镐子（/ 命令切换）可让玩家一键快速挖掘方块。',
  },
  'super-pickaxe.drop-items': {
    title: '破坏时掉落物品',
    description: '超级镐子单方块模式下破坏方块是否掉落物品，默认 true。\n设为 false 则只破坏不掉落。',
  },
  'super-pickaxe.many-drop-items': {
    title: '范围破坏时掉落物品',
    description: '超级镐子范围（recursive/area）模式下破坏方块是否掉落物品，默认 false。\n开启后大量掉落物可能造成卡顿。',
  },

  // 5. 快照 (Snapshots)
  'snapshots': {
    title: '快照备份设置',
    description: '快照功能允许从世界备份文件中恢复选区内容（//restore）。',
  },
  'snapshots.directory': {
    title: '快照备份目录',
    description: '存放世界备份（zip/tar 压缩的世界文件夹）的目录路径，默认为空（未配置）。\n配置后玩家可用 //snap list 查看快照、//restore 恢复选区。',
  },

  // 6. 导航棒 (Navigation Wand)
  'navigation-wand': {
    title: '导航棒设置',
    description: '导航棒用于快速传送：左键传送到准星所指方块顶部，右键穿透墙体（/thru）。',
  },
  'navigation-wand.item': {
    title: '导航棒物品',
    description: '作为导航棒的物品 ID，默认 minecraft:compass（指南针）。\n手持该物品即可使用 /jumpto 和 /thru 的快捷功能。',
  },
  'navigation-wand.max-distance': {
    title: '最大传送距离',
    description: '导航棒传送（jumpto/thru）允许的最大距离（单位：格），默认 100。\n防止玩家瞬移到过远未加载区块引发卡顿。',
  },

  // 7. 脚本 (Scripting)
  'scripting': {
    title: 'CraftScript 脚本设置',
    description: 'CraftScript 允许玩家用 JavaScript 编写脚本批量执行 WorldEdit 操作。',
  },
  'scripting.timeout': {
    title: '脚本执行超时 (毫秒)',
    description: '单个脚本允许运行的最长时间（毫秒），默认 3000（3 秒）。\n超时后脚本被强制终止，防止死循环脚本卡死服务器。',
  },
  'scripting.dir': {
    title: '脚本存放目录',
    description: 'CraftScript 脚本（.js 文件）存放的目录名，默认 craftscripts，位于 WorldEdit 插件目录下。',
  },

  // 8. 原理图保存 (Saving)
  'saving': {
    title: '原理图保存设置',
    description: '控制 //copy + //save 保存原理图（schematic）文件的相关选项。',
  },
  'saving.dir': {
    title: '原理图保存目录',
    description: '原理图文件保存的目录名，默认 schematics，位于 WorldEdit 插件目录下。',
  },

  // 9. 文件安全 (Files)
  'files': {
    title: '文件访问安全设置',
    description: '与 WorldEdit 读写文件（原理图、脚本等）相关的安全选项。',
  },
  'files.allow-symbolic-links': {
    title: '允许符号链接',
    description: '是否允许 WorldEdit 访问符号链接（软链接）指向的文件，默认 false。\n保持 false 可防止玩家通过软链接读取服务器上的任意文件，强烈建议不要开启。',
  },

  // 10. 历史记录 (History)
  'history': {
    title: '撤销历史设置',
    description: 'WorldEdit 会记录玩家的每次修改以支持 //undo 撤销，此处控制记录容量。',
  },
  'history.size': {
    title: '历史记录条数',
    description: '每名玩家最多保留多少条可撤销的操作记录，默认 15 条。\n数值越大占用内存/磁盘越多，超过后最旧的记录被丢弃。',
  },
  'history.expiration': {
    title: '历史记录过期时间 (分钟)',
    description: '历史记录保留的最长时间（单位：分钟），默认 10 分钟。\n超时后即使没满条数也会被清除。设为 0 表示永不过期。',
  },

  // 11. 计算超时 (Calculation)
  'calculation': {
    title: '表达式计算设置',
    description: '限制 //generate 等命令中数学表达式的计算时间，防止恶意公式卡服。',
  },
  'calculation.timeout': {
    title: '表达式计算超时 (毫秒)',
    description: '数学表达式（如 //generate 的公式）单次计算的最长时间（毫秒），默认 100。\n超时即中止操作。调低更安全，但复杂公式可能算不完。',
  },

  // 12. 调试 (Debugging)
  'debugging': {
    title: '调试选项',
    description: '面向插件开发者和排错人员的调试开关，普通服主无需改动。',
  },
  'debugging.trace-unflushed-sessions': {
    title: '追踪未刷新的编辑会话',
    description: '开启后追踪未被正确关闭的编辑会话并输出调试信息，默认 false。\n仅排查内存泄漏问题时开启。',
  },

  // 13. 杂项 (Misc)
  'wand-item': {
    title: '选区工具物品',
    description: '作为选区工具（木斧）的物品 ID，默认 minecraft:wooden_axe。\n手持该物品左键选第一个点、右键选第二个点。可改成其他物品避免与生存玩法冲突。',
  },
  'shell-save-type': {
    title: '脚本保存类型',
    description: '指定脚本执行环境的保存类型，默认为空（使用内置默认）。\n极少数高级场景才需要修改，一般留空即可。',
    options: [
      { value: '', label: '(空) 默认 (Default)' },
      { value: 'sequential', label: 'Sequential 顺序保存' },
      { value: 'batched', label: 'Batched 批量保存' },
    ],
  },
  'no-op-permissions': {
    title: '空操作权限模式',
    description: '为 true 时 WorldEdit 不再向权限插件注册权限检查，所有权限判断直接放行，默认 false。\n仅用于权限插件冲突等特殊调试场景，正常服务器请勿开启（等于人人可用 WE）。',
  },
  'debug': {
    title: '调试模式',
    description: '开启后在控制台输出大量 WorldEdit 内部调试信息，默认 false。\n排查问题时临时开启，日常保持关闭以免刷屏。',
  },
  'show-help-on-first-use': {
    title: '首次使用显示帮助',
    description: '玩家第一次拿到选区工具时是否自动发送一条帮助提示消息，默认 true。',
  },
  'server-side-cui': {
    title: '服务端选区可视化 (CUI)',
    description: '是否用服务端假方块向玩家显示选区范围线框（无需客户端装模组），默认 true。\n开启后玩家能直观看到选区边界，低配客户端也兼容，建议保持开启。',
  },
  'command-block-support': {
    title: '命令方块支持',
    description: '是否允许命令方块执行 WorldEdit 命令，默认 false。\n开启需谨慎：命令方块执行的 WE 操作通常不受玩家限制约束，存在被滥用的风险。',
  },
};

export const worldeditDefinition: PluginConfigDocDefinition = {
  pluginNames: ['worldedit', 'we'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: worldeditConfigDocs,
};

export default worldeditDefinition;
