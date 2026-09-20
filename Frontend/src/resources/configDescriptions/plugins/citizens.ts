import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

const BOOLEAN_OPTIONS = [
  { value: true, label: 'true (开启)' },
  { value: false, label: 'false (关闭)' },
];

/**
 * Citizens config.yml 中文对照字典
 * 配置来源：Citizens2 源码 Settings.java（官方配置枚举，含注释与默认值）
 */
export const citizensConfigDocs: ConfigDocMap = {
  // 1. 通用设置 (general)
  'general': {
    title: '通用设置',
    description: 'Citizens 的调试、语言、颜色方案等全局设置。',
  },
  'general.debug-mode': {
    title: '调试模式',
    description: '开启 Citizens 的调试输出，仅排查问题时开启。',
    options: BOOLEAN_OPTIONS,
  },
  'general.debug-file': {
    title: '调试日志输出文件',
    description: '将调试信息写入指定文件（相对插件目录的文件名，如 debug.log）。留空则输出到控制台。',
  },
  'general.check-minecraft-version': {
    title: '检查 Minecraft 版本兼容性',
    description: '是否检查 Minecraft 版本兼容性。请勿修改！',
    options: BOOLEAN_OPTIONS,
  },
  'general.reload-warning-enabled': {
    title: '重载警告',
    description: '使用 /citizens reload 时是否显示数据丢失风险警告。默认开启，建议保持。',
    options: BOOLEAN_OPTIONS,
  },
  'general.reset-formatting-on-color-change': {
    title: '颜色切换时重置格式',
    description: '切换颜色代码时是否重置已有格式（模拟旧版颜色代码行为）。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'general.authlib.profile-url': {
    title: '皮肤档案查询地址',
    description: '通过 authlib 查询玩家游戏档案（皮肤/名字）使用的 API 地址。\n默认指向 Mojang 官方，使用皮肤代理或镜像服务时可修改。',
  },
  'general.resource-pack-path': {
    title: '资源包保存路径',
    description: '/npc resourcepack 相关功能保存资源包的目录，默认 plugins/Citizens/resourcepack。',
  },
  'general.entity-spawn-wait-ticks': {
    title: '实体生成等待时间',
    description: 'NPC 所在区块从磁盘加载完成后，等待多久才生成实体。\n默认 1 秒。磁盘较慢时可适当调大，避免 NPC 生成失败。',
  },
  'general.translation.locale': {
    title: '语言区域',
    description: 'Citizens 消息的语言。留空跟随系统语言，设为 zh 使用简体中文（若翻译文件已包含）。',
  },
  'general.color-scheme.message': {
    title: '消息颜色',
    description: 'Citizens 普通消息的颜色，使用 MiniMessage 标签格式，如 <green>。',
  },
  'general.color-scheme.message-error': {
    title: '错误消息颜色',
    description: 'Citizens 错误消息的颜色，默认 <red>。',
  },
  'general.color-scheme.message-highlight': {
    title: '高亮颜色',
    description: 'Citizens 消息中高亮部分的颜色，默认 <yellow>。',
  },

  // 2. NPC 默认值 (npc.default)
  'npc': {
    title: 'NPC 设置',
    description: 'NPC 行为、寻路、皮肤、聊天等设置。npc.default 下的值为新 NPC 的默认属性（可按 NPC 单独覆盖）。',
  },
  'npc.default.look-close.enabled': {
    title: '默认开启注视附近玩家',
    description: '新 NPC 是否默认开启 look-close（头部转向附近玩家）。\n可用 /npc lookclose 按 NPC 覆盖。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.look-close.range': {
    title: '注视范围 (方块)',
    description: 'look-close 默认的注视范围，玩家进入此距离 NPC 会转头看向，默认 10。',
  },
  'npc.default.look-close.random-look-enabled': {
    title: '默认开启随机张望',
    description: '新 NPC 是否默认随机张望（无玩家时随机转头），默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.look-close.random-look-delay': {
    title: '随机张望间隔',
    description: '随机张望的间隔时间，默认 3s（支持 s/m/h 单位）。',
  },
  'npc.default.look-close.realistic-looking': {
    title: '真实视线检测',
    description: '开启后 NPC 注视玩家时需要视线无遮挡（被墙挡住就不看）。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.look-close.disable-while-navigating': {
    title: '寻路时禁用注视',
    description: 'NPC 移动寻路时是否暂停 look-close 行为，默认开启（走路时不东张西望）。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.talk-close.enabled': {
    title: '默认开启自动说话',
    description: '新 NPC 是否默认开启 talk-close（玩家靠近时说话）。内容用 /npc text 设置。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.talk-close.range': {
    title: '说话触发范围 (方块)',
    description: '玩家进入此距离时 NPC 开始说话，默认 5。',
  },
  'npc.default.talk-close.text': {
    title: '默认台词',
    description: 'talk-close 的默认台词列表，支持 <npc>、<player> 等占位符。\n默认 Hi, I\'m <npc>!。可用 /npc text 按 NPC 覆盖。',
  },
  'npc.default.random-talker': {
    title: '默认随机说话开关',
    description: '新 NPC 是否默认在台词列表中随机挑选一句，默认关闭（按顺序）。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.bossbar-view-range': {
    title: 'Boss 血条可见范围 (方块)',
    description: 'NPC 头顶 Boss 血条（/npc bossbar）默认的可见距离，默认 64。',
  },
  'npc.default.reset-yaw-on-spawn': {
    title: '生成时重置朝向',
    description: 'NPC 生成时是否重置朝向角度（受技术限制，通过挥手动画实现）。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.enable-scoreboard-teams': {
    title: '启用记分板队伍管理',
    description: '是否用记分板队伍管理 NPC（用于隐形、发光等效果）。默认开启，关闭可能导致 NPC 显示异常。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.spawn-nodamage-duration': {
    title: '生成无敌时间',
    description: 'NPC 生成后的短暂无敌时间，默认 1s（原版为 20 tick）。',
  },
  'npc.default.block-breaker-radius': {
    title: '方块破坏距离半径',
    description: 'NPC 破坏方块类任务默认的作业距离，-1 使用默认值（0 表示紧贴目标方块）。',
  },
  'npc.default.waypoints.cache-paths': {
    title: '默认缓存路径点路径',
    description: '新 NPC 是否默认缓存 /npc path 设置的静态路径，可大幅减少重复寻路开销。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.default.pathfinding.range': {
    title: '默认寻路范围 (方块)',
    description: 'NPC 寻路的默认最大范围，默认 100。\n不要设得太大，避免寻路卡服；长距离移动建议分段寻路。',
  },
  'npc.default.stationary-duration': {
    title: '静止判定时长',
    description: 'NPC 停留多久后判定为寻路失败（卡住），默认 -1（不判定）。',
  },

  // 3. NPC 寻路 (npc.pathfinding)
  'npc.pathfinding': {
    title: 'NPC 寻路设置',
    description: 'NPC 移动寻路的行为与性能参数。',
  },
  'npc.pathfinding.pathfinder-type': {
    title: '寻路引擎类型',
    description: 'NPC 使用的寻路引擎：\n- MINECRAFT：原版引擎（默认，兼容性最好）\n- CITIZENS：Citizens 自研引擎\n- CITIZENS_ASYNC：异步版，更快但需要多核 CPU 和更多内存（较新，较实验性）',
    options: [
      { value: 'MINECRAFT', label: 'MINECRAFT (原版引擎，默认)' },
      { value: 'CITIZENS', label: 'CITIZENS (自研引擎)' },
      { value: 'CITIZENS_ASYNC', label: 'CITIZENS_ASYNC (异步引擎，需多核)' },
    ],
  },
  'npc.pathfinding.citizens.blocks-per-tick': {
    title: '每 tick 寻路方块数',
    description: 'Citizens 寻路引擎每 tick 处理的方块数量，默认 250。调大寻路更快但更卡。',
  },
  'npc.pathfinding.citizens.maximum-search-blocks': {
    title: '寻路最大搜索方块数',
    description: 'Citizens 引擎单次寻路最多检查的方块数，默认 1024。限制寻路开销。',
  },
  'npc.pathfinding.minecraft.maximum-search-blocks': {
    title: '原版引擎最大搜索方块数',
    description: 'MINECRAFT 引擎单次寻路最多检查的方块数，默认 1024。',
  },
  'npc.pathfinding.citizens.async-chunk-cache-expiry': {
    title: '异步寻路区块缓存时长',
    description: '异步寻路时缓存的区块在内存中保留的时长，默认 5s。\n寻路期间区块变化频繁就调小，变化少可调大（省 CPU 但费内存）。',
  },
  'npc.pathfinding.citizens.check-bounding-boxes': {
    title: '检查碰撞箱',
    description: '寻路时是否检查方块碰撞箱（栅栏之间、门内、半砖等精细场景）。默认关闭。开启更精确但更耗性能。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.pathfinding.citizens.open-doors': {
    title: '寻路时开门',
    description: 'NPC 寻路遇到门时是否自动开门（通过后关门）。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.pathfinding.citizens.experimental-jumps': {
    title: '模拟跳跃 (实验性)',
    description: '寻路时模拟跳跃动作。会增加寻路 CPU 开销，建议配合异步寻路引擎使用。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.pathfinding.allowed-fall-distance': {
    title: '寻路允许最大下落高度',
    description: '寻路时允许 NPC 下落的最大高度，-1 使用默认值。防止 NPC 为走捷径跳下悬崖。',
  },
  'npc.pathfinding.attack-range': {
    title: '攻击距离 (方块)',
    description: 'NPC 发起攻击前与目标的距离，默认 1.75。',
  },
  'npc.pathfinding.default-distance-margin': {
    title: '默认移动判定距离 (方块)',
    description: 'NPC 实际移动到距目标多近才算移动完成，默认 1。与寻路距离(path-distance-margin)不同。',
  },
  'npc.pathfinding.default-path-distance-margin': {
    title: '默认寻路判定距离 (方块)',
    description: '寻路计算到距目标多近即认为寻路成功，默认 0（精确寻路到目标）。',
  },
  'npc.pathfinding.default-destination-teleport-margin': {
    title: '目的地直接传送距离',
    description: 'NPC 与目的地距离小于此值时直接传送过去（不寻路），-1 禁用。适合需要精确到达目标的场景。',
  },
  'npc.pathfinding.default-stuck-action': {
    title: '卡住时的默认处理',
    description: 'NPC 寻路失败或长时间卡在同一位置时的处理方式：\n- none：什么都不做（默认）\n- teleport to destination：直接传送到目的地',
    options: [
      { value: 'none', label: 'none (不处理)' },
      { value: 'teleport to destination', label: 'teleport to destination (传送到目的地)' },
    ],
  },
  'npc.pathfinding.update-path-rate': {
    title: '动态目标重新寻路间隔',
    description: '追踪动态目标（如实体）时重新计算路径的间隔，默认 1s。',
  },
  'npc.pathfinding.straight-line-targeting-distance': {
    title: '直线追踪距离 (方块)',
    description: '目标在此距离内时，NPC 直接直线走向目标而不再寻路。默认 5。仅对动态目标（实体）生效。',
  },
  'npc.pathfinding.disable-mc-fallback-navigation': {
    title: '禁用原版近似寻路',
    description: '原版寻路找不到直达路径时会选一个"近似可达"位置。\n开启此选项后禁用该行为（要求精确路径）。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.pathfinding.debug-paths': {
    title: '寻路调试显示',
    description: '用假的目标方块可视化寻路过程，仅调试时开启。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },

  // 4. NPC 皮肤 (npc.skins)
  'npc.skins': {
    title: 'NPC 皮肤设置',
    description: 'NPC 皮肤获取与更新的行为。',
  },
  'npc.skins.try-fetch-default-skin': {
    title: '自动获取同名玩家皮肤',
    description: '创建 NPC 时是否尝试用 NPC 名字对应的玩家皮肤。\n如创建名为 Dinnerbone 的 NPC 会自动使用其皮肤。关闭则使用默认皮肤。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.skins.use-latest-by-default': {
    title: '定期刷新皮肤',
    description: '是否定期从 Minecraft 获取玩家最新皮肤。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.skins.view-distance': {
    title: '皮肤可见距离 (方块)',
    description: 'NPC 皮肤数据发送给玩家的距离，默认 100。',
  },
  'npc.skins.retry-delay': {
    title: '皮肤请求重试间隔',
    description: '皮肤请求失败（通常是 Mojang 限流）后的重试间隔，默认 5s。',
  },
  'npc.skins.max-retries': {
    title: '皮肤加载最大重试次数',
    description: '加载皮肤的最大重试次数。因 Mojang 接口限流，不建议低于 5。-1 为不限。',
  },
  'npc.skins.player-join-update-delay-ticks': {
    title: '玩家进服皮肤发送延迟',
    description: '玩家进服后延迟多久发送 NPC 皮肤数据，默认 1s。过早发送可能显示失败。',
  },
  'npc.skins.placeholder-update-frequency': {
    title: '皮肤占位符更新频率',
    description: '使用 PlaceholderAPI 动态皮肤时，更新皮肤的频率，默认 5m。',
  },

  // 5. NPC 悬浮字 (npc.hologram)
  'npc.hologram': {
    title: 'NPC 悬浮字设置',
    description: 'NPC 名字/悬浮字（hologram）的渲染方式与可见范围。',
  },
  'npc.hologram.default-renderer': {
    title: '默认悬浮字渲染器',
    description: '悬浮字的渲染方式：\n- interaction：需要 1.19+，名字贴合度最好\n- display：可自定义背景色（默认）\n- display_vehicle：挂载在 NPC 上的 display\n- areaeffectcloud：最兼容稳妥\n- armorstand / armorstand_vehicle：盔甲架方案，兼容性次之',
    options: [
      { value: 'interaction', label: 'interaction (1.19+，名字最贴合)' },
      { value: 'display', label: 'display (默认，支持背景色)' },
      { value: 'display_vehicle', label: 'display_vehicle (骑乘式显示实体)' },
      { value: 'areaeffectcloud', label: 'areaeffectcloud (最稳妥)' },
      { value: 'armorstand', label: 'armorstand (盔甲架)' },
      { value: 'armorstand_vehicle', label: 'armorstand_vehicle (骑乘盔甲架)' },
    ],
  },
  'npc.hologram.default-line-height': {
    title: '悬浮字行间距 (方块)',
    description: '多行悬浮字之间的垂直间距，默认 0.4。',
  },
  'npc.hologram.default-view-range': {
    title: '默认水平可见范围 (方块)',
    description: '悬浮字默认的水平可见距离，-1 表示跟随实体追踪范围。',
  },
  'npc.hologram.default-vertical-view-range': {
    title: '默认垂直可见范围 (方块)',
    description: '悬浮字默认的垂直可见距离，-1 表示不限制。',
  },
  'npc.hologram.update-rate': {
    title: '悬浮字更新间隔',
    description: '悬浮字内容（含 PlaceholderAPI 变量）的刷新间隔，默认 1s。',
  },
  'npc.hologram.always-update-position': {
    title: '每 tick 更新悬浮字位置',
    description: '是否每 tick 强制刷新悬浮字位置。消耗更大，仅在位置不同步时开启。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },

  // 6. NPC 聊天 (npc.chat)
  'npc.chat': {
    title: 'NPC 聊天设置',
    description: '玩家与 NPC 对话时的消息格式与范围。支持 <npc>、<player>、<target> 等占位符。',
  },
  'npc.chat.format.no-targets': {
    title: '无目标聊天格式',
    description: '玩家对 NPC 说话（无特定目标）时的显示格式，默认 [<npc>]: <text>。',
  },
  'npc.chat.format.to-target': {
    title: '对目标说话格式',
    description: '玩家对指定目标说话时的格式，默认 <npc>: <text>。',
  },
  'npc.chat.format.with-target-to-bystanders': {
    title: '旁人看到的一对一格式',
    description: '玩家对某目标说话时，附近其他玩家看到的格式，默认 [<npc>] -> [<target>]: <text>。',
  },
  'npc.chat.format.with-targets-to-bystanders': {
    title: '旁人看到的多目标格式',
    description: '玩家对多个目标说话时，附近其他玩家看到的格式，默认 [<npc>] -> [<targets>]: <text>。',
  },
  'npc.chat.options.range': {
    title: '聊天接收范围 (方块)',
    description: 'NPC 对话能被听到的范围，默认 5。',
  },
  'npc.chat.options.talk-to-npcs': {
    title: '允许玩家和 NPC 对话',
    description: '玩家聊天时是否也会触发 NPC 的对话（而不仅是对玩家说话）。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.chat.options.bystanders-hear-targeted-chat': {
    title: '旁人听到定向聊天',
    description: '玩家对特定目标说话时，附近的其他玩家是否也能听到。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.chat.options.max-number-of-targets-to-show': {
    title: '旁人可见的目标名数量',
    description: '旁人视角中最多显示几个目标名字，默认 2。超出的显示为"其他人"。',
  },
  'npc.chat.options.multiple-targets-format': {
    title: '多目标格式',
    description: '多个目标名字的拼接格式，默认 <target>|, <target>| & <target>| & others。',
  },

  // 7. NPC 限制与经济 (npc.limits / npc.defaults)
  'npc.limits': {
    title: 'NPC 数量限制',
    description: '每个玩家可拥有的 NPC 数量限制。',
  },
  'npc.limits.default-limit': {
    title: '默认每人 NPC 上限',
    description: '单个玩家默认最多可拥有的 NPC 数量，默认 10。\n拥有 citizens.ignore-limits 权限的玩家不受限制。',
  },
  'npc.limits.max-permission-checks': {
    title: '单次创建权限检查次数',
    description: '创建 NPC 时最多检查多少条权限数量规则，默认 100。\n仅当你的权限上限规则超过 100 条时才需调大。',
  },
  'npc.defaults.npc-cost': {
    title: '创建 NPC 费用',
    description: '创建一个 NPC 的默认费用，默认 100。\n需要配合经济插件（Vault + 经济插件）使用。',
  },
  'npc.server-ownership': {
    title: 'NPC 归服务器所有',
    description: '开启后 NPC 归服务器所有而非创建者个人（重建后仍保留归属关系简化）。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },

  // 8. NPC 行为杂项
  'npc.chunks.always-keep-loaded': {
    title: '保持 NPC 所在区块加载',
    description: '是否强制加载 NPC 所在区块。开启可保证 NPC 永远活动，但会增加服务器负载。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.tablist.disable': {
    title: '从 Tab 列表移除 NPC',
    description: '是否将 NPC 从玩家列表（Tab 键）中移除。默认开启（不显示）。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.tablist.remove-packet-delay': {
    title: 'Tab 列表移除延迟',
    description: '发出从 Tab 列表移除 NPC 数据包前的等待时间，默认 2t（2 tick）。',
  },
  'npc.player.remove-from-list': {
    title: '从玩家列表移除 NPC 记录',
    description: '是否把 NPC 从服务端玩家列表对象中移除，默认开启。一般无需修改。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.use-packet-holograms': {
    title: '使用数据包悬浮字 (实验性)',
    description: '用数据包级（packet）NPC 渲染名字悬浮字，性能更好但实验性。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.packets.update-delay': {
    title: '数据包更新延迟',
    description: 'NPC 数据包更新间隔（tick），默认 30。越小越流畅但越耗性能。',
  },
  'npc.movement.water-speed-modifier': {
    title: '水中移动速度倍率',
    description: 'NPC 在水中的移动速度倍率，默认 1.15（比陆地快 15%）。',
  },
  'npc.controllable.ground-direction-modifier': {
    title: '地面操控加速倍率',
    description: '骑乘控制 NPC 在地面移动时的速度加成比例，默认 1.0。',
  },
  'npc.controllable.max-ground-speed': {
    title: '地面操控最大速度',
    description: '可操控 NPC 在地面的最大速度（Minecraft 速度单位），默认 0.5。',
  },
  'npc.controllable.max-flying-speed': {
    title: '飞行操控最大速度',
    description: '可操控 NPC 飞行的最大速度，默认 0.75。',
  },
  'npc.controllable.use-boat-controls': {
    title: '使用船类操控方式',
    description: '载具 NPC 用移动方向而非转向键控制。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.follow.teleport-across-worlds': {
    title: '/npc follow 跨世界跟随',
    description: '/npc follow 的目标切换世界时，NPC 是否传送过去继续跟随。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.selection.item': {
    title: '选择 NPC 的物品',
    description: '手持此物品右键即可选中 NPC（快捷选中），默认 stick（木棍）。可用 /npc select 覆盖。',
  },
  'npc.text.talk-item': {
    title: '触发说话的物品过滤',
    description: '手持什么物品时可以和 NPC 交谈，* 表示任意物品。',
  },
  'npc.text.default-random-text-delay-min': {
    title: '随机说话最小间隔',
    description: 'NPC 随机说话的最小等待时间，默认 5s。',
  },
  'npc.text.default-random-text-delay-max': {
    title: '随机说话最大间隔',
    description: 'NPC 随机说话的最大等待时间，默认 10s。',
  },
  'npc.text.speech-bubble-duration': {
    title: '气泡显示时长',
    description: 'NPC 说话气泡的显示时长，默认 50t（50 tick = 2.5 秒）。',
  },
  'npc.commands.global-cooldown': {
    title: 'NPC 命令全局冷却',
    description: 'NPC 绑定命令（/npc cmd）的全局冷却时间，默认 1s。',
  },
  'npc.shops.add-default-item-description': {
    title: '商店物品默认描述',
    description: '是否为 NPC 商店的所有物品自动添加默认描述占位符。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'npc.shops.global-view-permission': {
    title: '商店查看权限',
    description: '查看任意 NPC 商店所需的全局权限，留空表示无需权限。',
  },

  // 9. 存储设置 (storage)
  'storage': {
    title: '存储设置',
    description: 'NPC 数据的保存方式与频率。',
  },
  'storage.file': {
    title: '数据保存文件名',
    description: 'NPC 数据保存的文件名，默认 saves.yml。一般无需修改。',
  },
  'storage.save-task.delay': {
    title: '自动保存间隔',
    description: 'NPC 数据写入磁盘的间隔，默认 1hr。\n调小可降低宕机时的数据丢失风险，但增加磁盘写入。',
  },
};

export const citizensDefinition: PluginConfigDocDefinition = {
  pluginNames: ['citizens'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: citizensConfigDocs,
};

export default citizensDefinition;
