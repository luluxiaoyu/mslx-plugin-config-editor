import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

const COLOR_CODE_OPTIONS = [
  { value: '0', label: '0 - 黑色 (Black)' },
  { value: '1', label: '1 - 深蓝色 (Dark Blue)' },
  { value: '2', label: '2 - 深绿色 (Dark Green)' },
  { value: '3', label: '3 - 深青色 (Dark Aqua)' },
  { value: '4', label: '4 - 深红色 (Dark Red)' },
  { value: '5', label: '5 - 紫色 (Dark Purple)' },
  { value: '6', label: '6 - 金色 (Gold)' },
  { value: '7', label: '7 - 灰色 (Gray)' },
  { value: '8', label: '8 - 深灰色 (Dark Gray)' },
  { value: '9', label: '9 - 蓝色 (Blue)' },
  { value: 'a', label: 'a - 绿色 (Green)' },
  { value: 'b', label: 'b - 青色 (Aqua)' },
  { value: 'c', label: 'c - 红色 (Red)' },
  { value: 'd', label: 'd - 粉色 (Light Purple)' },
  { value: 'e', label: 'e - 黄色 (Yellow)' },
  { value: 'f', label: 'f - 白色 (White)' },
  { value: 'none', label: 'none - 不染色（禁用）' },
];

const LISTENER_PRIORITY_OPTIONS = [
  { value: 'none', label: 'none - 使用原版行为' },
  { value: 'lowest', label: 'lowest - 最低优先级（让世界插件处理）' },
  { value: 'low', label: 'low - 低优先级' },
  { value: 'normal', label: 'normal - 普通优先级' },
  { value: 'high', label: 'high - 高优先级（EssentialsX Spawn 处理，默认）' },
  { value: 'highest', label: 'highest - 最高优先级（强制 EssentialsX Spawn 处理）' },
];

const ITEM_POLICY_OPTIONS = [
  { value: 'keep', label: 'keep - 保留在背包 (Keep)' },
  { value: 'drop', label: 'drop - 掉落在死亡点 (Drop)' },
  { value: 'delete', label: 'delete - 直接删除 (Delete)' },
];

const TELEPORT_WHEN_FREED_OPTIONS = [
  { value: 'back', label: 'back - 传回入狱前的位置 (Back)' },
  { value: 'spawn', label: 'spawn - 传送到出生点 (Spawn)' },
  { value: 'off', label: 'off - 不传送 (Off)' },
];

/**
 * EssentialsX config.yml 中文对照字典
 */
export const essentialsConfigDocs: ConfigDocMap = {
  // 1. 全局设置 (EssentialsX Global)
  'ops-name-color': {
    title: 'OP 玩家名字颜色',
    description: 'OP 玩家在聊天和玩家列表中名字显示的颜色代码。\n- 1.16+ 版本还支持十六进制颜色码（如 #613e1d）。\n- 设为 none 则不特殊染色。',
    options: COLOR_CODE_OPTIONS,
  },
  'nickname-prefix': {
    title: '昵称前缀字符',
    description: '所有玩家昵称前自动添加的字符（默认 ~），用于区分昵称和真实用户名。\n拥有 essentials.nick.hideprefix 权限的玩家不会显示该前缀。',
  },
  'max-nick-length': {
    title: '昵称最大长度',
    description: '玩家昵称允许的最大字符数，不包含昵称前缀。\n可通过 ignore-colors-in-max-nick-length 设置颜色代码是否计入长度。',
  },
  'allowed-nicks-regex': {
    title: '昵称允许字符正则',
    description: '用于校验昵称合法性的正则表达式，不匹配的昵称会被拒绝。\n拥有 essentials.nick.allowunsafe 权限的玩家可绕过此检查。',
  },
  'nick-blacklist': {
    title: '昵称黑名单',
    description: '禁止使用的昵称列表，支持正则表达式（如 ^Dinnerbone）。\n拥有 essentials.nick.blacklist.bypass 权限的玩家可绕过此过滤。',
  },
  'ignore-colors-in-max-nick-length': {
    title: '昵称长度忽略颜色代码',
    description: '开启后，检查昵称长度时不计算颜色代码的字符。\n例如 "&6Notch" 共 7 个字符，开启后按 5 个字符计算。',
  },
  'reset-nick-on-name-change': {
    title: '改名后重置昵称',
    description: '开启后，当玩家的 Minecraft 账号名变更时，其昵称将被自动重置，防止旧昵称（包括 RGB 格式）残留。',
  },
  'hide-displayname-in-vanish': {
    title: '隐身时隐藏显示名',
    description: '开启后，隐身（vanish）玩家的显示名不会被展示，防止其他玩家察觉其在线。',
  },
  'change-displayname': {
    title: '修改玩家显示名',
    description: '是否允许 Essentials 修改玩家的显示名（display name）。\n如有其他插件负责修改显示名，请设为 false 以避免冲突。',
  },
  'change-tab-complete-name': {
    title: 'Tab 补全使用显示名',
    description: '开启后，Tab 补全 Essentials 命令参数时显示玩家的显示名而非用户名。\n如果显示名带前后缀，建议设为 false。',
  },
  'add-prefix-suffix': {
    title: '显示名附加前后缀',
    description: '未安装 EssentialsChat 时，强制 Essentials 将权限插件提供的前后缀加到显示名上。\n- 需要 change-displayname 为 true。\n- 安装了 EssentialsChat 时此项被忽略（默认按 true 处理）。\n- 不懂请勿修改！',
  },
  'change-playerlist': {
    title: 'Tab 列表使用显示名',
    description: '开启后，Tab 玩家列表中使用玩家的显示名。需要 change-displayname 为 true。',
  },
  'add-prefix-in-playerlist': {
    title: 'Tab 列表显示前缀',
    description: '开启后，Tab 玩家列表中显示玩家前缀（仅 1.8+）。需要 change-playerlist 为 true。',
  },
  'add-suffix-in-playerlist': {
    title: 'Tab 列表显示后缀',
    description: '开启后，Tab 玩家列表中显示玩家后缀（仅 1.8+）。需要 change-playerlist 为 true。',
  },

  // 2. 传送设置 (Teleportation)
  'teleport-safety': {
    title: '传送安全检测',
    description: '传送到不安全位置（如半空、岩浆上方）时的处理方式：\n- true：自动寻找最近的安全位置传送。\n- false：取消传送并警告玩家。',
  },
  'force-disable-teleport-safety': {
    title: '强制关闭传送安全检测',
    description: '设为 true 后，传送到危险位置不再有任何警告。\n注意：此项和 teleport-safety 同时为 true 时才会强制传送到危险位置，请谨慎开启！',
  },
  'force-safe-teleport-location': {
    title: '强制安全位置传送',
    description: '默认创造、冒险、上帝模式的玩家传送到危险位置时不会被转移到安全位置。\n设为 true 后，所有玩家传送时都会被强制转移到安全位置。',
  },
  'consider-world-height-for-teleport-safety': {
    title: '安全检测考虑世界高度',
    description: '开启后，传送安全检测会考虑世界的逻辑高度，防止玩家被安全检测转移到下界基岩层上方（除非目标位置本来就在基岩层上）。',
  },
  'is-water-safe': {
    title: '水方块视为安全',
    description: '开启后，水方块被视为安全位置，允许玩家使用 /home、/spawn 等命令传送到被水占据的位置。',
  },
  'teleport-passenger-dismount': {
    title: '传送前卸下乘客',
    description: '玩家身上有乘客（骑乘实体）时传送的处理方式：\n- true：传送前自动卸下乘客。\n- false：取消传送并警告。',
  },
  'teleport-cooldown': {
    title: '传送冷却时间 (秒)',
    description: '两次使用 /home、/tp 等传送命令之间的冷却时间（秒），设为 0 表示无冷却。',
  },
  'teleport-delay': {
    title: '传送延迟 (秒)',
    description: '执行传送命令后实际传送前的等待时间（秒）。\n等待期间玩家移动或受到攻击将取消传送，设为 0 表示立即传送。',
  },
  'teleport-invulnerability': {
    title: '传送后无敌时间 (秒)',
    description: '通过命令传送后，玩家无法被其他玩家攻击的时长（秒），同时该玩家也无法攻击别人。\n设为 0 关闭此保护。',
  },
  'teleport-to-center': {
    title: '传送到方块中心',
    description: '开启后，所有传送都会落在方块正中心（X 和 Z 坐标小数为 .5），避免卡墙。',
  },
  'heal-cooldown': {
    title: '治疗/喂食冷却 (秒)',
    description: '两次使用 /heal 或 /feed 命令之间的冷却时间（秒）。',
  },
  'remove-effects-on-heal': {
    title: '治疗时清除药水效果',
    description: '使用 /heal 治疗玩家时是否同时移除其身上的所有药水效果（包括正面效果）。',
  },
  'near-radius': {
    title: 'near 默认搜索半径 (方块)',
    description: '不带参数使用 /near 命令时搜索附近玩家的默认半径（方块）。',
  },
  'item-spawn-blacklist': {
    title: '物品生成黑名单',
    description: '禁止通过 /item 和 /give 获取的物品列表，逗号分隔。\n示例：lava_bucket,tnt,end_crystal',
  },
  'permission-based-item-spawn': {
    title: '基于权限的物品生成',
    description: '设为 true 后改用权限节点控制物品生成，item-spawn-blacklist 将被忽略。\n权限示例：essentials.itemspawn.item-all、essentials.give.item-<物品名>、essentials.unlimited.item-<物品名>。',
  },
  'spawnmob-limit': {
    title: 'spawnmob 生成数量上限',
    description: '单次使用 /spawnmob 命令允许生成的最大实体数量。',
  },
  'warn-on-smite': {
    title: '雷击提示',
    description: '使用 /lightning 雷劈玩家时，是否向被劈的玩家发送提示消息。',
  },
  'drop-items-if-full': {
    title: '背包满时物品掉在脚下',
    description: '给予物品时背包已满的处理方式：\n- true：将多余的物品掉落在玩家脚下。\n- false：不给予多余的物品。',
  },
  'notify-no-new-mail': {
    title: '无新邮件提示',
    description: '玩家没有新邮件时是否仍然发送提示消息。邮件多的服务器可关闭以减少打扰。',
  },
  'notify-player-of-mail-cooldown': {
    title: '邮件通知冷却 (秒)',
    description: '同一玩家两次收到新邮件通知之间的间隔（秒），适合邮件流量大的服务器。',
  },
  'overridden-commands': {
    title: '命令抢占覆盖列表',
    description: '默认情况下，当命令与其他插件冲突时，Essentials 会让其他插件优先。\n将命令加入此列表可让 Essentials 不让步（此状态下哪个插件生效几乎是随机的）。\n若要强制 Essentials 接管某命令（如 /god），请在服务端根目录 commands.yml 中设置别名：god: essentials:god $1-',
  },
  'disabled-commands': {
    title: '禁用命令列表',
    description: '在此列出的命令将不再由 Essentials 处理（不影响与其他插件的命令冲突）。\n其他插件的命令无需在此禁用，它们会自动获得优先权。',
  },
  'verbose-command-usages': {
    title: '详细命令用法提示',
    description: '是否显示详细的命令用法。设为 false 时，所有用法将合并为一条简略提示。',
  },
  'socialspy-commands': {
    title: '社交监听命令列表',
    description: '开启社交监听（SocialSpy）的玩家可以看到的命令列表。\n- 可添加其他插件的命令。\n- 添加 \'*\' 可监听所有命令。\n- 不需要监听某命令就从列表中移除。',
  },
  'socialspy-listen-muted-players': {
    title: '监听被禁言玩家',
    description: '被禁言（mute）玩家的私聊和公聊消息是否也显示在社交监听中。\n为 true 时，其消息会与正常玩家的消息区分开显示。',
  },
  'socialspy-messages': {
    title: '监听私聊消息',
    description: '社交监听是否额外监听所有私聊消息。\n为 false 时仅监听 socialspy-commands 列表中的命令。',
  },
  'socialspy-uses-displaynames': {
    title: '社交监听使用显示名',
    description: '社交监听消息中是否使用带颜色的格式化显示名。\n为 false 时只显示真实用户名。',
  },
  'world-change-fly-reset': {
    title: '切换世界重置飞行',
    description: '玩家切换世界时，是否重置其飞行状态。\n没有 essentials.fly 权限的玩家将被关闭飞行。\n如使用其他插件管理飞行和速度，请设为 false。',
  },
  'world-change-preserve-flying': {
    title: '切换世界保留飞行',
    description: '1.17+ 版本切换世界后原版不再保留飞行能力。\n设为 true 后，拥有 essentials.fly 权限的玩家切换世界时保留飞行状态。',
  },
  'gamemode-change-preserve-flying': {
    title: '切换游戏模式保留飞行',
    description: '开启后，玩家切换游戏模式时如果正在飞行，则保持飞行状态。\n需要玩家拥有 essentials.fly 权限。',
  },
  'world-change-speed-reset': {
    title: '切换世界重置速度',
    description: '玩家切换世界时，是否根据其权限重置移动速度。\n- 没有 essentials.speed 权限的玩家重置为默认速度。\n- 没有 essentials.speed.bypass 权限的玩家速度不会超过 max-walk-speed 和 max-fly-speed 的上限。',
  },
  'mute-commands': {
    title: '禁言时禁用的命令',
    description: '玩家被禁言（mute）期间禁止使用的命令列表（Essentials 的聊天命令默认已被禁用）。\n- 只匹配命令名，不区分参数（/f chat 与 /f 相同）。\n- 添加 \'*\' 可禁用所有命令。',
  },
  'player-commands': {
    title: '内置简易权限列表',
    description: '不使用权限插件时的简易权限方案：在此列出默认给予普通玩家的权限（不含 essentials. 前缀），未列出的仅 OP 可用。\n- 如果你正在使用 LuckPerms 等权限插件，此列表无效。\n- 要启用此功能，需将 use-bukkit-permissions 设为 false。',
  },
  'use-bukkit-permissions': {
    title: '使用 Bukkit 权限系统',
    description: '设为 true 则强制使用基于 superperms 的权限处理（支持通配符），适用于自定义权限插件。\n设为 false 则使用上方 player-commands 内置简易权限方案。',
  },
  'skip-used-one-time-kits-from-kit-list': {
    title: '隐藏已用的一次性礼包',
    description: '开启后，已使用过的一次性礼包（delay 小于 0）将不再显示在该玩家的 /kit list 中。',
  },
  'kit-auto-equip': {
    title: '礼包自动穿戴护甲',
    description: '开启后，领取礼包时其中的护甲会自动装备到玩家身上（前提是护甲槽为空）。',
  },
  'pastebin-createkit': {
    title: 'createkit 生成网页链接',
    description: '决定 /createkit 命令的行为：\n- true：生成一个包含礼包代码的 Pastebin 链接。\n- false：直接将礼包写入 kits.yml 文件。',
  },
  'use-nbt-serialization-in-createkit': {
    title: 'createkit 使用 NBT 序列化',
    description: '开启后，/createkit 以 NBT 格式保存物品，可保存潜影盒、自定义属性等复杂数据。\n注意：仅支持 1.15.2+ 的 Paper 服务端，且会绕过 Magic 等插件的自定义序列化。\n注意：开启后创建的礼包物品将无法随服务器降级。\n此项只影响 /createkit，手工在 kits.yml 编写礼包不受影响。',
  },
  'enabledSigns': {
    title: '启用功能木牌',
    description: 'Essentials 功能木牌开关，取消对应项的 # 注释即可启用：\n- 交易类：balance、buy、sell、trade、free\n- 功能类：kit、warp、enchant、repair、heal、gamemode、disposal、mail、randomteleport、spawnmob、time、weather\n- 工作台类：anvil、cartography、grindstone、loom、smithing、workbench\n- color 不是木牌类型，启用后允许有权限的玩家在木牌上使用颜色代码。\n用法教程：https://wiki.ess3.net/wiki/Sign_Tutorial',
  },
  'sign-use-per-second': {
    title: '木牌每秒使用次数限制',
    description: '每个玩家每秒可与 Essentials 木牌交互的次数，取值 1-20。\n数值越小防刷能力越强，但可能影响正常玩家体验；20 基本等于无限制。',
  },
  'allow-old-id-signs': {
    title: '兼容旧版数字 ID 木牌',
    description: '1.13 之前放置的使用数字物品 ID 的旧木牌，是否允许继续交互。\n新建木牌无法使用数字 ID，此项仅为兼容旧木牌。',
  },
  'unprotected-sign-names': {
    title: '不保护的木牌名称',
    description: '在此列出的木牌名称 Essentials 将不加以保护。\n当其他插件提供同名木牌且你想使用对方的版本时（如 [kit]），在此添加该名称（如 kit）即可。',
  },
  'backup': {
    title: '定时备份设置',
    description: '按指定间隔执行自定义备份命令/脚本。\n备份前会自动保存世界，备份期间暂停世界保存以防止存档损坏。\n也可使用 /backup 命令手动触发。',
  },
  'backup.interval': {
    title: '备份间隔 (分钟)',
    description: '自动备份任务的执行间隔，单位：分钟。',
  },
  'backup.always-run': {
    title: '无人在线也备份',
    description: '设为 true 后，即使服务器没有玩家在线也会执行备份任务。',
  },
  'backup.command': {
    title: '备份命令',
    description: '执行备份所用的命令或脚本（必须配置，否则备份功能无效）。\n示例（使用 rdiff-backup）：rdiff-backup World1 backups/World1',
  },
  'per-warp-permission': {
    title: '传送点独立权限',
    description: '设为 true 后，每个传送点（warp）需要单独权限才能使用：essentials.warp.<传送点名>。',
  },
  'list': {
    title: 'list 命令分组显示',
    description: '控制 /list 命令按权限组分组显示玩家：\n- 合并组：如 Admins: owner admin，将多个组合并为一个名称显示。\n- 截断显示：如 builder: 20，该组最多显示 20 人。\n- 隐藏组：如 default: hidden。\n- 不分组显示所有人：Players: \'*\'\n详细说明见 wiki：https://wiki.ess3.net/wiki/List',
  },
  'real-names-on-list': {
    title: 'list 显示真实用户名',
    description: '开启后，/list 中会在使用昵称的玩家旁边显示其真实用户名。',
  },
  'debug': {
    title: '调试模式',
    description: '开启后，Essentials 会在控制台输出更多调试信息，排查问题时使用。',
  },
  'locale': {
    title: '插件语言',
    description: '设置 Essentials 所有消息的语言，如 en、zh_CN、zh。\n设置后使用对应的 messages_<语言>.properties 文件。\n不设置则跟随服务端默认语言。详见：https://essentialsx.net/wiki/Locale.html',
  },
  'per-player-locale': {
    title: '按玩家语言显示消息',
    description: '开启后，向玩家发送消息时使用玩家客户端的语言，而控制台消息仍使用服务器语言。\n玩家语言未知时回退到服务器语言（或 locale 设置的语言）。',
  },
  'message-colors': {
    title: '消息配色',
    description: 'Essentials 消息使用的主色和次色。\n部分消息使用自定义颜色，需在对应语言消息文件中修改。',
  },
  'message-colors.primary': {
    title: '消息主颜色',
    description: 'Essentials 消息中使用的主色调（默认 #ffaa00 金色），支持十六进制颜色码。',
  },
  'message-colors.secondary': {
    title: '消息次颜色',
    description: 'Essentials 消息中使用的次要颜色（默认 #ff5555 红色），支持十六进制颜色码。',
  },
  'remove-god-on-disconnect': {
    title: '退出时移除上帝模式',
    description: '玩家退出服务器时是否自动关闭其上帝模式（god mode）。',
  },

  // 3. AFK 挂机设置
  'auto-afk': {
    title: '自动挂机时间 (秒)',
    description: '玩家无操作超过此秒数后自动标记为挂机（AFK）。\n- 需要玩家拥有 essentials.afk.auto 权限。\n- 设为 -1 关闭自动挂机。',
  },
  'auto-afk-timeout': {
    title: '挂机踢出时间 (秒)',
    description: '玩家挂机超过此秒数后将被踢出服务器，或执行 afk-timeout-commands 中的命令。\n- 拥有 essentials.afk.kickexempt 权限的玩家不受影响。\n- 设为 -1 表示永不踢出。',
  },
  'afk-timeout-commands': {
    title: '挂机超时执行命令',
    description: '达到 auto-afk-timeout 后执行的命令列表（替代踢出）。若列表为空且超时不是 -1，默认踢出玩家。\n注意：必须包含一条能将玩家移出服务器或解除挂机状态的命令，否则这些命令会每秒重复执行！\n可用占位符：{USERNAME} 玩家名，{KICKTIME} 挂机分钟数。',
  },
  'freeze-afk-players': {
    title: '冻结挂机玩家',
    description: '开启后，挂机玩家被冻结在原地，其他玩家或怪物无法推动他们，同时给予临时上帝模式。\n玩家需使用 /afk 命令解除挂机。',
  },
  'disable-item-pickup-while-afk': {
    title: '挂机时禁止拾取物品',
    description: '开启后，挂机玩家无法拾取物品，可防止玩家在刷怪塔中挂机刷资源。',
  },
  'cancel-afk-on-interact': {
    title: '交互时解除挂机',
    description: '玩家进行交互（右键等）时是否将其标记为活跃并解除挂机状态。',
  },
  'cancel-afk-on-move': {
    title: '移动时解除挂机',
    description: '玩家移动时是否自动解除挂机状态。\n聊天或使用命令无论如何都会解除挂机。\n关闭此项可略微减少服务器性能开销。',
  },
  'cancel-afk-on-chat': {
    title: '聊天时解除挂机',
    description: '玩家发送聊天消息时是否自动解除挂机状态。',
  },
  'cancel-afk-on-fish': {
    title: '钓鱼时解除挂机',
    description: '玩家使用钓鱼竿时是否自动解除挂机状态。',
  },
  'sleep-ignores-afk-players': {
    title: '睡觉跳过挂机玩家',
    description: '开启后，统计睡觉人数时忽略挂机玩家，挂机玩家不会阻碍跳过夜晚。\n拥有 essentials.sleepingignored 权限的玩家始终被忽略。',
  },
  'sleep-ignores-vanished-player': {
    title: '睡觉跳过隐身玩家',
    description: '开启后，统计睡觉人数时忽略隐身（vanish）玩家。\n拥有 essentials.sleepingignored 权限的玩家始终被忽略。',
  },
  'afk-list-name': {
    title: '挂机玩家列表名称',
    description: '玩家挂机时在 /list 中显示的名称，默认 none 表示不做修改。\n可用颜色代码，{USERNAME} 表示用户名，{PLAYER} 表示显示名。\n示例：\'&7[挂机] {USERNAME}\'',
  },
  'broadcast-afk-message': {
    title: '全服广播挂机消息',
    description: '玩家进入或退出挂机状态时，是否向全服广播。\n设为 false 时只有玩家本人收到提示。',
  },

  // 4. 死亡与进出服消息
  'death-messages': {
    title: '死亡消息',
    description: '设为 false 可关闭 Minecraft 的死亡消息。',
  },
  'vanishing-items-policy': {
    title: '消失诅咒物品处理',
    description: '拥有 essentials.keepinv 权限的玩家死亡时，带有消失诅咒的物品如何处理。',
    options: ITEM_POLICY_OPTIONS,
  },
  'binding-items-policy': {
    title: '绑定诅咒物品处理',
    description: '拥有 essentials.keepinv 权限的玩家死亡时，带有绑定诅咒的物品如何处理。',
    options: ITEM_POLICY_OPTIONS,
  },
  'send-info-after-death': {
    title: '死亡后发送坐标',
    description: '玩家死亡后是否向其发送死亡地点的坐标。',
  },
  'allow-silent-join-quit': {
    title: '允许静默进出服',
    description: '开启后，拥有权限的玩家可以静默进出服务器（不显示进出消息）：\n- essentials.silentjoin：静默进服\n- essentials.silentquit：静默退服\n- essentials.silentjoin.vanish：进服时自动隐身',
  },
  'custom-join-message': {
    title: '自定义进服消息',
    description: '设为 none 使用原版进服消息，设为空字符串则完全隐藏进服消息。\n可用占位符：{PLAYER} 显示名、{USERNAME} 用户名、{PREFIX} 前缀、{SUFFIX} 后缀、{ONLINE} 在线人数、{UNIQUE} 累计进服人数、{UPTIME} 服务器运行时长。',
  },
  'custom-quit-message': {
    title: '自定义退服消息',
    description: '设为 none 使用原版退服消息，设为空字符串则完全隐藏退服消息。\n可用占位符同 custom-join-message。',
  },
  'custom-new-username-message': {
    title: '改名玩家进服消息',
    description: '玩家改名后首次进服时显示的消息（替代 custom-join-message）。\n设为 none 则统一使用 custom-join-message。\n额外可用占位符：{OLDUSERNAME} 旧用户名。',
  },
  'use-custom-server-full-message': {
    title: '自定义服务器已满提示',
    description: '是否用 Essentials 语言文件中的消息替换原版"服务器已满"提示。设为 false 保留原版消息。',
  },
  'use-custom-whitelist-message': {
    title: '自定义白名单提示',
    description: '是否用 Essentials 语言文件中的消息替换原版"您不在白名单中"提示。设为 false 保留原版消息。',
  },
  'hide-join-quit-messages-above': {
    title: '人数达到上限时隐藏进出消息',
    description: '在线人数达到此数值后不再显示进出服消息。\n低于此数值时始终显示；设为 -1 则无论多少人都显示。',
  },

  // 5. 杂项 (Miscellaneous)
  'no-god-in-worlds': {
    title: '禁用上帝模式的世界',
    description: '在此列出的世界中，玩家的上帝模式将被自动关闭。\n示例：- world_nether',
  },
  'world-teleport-permissions': {
    title: '跨世界传送权限',
    description: '设为 true 后，使用 /world、/back、/tpa 等命令跨世界传送需要权限 essentials.worlds.<世界名>。\n- 不影响 warp 和 /home（后者见 world-home-permissions）。',
  },
  'default-stack-size': {
    title: '默认给予物品数量',
    description: '使用 /item 或 /give 不填数量时给予的物品数。\n小于 1 时按物品最大堆叠数给予；超过最大堆叠数且未改 oversized-stacksize 时会拆成多组。',
  },
  'oversized-stacksize': {
    title: '超堆叠物品数量',
    description: '超堆叠（忽略正常堆叠上限）的物品组大小。\n拥有 essentials.oversizedstacks 权限的玩家可通过 /give、/item 获得超堆叠物品。',
  },
  'repair-enchanted': {
    title: '允许修复附魔装备',
    description: '是否允许使用 /repair 修复附魔武器和护甲。\n设为 false 时，拥有 essentials.repair.enchanted 权限的玩家仍可修复。',
  },
  'unsafe-enchantments': {
    title: '允许不安全附魔',
    description: '是否允许在礼包和物品生成中使用超出原版限制的附魔（如等级过高的附魔）。\n注意：混合和超等级附魔可能导致客户端、服务端和插件异常，请谨慎开启！',
  },
  'tree-command-range-limit': {
    title: '种树命令距离上限 (方块)',
    description: '/tree 和 /bigtree 命令允许在距离玩家多远的位置生成树木（方块）。',
  },
  'register-back-in-listener': {
    title: '监听传送记录 back 位置',
    description: '开启后，Essentials 会监听所有传送事件并记录 /back 返回点（包括其他插件触发的传送）。',
  },
  'login-attack-delay': {
    title: '进服攻击延迟 (秒)',
    description: '玩家进服后多少秒内无法造成攻击伤害，防止利用进服时的短暂无敌进行攻击。',
  },
  'max-walk-speed': {
    title: '最大行走速度',
    description: '玩家行走速度上限，取值 0.1 ~ 1.0。\n此值为游戏内速度档位（0~10）的比例：如设为 0.8，玩家用 /speed 10 时实际速度为 0.8。',
  },
  'max-fly-speed': {
    title: '最大飞行速度',
    description: '玩家飞行速度上限，取值 0.1 ~ 1.0，计算方式同 max-walk-speed。',
  },
  'mails-per-minute': {
    title: '每分钟邮件发送上限',
    description: '全服每分钟最多允许发送的邮件数量，防止邮件刷屏。',
  },
  'max-mute-time': {
    title: '最大禁言时长 (秒)',
    description: '/mute 命令允许设置的最大禁言时长（秒）。\n设为 -1 不限制；拥有 essentials.mute.unlimited 权限的玩家可绕过此限制。',
  },
  'max-tempban-time': {
    title: '最大临时封禁时长 (秒)',
    description: '/tempban 命令允许设置的最大封禁时长（秒）。\n设为 -1 不限制；拥有 essentials.tempban.unlimited 权限的玩家可绕过此限制。',
  },
  'last-message-reply-recipient': {
    title: 'reply 回复最近发送对象',
    description: '/reply 的默认行为：\n- true：回复给你最近发消息的人。\n- false：回复给最近给你发消息的人。\n玩家可用 /rtoggle 单独切换自己的模式。',
  },
  'last-message-reply-recipient-timeout': {
    title: 'reply 对象超时时间 (秒)',
    description: 'last-message-reply-recipient 为 true 时，收到新消息后经过多少秒才更新回复对象。\n默认 180 秒（3 分钟）。',
  },
  'last-message-reply-vanished': {
    title: '允许回复隐身玩家',
    description: '设为 true 后，/reply 不检查对方是否隐身。\n设为 false 时，玩家无法回复他们看不见的隐身玩家。',
  },
  'milk-bucket-easter-egg': {
    title: '牛奶桶彩蛋',
    description: '是否启用彩蛋：用牛奶桶左键点击生物可将其变成幼年形态。',
  },
  'send-fly-enable-on-join': {
    title: '进服提示飞行状态',
    description: '玩家进服时，如果其飞行已开启，是否发送飞行状态提示消息。',
  },
  'world-time-permissions': {
    title: '分世界时间权限',
    description: '设为 true 后，使用 /time、/day、/night 修改指定世界时间需要权限 essentials.time.world.<世界名>。',
  },
  'command-cooldowns': {
    title: '命令冷却设置',
    description: '为 Essentials 或其他插件的命令设置冷却时间（秒），命令名不带 /。\n- 支持通配符：\'*i*\': 50 表示所有含字母 i 的命令冷却 50 秒。\n- 支持正则：以 ^ 开头，如 \'^ban([^ip])( .*)?\': 60。\n- 命令本身以 ^ 开头时用反斜杠转义：\\^command: 123',
  },
  'command-cooldown-persistence': {
    title: '冷却时间跨重启保留',
    description: '服务器重启后是否保留玩家的命令冷却时间。',
  },
  'npcs-in-balance-ranking': {
    title: 'NPC 计入财富排行',
    description: '/balancetop 等财富排行是否包含 NPC 的余额（如 FactionsUUID 插件的派系账户）。',
  },
  'allow-bulk-buy-sell': {
    title: '潜行批量买卖',
    description: '开启后，玩家潜行（Shift）点击买卖木牌时可批量买入/卖出，适合一次出售大量物品。',
  },
  'allow-selling-named-items': {
    title: '允许出售命名物品',
    description: '是否允许通过 /sell 出售带有自定义名称的物品。\n保持 false 可防止玩家误卖自己命名过的物品。',
  },
  'delay-motd': {
    title: '进服 MOTD 延迟 (毫秒)',
    description: '玩家进服后延迟多少毫秒再显示 MOTD。\n- MOTD 命令或权限被禁用时此项无效。\n- 设为 -1 完全不显示进服 MOTD。',
  },
  'default-enabled-confirm-commands': {
    title: '默认需要二次确认的命令',
    description: '在此列出的命令默认需要玩家二次确认才会执行（如 pay、clearinventory）。',
  },
  'teleport-when-freed': {
    title: '出狱传送位置',
    description: '玩家刑满释放后传送到哪里。',
    options: TELEPORT_WHEN_FREED_OPTIONS,
  },
  'jail-online-time': {
    title: '监禁时间仅在线计算',
    description: '设为 true 后，被监禁玩家的刑期只在其在线时扣减。',
  },
  'tpa-accept-cancellation': {
    title: 'tpa 请求超时 (秒)',
    description: '传送请求在多少秒后自动取消，设为 0 表示永不超时。',
  },
  'tpa-max-requests': {
    title: 'tpa 最大待处理请求数',
    description: '每个玩家同时最多能有多少个待处理的传送请求，超过后最旧的请求会立即失效。',
  },
  'allow-direct-hat': {
    title: '点击头盔槽直接戴帽',
    description: '是否允许玩家手持物品点击头盔槽直接将其作为帽子戴上。',
  },
  'allow-world-in-broadcastworld': {
    title: 'broadcastworld 允许指定世界',
    description: '开启后，游戏内执行 /broadcastworld 时可指定目标世界。\n设为 false 则始终广播到玩家当前所在世界（不影响控制台使用）。',
  },
  'safe-usermap-names': {
    title: '用户名安全过滤',
    description: '保存用户映射前是否对用户名进行安全过滤。\n仅在使用 Minecraft 中国版时才需要设为 false。',
  },
  'log-command-block-commands': {
    title: '记录命令方块日志',
    description: '命令方块执行命令时是否在控制台输出日志，如：CommandBlock at <x>,<y>,<z> issued server command: /<命令>。',
  },
  'log-console-commands': {
    title: '记录控制台命令日志',
    description: '控制台执行命令时是否在日志中输出，如：CONSOLE issued server command: /<命令>。',
  },
  'max-projectile-speed': {
    title: 'fireball 弹射物最大速度',
    description: '/fireball 命令生成的弹射物允许的最大速度。',
  },
  'max-itemlore-lines': {
    title: 'itemlore 最大行数',
    description: '/itemlore 命令最多能设置的 Lore 行数。\n拥有 essentials.itemlore.bypass 权限的玩家可绕过此限制。',
  },
  'update-check': {
    title: '更新检查',
    description: '是否在有新版本时显示更新通知。\n使用 GitHub 公开 API，不会发送或存储任何身份信息。',
  },

  // 6. 家园设置 (Homes)
  'update-bed-at-daytime': {
    title: '白天设置床重生点',
    description: '是否允许玩家在白天右键床设置重生点。\n在 Minecraft 1.15+ 中此项无效，因为原版总是允许白天设置重生点。',
  },
  'world-home-permissions': {
    title: '跨世界回家权限',
    description: '设为 true 后，使用 /home 跨世界传送需要权限 essentials.worlds.<世界名>。\n仅对 /home 命令生效。',
  },
  'sethome-multiple': {
    title: '多家园数量设置',
    description: '允许玩家设置多个家。玩家必须先拥有 essentials.sethome.multiple 权限才能拥有多个家。\n- 下方可定义"家园等级"及对应数量，再给予权限 essentials.sethome.multiple.<等级名>。\n- 等级名无需与权限插件的组名一致。\n- 给予 essentials.sethome.multiple.unlimited 可完全取消数量限制。\n示例：拥有 essentials.sethome.multiple 和 essentials.sethome.multiple.vip 的玩家可设 5 个家。',
  },
  'compass-towards-home-perm': {
    title: '指南针指向家需要权限',
    description: '开启后，玩家需要 essentials.home.compass 权限才能让指南针指向第一个家。\n保持 false 则维持原有行为：指南针始终指向玩家的第一个家。',
  },
  'spawn-if-no-home': {
    title: '无家时传送到出生点',
    description: '玩家未设置家时执行 /home 是否传送到出生点。\n设为 false 时，未设置家的玩家执行 /home 不会被传送。',
  },
  'confirm-home-overwrite': {
    title: '覆盖家园需要确认',
    description: '玩家设置的家与已有家重名时，是否需要二次确认才会覆盖。',
  },

  // 7. 经济 (Economy)
  'starting-balance': {
    title: '新玩家初始金钱',
    description: '新玩家进服时拥有的初始余额。',
  },
  'command-costs': {
    title: '命令收费设置',
    description: '设置每次使用指定命令收取的费用。\n- 例如 example: 1000 表示 /example 每次收费 1000。\n- kit-tools: 1500 表示 /kit tools 每次收费 1500。\n- 部分命令（如 /repair）有子项收费，详见 wiki。',
  },
  'currency-symbol': {
    title: '货币符号',
    description: '显示的货币符号（如 $、￥、€）。\n使用特殊字符时必须以 UTF-8 编码保存本文件，不能用 ANSI。',
  },
  'currency-symbol-suffix': {
    title: '货币符号放在金额后',
    description: '开启后，货币符号显示在金额之后（如 100€），而非金额之前。',
  },
  'max-money': {
    title: '金钱上限',
    description: '玩家可拥有的最大金钱数量。\n注意：过大的数值可能带来意想不到的问题。',
  },
  'min-money': {
    title: '金钱下限',
    description: '玩家余额的最低值（必须大于 max-money 的相反数）。\n- 设为 0 则完全禁止透支/贷款。\n- 余额为负需要玩家拥有 essentials.eco.loan 权限。',
  },
  'economy-log-enabled': {
    title: '启用经济日志',
    description: '开启后，记录所有买卖/交易木牌及 /sell 命令的交易记录到 trade.log。',
  },
  'economy-log-uuids': {
    title: '经济日志使用 UUID',
    description: '开启后，trade.log 中使用 UUID 代替用户名记录交易。',
  },
  'economy-log-update-enabled': {
    title: '记录 Vault 经济变动',
    description: '开启后，同时记录其他插件通过 Vault 进行的所有经济变动。\n会使经济日志快速增长，建议仅在测试时开启！',
  },
  'minimum-pay-amount': {
    title: 'pay 最低转账金额',
    description: '/pay 命令允许转账的最小金额。',
  },
  'pay-excludes-ignore-list': {
    title: '禁止转账给屏蔽者',
    description: '开启后，玩家无法向屏蔽（ignore）了自己的玩家转账。',
  },
  'show-zero-baltop': {
    title: '财富榜显示零余额',
    description: '余额为 0 或负数的玩家是否显示在财富榜中。\n注意：重载配置后需执行 /baltop force 才能生效。',
  },
  'baltop-requirements': {
    title: '财富榜上榜条件',
    description: '玩家显示在财富榜中需要满足的条件（游戏时长以秒计）。',
  },
  'baltop-requirements.minimum-balance': {
    title: '财富榜最低余额',
    description: '余额达到此数值才会显示在财富榜中。',
  },
  'baltop-requirements.minimum-playtime': {
    title: '财富榜最低游戏时长 (秒)',
    description: '游戏时长（秒）达到此数值才会显示在财富榜中。',
  },
  'baltop-entry-limit': {
    title: '财富榜缓存条数上限',
    description: '限制财富榜缓存的条目数量，玩家多的大服建议设置以减少内存占用。\n设为 -1 不限制。',
  },
  'currency-format': {
    title: '货币数字格式',
    description: '货币数字的显示格式（不含符号，符号格式见 currency-symbol-format-locale）。\n大多数国家使用 "#,##0.00"（如 1,234.50）。',
  },
  'currency-symbol-format-locale': {
    title: '货币符号格式区域',
    description: '货币符号的格式化区域设置，不同区域对千分位和小数点处理不同：\n- de-DE：1.234,50\n- en-US：1,234.50\n- fr-CH：1\'234,50\n某些格式可能因 Minecraft 字体渲染问题无法正常显示。',
  },
  'sell-multipliers': {
    title: '出售价格倍率',
    description: '玩家通过 /sell 或出售木牌卖物品时的价格倍率。\n- default 为默认倍率，可自定义更多"倍率等级"。\n- 给予权限 essentials.sell.multiplier.<等级名> 让玩家享受对应倍率。\n- 等级名无需与权限插件的组名一致。',
  },

  // 8. 帮助 (Help)
  'non-ess-in-help': {
    title: '帮助中显示其他插件命令',
    description: 'Essentials 的 /help 帮助列表中是否显示其他插件的命令。',
  },
  'hide-permissionless-help': {
    title: '隐藏无权限的帮助条目',
    description: '开启后，玩家无权限使用的插件命令不会在帮助中显示。\n- 可通过权限 essentials.help.<插件名> 单独开放查看。\n- 拥有 essentials.* 或 * 的玩家可看到全部帮助。\n- 也可用负权限隐藏特定插件的帮助。',
  },

  // 9. EssentialsX Chat（需安装 EssentialsX Chat 模块）
  'chat': {
    title: '聊天设置',
    description: 'EssentialsX Chat 聊天模块的设置。\n注意：需要安装 EssentialsX Chat 模块后此分区才生效。',
  },
  'chat.radius': {
    title: '聊天范围 (方块)',
    description: '玩家聊天消息的传播范围（方块），设为 0 为全服聊天。\n- 拥有 essentials.chat.spy 权限的玩家可以看到所有消息。\n- 拥有 essentials.chat.shout 权限的玩家可用感叹号 (!) 开头喊话全服。\n- 拥有 essentials.chat.question 权限的玩家可用问号 (?) 开头全局提问。\n- 可在 command-costs 中添加 chat-shout、chat-question 对喊话/提问收费。',
  },
  'chat.format': {
    title: '聊天格式',
    description: '聊天消息的显示格式，支持颜色代码。\n常用占位符：{MESSAGE} 消息内容、{USERNAME} 用户名、{DISPLAYNAME} 显示名（已含前后缀）、{NICKNAME} 昵称、{PREFIX} 前缀、{SUFFIX} 后缀、{GROUP} 权限组、{WORLD} 世界别名、{WORLDNAME} 世界名。\n注意：{DISPLAYNAME} 默认已包含前后缀，与 {PREFIX}/{SUFFIX} 同时使用会重复。\n也可按聊天类型分别设置 normal/question/shout 子格式。',
  },
  'chat.group-formats': {
    title: '分组聊天格式',
    description: '为不同权限组指定不同的聊天格式。\n- 组名区分大小写，必须与权限插件中的组名一致。\n- 若 LuckPerms 组设置了显示名（alias），需使用显示名。\n- 也可以为每个组分别设置 question/shout 子格式。',
  },
  'chat.world-aliases': {
    title: '世界名称别名',
    description: '在聊天格式的 {WORLD} 占位符中用别名替换世界名。\n示例：creative: "&eC&r"',
  },
  'chat.shout-default': {
    title: '默认喊话模式',
    description: '开启后，玩家的聊天默认处于喊话（shout）模式。',
  },
  'chat.persist-shout': {
    title: '喊话模式跨重启保留',
    description: '玩家的喊话模式是否在服务器重启后保留。',
  },
  'chat.question-enabled': {
    title: '启用提问消息',
    description: '是否允许玩家以问号 (?) 开头发送全局提问消息。',
  },
  'chat.paper-chat-events': {
    title: '使用 Paper 聊天事件',
    description: '1.16.5+ 中是否使用 Paper 的现代聊天事件系统（悬停、点击事件等聊天功能需要）。\n如果与其他使用聊天事件的插件冲突，可设为 false。\n修改此项后必须重启服务器。',
  },

  // 10. EssentialsX Protect（需安装 Protect 模块）
  'protect': {
    title: '世界保护设置',
    description: 'EssentialsX Protect 世界保护模块的设置。\n注意：需要安装 EssentialsX Protect 模块后此分区才生效。',
  },
  'protect.prevent': {
    title: '行为阻止设置',
    description: '各类物理/行为修改项，设为 true 表示阻止该行为发生。',
  },
  'protect.prevent.lava-flow': {
    title: '阻止岩浆流动',
    description: '设为 true 后，岩浆将不再流动。',
  },
  'protect.prevent.water-flow': {
    title: '阻止水流动',
    description: '设为 true 后，水将不再流动。',
  },
  'protect.prevent.water-bucket-flow': {
    title: '阻止水桶倒水流动',
    description: '设为 true 后，玩家用水桶倒出的水将不再流动。',
  },
  'protect.prevent.fire-spread': {
    title: '阻止火焰蔓延',
    description: '设为 true 后，火焰不会向周围方块蔓延（默认已开启）。',
  },
  'protect.prevent.lava-fire-spread': {
    title: '阻止岩浆引燃',
    description: '设为 true 后，岩浆不会点燃周围的方块（默认已开启）。',
  },
  'protect.prevent.lava-itemdamage': {
    title: '阻止岩浆烧毁物品',
    description: '设为 true 后，掉落物掉进岩浆不会被烧毁。',
  },
  'protect.prevent.flint-fire': {
    title: '阻止打火石点火',
    description: '设为 true 后，玩家无法使用打火石点火。',
  },
  'protect.prevent.lightning-fire-spread': {
    title: '阻止雷击引燃',
    description: '设为 true 后，雷击不会引燃方块（默认已开启）。',
  },
  'protect.prevent.portal-creation': {
    title: '阻止传送门生成',
    description: '设为 true 后，无法创建下界传送门。',
  },
  'protect.prevent.tnt-explosion': {
    title: '阻止 TNT 爆炸',
    description: '设为 true 后，TNT 不再爆炸破坏方块。',
  },
  'protect.prevent.tnt-playerdamage': {
    title: '阻止 TNT 伤害玩家',
    description: '设为 true 后，TNT 爆炸不再对玩家造成伤害。',
  },
  'protect.prevent.tnt-itemdamage': {
    title: '阻止 TNT 毁坏掉落物',
    description: '设为 true 后，TNT 爆炸不再摧毁掉落物。',
  },
  'protect.prevent.tnt-minecart-explosion': {
    title: '阻止 TNT 矿车爆炸',
    description: '设为 true 后，TNT 矿车不再爆炸破坏方块。',
  },
  'protect.prevent.tnt-minecart-playerdamage': {
    title: '阻止 TNT 矿车伤害玩家',
    description: '设为 true 后，TNT 矿车爆炸不再对玩家造成伤害。',
  },
  'protect.prevent.tnt-minecart-itemdamage': {
    title: '阻止 TNT 矿车毁坏掉落物',
    description: '设为 true 后，TNT 矿车爆炸不再摧毁掉落物。',
  },
  'protect.prevent.fireball-explosion': {
    title: '阻止火球爆炸',
    description: '设为 true 后，火球（恶魂/烈焰人）不再爆炸破坏方块。',
  },
  'protect.prevent.fireball-fire': {
    title: '阻止火球引燃',
    description: '设为 true 后，火球不再点燃方块。',
  },
  'protect.prevent.fireball-playerdamage': {
    title: '阻止火球伤害玩家',
    description: '设为 true 后，火球不再对玩家造成伤害。',
  },
  'protect.prevent.fireball-itemdamage': {
    title: '阻止火球毁坏掉落物',
    description: '设为 true 后，火球不再摧毁掉落物。',
  },
  'protect.prevent.windcharge-explosion': {
    title: '阻止风弹爆炸',
    description: '设为 true 后，风弹（wind charge）不再造成爆炸效果。',
  },
  'protect.prevent.witherskull-explosion': {
    title: '阻止凋灵头颅爆炸',
    description: '设为 true 后，凋灵头颅不再爆炸破坏方块。',
  },
  'protect.prevent.witherskull-playerdamage': {
    title: '阻止凋灵头颅伤害玩家',
    description: '设为 true 后，凋灵头颅不再对玩家造成伤害。',
  },
  'protect.prevent.witherskull-itemdamage': {
    title: '阻止凋灵头颅毁坏掉落物',
    description: '设为 true 后，凋灵头颅不再摧毁掉落物。',
  },
  'protect.prevent.wither-spawnexplosion': {
    title: '阻止凋灵生成爆炸',
    description: '设为 true 后，凋灵生成时不再产生爆炸。',
  },
  'protect.prevent.wither-blockreplace': {
    title: '阻止凋灵破坏方块',
    description: '设为 true 后，凋灵不再破坏周围的方块。',
  },
  'protect.prevent.creeper-explosion': {
    title: '阻止苦力怕爆炸',
    description: '设为 true 后，苦力怕不再爆炸。\n也可用 protect.creeper.max-height 只限制其爆炸的高度。',
  },
  'protect.prevent.creeper-playerdamage': {
    title: '阻止苦力怕伤害玩家',
    description: '设为 true 后，苦力怕爆炸不再对玩家造成伤害。',
  },
  'protect.prevent.creeper-itemdamage': {
    title: '阻止苦力怕毁坏掉落物',
    description: '设为 true 后，苦力怕爆炸不再摧毁掉落物。',
  },
  'protect.prevent.creeper-blockdamage': {
    title: '阻止苦力怕破坏方块',
    description: '设为 true 后，苦力怕爆炸不再破坏方块。',
  },
  'protect.prevent.ender-crystal-explosion': {
    title: '阻止末影水晶爆炸',
    description: '设为 true 后，末影水晶不再爆炸破坏方块。',
  },
  'protect.prevent.enderdragon-blockdamage': {
    title: '阻止末影龙破坏方块',
    description: '设为 true 后，末影龙不再破坏方块（默认已开启）。',
  },
  'protect.prevent.enderman-pickup': {
    title: '阻止末影人搬方块',
    description: '设为 true 后，末影人不再搬起方块。',
  },
  'protect.prevent.villager-death': {
    title: '阻止村民死亡',
    description: '设为 true 后，村民不会因怪物攻击而死亡。',
  },
  'protect.prevent.bed-explosion': {
    title: '阻止床爆炸',
    description: '设为 true 后，在下界和末地使用床不再引发爆炸。',
  },
  'protect.prevent.respawn-anchor-explosion': {
    title: '阻止重生锚爆炸',
    description: '设为 true 后，在非下界维度使用重生锚不再引发爆炸。',
  },
  'protect.prevent.entitytarget': {
    title: '阻止怪物追踪玩家',
    description: '设为 true 后，怪物不会主动追踪玩家。\n拥有 essentials.protect.entitytarget.bypass 权限的玩家不受影响。',
  },
  'protect.prevent.zombie-door-break': {
    title: '阻止僵尸破门',
    description: '设为 true 后，僵尸不再破坏木门。',
  },
  'protect.prevent.ravager-thief': {
    title: '阻止劫掠兽破坏方块',
    description: '设为 true 后，劫掠兽不再破坏树叶、作物等方块。',
  },
  'protect.prevent.sheep-eat-grass': {
    title: '阻止羊吃草',
    description: '设为 true 后，羊不再吃草使草方块变成泥土。',
  },
  'protect.prevent.transformation': {
    title: '生物变异阻止设置',
    description: '阻止生物因雷击、感染等原因发生形态转变，设为 true 表示阻止该转变。',
  },
  'protect.prevent.transformation.charged-creeper': {
    title: '阻止苦力怕充能',
    description: '设为 true 后，苦力怕被雷击后不会变成闪电苦力怕。',
  },
  'protect.prevent.transformation.zombie-villager': {
    title: '阻止村民变僵尸村民',
    description: '设为 true 后，村民被僵尸杀死后不会变成僵尸村民。',
  },
  'protect.prevent.transformation.villager': {
    title: '阻止僵尸村民被治愈',
    description: '设为 true 后，僵尸村民无法被治愈回村民。',
  },
  'protect.prevent.transformation.witch': {
    title: '阻止村民变女巫',
    description: '设为 true 后，村民被雷击后不会变成女巫。',
  },
  'protect.prevent.transformation.zombie-pigman': {
    title: '阻止猪变僵尸猪灵',
    description: '设为 true 后，猪被雷击后不会变成僵尸猪灵。',
  },
  'protect.prevent.transformation.drowned': {
    title: '阻止僵尸变溺尸',
    description: '设为 true 后，僵尸不会转化为溺尸，尸壳也不会转化为僵尸。',
  },
  'protect.prevent.transformation.mooshroom': {
    title: '阻止哞菇变色',
    description: '设为 true 后，哞菇被雷击后不会改变颜色。',
  },
  'protect.prevent.spawn': {
    title: '生物生成阻止设置',
    description: '阻止指定生物生成，设为 true 表示阻止该生物生成。\n列表中没有的生物可以按同样的格式自行添加（生物名为英文 ID）。',
  },
  'protect.creeper': {
    title: '苦力怕高度限制',
    description: '苦力怕爆炸相关的高度限制设置。',
  },
  'protect.creeper.max-height': {
    title: '苦力怕爆炸最大高度',
    description: '苦力怕允许爆炸的最大 Y 高度，设为 -1 表示任何高度都可爆炸。\n想完全禁止苦力怕爆炸请使用 protect.prevent.creeper-explosion。',
  },
  'protect.disable': {
    title: '伤害/事件禁用设置',
    description: '禁用各类默认伤害和事件，设为 true 表示禁用该类型。',
  },
  'protect.disable.fall': {
    title: '禁用摔落伤害',
    description: '设为 true 后，玩家不会受到摔落伤害。',
  },
  'protect.disable.pvp': {
    title: '禁用 PvP',
    description: '设为 true 后，玩家之间无法互相攻击。\n拥有 essentials.protect.pvp 权限的玩家仍可攻击，但无法攻击没有该权限的玩家。',
  },
  'protect.disable.drown': {
    title: '禁用溺水伤害',
    description: '设为 true 后，玩家不会受到溺水伤害。',
  },
  'protect.disable.suffocate': {
    title: '禁用窒息伤害',
    description: '设为 true 后，玩家不会在方块中窒息。',
  },
  'protect.disable.lavadmg': {
    title: '禁用岩浆伤害',
    description: '设为 true 后，玩家不会受到岩浆伤害（物品掉进岩浆仍会烧毁）。',
  },
  'protect.disable.projectiles': {
    title: '禁用弹射物伤害',
    description: '设为 true 后，箭矢等弹射物不再造成伤害。',
  },
  'protect.disable.contactdmg': {
    title: '禁用接触伤害',
    description: '设为 true 后，接触仙人掌、滴水石、浆果丛等不再造成伤害。',
  },
  'protect.disable.firedmg': {
    title: '禁用火焰伤害',
    description: '设为 true 后，玩家不会受到火焰燃烧伤害。',
  },
  'protect.disable.lightning': {
    title: '禁用雷击伤害',
    description: '设为 true 后，被雷电击中不再受到伤害。',
  },
  'protect.disable.wither': {
    title: '禁用凋零伤害',
    description: '设为 true 后，玩家不会受到凋零效果伤害。',
  },
  'protect.disable.weather': {
    title: '天气禁用设置',
    description: '禁用各类天气，设为 true 表示禁用。',
  },
  'protect.disable.weather.storm': {
    title: '禁用降雨',
    description: '设为 true 后，不再出现降雨天气。',
  },
  'protect.disable.weather.thunder': {
    title: '禁用雷暴',
    description: '设为 true 后，不再出现雷暴天气。',
  },
  'protect.disable.weather.lightning': {
    title: '禁用闪电',
    description: '设为 true 后，不再出现闪电。',
  },

  // 11. EssentialsX AntiBuild（需安装 AntiBuild 模块）
  'protect.disable.build': {
    title: '建筑权限检查',
    description: '是否阻止没有 essentials.build 权限的玩家进行建造（放置/破坏）。\n设为 false 表示 Essentials AntiBuild 完全不干预建造行为。\n注意：此分区需要安装 EssentialsX AntiBuild 模块才生效。',
  },
  'protect.disable.use': {
    title: '物品使用权限检查',
    description: '是否阻止没有 essentials.build 权限的玩家使用物品（如开关门、使用水桶等）。\n设为 false 表示 Essentials AntiBuild 完全不干预物品使用。',
  },
  'protect.disable.warn-on-build-disallow': {
    title: '建造被拒时提示',
    description: '玩家因无权限被阻止建造时，是否向其发送提示消息。',
  },
  'protect.alert': {
    title: '敏感操作警报',
    description: '当玩家进行下列操作时在控制台/游戏内向管理员发出警报。\n方块/物品名见 Bukkit Material 列表，逗号分隔。',
  },
  'protect.alert.on-placement': {
    title: '放置警报',
    description: '玩家放置这些方块时发出警报，默认：LAVA,TNT,LAVA_BUCKET。',
  },
  'protect.alert.on-use': {
    title: '使用警报',
    description: '玩家使用这些物品时发出警报，默认：LAVA_BUCKET。',
  },
  'protect.alert.on-break': {
    title: '破坏警报',
    description: '玩家破坏这些方块时发出警报，默认为空。',
  },
  'protect.blacklist': {
    title: '方块/物品黑名单',
    description: '阻止玩家放置、使用或破坏指定的方块/物品（拥有 essentials.protect.exemptplacement 等豁免权限的玩家不受限）。',
  },
  'protect.blacklist.placement': {
    title: '禁止放置黑名单',
    description: '禁止玩家放置的方块列表，逗号分隔，默认：LAVA,TNT,LAVA_BUCKET。\n拥有 essentials.protect.exemptplacement 权限的玩家不受限。',
  },
  'protect.blacklist.usage': {
    title: '禁止使用黑名单',
    description: '禁止玩家使用的物品列表，逗号分隔，默认：LAVA_BUCKET。\n拥有 essentials.protect.exemptusage 权限的玩家不受限。',
  },
  'protect.blacklist.break': {
    title: '禁止破坏黑名单',
    description: '禁止玩家破坏的方块列表，逗号分隔，默认为空。\n拥有 essentials.protect.exemptbreak 权限的玩家不受限。',
  },
  'protect.blacklist.piston': {
    title: '禁止活塞推动黑名单',
    description: '不允许被活塞推动的方块列表，逗号分隔，默认为空。',
  },
  'protect.blacklist.dispenser': {
    title: '禁止发射器发射黑名单',
    description: '不允许被发射器发射的方块/物品列表，逗号分隔，默认为空。',
  },

  // 12. EssentialsX Spawn + 新玩家设置（需安装 Spawn 模块）
  'newbies': {
    title: '新玩家设置',
    description: '新玩家进服相关的设置。\n注意：需要安装 EssentialsX Spawn 模块后此分区才生效。',
  },
  'newbies.announce-format': {
    title: '新人进服公告格式',
    description: '玩家首次进服时向全服广播的消息。\n- {DISPLAYNAME} 会替换为玩家显示名。\n- 设为空字符串 \'\' 则关闭公告。',
  },
  'newbies.spawnpoint': {
    title: '新人出生点',
    description: '新玩家首次进服时使用的出生点名称。\n- 设为 none 使用世界默认出生点。\n- 可用 /setspawn <组名> 为不同组设置不同出生点。',
  },
  'newbies.kit': {
    title: '新人礼包',
    description: '新玩家首次进服时发放的礼包名称（需在 kits.yml 中定义）。\n- 发放时不检查费用和权限，也不会触发礼包冷却。\n- 设为空字符串 \'\' 则不发放礼包。',
  },
  'respawn-listener-priority': {
    title: '重生处理优先级',
    description: 'Essentials 处理玩家死亡重生的事件优先级。\n注意：修改后需要重启服务器才生效。',
    options: LISTENER_PRIORITY_OPTIONS,
  },
  'spawn-join-listener-priority': {
    title: '进服出生处理优先级',
    description: 'Essentials 处理玩家进服时出生位置的事件优先级，取值同 respawn-listener-priority。\n注意：修改可能影响 spawn-on-join 功能；修改后需要重启服务器才生效。',
    options: LISTENER_PRIORITY_OPTIONS,
  },
  'respawn-at-home': {
    title: '死亡后在家中重生',
    description: '玩家死亡后是否在其第一个家或床的位置重生，而非出生点。',
  },
  'respawn-at-home-bed': {
    title: '优先在床重生',
    description: '玩家死亡后是否优先在其床的位置重生（需要 respawn-at-home 为 true）。',
  },
  'respawn-at-anchor': {
    title: '尊重重生锚',
    description: '玩家死亡后是否遵循其设置的重生锚位置重生。',
  },
  'random-spawn-location': {
    title: '随机出生位置',
    description: '配置后，玩家首次进服将出生在随机位置而非出生点（会覆盖 newbies.spawnpoint）。\n- 需先用 /settpr 命令或在 tpr.yml 中设置随机传送位置。\n- 此处填写世界名（或 tpr.yml 中定义的名称）。',
  },
  'random-respawn-location': {
    title: '随机重生位置',
    description: '配置后，玩家死亡后在随机位置重生。\n位置设置方式见 random-spawn-location。',
  },
  'spawn-on-join': {
    title: '进服传送到出生点',
    description: '玩家进服时是否传送到出生点：\n- true：所有玩家进服都传送到出生点。\n- 填写组名（如 guests）：仅该组玩家被传送。\n- 填写列表：列表中的组都会被传送。\n- false：不传送。',
  },
};

export const essentialsDefinition: PluginConfigDocDefinition = {
  pluginNames: ['essentials', 'ess'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: essentialsConfigDocs,
};

export default essentialsDefinition;
