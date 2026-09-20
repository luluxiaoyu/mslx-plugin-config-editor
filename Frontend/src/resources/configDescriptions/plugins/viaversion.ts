import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

const BOOLEAN_OPTIONS = [
  { value: true, label: 'true (开启)' },
  { value: false, label: 'false (关闭)' },
];

const PROTOCOL_TABLE_URL = 'https://minecraft.wiki/w/Protocol_version';

/**
 * ViaVersion config.yml 中文对照字典
 * 官方默认配置来源：https://github.com/ViaVersion/ViaVersion/blob/master/common/src/main/resources/assets/viaversion/config.yml
 */
export const viaversionConfigDocs: ConfigDocMap = {
  // 1. 全局设置 (Global Options)
  'check-for-updates': {
    title: '检查插件更新',
    description: '是否让 ViaVersion 自动检查新版本。\n- 设为 true 时，有新版本会在控制台提示。\n- 默认开启，建议保持。',
    options: BOOLEAN_OPTIONS,
  },
  'send-supported-versions': {
    title: '在服务器状态里展示支持的版本',
    description: '是否在玩家 Ping 服务器（多人游戏列表）返回的状态包中附带本服支持的所有 Minecraft 版本。\n默认关闭。开启后部分服务器列表工具可以读取并展示兼容版本范围。',
    options: BOOLEAN_OPTIONS,
  },
  'block-versions': {
    title: '按版本名阻止进服',
    description: '用可读的版本字符串阻止特定版本的客户端进服，比 block-protocols 更直观，两者可同时使用。\n- 支持 "<" 和 ">" 前缀表示范围。\n- 例如阻止 1.16.4、所有低于 1.16 及高于 1.17.1 的版本：["<1.16", "1.16.4", ">1.17.1"]\n- 默认为空列表（不阻止任何版本）。',
  },
  'block-protocols': {
    title: '按协议号阻止进服',
    description: '按 Minecraft 协议版本号（整数）列表阻止客户端进服，可与 block-versions 同时使用。\n- 协议号对照表：' + PROTOCOL_TABLE_URL + '\n- 也可用生成器：https://via.krusic22.com\n- 例如 [735, 736] 表示阻止 1.16/1.16.1。默认为空列表。',
  },
  'block-disconnect-msg': {
    title: '版本被阻止时的踢出提示',
    description: '玩家使用了被 block-versions / block-protocols 阻止的版本时，看到的断开连接提示消息。',
  },
  'reload-disconnect-msg': {
    title: '重载插件时的踢出提示',
    description: '当服务器同时装了 ProtocolLib 时，ViaVersion 无法热重载而不踢人，此消息为执行重载时踢出所有玩家所用的提示。\n官方不建议使用 /reload，请尽量重启服务器或使用插件管理器。',
  },
  'logging': {
    title: '日志行为设置',
    description: '控制 ViaVersion 各类转换错误与事件的日志输出。\n排查兼容问题时官方可能会要求你临时开启其中几项；平时大多默认关闭，防止恶意客户端输入刷屏。',
  },
  'logging.log-blocked-joins': {
    title: '记录被阻止的进服尝试',
    description: '是否在控制台打印因版本被 block-versions / block-protocols 拦截而踢出玩家的详细信息。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'logging.log-entity-data-errors': {
    title: '记录实体数据转换错误',
    description: '实体元数据在服务端与客户端版本间转换出错时，是否打印错误日志。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'logging.log-text-component-conversion-errors': {
    title: '记录文本组件转换错误',
    description: '聊天/告示牌等文本组件在不同版本间转换出错时，是否打印错误日志。\n默认关闭，防止恶意文本刷屏。',
    options: BOOLEAN_OPTIONS,
  },
  'logging.log-other-conversion-warnings': {
    title: '记录其他转换警告',
    description: '物品、方块等数据在服务端与客户端间转换出现其他问题时，是否打印警告日志。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'logging.max-error-length': {
    title: '单条错误日志最大长度',
    description: '控制台中单条错误消息的最大字符数，超出的部分会被截断。\n默认 1500，防止超长恶意输入撑爆日志。',
  },
  'config-version': {
    title: '配置文件版本号',
    description: '供 ViaVersion 自动升级配置文件使用的内部版本号。\n请勿手动修改，否则可能导致配置升级失败。',
  },
  'init-config-version': {
    title: '初始配置版本号',
    description: '记录配置文件首次生成时的版本，供内部迁移逻辑使用。\n请勿手动修改。',
  },
  'migrate-default-config-changes': {
    title: '自动迁移默认值变更',
    description: '当官方在新版本中修改了某个选项的默认值，而你的配置里该项仍保持旧默认值时，是否自动更新为新默认值。\n默认开启，建议保持。',
    options: BOOLEAN_OPTIONS,
  },
  'send-player-details': {
    title: '向服务端上报玩家真实版本',
    description: '开启后，玩家连接时 ViaVersion 会通过插件消息通道把玩家的真实客户端版本发送给服务端，供其他插件识别。\n详见：https://github.com/ViaVersion/ViaVersion/wiki/Server-and-Player-Details-Protocol\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'send-server-details': {
    title: '向玩家下发服务端真实版本',
    description: '开启后，玩家连接时 ViaVersion 会通过插件消息通道把服务端的真实版本告知客户端侧模组。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },

  // 2. Velocity 群组服设置 (Velocity Options)
  'velocity-ping-interval': {
    title: '子服版本探测间隔 (秒)',
    description: 'Velocity 群组中各子服可以是不同版本。ViaVersion 会按此间隔（秒）去 Ping 各子服以自动获取其协议版本。\n- 设为 -1 表示禁用自动探测。\n- 默认 60 秒。',
  },
  'velocity-ping-save': {
    title: '保存子服探测结果',
    description: 'velocity-ping-interval 开启时，是否把探测到的各子服协议版本写入下方 velocity-servers 段，便于下次直接使用。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'velocity-servers': {
    title: '子服协议版本映射表',
    description: '手动指定 Velocity 各子服的协议版本号，格式为：\n  子服名: 协议号\n例如 lobby: 47 表示 lobby 服是 1.8。\n- 查找顺序：先查本表 → 再查 Ping 缓存（若开启了探测）→ 最后用默认值。\n- 协议号对照表：' + PROTOCOL_TABLE_URL,
  },

  // 3. 全局限流 (Global Packet Limiter)
  'packet-limiter': {
    title: '数据包频率限制器',
    description: '限制单个客户端每秒可发送的数据包数量（PPS），防止恶意发包攻击。\n正常客户端每秒约发送 20-90 个包。踢出消息中可使用 %pps 占位符（主要用于调试）。',
  },
  'packet-limiter.enabled': {
    title: '启用频率限制',
    description: '是否开启每秒数据包数量限制。\n默认开启，建议保持以防御发包攻击。',
    options: BOOLEAN_OPTIONS,
  },
  'packet-limiter.max-per-second': {
    title: '每秒最大包数',
    description: '单个客户端每秒允许发送的最大数据包数，超过即踢出。\n设为 -1 表示不限制。默认 800。',
  },
  'packet-limiter.max-per-second-kick-message': {
    title: '频率超限踢出提示',
    description: '客户端每秒包数超过 max-per-second 时被踢出的提示消息，可使用 %pps 占位符。',
  },
  'packet-limiter.sustained-max-per-second': {
    title: '持续超限的每秒阈值',
    description: '在较长时间窗口内允许的持续每秒最大包数。配合下面两项实现"持续超限才踢"：例如在 sustained-period-seconds 秒内，有 sustained-threshold 秒超过此值就踢出。\n设为 -1 表示禁用该检测。默认 200。',
  },
  'packet-limiter.sustained-period-seconds': {
    title: '持续超限统计窗口 (秒)',
    description: '统计持续超限的时间窗口长度（秒）。\n默认 7 秒。',
  },
  'packet-limiter.sustained-threshold': {
    title: '持续超限触发秒数',
    description: '在统计窗口内，客户端有多少秒超过 sustained-max-per-second 才会被踢出。\n默认 4 秒。',
  },
  'packet-limiter.sustained-kick-message': {
    title: '持续超限踢出提示',
    description: '客户端持续超频发包被踢出时的提示消息，可使用 %pps 占位符。',
  },
  'packet-size-limiter': {
    title: '数据包大小限制器',
    description: '限制单个客户端每秒发送的数据包总大小（KB），防止大流量攻击。\n结构与 packet-limiter 相同，踢出消息可使用 %bps 占位符。默认整体关闭。',
  },
  'packet-size-limiter.enabled': {
    title: '启用大小限制',
    description: '是否开启每秒数据包总大小限制。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'packet-size-limiter.max-per-second': {
    title: '每秒最大流量 (KB)',
    description: '单个客户端每秒允许发送的数据包总大小（KB），超过即踢出。\n设为 -1 表示不限制。默认 -1。',
  },
  'packet-size-limiter.max-per-second-kick-message': {
    title: '流量超限踢出提示',
    description: '客户端每秒流量超过 max-per-second 时被踢出的提示消息，可使用 %bps 占位符。',
  },
  'packet-size-limiter.sustained-max-per-second': {
    title: '持续超限的每秒流量 (KB)',
    description: '在时间窗口内允许的持续每秒最大流量（KB）。\n设为 -1 表示禁用该检测。默认 -1。',
  },
  'packet-size-limiter.sustained-period-seconds': {
    title: '持续超限统计窗口 (秒)',
    description: '统计持续超限的时间窗口长度（秒）。\n默认 5 秒。',
  },
  'packet-size-limiter.sustained-threshold': {
    title: '持续超限触发秒数',
    description: '在统计窗口内，客户端有多少秒超过 sustained-max-per-second 才会被踢出。\n默认 3 秒。',
  },
  'packet-size-limiter.sustained-kick-message': {
    title: '持续流量超限踢出提示',
    description: '客户端持续发送超大流量被踢出时的提示消息，可使用 %bps 占位符。',
  },

  // 4. 多版本兼容修复项 (Multiple Versions Options)
  'hologram-patch': {
    title: '修复悬浮字位置偏移',
    description: '当全息投影（Hologram，盔甲架悬浮字）在高版本客户端上显示位置偏低/错位时，开启此项进行修正。\n默认关闭，出现错位再开。',
    options: BOOLEAN_OPTIONS,
  },
  'hologram-y': {
    title: '悬浮字高度偏移量',
    description: 'hologram-patch 开启时使用的 Y 轴修正偏移量。\n默认 -0.96，一般无需修改。',
  },
  'register-userconnections-on-join': {
    title: '进服事件前就绪连接数据',
    description: '确保在 PlayerJoinEvent 触发时，ViaVersion 的玩家连接对象（UserConnection）已可用，供其他插件读取玩家版本。\n- 如果你 100% 确定没有其他插件需要它，可以关闭以略微加快进服速度。\n- 默认开启，建议保持。',
    options: BOOLEAN_OPTIONS,
  },
  'piston-animation-patch': {
    title: '禁用 1.11 活塞动画',
    description: '针对 1.11 / 1.11.1 客户端：大量活塞同时工作时可能直接崩溃客户端，开启此项可对这些客户端禁用活塞动画。\n默认关闭，有 1.11 玩家崩溃再开。',
    options: BOOLEAN_OPTIONS,
  },
  'quick-move-action-fix': {
    title: '修复 1.12 Shift 快速移动物品',
    description: '实验性功能。修复 1.12 客户端在 1.8-1.11.2 服务端上 Shift+双击快速移动物品失效的问题。\n仅对 1.8-1.11.2 的 Bukkit 系服务端生效。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'multi-reddust-color-fix': {
    title: '修复 1.13+ 红石粒子彩色显示',
    description: '修复 1.13+ 客户端看到的红石粉粒子颜色被客户端随机化的问题，使其显示正确颜色。\n- 代价是每个粒子多发一个数据包，开启可能造成轻微发包增加。\n- 默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'team-colour-fix': {
    title: '修复 1.13+ 队伍颜色',
    description: '是否用队伍前缀的方式为 1.13 及以上客户端修正玩家名字颜色显示。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'disable-1_13-auto-complete': {
    title: '禁用 1.13 新命令补全',
    description: '1.13 引入了新的命令自动补全，在低于 1.13 的服务端上可能触发"Kicked for spamming"（刷屏踢出）。\n设为 true 可完全禁用该新补全机制。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  '1_13-tab-complete-delay': {
    title: 'Tab 补全请求延迟 (tick)',
    description: '将 1.13+ 客户端的 Tab 补全请求延迟指定 tick 数再处理；大于 0 时生效。若延迟期间收到新的补全请求，旧请求会被取消。\n可缓解补全刷屏问题。默认 0（不延迟）。',
  },
  'fix-low-snow-collision': {
    title: '修复 1.13+ 薄雪层无碰撞',
    description: '对 1.13 客户端来说最薄的一层雪没有碰撞体积，会"陷进去"。\n开启后会把单层雪以两层雪的形式发给 1.13+ 客户端，防止穿模。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'fix-infested-block-breaking': {
    title: '修复虫蚀方块无法挖掘',
    description: '虫蚀方块（蠹虫方块）对 1.13+ 客户端是瞬间破坏的，导致在 1.13 以下服务端上无法正常挖掘。\n开启后会把它们映射为对应的普通石头类方块。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'truncate-1_14-books': {
    title: '截断 1.14 成书页数',
    description: '1.14 将成书页数上限从 50 提高到 100，部分反作弊/反利用插件会在页数超过 50 时直接封禁玩家。\n开启后会把编辑的成书截断到 50 页。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'change-1_9-hitbox': {
    title: '修正 1.9-1.13 潜行碰撞箱',
    description: '修复 1.9-1.13 客户端在 1.8 服务端上潜行到方块下方时无击退/速度异常（velocity bug）的问题。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },

  'change-1_14-hitbox': {
    title: '修正 1.14+ 潜行碰撞箱',
    description: '与 change-1_9-hitbox 类似，但面向 1.14+ 客户端连接 1.8-1.13 服务端的场景。\n- 警告：开启后 1.14+ 玩家能潜行通过 1.5 格高的缝隙（低版本玩家做不到），且潜行时头顶部分的弹射物/攻击可能打不中他们，可能破坏 PVP 平衡。\n- 默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'fix-non-full-blocklight': {
    title: '修复 1.14+ 非完整方块光照',
    description: '修复 1.14+ 客户端在 1.14 以下服务端上看到的非完整方块（半砖、台阶等）光照值为 0（发黑）的问题。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'fix-1_14-health-nan': {
    title: '修复 1.14 生命值 NaN 动画丢失',
    description: '修复当玩家生命值被插件设置为 Float.NaN 时，1.14 客户端不显示行走动画的问题。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'use-1_15-instant-respawn': {
    title: '1.15+ 跳过死亡界面重生',
    description: '是否让 1.15 及以上客户端死亡后立即重生，不显示死亡界面。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'serverside-blockconnections': {
    title: '启用服务端方块连接计算',
    description: '为 1.13+ 客户端在服务端侧计算栅栏、玻璃板等方块的连接状态（因为 1.13 以下服务端没有这些数据）。\n本节中的 blockconnection-method 等选项都围绕它工作。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'blockconnection-method': {
    title: '方块连接计算方式',
    description: 'serverside-blockconnections 开启时的计算模式：\n- packet：数据包级（默认，稳定）\n- world：世界级（高度实验性，风险自负）',
    options: [
      { value: 'packet', label: 'packet 数据包级 (默认，推荐)' },
      { value: 'world', label: 'world 世界级 (实验性，慎用)' },
    ],
  },
  'reduce-blockstorage-memory': {
    title: '降低方块连接内存占用',
    description: '开启后只存储最重要的方块连接数据（栅栏、玻璃板等不再与实心方块连接），可显著降低内存占用。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'flowerstem-when-block-above': {
    title: '上方有方块时花显示为茎',
    description: '配合 serverside-blockconnections 使用：开启后，上方有方块遮挡的花会向客户端显示为茎。\n适合大厅服等玩家不能建造、花茎仅作装饰的场景。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'vine-climb-fix': {
    title: '修复悬空藤蔓可攀爬',
    description: '开启后，没有附着方块的藤蔓会被映射为空气，防止 1.13+ 客户端在 1.13 以下服务端上攀爬本不该能爬的悬空藤蔓。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'ignore-long-1_16-channel-names': {
    title: '忽略超长插件通道名',
    description: '忽略 1.16+ 客户端发来的、通道名超过 32 字符的插件消息。\nCraftBukkit 在 1.16 之前硬编码了该限制，需假设某些服务端/代理仍存在此检查。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'forced-use-1_17-resource-pack': {
    title: '强制 1.17+ 客户端使用资源包',
    description: '强制 1.17+ 客户端接受服务器资源包；若玩家拒绝将自动断开连接。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },

  'resource-pack-1_17-prompt': {
    title: '资源包确认提示语',
    description: '1.17+ 客户端收到服务器资源包时，确认窗口上显示的提示文本。\n默认为空（不显示自定义提示）。',
  },
  'cache-1_17-light': {
    title: '缓存 1.17 光照数据',
    description: '缓存光照数据直到区块卸载，使后续区块更新包可以只发增量，而不是在首次区块数据时就清除缓存。\n默认开启，除非你知道自己在做什么，否则不要关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'armor-toggle-fix': {
    title: '修复 1.19.4+ 盔甲栏换装',
    description: '当 1.19.4+ 玩家尝试在已被占用的槽位上快速切换盔甲时，强制刷新其背包显示，避免物品显示不同步。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'map-1_16-world-names': {
    title: '1.16 维度世界名映射',
    description: '配置向客户端返回的三个原版维度对应的世界名称（overworld / nether / end）。\n一般保持默认即可。',
  },
  'map-1_16-world-names.overworld': {
    title: '主世界维度名',
    description: '向客户端返回的主世界（overworld）对应的世界名称。\n默认 minecraft:overworld。',
  },
  'map-1_16-world-names.nether': {
    title: '下界维度名',
    description: '向客户端返回的下界（nether）对应的世界名称。\n默认 minecraft:the_nether。',
  },
  'map-1_16-world-names.end': {
    title: '末地维度名',
    description: '向客户端返回的末地（end）对应的世界名称。\n默认 minecraft:the_end。',
  },
  'translate-ocelot-to-cat': {
    title: '把豹猫翻译为猫',
    description: '针对 1.13 服务端 + 1.14+ 客户端：\n- 设为 false 时，已驯服的猫显示为豹猫；\n- 设为 true 时，豹猫（无论是否驯服）显示为猫。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'enforce-secure-chat': {
    title: '伪装安全聊天状态',
    description: '当 ViaVersion 无法获取真实值时，决定进服时向 1.19+ 客户端发送的安全聊天（Secure Chat）标记。\n- 如果你的服务端本身是 1.19 或更高版本，不建议伪造该值：1.20.5 起聊天校验更严格，伪造可能导致玩家被踢。\n- 默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'handle-invalid-item-count': {
    title: '处理 1.20.3 非法物品堆叠数',
    description: '处理 1.20.3 服务端上物品数量超过最大堆叠上限的非法物品，防止客户端异常。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'hide-scoreboard-numbers': {
    title: '隐藏 1.20.3+ 侧边栏记分板数字',
    description: '在旧版本服务端上，为 1.20.3+ 客户端隐藏侧边栏记分板右侧的数字列。\n默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'fix-1_21-placement-rotation': {
    title: '修复 1.21+ 快速移动放错水桶',
    description: '修复 1.21+ 客户端在 1.20.5 服务端上快速移动时，水/岩浆桶放置位置错误的问题。\n注意：可能与反作弊插件产生误判。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'cancel-swing-in-inventory': {
    title: '取消打开背包时的挥手动作',
    description: '开启后，取消 1.15.2 及以下服务端上玩家在打开背包界面时发送的挥手（攻击）数据包。\n注意：可能与反作弊插件产生误判。默认开启。',
    options: BOOLEAN_OPTIONS,
  },


  // 5. 1.9+ 客户端连接 1.8 服务端 (1.9+ Clients on 1.8 Servers)
  'prevent-collision': {
    title: '阻止玩家互相碰撞',
    description: '1.9 起加入了玩家碰撞体积，在 1.8 服务端上会导致玩家互相推挤。\n开启后阻止 1.9+ 玩家之间的碰撞推挤，还原 1.8 手感。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'auto-team': {
    title: '自动分配队伍',
    description: 'prevent-collision 开启时，是否自动把玩家放进同一个队伍来彻底禁用碰撞（队伍内无碰撞）。\n如果你自己的插件会管理队伍，可以关闭。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'shield-blocking': {
    title: '启用盾牌格挡',
    description: '开启后，1.9+ 玩家在 1.8 服务端上可以使用盾牌进行格挡（替代旧版剑格挡）。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'no-delay-shield-blocking': {
    title: '主手无延迟格挡',
    description: '开启后，用主手触发格挡而不是副手，格挡生效更快。\n- 需要 show-shield-when-sword-in-hand 设为 false。\n- 默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'show-shield-when-sword-in-hand': {
    title: '手持剑时显示盾牌',
    description: '开启后，1.9+ 玩家主手持剑时会立即显示盾牌（模拟 1.8 剑格挡外观），切换到其他物品时消失。\n- 需要 shield-blocking 设为 true。\n- 默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'simulate-pt': {
    title: '模拟玩家刻运算',
    description: '开启玩家 tick（刻）模拟，修复 1.9+ 客户端在 1.8 服务端上吃东西、喝药水、进下界传送门等动作异常的问题。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'nms-player-ticking': {
    title: '使用 NMS 进行玩家刻模拟',
    description: '是否使用 NMS（服务端内部）玩家对象来模拟数据包，可能修复部分反作弊插件的误判问题。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'bossbar-patch': {
    title: '修复 Boss 血条显示',
    description: '修补 Boss 血条（BossBar），让 1.9+ 客户端在 1.8 服务端上能正常显示。\n默认开启；如遇到血条异常问题可尝试关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'bossbar-anti-flicker': {
    title: 'Boss 血条防闪烁',
    description: '如果 1.9+ 客户端上的 Boss 血条闪烁，可设为 true。\n- 副作用：所有血条会固定显示为 100% 血量，不推荐常规使用。\n- 默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'use-new-effect-indicator': {
    title: '显示新版药水效果图标',
    description: '为 1.9+ 玩家在屏幕右上角显示新版的药水/状态效果指示图标。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'use-new-deathmessages': {
    title: '显示新版死亡消息',
    description: '为 1.9+ 玩家在死亡界面上显示新版样式的死亡消息。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'item-cache': {
    title: '缓存物品转换结果',
    description: '缓存转换后的物品数据，防止大量物品转换导致服务器卡顿。\n- 代价是后台常驻一个缓存任务，占用少量性能。\n- 默认开启，建议保持。',
    options: BOOLEAN_OPTIONS,
  },
  'replace-pistons': {
    title: '替换伸出状态活塞',
    description: '修复 1.10.1 客户端加载区块时伸出状态的活塞导致崩溃的问题（仅在区块加载时替换）。\n默认关闭，有 1.10.1 玩家再开。',
    options: BOOLEAN_OPTIONS,
  },
  'replacement-piston-id': {
    title: '活塞替换方块 ID',
    description: 'replace-pistons 开启时，把伸出活塞替换为什么方块 ID。\n默认 0（空气）。注意：玩家站在被替换的位置上可能会被卡住。',
  },
  'chunk-border-fix': {
    title: '修复 1.9+ 远处区块不渲染',
    description: '修复 1.9+ 客户端不渲染远处区块的问题，并改善快速移动时的区块加载表现。\n- 代价：网络流量增加，客户端 FPS 略微下降。\n- 默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'left-handed-handling': {
    title: '支持 1.9+ 左撇子模式',
    description: '允许 1.9+ 客户端在 1.8 服务端上使用左手为主手的设置。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'cancel-block-sounds': {
    title: '取消重复方块音效',
    description: '尝试取消 1.8 服务端发给 1.9+ 客户端的方块破坏/放置音效，防止音效重复播放两次。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'use-1_8-hitbox-margin': {
    title: '1.21.11+ 使用 1.8 攻击判定宽度',
    description: '开启后，1.21.11+ 客户端在 1.8 服务端上用物品攻击实体时，使用更宽的 1.8 风格实体碰撞箱判定。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },
};

export const viaversionDefinition: PluginConfigDocDefinition = {
  pluginNames: ['viaversion'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: viaversionConfigDocs,
};

export default viaversionDefinition;

