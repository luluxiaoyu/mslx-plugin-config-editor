import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

const BOOLEAN_OPTIONS = [
  { value: true, label: 'true (开启)' },
  { value: false, label: 'false (关闭)' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOWEST', label: 'LOWEST (最低，最先执行)' },
  { value: 'LOW', label: 'LOW (较低)' },
  { value: 'NORMAL', label: 'NORMAL (普通)' },
  { value: 'HIGH', label: 'HIGH (较高)' },
  { value: 'HIGHEST', label: 'HIGHEST (最高)' },
  { value: 'MONITOR', label: 'MONITOR (监控，只读)' },
];

/**
 * Multiverse-Core config.yml 中文对照字典
 * 配置来源：MV5 源码 CoreConfigNodes.java（官方配置节点定义，含注释与默认值）
 */
export const multiverseCoreConfigDocs: ConfigDocMap = {
  // 1. 世界设置 (world)
  'world': {
    title: '世界管理设置',
    description: 'Multiverse 世界管理的全局行为设置。',
  },
  'world.auto-import-default-worlds': {
    title: '自动导入默认世界',
    description: '开启后，Multiverse 启动/重载时会自动导入 server.properties 中 level-name 指定的主世界（含下界和末地，若已生成）。\n默认开启，一般保持即可。',
    options: BOOLEAN_OPTIONS,
  },
  'world.auto-import-3rd-party-worlds': {
    title: '自动导入其他插件创建的世界',
    description: '开启后，Multiverse 启动/重载时会自动导入其他插件创建的所有世界。\n默认开启。设为 false 可避免某些插件世界被重复注册。',
    options: BOOLEAN_OPTIONS,
  },
  'world.enforce-access': {
    title: '强制世界进入权限',
    description: '是否阻止玩家进入没有权限的世界。\n- true：玩家需有 multiverse.access.<世界名> 权限才能进入对应世界。\n- false：玩家可自由进入所有世界。\n默认关闭。多世界权限管理必备。',
    options: BOOLEAN_OPTIONS,
  },
  'world.enforce-gamemode': {
    title: '强制世界游戏模式',
    description: '玩家切换世界时是否强制切到该世界设定的游戏模式。\n拥有 mv.bypass.gamemode.<世界名> 权限的玩家不受影响。默认开启。\n每个世界的模式用 /mv modify <世界名> set gamemode <模式> 设置。',
    options: BOOLEAN_OPTIONS,
  },
  'world.enforce-flight': {
    title: '强制飞行限制',
    description: '是否由 Multiverse 全局接管世界飞行能力（allow-flight 世界属性）。\n若用其他插件管理飞行，可关闭此项，关闭后世界的 allow-flight 属性将失效。',
    options: BOOLEAN_OPTIONS,
  },
  'world.gamemode-and-flight-enforce-delay': {
    title: '模式/飞行强制延迟 (tick)',
    description: '切换世界后，延迟多少 tick 再强制游戏模式和飞行能力。\n- 默认 1。与其他模式/飞行插件冲突时可调大（如 5、10）。\n- 0 表示在世界切换事件中立即强制。',
  },
  'world.apply-entity-spawn-rate': {
    title: '应用世界实体生成速率',
    description: '是否应用 worlds.yml 中每个世界的 tick-rate（实体生成速率）配置。\n关闭则该配置失效，可改由 paper-world.yml 等管理。\n注意：修改后需重启服务器才完全生效。',
    options: BOOLEAN_OPTIONS,
  },
  'world.apply-entity-spawn-limit': {
    title: '应用世界实体生成上限',
    description: '是否在加载世界时应用 worlds.yml 中的 spawn-limit（实体上限）配置。\n关闭可改由 paper-world.yml 等其他插件管理。\n注意：修改后需重启服务器才完全生效。',
    options: BOOLEAN_OPTIONS,
  },
  'world.auto-purge-entities': {
    title: '加载时自动清理实体',
    description: '开启后，每次加载世界时会按该世界的实体生成配置自动清除多余实体。\n默认关闭。清理不可恢复，请谨慎开启。',
    options: BOOLEAN_OPTIONS,
  },
  'world.warn-alias-conflicts': {
    title: '世界别名冲突警告',
    description: '添加世界或修改别名时，若多个世界使用相同别名、或别名与其他世界重名，是否在控制台警告。\n默认开启，建议保持，避免命令选世界时产生混乱。',
    options: BOOLEAN_OPTIONS,
  },
  'world.world-name-format': {
    title: '世界组命名格式',
    description: '用于自动识别某主世界对应的下界/末地世界的命名格式。\n供 default-respawn-in-overworld 等功能使用。',
  },
  'world.world-name-format.nether': {
    title: '下界世界命名格式',
    description: '识别"主世界-下界"世界组的命名规则，%overworld% 为主世界名。\n默认 %overworld%_nether。若你的下界名不同，请改为实际格式。',
  },
  'world.world-name-format.end': {
    title: '末地世界命名格式',
    description: '识别"主世界-末地"世界组的命名格式，%overworld% 为主世界名。\n默认 %overworld%_the_end。',
  },

  // 2. 传送设置 (teleport)
  'teleport': {
    title: '传送设置',
    description: 'Multiverse 传送行为（/mvtp、/mvspawn 等）的全局配置。',
  },
  'teleport.use-finer-teleport-permissions': {
    title: '使用细粒度传送权限',
    description: '开启后 /mvtp 与 /mvspawn 使用更细的权限节点：\n- multiverse.teleport.<self|other>.<类型>.<目标>\n- multiverse.core.spawn.<self|other>.<世界名>\n关闭则使用旧版粗粒度权限（不带具体目标）。',
    options: BOOLEAN_OPTIONS,
  },
  'teleport.passenger-mode': {
    title: '乘客/载具传送模式',
    description: '实体被传送时（仅限 Multiverse 触发的传送），乘客与载具的处理方式：\n- default：由服务端决定\n- dismount_passengers / dismount_vehicle / dismount_all：传送前解除\n- retain_passengers / retain_vehicle / retain_all：跟随一起传送',
    options: [
      { value: 'default', label: 'default (由服务端处理)' },
      { value: 'dismount_passengers', label: 'dismount_passengers (传送前让乘客下车)' },
      { value: 'dismount_vehicle', label: 'dismount_vehicle (传送前解除载具)' },
      { value: 'dismount_all', label: 'dismount_all (全部解除)' },
      { value: 'retain_passengers', label: 'retain_passengers (保留乘客一起传送)' },
      { value: 'retain_vehicle', label: 'retain_vehicle (保留载具一起传送)' },
      { value: 'retain_all', label: 'retain_all (全部一起传送)' },
    ],
  },
  'teleport.concurrent-teleport-limit': {
    title: '单次批量传送上限',
    description: '/mv teleport 一次最多可同时传送的玩家数量，默认 50。防止误操作批量传送卡服。',
  },
  'teleport.teleport-intercept': {
    title: '拦截所有传送事件',
    description: '开启后，Multiverse 会对所有传送（包括其他插件发起的）执行世界进入权限检查。\n只有与其他传送插件冲突时才建议关闭。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'teleport.safe-location-horizontal-search-radius': {
    title: '安全落点水平搜索半径',
    description: '传送目标不安全时，在水平方向（X/Z 轴）扩大搜索安全位置的范围，默认 3。\n调大更容易找到安全点但更耗性能，设为 0 禁用搜索。',
  },
  'teleport.safe-location-vertical-search-radius': {
    title: '安全落点垂直搜索半径',
    description: '垂直方向（Y 轴）搜索安全传送点的范围，默认 3。调大更耗性能，设为 0 禁用。',
  },

  // 3. 出生点设置 (spawn)
  'spawn': {
    title: '出生点与重生设置',
    description: '玩家首次进服、每次进服、死亡重生时的位置规则。',
  },
  'spawn.first-spawn-override': {
    title: '覆盖首次出生点',
    description: '是否覆盖玩家第一次进服的出生位置（配合 first-spawn-location 使用）。\n关闭时使用 server.properties 的默认设置。',
    options: BOOLEAN_OPTIONS,
  },
  'spawn.first-spawn-location': {
    title: '首次进服位置',
    description: '玩家第一次进服时的出生位置（Multiverse 目标格式，如 w:世界名）。\n仅当 first-spawn-override 开启时生效。',
  },
  'spawn.enable-join-destination': {
    title: '启用每次进服固定位置',
    description: '开启后，玩家每次进服都会被传送到 join-destination 指定的位置（而非仅首次进服）。',
    options: BOOLEAN_OPTIONS,
  },
  'spawn.join-destination': {
    title: '每次进服的传送目标',
    description: '玩家每次进服都被传送到的位置（Multiverse 目标格式，如 w:lobby）。\n需开启 enable-join-destination 才生效。',
  },
  'spawn.default-respawn-in-overworld': {
    title: '下界/末地死亡回主世界重生',
    description: '玩家没有床/重生锚、且死亡世界未设置 respawn-world 时：\n- true：回主世界重生（原版行为）\n- false：在死亡世界重生\n优先级高于 default-respawn-within-same-world。',
    options: BOOLEAN_OPTIONS,
  },
  'spawn.default-respawn-within-same-world': {
    title: '在死亡世界重生',
    description: '玩家死亡且无床/重生锚、也未设置 respawn-world 时，是否在死亡的世界重生（使用该世界出生点）。\n关闭则交给其他重生插件处理。',
    options: BOOLEAN_OPTIONS,
  },
  'spawn.enforce-respawn-at-world-spawn': {
    title: '强制在世界出生点重生',
    description: '开启后，重生时总是回到重生世界的出生点（除非有床/重生锚）。\n关闭则允许使用 /spawnpoint 等自定义重生位置。',
    options: BOOLEAN_OPTIONS,
  },

  // 4. 传送门设置 (portal)
  'portal': {
    title: '传送门搜索设置',
    description: '控制玩家穿过传送门时搜索对应传送门的范围。',
  },
  'portal.use-custom-portal-search': {
    title: '自定义传送门搜索半径',
    description: '是否由 Multiverse 接管原版的传送门搜索半径。\n关闭则按 Bukkit 默认行为处理。',
    options: BOOLEAN_OPTIONS,
  },
  'portal.custom-portal-search-radius': {
    title: '传送门搜索半径',
    description: '搜索目标传送门的最大范围（方块），默认 128。\n仅当 use-custom-portal-search 开启时生效。值越大搜索越慢，不能为负数。',
  },

  // 5. 消息与本地化 (messaging)
  'messaging': {
    title: '消息与本地化设置',
    description: '聊天前缀、PlaceholderAPI 挂钩与多语言设置。',
  },
  'messaging.enable-chat-prefix': {
    title: '聊天加世界名前缀',
    description: '是否在聊天消息前加上世界名前缀。\n如果用其他聊天格式化插件（如 EssentialsXChat），保持关闭以免冲突。',
    options: BOOLEAN_OPTIONS,
  },
  'messaging.chat-prefix-format': {
    title: '世界前缀格式',
    description: '聊天前缀的格式模板，仅当 enable-chat-prefix 开启时生效。\n默认 [%world%]%chat%，%world% 为世界名、%chat% 为聊天内容。',
  },
  'messaging.register-papi-hook': {
    title: '注册 PlaceholderAPI 挂钩',
    description: '是否向 PlaceholderAPI 注册 Multiverse 的变量（需已安装 PlaceholderAPI）。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'messaging.warn-invalid-papi-format': {
    title: '警告无效的 PAPI 变量',
    description: 'Multiverse 变量书写错误时是否在控制台警告。仅针对 multiverse 提供的变量。',
    options: BOOLEAN_OPTIONS,
  },
  'messaging.invalid-papi-format-returns-blank': {
    title: '无效变量返回空白',
    description: 'Multiverse 变量格式错误时的返回行为：\n- false（默认）：返回原始变量字符串\n- true：返回空白',
    options: BOOLEAN_OPTIONS,
  },
  'messaging.default-locale': {
    title: '默认语言',
    description: 'Multiverse 消息使用的默认语言，如 zh、en。\n玩家客户端语言无对应翻译时回退到此语言。',
    options: [
      { value: 'zh', label: 'zh (简体中文)' },
      { value: 'zh_tw', label: 'zh_tw (繁体中文)' },
      { value: 'en', label: 'en (英语)' },
      { value: 'ja', label: 'ja (日语)' },
      { value: 'ko', label: 'ko (韩语)' },
      { value: 'de', label: 'de (德语)' },
      { value: 'fr', label: 'fr (法语)' },
      { value: 'ru', label: 'ru (俄语)' },
    ],
  },
  'messaging.per-player-locale': {
    title: '按玩家客户端语言显示',
    description: '开启后，Multiverse 的消息按每个玩家客户端语言显示（无对应翻译时回退到默认语言）。\n默认开启。',
    options: BOOLEAN_OPTIONS,
  },

  // 6. 命令设置 (command)
  'command': {
    title: '命令行为设置',
    description: 'Multiverse 命令的确认、补全等行为。',
  },
  'command.resolve-alias-name': {
    title: '命令支持世界别名',
    description: '开启后，命令和传送目标可以直接使用世界别名（真实世界名依然有效）。\n多个世界同别名时使用先找到的那个。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'command.simplified-destination-tab-completion': {
    title: '简化传送目标补全',
    description: '开启后，Tab 补全只提示简单格式（纯世界名），不提示 e:世界:x,y,z、p:玩家名 等复杂格式。\n只是简化提示，玩家仍可通过权限使用完整格式。',
    options: BOOLEAN_OPTIONS,
  },
  'command.confirm-mode': {
    title: '危险命令确认模式',
    description: '执行危险操作（如删除世界）前是否需要 /mv confirm 确认：\n- enable：始终需要\n- player_only：仅玩家执行时需要\n- disable：完全不需要（不建议）',
    options: [
      { value: 'enable', label: 'enable (需要确认，推荐)' },
      { value: 'player_only', label: 'player_only (仅玩家需确认)' },
      { value: 'disable_command_blocks', label: 'disable_command_blocks (命令方块免确认)' },
      { value: 'disable_console', label: 'disable_console (控制台免确认)' },
      { value: 'disable', label: 'disable (全部免确认)' },
    ],
  },
  'command.use-confirm-otp': {
    title: '确认命令加验证码',
    description: '开启后，/mv confirm 需要附带随机 3 位数字（如 /mv confirm 726），防止误确认危险操作。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'command.confirm-timeout': {
    title: '确认超时时间 (秒)',
    description: '/mv confirm 的有效时长，超时后需重新执行原命令，默认 30 秒。',
  },
  'command.show-legacy-aliases': {
    title: '显示旧版命令别名',
    description: '是否在 Tab 补全中显示 MV4 时代的旧命令别名（如 /mvclone）。\n默认关闭。注意：需重启服务器才生效。',
    options: BOOLEAN_OPTIONS,
  },

  // 7. 事件优先级 (event-priority)
  'event-priority': {
    title: '事件优先级',
    description: '调整 Multiverse 监听各类 Bukkit 事件的优先级，用于与其他插件协调执行顺序。\n一般无需改动，仅在与其他插件冲突时调整。\n注意：修改后需重启服务器才生效。',
  },
  'event-priority.player-portal': {
    title: '传送门事件优先级',
    description: 'PlayerPortalEvent 的监听优先级，默认 HIGH。仅在其他传送插件与 Multiverse 冲突时调整。需重启生效。',
    options: PRIORITY_OPTIONS,
  },
  'event-priority.player-respawn': {
    title: '重生事件优先级',
    description: 'PlayerRespawnEvent 的监听优先级，默认 LOW。与其他重生插件冲突时可调整。需重启生效。',
    options: PRIORITY_OPTIONS,
  },
  'event-priority.player-spawn-location': {
    title: '进服位置事件优先级',
    description: 'PlayerSpawnLocationEvent 的监听优先级，默认 NORMAL。需重启生效。',
    options: PRIORITY_OPTIONS,
  },
  'event-priority.player-teleport': {
    title: '传送事件优先级',
    description: 'PlayerTeleportEvent 的监听优先级，默认 HIGHEST。与其他传送插件冲突时可调整。需重启生效。',
    options: PRIORITY_OPTIONS,
  },
  'event-priority.player-changed-world': {
    title: '切换世界事件优先级',
    description: 'PlayerChangedWorldEvent 的监听优先级，默认 NORMAL。需重启生效。',
    options: PRIORITY_OPTIONS,
  },

  // 8. 杂项设置 (misc)
  'misc': {
    title: '杂项设置',
    description: '调试、启动行为、文件路径等杂项配置。',
  },
  'misc.bukkit-yml-path': {
    title: 'bukkit.yml 路径',
    description: 'bukkit.yml 文件路径。仅当用 --bukkit-settings 启动参数指定了自定义路径时才需修改。\n注意：修改后需重启服务器。',
  },
  'misc.server-properties-path': {
    title: 'server.properties 路径',
    description: 'server.properties 文件路径。仅当用 --config 启动参数指定了自定义路径时才需修改。需重启生效。',
  },
  'misc.auto-detect-generator-plugins': {
    title: '自动检测世界生成器插件',
    description: '是否自动检测服务器上安装的世界生成器插件（仅影响 /mv create 的 Tab 补全和 /mv generators 的输出）。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'misc.global-debug': {
    title: '全局调试等级',
    description: 'Multiverse 的调试日志等级，排查问题时按开发者要求调整：\n- 0 = 关闭（默认）\n- 1/2/3 = 由细到最细的调试日志',
    options: [
      { value: 0, label: '0 - 关闭' },
      { value: 1, label: '1 - fine (详细)' },
      { value: 2, label: '2 - finer (更详细)' },
      { value: 3, label: '3 - finest (最详细)' },
    ],
  },
  'misc.debug-permissions': {
    title: '权限检查调试日志',
    description: '在控制台记录 Multiverse 所有插件的每一次权限检查。\n需将 misc.global-debug 设为 1 及以上才生效。仅排查问题时开启。',
    options: BOOLEAN_OPTIONS,
  },
  'misc.silent-start': {
    title: '静默启动',
    description: '开启后，Multiverse 启动时不再在控制台输出配置加载信息。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'misc.show-donation-message': {
    title: '显示捐赠提示',
    description: '是否在控制台显示 Multiverse 的捐赠提示信息。不想看到可关闭。',
    options: BOOLEAN_OPTIONS,
  },

  // version
  'version': {
    title: '配置文件版本号',
    description: '配置文件版本标识，由插件自动维护，用于配置迁移。\n请勿手动修改！',
  },
};

export const multiverseCoreDefinition: PluginConfigDocDefinition = {
  pluginNames: ['multiverse-core', 'multiverse'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: multiverseCoreConfigDocs,
};

export default multiverseCoreDefinition;
