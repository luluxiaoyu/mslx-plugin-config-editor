import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

/**
 * CoreProtect config.yml 中文对照字典
 * 默认值来源：https://github.com/PlayPro/CoreProtect (net.coreprotect.config.Config)
 * 注：CoreProtect 的 config.yml 为扁平结构（所有键都在根级），且支持按世界单独配置（world_nether.yml 等）。
 */

// 开关类选项（CoreProtect 绝大多数键都是布尔开关）
const BOOLEAN_OPTIONS = [
  { value: true, label: '开启 (true)' },
  { value: false, label: '关闭 (false)' },
];

/**
 * 记录开关的快捷描述模板。
 * @param action 该开关记录的行为（如“玩家放置的方块”）
 * @param extra 额外说明（可选）
 */
const logSwitch = (action: string, extra?: string): string =>
  `是否记录${action}。\n- 默认开启 (true)，关闭后相关行为将无法被查询和回滚。${extra ? `\n- ${extra}` : ''}`;

export const coreprotectConfigDocs: ConfigDocMap = {
  // 1. 数据库设置 (Database Settings)
  'donation-key': {
    title: '捐赠密钥',
    description: 'CoreProtect 为捐赠制软件（donationware）。\n在 coreprotect.net/donate/ 捐赠后获得的密钥填在这里，可解锁 Patreon 专属功能（如数据库迁移）。普通使用留空即可。',
  },
  'database-type': {
    title: '数据库引擎',
    description: 'CoreProtect 存储日志数据使用的数据库类型。\n- 全新安装默认使用内置 DuckDB，无需任何额外配置；旧版本升级时若缺少此键，会自动根据 use-mysql 推导为 sqlite 或 mysql。\n- 切换数据库引擎不会迁移已有数据，相当于启用一套全新的日志库。修改后需 /co reload 或重启生效。',
    options: [
      { value: 'duckdb', label: 'DuckDB 内置列式数据库 (默认，推荐)', description: 'CoreProtect 25.0+ 新装默认，数据存于 plugins/CoreProtect/database.duckdb，无需外部服务。' },
      { value: 'clickhouse', label: 'ClickHouse 外部列式数据库', description: '需要自行搭建 ClickHouse 25.6+ 服务器，适合超大型日志量。' },
      { value: 'sqlite', label: 'SQLite 内置数据库 (旧版默认)', description: '传统内置方案，数据存于 database.db 文件。' },
      { value: 'mysql', label: 'MySQL 外部数据库', description: '需在下方 mysql-host 等键中配置连接信息。' },
    ],
  },
  'use-mysql': {
    title: '使用 MySQL（旧版兼容键）',
    description: '旧版 CoreProtect（23.x 及更早）用于切换 MySQL 的开关。\n- 新版已被 database-type 取代，database-type 存在时此键被忽略。\n- 仅当配置中没有 database-type 时，CoreProtect 才用它推导存储引擎（true → mysql，false → sqlite）。',
    options: BOOLEAN_OPTIONS,
  },
  'table-prefix': {
    title: '数据表前缀',
    description: '数据库中 CoreProtect 数据表的前缀，默认 co_。\n- 多个服务端共用同一个 MySQL/ClickHouse 数据库时，可用不同前缀隔离数据。\n- 请勿在已有数据的情况下随意修改，否则 CoreProtect 会视为全新空库。',
  },
  'mysql-host': {
    title: 'MySQL 主机地址',
    description: 'MySQL 服务器地址，默认 127.0.0.1。仅 database-type 为 mysql 时生效。',
  },
  'mysql-port': {
    title: 'MySQL 端口',
    description: 'MySQL 服务器端口，默认 3306。仅 database-type 为 mysql 时生效。',
  },
  'mysql-database': {
    title: 'MySQL 数据库名',
    description: '用于存放 CoreProtect 数据的 MySQL 数据库名称。\n该数据库需提前在 MySQL 中创建好，CoreProtect 会自动在其中建表。',
  },
  'mysql-username': {
    title: 'MySQL 用户名',
    description: '连接 MySQL 使用的账号，默认 root。建议使用权限仅限该数据库的专用账号。',
  },
  'mysql-password': {
    title: 'MySQL 密码',
    description: '连接 MySQL 使用的密码。注意：此文件包含明文密码，请限制服务器上的文件访问权限。',
  },
  'enable-ssl': {
    title: 'MySQL 启用 SSL 连接',
    description: '连接 MySQL 时是否使用 SSL 加密。默认关闭。\n仅当数据库与面板服分离、需要跨网络加密时才建议开启，且数据库端需配置好证书。',
    options: BOOLEAN_OPTIONS,
  },
  'disable-wal': {
    title: '禁用 SQLite WAL 模式',
    description: '是否禁用 SQLite 的 WAL（预写日志）模式。默认关闭（即启用 WAL，性能更好）。\n仅当数据库文件存放在不支持 WAL 的网络文件系统（如 NFS/SMB）时才需要开启，否则会明显拖慢写入。',
    options: BOOLEAN_OPTIONS,
  },
  'maximum-pool-size': {
    title: '数据库连接池最大连接数',
    description: 'MySQL/ClickHouse 连接池允许的最大连接数，默认 10。\n大多数服务器无需调整；只有确认数据库连接耗尽时才适当调大。',
  },
  'database-lock': {
    title: '数据库写入锁',
    description: '开启后独占数据库写入权，防止多个服务端同时写入同一数据库导致数据损坏。默认开启，强烈建议保持。\n- 只有在使用 ClickHouse 且明确配置了多写入端时才可关闭。\n- 执行数据清理（purge）或迁移前，必须先停掉所有共用该库的服务端并保持此锁开启。',
    options: BOOLEAN_OPTIONS,
  },
  'clickhouse-host': {
    title: 'ClickHouse 主机地址',
    description: 'ClickHouse 服务器的 HTTP 接口地址，默认 127.0.0.1。仅 database-type 为 clickhouse 时生效。',
  },
  'clickhouse-port': {
    title: 'ClickHouse 端口',
    description: 'ClickHouse 的 HTTP 端口，默认 8123。仅 database-type 为 clickhouse 时生效。',
  },
  'clickhouse-database': {
    title: 'ClickHouse 数据库名',
    description: '存放 CoreProtect 数据的 ClickHouse 数据库，默认 default。\n需提前创建（建议 ENGINE = Atomic），CoreProtect 只负责建表。',
  },
  'clickhouse-username': {
    title: 'ClickHouse 用户名',
    description: '连接 ClickHouse 使用的账号，默认 default。',
  },
  'clickhouse-password': {
    title: 'ClickHouse 密码',
    description: '连接 ClickHouse 使用的密码，默认为空。',
  },
  'clickhouse-tls': {
    title: 'ClickHouse 启用 TLS',
    description: '连接 ClickHouse 时是否使用 TLS 加密（HTTPS 端口通常为 8443）。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'clickhouse-consumer-delay': {
    title: 'ClickHouse 写入批量延迟 (毫秒)',
    description: '向 ClickHouse 批量写入日志的间隔（毫秒），默认 2500，最小 500。\n调大可减少写入次数、降低数据库压力；调小则数据入库更快。一般无需修改。',
  },
  'duckdb-memory-limit': {
    title: 'DuckDB 内存上限',
    description: '内置 DuckDB 缓冲管理器的内存上限，默认 512MB（如 1GB、512MB）。\n只控制缓冲区，实际占用的原生内存可能更高。大查询内存不足时可适当调大。',
  },
  'duckdb-threads': {
    title: 'DuckDB 查询线程数',
    description: 'DuckDB 执行查询使用的线程数，默认 3。一般无需调整。',
  },
  'duckdb-max-temp-directory-size': {
    title: 'DuckDB 临时溢出文件上限',
    description: 'DuckDB 查询时写盘的临时溢出数据上限，默认 10GB。\n不预占空间，也不限制数据库本体大小；超出内存且溢出空间也耗尽的查询会失败。',
  },

  // 2. 基础设置 (General Settings)
  'language': {
    title: '语言',
    description: '插件提示消息使用的语言代码（如 en、zh_cn、zh_tw）。默认 en。\n修改后 CoreProtect 会自动尝试翻译语言文件，语言代码列表见 coreprotect.net/languages/。',
  },
  'check-updates': {
    title: '检查更新',
    description: '服务器启动时是否检查 CoreProtect 新版本，并在控制台提示。默认开启，建议保持以便及时获得修复。',
    options: BOOLEAN_OPTIONS,
  },
  'error-reporting': {
    title: '自动错误上报',
    description: '插件出错时是否自动把错误信息发送给插件作者，帮助改进软件。默认开启，介意隐私可关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'api-enabled': {
    title: '开放 CoreProtect API',
    description: '是否允许其他插件调用 CoreProtect API（如自己的反作弊、经济插件想写入/读取日志）。默认开启。\n绝大多数依赖 CoreProtect 的插件都需要此项，不建议关闭。',
    options: BOOLEAN_OPTIONS,
  },
  'verbose': {
    title: '回滚时显示详细信息',
    description: '执行回滚/还原时是否输出更详细的过程信息。默认开启。\n也可以只对单次命令生效：在命令里加 #verbose 标签即可。',
    options: BOOLEAN_OPTIONS,
  },
  'hover-events': {
    title: '聊天悬浮提示',
    description: '查询结果等聊天消息中是否启用鼠标悬浮显示详情（如物品、坐标信息）。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  'debug': {
    title: '调试模式（旧版键）',
    description: '旧版配置中的调试开关，输出内部调试日志到控制台。\n新版 CoreProtect 已移除该键，如需排查网络通信问题请使用 network-debug。仅排查问题时开启，平时保持关闭避免刷屏。',
    options: BOOLEAN_OPTIONS,
  },
  'network-debug': {
    title: '网络同步调试输出',
    description: '是否输出 CoreProtect 跨服网络通信的调试信息。默认关闭，仅排查群组网络数据同步问题时开启。',
    options: BOOLEAN_OPTIONS,
  },
  'unknown-logging': {
    title: '记录未知/未识别事件',
    description: '是否记录插件无法明确归因的杂项事件。默认关闭。\n开启会增加数据量，一般仅在排查疑难问题时临时开启。',
    options: BOOLEAN_OPTIONS,
  },

  // 3. 数据清理 (Automatic Purging)
  'auto-purge': {
    title: '自动清理过期数据',
    description: '自动删除超过指定时长的旧日志，支持格式如 30d（天）、12w（周）、6mo（月）。设为 false 关闭。\n- 强烈建议开启（如 30d），否则日志会无限增长、占满磁盘。\n- 清理不可逆，且操作前请确保 database-lock 为 true；社区版（免费版）不支持此功能。',
  },
  'auto-purge-time': {
    title: '自动清理执行时刻',
    description: '每日自动清理的执行时间（如 3:00 表示凌晨 3 点）。建议设在玩家较少的时段，避免清理时造成卡顿。',
  },

  // 4. 回滚与查询范围 (Rollback & Radius)
  'default-radius': {
    title: '默认回滚半径',
    description: '执行回滚/还原命令且未指定半径 (r:) 时自动套用的范围，默认 10 格。设为 0 表示不自动添加半径。\n- 安全提示：没有半径限制的回滚可能影响全图数据，务必谨慎。设置默认值能有效防止管理员忘写半径导致误回滚全世界。',
  },
  'max-radius': {
    title: '最大允许半径',
    description: '命令中允许使用的最大半径，默认 100 格。设为 0 表示不限制。\n- 如需全图操作可使用 r:#global。\n- 建议保留一个合理上限，防止误操作大范围回滚导致长时间卡服。',
  },
  'rollback-items': {
    title: '回滚包含容器物品',
    description: '回滚时是否同时恢复玩家从箱子、熔炉等容器中取出的物品。默认开启。\n- 关闭后被偷的物品无法通过回滚找回，建议保持开启。',
    options: BOOLEAN_OPTIONS,
  },
  'rollback-entities': {
    title: '回滚包含实体',
    description: '回滚时是否恢复被击杀的实体（如牛、村民），以及撤销玩家放置的实体。默认开启。\n- 关闭后被恶意屠杀的动物/村民无法找回。',
    options: BOOLEAN_OPTIONS,
  },
  'skip-generic-data': {
    title: '跳过无归因的泛型数据',
    description: '是否不记录无法归属到玩家/具体源头的泛型事件（如僵尸在阳光下自燃）。默认开启。\n- 开启可显著减少数据库体积，且不影响正常的玩家行为回滚，建议保持。',
    options: BOOLEAN_OPTIONS,
  },

  // 5. 记录开关 - 方块类 (Block Logging)
  'block-place': {
    title: '记录方块放置',
    description: logSwitch('玩家放置的方块', '核心功能，关闭后无法查询/回滚玩家放置行为，不建议关闭。'),
    options: BOOLEAN_OPTIONS,
  },
  'block-break': {
    title: '记录方块破坏',
    description: logSwitch('玩家破坏的方块', '核心功能，关闭后无法追查/回滚玩家拆房行为，不建议关闭。'),
    options: BOOLEAN_OPTIONS,
  },
  'natural-break': {
    title: '记录依附方块掉落',
    description: logSwitch(
      '因依附方块被破坏而掉落的方块（如玩家打掉泥土后上面的告示牌、火把掉落）',
      '床和门要能被正确回滚必须依赖此功能，不建议关闭。'
    ),
    options: BOOLEAN_OPTIONS,
  },
  'block-movement': {
    title: '记录方块移动',
    description: logSwitch('方块的自然移动（如沙子、沙砾坠落）', '关闭后坠落类方块的变化无法被准确回滚。'),
    options: BOOLEAN_OPTIONS,
  },
  'pistons': {
    title: '记录活塞推动',
    description: logSwitch('被活塞推拉移动的方块。'),
    options: BOOLEAN_OPTIONS,
  },
  'dispensers': {
    title: '记录发射器行为',
    description: logSwitch('由发射器造成的方块放置与移除。'),
    options: BOOLEAN_OPTIONS,
  },
  'block-burn': {
    title: '记录方块烧毁',
    description: logSwitch('被火烧毁的方块', '火灾烧掉的建筑要能被回滚需要开启此项与 block-ignite。'),
    options: BOOLEAN_OPTIONS,
  },
  'block-ignite': {
    title: '记录方块着火',
    description: logSwitch('方块自然着火（如火势蔓延引燃）。'),
    options: BOOLEAN_OPTIONS,
  },
  'fire-extinguish': {
    title: '记录火焰自然熄灭',
    description: logSwitch('火焰的自然熄灭', '默认关闭，对回滚价值不大，开启只会增加数据量。'),
    options: BOOLEAN_OPTIONS,
  },
  'explosions': {
    title: '记录爆炸破坏',
    description: logSwitch('爆炸事件（如 TNT、苦力怕炸毁的方块）', '爆炸破坏要能被回滚必须开启此项。'),
    options: BOOLEAN_OPTIONS,
  },
  'entity-change': {
    title: '记录实体改变方块',
    description: logSwitch('实体对方块的改变（如末影人搬方块、羊吃草、雪傀儡留雪）。'),
    options: BOOLEAN_OPTIONS,
  },
  'entity-kills': {
    title: '记录实体被击杀',
    description: logSwitch('被击杀的实体（如牛、村民、末影人）', '配合 rollback-entities 可在回滚时恢复被杀的动物。'),
    options: BOOLEAN_OPTIONS,
  },
  'entity-spawns': {
    title: '记录玩家放置实体',
    description: logSwitch('玩家放置或生成的实体（如船、矿车、刷怪蛋生成的生物、盔甲架）。'),
    options: BOOLEAN_OPTIONS,
  },
  'sign-text': {
    title: '记录告示牌文字',
    description: logSwitch('告示牌上的文字内容', '关闭后回滚告示牌时会变成空白牌。'),
    options: BOOLEAN_OPTIONS,
  },
  'buckets': {
    title: '记录液体桶使用',
    description: logSwitch('玩家使用桶放置/回收水和岩浆源头。'),
    options: BOOLEAN_OPTIONS,
  },
  'leaf-decay': {
    title: '记录树叶自然枯萎',
    description: logSwitch('树叶的自然枯萎消失', '会产生较多记录，纯自然景观服可考虑关闭以减小数据库。'),
    options: BOOLEAN_OPTIONS,
  },
  'tree-growth': {
    title: '记录树木生长',
    description: logSwitch('树木生长，并把长成的树关联到种下树苗的玩家。'),
    options: BOOLEAN_OPTIONS,
  },
  'mushroom-growth': {
    title: '记录蘑菇蔓延',
    description: logSwitch('蘑菇的自然蔓延生长。'),
    options: BOOLEAN_OPTIONS,
  },
  'vine-growth': {
    title: '记录藤蔓生长',
    description: logSwitch('藤蔓的自然生长蔓延。'),
    options: BOOLEAN_OPTIONS,
  },
  'sculk-spread': {
    title: '记录幽匿方块蔓延',
    description: logSwitch('幽匿催发体导致的幽匿类方块蔓延。'),
    options: BOOLEAN_OPTIONS,
  },
  'portals': {
    title: '记录传送门生成',
    description: logSwitch('传送门的自然生成（如下界传送门被点燃成型）。'),
    options: BOOLEAN_OPTIONS,
  },
  'water-flow': {
    title: '记录水流',
    description: logSwitch('水的流动', '水冲毁火把等方块后能被正确回滚依赖此项。'),
    options: BOOLEAN_OPTIONS,
  },
  'lava-flow': {
    title: '记录岩浆流动',
    description: logSwitch('岩浆的流动', '岩浆烧毁方块后能被正确回滚依赖此项。'),
    options: BOOLEAN_OPTIONS,
  },
  'liquid-tracking': {
    title: '液体归属追踪',
    description: '是否追踪液体的来源并关联到玩家。\n- 例如玩家倒水冲毁了火把，回滚该玩家时可一并恢复。\n- 对定位“放岩浆熊服”的责任人非常关键，建议保持开启。',
    options: BOOLEAN_OPTIONS,
  },

  // 6. 记录开关 - 物品与容器 (Item & Container Logging)
  'item-transactions': {
    title: '记录容器物品存取',
    description: logSwitch('玩家与容器间的物品存取（如从箱子、熔炉、发射器中拿放物品）', '追查“谁偷了箱子里的东西”依赖此项，不建议关闭。数据量较大。'),
    options: BOOLEAN_OPTIONS,
  },
  'item-drops': {
    title: '记录玩家丢弃物品',
    description: logSwitch('玩家丢出的物品', '会产生大量记录，不需要可查可关。'),
    options: BOOLEAN_OPTIONS,
  },
  'item-pickups': {
    title: '记录玩家拾取物品',
    description: logSwitch('玩家捡起的物品', '与 item-drops 配合可追踪物品流转，但数据量大。'),
    options: BOOLEAN_OPTIONS,
  },
  'hopper-transactions': {
    title: '记录漏斗物品传输',
    description: logSwitch('漏斗的物品传输（如漏斗从箱子、熔炉中吸取物品）', '在大型生电服上漏斗事件非常频繁，会显著增大数据库，可按需关闭。'),
    options: BOOLEAN_OPTIONS,
  },
  'hopper-filter-meta': {
    title: '漏斗过滤含 NBT 物品',
    description: '记录漏斗传输时，是否跳过带有特殊元数据（NBT，如改名、附魔）的物品。默认关闭。\n开启可减少 hopper-transactions 的数据量，但这些特殊物品的流转将不被记录。',
    options: BOOLEAN_OPTIONS,
  },

  // 7. 记录开关 - 玩家行为 (Player Logging)
  'player-interactions': {
    title: '记录玩家交互',
    description: logSwitch('玩家与方块的交互（如开门、按按钮、开箱子）', '交互记录无法被回滚，仅用于查询取证。数据量大，可按需关闭。'),
    options: BOOLEAN_OPTIONS,
  },
  'player-messages': {
    title: '记录玩家聊天',
    description: logSwitch('玩家在聊天栏发送的消息', '涉及玩家隐私，且会增大数据库；有独立聊天日志插件时可关闭。'),
    options: BOOLEAN_OPTIONS,
  },
  'log-cancelled-chat': {
    title: '记录被取消的聊天',
    description: '是否记录被其他插件（如聊天审核、反刷屏）拦截取消的聊天消息。默认开启。\n- 可用于追查违规未遂发言；注意这可能绕过其他插件的隐私处理逻辑。',
    options: BOOLEAN_OPTIONS,
  },
  'player-commands': {
    title: '记录玩家命令',
    description: logSwitch('玩家使用的所有命令', '注意：含 /login、/register 等登录命令也会被记录，数据库可能泄露密码明文，建议配合 blacklist.txt 过滤。'),
    options: BOOLEAN_OPTIONS,
  },
  'player-sessions': {
    title: '记录玩家进出服',
    description: logSwitch('玩家的登录与登出（含登录时间、IP 等会话信息）', '管理查证必备，建议保持开启。'),
    options: BOOLEAN_OPTIONS,
  },
  'username-changes': {
    title: '记录玩家改名',
    description: logSwitch('玩家修改 Minecraft 用户名的记录', '改名后旧记录仍可通过历史名字查询到同一人。'),
    options: BOOLEAN_OPTIONS,
  },
  'worldedit': {
    title: '记录 WorldEdit 操作',
    description: logSwitch('通过 WorldEdit 插件对方块做出的修改', 'WE 大规模操作会产生海量记录；关闭后 WE 造成的破坏无法回滚，请谨慎。'),
    options: BOOLEAN_OPTIONS,
  },

  // 8. 网络与其他高级设置 (Network & Advanced)
  'exclude-tnt': {
    title: '网络同步排除 TNT 爆炸',
    description: '使用群组网络功能时，是否不同步 TNT 爆炸数据。默认关闭。\n仅在跨服网络部署中用于降低同步数据量，单机服无需理会。',
    options: BOOLEAN_OPTIONS,
  },
  'duplicate-suppression': {
    title: '重复数据抑制',
    description: '是否合并/抑制短时间内产生的重复日志记录。默认开启，可明显减小数据库体积，建议保持。',
    options: BOOLEAN_OPTIONS,
  },
};

export const coreprotectDefinition: PluginConfigDocDefinition = {
  pluginNames: ['coreprotect', 'co'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: coreprotectConfigDocs,
};

export default coreprotectDefinition;
