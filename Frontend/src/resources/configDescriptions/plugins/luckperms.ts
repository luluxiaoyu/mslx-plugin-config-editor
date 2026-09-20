import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

const COMMON_STORAGE_OPTIONS = [
  { value: 'h2', label: 'H2 本地数据库 (默认推荐)' },
  { value: 'sqlite', label: 'SQLite 本地数据库' },
  { value: 'mysql', label: 'MySQL 远程数据库' },
  { value: 'mariadb', label: 'MariaDB 远程数据库 (推荐优于 MySQL)' },
  { value: 'postgresql', label: 'PostgreSQL 远程数据库' },
  { value: 'mongodb', label: 'MongoDB 远程文档型数据库' },
  { value: 'yaml', label: 'YAML 单独文件 (.yml)' },
  { value: 'json', label: 'JSON 单独文件 (.json)' },
  { value: 'hocon', label: 'HOCON 单独文件 (.conf)' },
  { value: 'toml', label: 'TOML 单独文件 (.toml)' },
];

/**
 * LuckPerms config.yml / luckperms.conf 中文对照字典
 */
export const luckpermsConfigDocs: ConfigDocMap = {
  // 1. 基础设置 (Essential Settings)
  'server': {
    title: '服务器标识名称',
    description: '用于特定服务器权限上下文（Context）的服务器标识名。\n- 设置为 "global" 时该设置实际上被忽略。\n- 其他情况下，此处设置的值将被添加到该服务器所有玩家的 "server" 上下文中。',
  },
  'use-server-uuid-cache': {
    title: '使用服务端 UUID 缓存',
    description: '当 LuckPerms 中尚无玩家记录时，是否使用服务端自身的 UUID 缓存/查询机制。\n- 设为 false 时，如果玩家在安装 LuckPerms 后从未进过服，通过用户名执行的命令将无法生效。\n- 设为 true 时，将使用服务端内置机制（包括本地缓存或向 Mojang API 查询）。',
  },

  // 2. 存储设置 (Storage Settings)
  'storage-method': {
    title: '数据存储方式',
    description: 'LuckPerms 存储权限数据的方式：\n- 远程数据库（需在下方配置连接信息）：MySQL, MariaDB（推荐）, PostgreSQL, MongoDB\n- 本地数据库（无需额外配置）：H2（推荐，默认）, SQLite\n- 纯文本文件（无需额外配置）：YAML (.yml), JSON (.json), HOCON (.conf), TOML (.toml)\n- 默认为 H2 数据库。如果想手动在文件中编辑，建议使用 YAML。',
    options: [
      ...COMMON_STORAGE_OPTIONS,
      { value: 'yaml-combined', label: 'YAML 合并单文件 (.yml)' },
      { value: 'json-combined', label: 'JSON 合并单文件 (.json)' },
      { value: 'hocon-combined', label: 'HOCON 合并单文件 (.conf)' },
      { value: 'toml-combined', label: 'TOML 合并单文件 (.toml)' },
    ],
  },
  'data': {
    title: '远程数据库连接配置',
    description: '远程数据库存储方式（MySQL, MariaDB, PostgreSQL, MongoDB 等）的连接参数。\n如果使用 H2/SQLite 本地数据库，则无需修改此项。',
  },
  'data.address': {
    title: '数据库连接地址与端口',
    description: '远程数据库服务器的主机地址和端口。\n默认使用各数据库标准端口（MySQL/MariaDB: 3306, PostgreSQL: 5432, MongoDB: 27017）。若非默认端口请按 "host:port" 格式填写。',
  },
  'data.database': {
    title: '数据库名称',
    description: '用于存储 LuckPerms 数据的数据库名称。该数据库必须已在数据库服务端预先创建好。使用 MongoDB 时无需关心此项。',
  },
  'data.username': {
    title: '数据库用户名',
    description: '连接远程数据库所使用的账号用户名。',
  },
  'data.password': {
    title: '数据库密码',
    description: '连接远程数据库所使用的密码。',
  },
  'data.pool-settings': {
    title: '连接池设置 (HikariCP)',
    description: 'MySQL / MariaDB / PostgreSQL 数据库连接池参数。默认值适合大多数服务器，非专业维护无需改动。',
  },
  'data.pool-settings.maximum-pool-size': {
    title: '连接池最大连接数',
    description: '连接池允许创建的最大数据库连接数。决定了同时与数据库通信的物理连接上限。',
  },
  'data.pool-settings.minimum-idle': {
    title: '最小空闲连接数',
    description: '连接池尝试维持的最小空闲连接数。为了最佳性能和快速响应突发请求，建议保持与 maximum-pool-size 相同。',
  },
  'data.pool-settings.maximum-lifetime': {
    title: '连接最大生命周期 (毫秒)',
    description: '连接在池中最长保留时间（毫秒）。默认 1800000（即 30 分钟）。应至少比数据库或网络超时短 30 秒。',
  },
  'data.pool-settings.keepalive-time': {
    title: '连接保活心跳间隔 (毫秒)',
    description: '连接池向数据库发送保活 ping 的频率，以防连接被数据库或路由器超时切断。设为 0 表示禁用保活。',
  },
  'data.pool-settings.connection-timeout': {
    title: '获取连接超时时间 (毫秒)',
    description: '从连接池获取可用连接时的最大等待时间（毫秒）。超时将抛出异常，默认 5000（5 秒）。',
  },
  'data.pool-settings.properties': {
    title: '数据库额外连接属性',
    description: 'JDBC 连接字符串中附加的额外属性，如字符编码（useUnicode: true, characterEncoding: utf8）和 SSL 选项。',
  },
  'data.table-prefix': {
    title: '数据表前缀',
    description: 'LuckPerms 创建的所有 SQL 表名前缀。默认 \'luckperms_\'。多个服务器共享同一个数据库时，可修改此项以区分各自的表。',
  },
  'data.mongodb-collection-prefix': {
    title: 'MongoDB 集合前缀',
    description: '用于 MongoDB 存储方式的集合名前缀，默认为空。',
  },
  'data.mongodb-connection-uri': {
    title: 'MongoDB 连接字符串 URI',
    description: 'MongoDB 连接 URI（如 mongodb:// 或 mongodb+srv:// 开头）。如果配置了此项，将覆盖上方单独配置的地址、库名和密码。',
  },
  'split-storage': {
    title: '分离存储配置 (Split Storage)',
    description: '允许将不同类别的数据（玩家、权限组、路线、日志等）分别存放在不同的存储媒介中。',
  },
  'split-storage.enabled': {
    title: '启用分离存储',
    description: '是否开启数据分离存储。若不需要将不同数据分开存放，请保持 false。',
  },
  'split-storage.methods': {
    title: '各类数据指定存储方式',
    description: '指定各类数据各自使用的存储引擎类型（user, group, track, uuid, log）。',
  },
  'split-storage.methods.user': {
    title: '玩家数据存储引擎',
    description: '存储玩家权限、元数据与父组所使用的存储类型。',
    options: COMMON_STORAGE_OPTIONS,
  },
  'split-storage.methods.group': {
    title: '权限组数据存储引擎',
    description: '存储权限组及其包含权限所使用的存储类型。',
    options: COMMON_STORAGE_OPTIONS,
  },
  'split-storage.methods.track': {
    title: '晋级路线存储引擎',
    description: '存储权限组晋升路线所使用的存储类型。',
    options: COMMON_STORAGE_OPTIONS,
  },
  'split-storage.methods.uuid': {
    title: 'UUID 映射存储引擎',
    description: '存储用户名与玩家 UUID 映射关系所使用的存储类型。',
    options: COMMON_STORAGE_OPTIONS,
  },
  'split-storage.methods.log': {
    title: '操作日志存储引擎',
    description: '存储权限操作记录所使用的存储类型。',
    options: COMMON_STORAGE_OPTIONS,
  },

  // 3. 更新同步与消息服务 (Update Propagation & Messaging Service)
  'sync-minutes': {
    title: '自动同步周期 (分钟)',
    description: 'LuckPerms 从存储媒介全量拉取刷新数据的周期（分钟）。\n- 设为 -1 表示完全禁用定时自动拉取（推荐搭配跨服消息服务实现即时更新）。\n- 适合未配置消息服务的跨服网络设为 3~5 分钟。',
  },
  'watch-files': {
    title: '文件监控热重载',
    description: '使用基于文件的存储方式（YAML/JSON/HOCON）时，是否监控数据文件变动并在被外部修改后自动刷新重载。',
  },
  'messaging-service': {
    title: '跨服消息通知服务',
    description: '用于在集群/跨服网络中各子服之间实时同步权限变更通知的消息通道：\n- auto: 自动尝试根据已有的 redis 或 sql 设置进行配置\n- redis: 使用 Redis 的 Pub/Sub 发布订阅功能进行实时跨服同步（强烈推荐）\n- sql: 使用 MySQL/MariaDB 数据表队列进行通知（仅在存储为 MySQL 时生效）\n- pluginmsg: 通过 BungeeCord/Velocity 插件消息通道通知代理和子服\n- rabbitmq: 使用 RabbitMQ 消息队列\n- nats: 使用 NATS 消息发布订阅',
    options: [
      { value: 'auto', label: '自动检测 (auto)' },
      { value: 'redis', label: 'Redis 发布订阅 (推荐)' },
      { value: 'sql', label: 'SQL 数据表队列' },
      { value: 'pluginmsg', label: 'Bungee/Velocity 插件通道' },
      { value: 'rabbitmq', label: 'RabbitMQ 消息队列' },
      { value: 'nats', label: 'NATS 消息队列' },
      { value: 'lilypad', label: 'LilyPad 跨服通道' },
      { value: 'notsql', label: '禁用 SQL 消息通道' },
    ],
  },
  'auto-push-updates': {
    title: '自动推送命令更新',
    description: '当管理员在服务器中使用命令修改权限后，是否自动通过消息服务向其他相连服务器广播同步通知。',
  },
  'push-log-entries': {
    title: '跨服推送操作日志',
    description: '是否通过消息服务将本服务器上的权限操作审计日志同步推送到其他服务器。',
  },
  'broadcast-received-log-entries': {
    title: '广播接收到的跨服日志',
    description: '是否向当前服务器上有权限的管理员广播从其他服务器接收到的权限操作日志。',
  },
  'redis': {
    title: 'Redis 消息连接配置',
    description: '用于跨服权限实时推送的 Redis 服务连接配置。',
  },
  'nats': {
    title: 'NATS 消息连接配置',
    description: '用于跨服权限实时推送的 NATS 服务连接配置。',
  },
  'rabbitmq': {
    title: 'RabbitMQ 消息连接配置',
    description: '用于跨服权限实时推送的 RabbitMQ 服务连接配置。',
  },

  // 4. 自定义与行为微调 (Customization Settings)
  'temporary-add-behaviour': {
    title: '临时权限累加行为',
    description: '当重复添加具有有效期的临时权限或父组时的合并策略：\n- accumulate: 累加时长（新时长追加到现有到期时间上）\n- replace: 替换（若新时长更晚，则更新为新的到期时间）\n- deny: 拒绝（若已存在同节点直接报错失败）',
    options: [
      { value: 'deny', label: '拒绝重复添加 (默认)' },
      { value: 'accumulate', label: '累加时长 (累加到当前到期时间)' },
      { value: 'replace', label: '替换更新 (以较长时长覆盖)' },
    ],
  },
  'primary-group-calculation': {
    title: '主权限组判定计算规则',
    description: 'LuckPerms 如何确定玩家的 Primary Group（主权限组）：\n- parents-by-weight: 按玩家直接继承的父组中权重最高的一个作为主组（官方推荐）\n- all-parents-by-weight: 递归计算所有直接和间接继承的父组，取权重最高者\n- stored: 直接使用数据记录中显式写入的主组字段',
    options: [
      { value: 'parents-by-weight', label: '按直接最高权重父组计算 (推荐)' },
      { value: 'all-parents-by-weight', label: '递归计算所有继承父组最高权重' },
      { value: 'stored', label: '读取数据库显式记录的主组' },
    ],
  },
  'argument-based-command-permissions': {
    title: '基于参数的命令细粒度权限',
    description: '是否对 LP 命令的参数进行额外的动态权限检查，允许更精确地控制管理员可操作的组与参数。',
  },
  'require-sender-group-membership-to-modify': {
    title: '需要成员资格才能修改组',
    description: '是否要求命令执行者自身必须属于某权限组，才能够修改该组的数据或增删该组成员。',
  },
  'log-notify': {
    title: '权限变动管理通知',
    description: '当权限被修改时，是否向具备对应通知权限的管理人员发送游戏内聊天通知。',
  },
  'log-notify-filtered-descriptions': {
    title: '通知过滤正则列表',
    description: '不想向管理员广播通知的日志正则表达式列表（匹配者将被忽略）。',
  },
  'auto-install-translations': {
    title: '自动下载语言翻译包',
    description: 'LuckPerms 是否自动从官方网络下载并定期更新最新的语言本地化翻译文件。',
  },
  'meta-formatting': {
    title: '前缀/后缀称号堆叠规则 (Prefix & Suffix)',
    description: '用于聊天或称号展示中，当玩家继承或拥有多个前缀/后缀时的格式化与堆叠合并机制。',
  },
  'meta-formatting.prefix': {
    title: '前缀 (Prefix) 堆叠格式',
    description: '玩家前缀的合并规则、去重策略与前后分隔符配置。',
  },
  'meta-formatting.prefix.duplicates': {
    title: '重复前缀处理规则',
    description: '当玩家继承到重复前缀时的处理方式：\n- first-only: 仅保留第一个\n- last-only: 仅保留最后一个\n- retain-all: 保留全部重复项',
    options: [
      { value: 'first-only', label: '仅保留首个 (默认)' },
      { value: 'last-only', label: '仅保留最后一个' },
      { value: 'retain-all', label: '保留所有' },
    ],
  },
  'meta-formatting.suffix': {
    title: '后缀 (Suffix) 堆叠格式',
    description: '玩家后缀的合并规则、去重策略与前后分隔符配置。',
  },
  'meta-formatting.suffix.duplicates': {
    title: '重复后缀处理规则',
    description: '当玩家继承到重复后缀时的处理方式：\n- first-only: 仅保留第一个\n- last-only: 仅保留最后一个\n- retain-all: 保留全部重复项',
    options: [
      { value: 'first-only', label: '仅保留首个 (默认)' },
      { value: 'last-only', label: '仅保留最后一个' },
      { value: 'retain-all', label: '保留所有' },
    ],
  },

  // 5. 权限计算与继承体系 (Permission Calculation & Inheritance)
  'inheritance-traversal-algorithm': {
    title: '继承树遍历算法',
    description: 'LuckPerms 沿权限继承树解析权限时的算法：\n- depth-first-pre-order: 深度优先前序遍历（默认，推荐）\n- depth-first-post-order: 深度优先后序遍历\n- breadth-first: 广度优先遍历',
    options: [
      { value: 'depth-first-pre-order', label: '深度优先前序遍历 (默认推荐)' },
      { value: 'depth-first-post-order', label: '深度优先后序遍历' },
      { value: 'breadth-first', label: '广度优先遍历' },
    ],
  },
  'post-traversal-inheritance-sort': {
    title: '遍历后根据规则重排序',
    description: '是否在遍历解析完成后，根据组权重和上下文自然顺序对节点重新排序。',
  },
  'context-satisfy-mode': {
    title: '上下文满足判定模式',
    description: '判定一组 Context（上下文键值）是否满足要求的模式：\n- at-least-one-value-per-key: 每个键至少命中一个指定值即满足\n- all-values-per-key: 必须命中所有指定值才满足',
    options: [
      { value: 'at-least-one-value-per-key', label: '至少满足一个值 (默认)' },
      { value: 'all-values-per-key', label: '必须满足所有值' },
    ],
  },
  'disabled-contexts': {
    title: '禁用的内置上下文',
    description: '禁用的 LuckPerms 原生上下文键名列表（如填入 "world" 将禁用世界维度上下文计算）。',
  },
  'include-global': {
    title: '应用全局服务器权限',
    description: '是否允许无特定 server 限制的全局权限在此服务器上生效。设为 false 则仅当前服务器专有权限生效。',
  },
  'include-global-world': {
    title: '应用全局世界权限',
    description: '是否允许无特定 world 限制的全局世界权限生效。',
  },
  'apply-global-groups': {
    title: '应用全局权限组',
    description: '是否在此服务器上应用无 server 限制的全局权限组继承。',
  },
  'apply-global-world-groups': {
    title: '应用全局世界组',
    description: '是否在此服务器上应用无 world 限制的全局世界组继承。',
  },
  'meta-value-selection-default': {
    title: '默认元数据选择方式',
    description: '当存在多个相同 Meta 键时选取值的规则：\n- inheritance: 优先使用最先继承到的值\n- highest-number: 选取数值最高的值\n- lowest-number: 选取数值最低的值',
    options: [
      { value: 'inheritance', label: '按最先继承顺序选取 (默认)' },
      { value: 'highest-number', label: '选取数值最大的值' },
      { value: 'lowest-number', label: '选取数值最小的值' },
    ],
  },
  'meta-value-selection': {
    title: '特定 Meta 键选择规则',
    description: '针对特定键名自定义的值选取规则（例如 max-homes: highest-number）。',
  },
  'apply-wildcards': {
    title: '应用通配符权限 (*)',
    description: '是否解析并生效通配符权限节点（例如 essentials.* 将展开并赋予该插件所有已注册子权限）。',
  },
  'apply-sponge-implicit-wildcards': {
    title: 'Sponge 隐式通配符继承',
    description: '如果拥有父权限是否隐式获得其下所有子权限（Sponge 体系特性，Bukkit 平台一般保持 false）。',
  },
  'apply-default-negated-permissions-before-wildcards': {
    title: '通配符前优先应用默认否定权限',
    description: '针对插件特别声明不给予 OP 的反向保护权限，是否在计算通配符前优先应用否定。',
  },
  'apply-regex': {
    title: '应用正则表达式权限 (r=)',
    description: '是否识别并支持以 "r=" 开头的正则表达式权限节点。',
  },
  'apply-shorthand': {
    title: '应用花括号简写模式',
    description: '是否支持花括号展开简写格式（如 foo.{bar,baz} 将自动展开）。',
  },
  'apply-bukkit-child-permissions': {
    title: '应用 Bukkit 子权限系统',
    description: '是否解析插件 plugin.yml 中定义的 parent-child 子权限继承树映射。',
  },
  'apply-bukkit-default-permissions': {
    title: '应用 Bukkit 默认权限',
    description: '是否应用插件默认赋予所有玩家（default: true）或默认赋予 OP 的权限配置。',
  },
  'apply-bukkit-attachment-permissions': {
    title: '应用其他插件附加权限',
    description: '是否包含其他插件通过 PermissionAttachment 机制临时动态附加在玩家身上的权限。',
  },
  'disabled-context-calculators': {
    title: '跳过的上下文计算器',
    description: '填写 Java 类全名或包路径以禁用指定的上下文计算处理器。',
  },
  'world-rewrite': {
    title: '世界名称重写别名',
    description: '在进行上下文匹配时为指定世界映射别名（如 world_nether 别名为 world）。',
  },
  'group-weight': {
    title: '本服务器专有权限组权重',
    description: '覆盖特定权限组在本服务器上的权重数值（如 admin: 10）。',
  },

  // 6. 微调与高级配置 (Fine Tuning Options)
  'enable-ops': {
    title: '允许管理员 (OP) 系统存在',
    description: '控制服务端是否允许 OP 机制存在。\n- 设为 false 时，所有玩家将被取消 OP（deop），且 /op 和 /deop 命令将被禁用。\n- 提示：原版出生点保护（spawn-protection）等特性依赖 OP 才能绕过。',
  },
  'auto-op': {
    title: '基于权限的自动 OP 机制',
    description: '是否启用基于权限节点的自动 OP 系统。\n- 设为 true 时，拥有 "luckperms.autoop" 权限的玩家将自动获得 OP 身份，其余未授权者会被 deop，且原版 op/deop 命令将被禁用。\n- 推荐用于需要按服务器/临时分配 OP 的严谨权限网络。',
  },
  'commands-allow-op': {
    title: 'OP 玩家默认允许使用 LP 命令',
    description: '是否允许拥有原版 OP 身份的玩家默认直接使用所有 LuckPerms 命令。若设为 false，则必须单独给予其 LP 命令权限。',
  },
  'vault-unsafe-lookups': {
    title: '允许主线程不安全 Vault 离线查询',
    description: '是否允许第三方插件在服务端主线程中执行可能导致严重卡顿的离线玩家 Vault 数据读取操作。强烈建议保持 false。',
  },
  'vault-group-use-displaynames': {
    title: 'Vault 返回权限组显示名称',
    description: '当其他插件通过 Vault API 获取玩家所在权限组时，是否返回组的 Display Name（显示别名）而非内部组 ID。',
  },
  'vault-npc-group': {
    title: 'Vault NPC 回退权限组',
    description: '当插件对 NPC（如 Citizens 假人）进行 Vault 权限检查时回退使用的权限组名，默认为 default。',
  },
  'vault-npc-op-status': {
    title: 'Vault NPC 视作 OP',
    description: '在处理 NPC 玩家的权限检查时，是否将其视作拥有 OP 身份。',
  },
  'use-vault-server': {
    title: '使用独立的 Vault 服务器标识',
    description: '是否在 Vault 权限操作中使用独立的服务器上下文名称（而非最上方的 server 项）。',
  },
  'vault-server': {
    title: 'Vault 专属服务器名',
    description: '当 use-vault-server 为 true 时生效的服务器名称标识，设为 "global" 表示不区分服务器。',
  },
  'vault-include-global': {
    title: 'Vault 包含全局权限',
    description: '通过 Vault 查询元数据或玩家组时是否包含全局服务器的权限。',
  },
  'vault-ignore-world': {
    title: 'Vault 忽略世界参数',
    description: 'Vault 权限查询时是否忽略传入的世界参数，视所有世界为同一环境。',
  },
  'debug-logins': {
    title: '登录处理调试输出',
    description: '在玩家进服登录及 UUID 权限加载时，是否在控制台打印详细的内部调试日志。排查进服卡顿或 UUID 映射问题时可开启。',
  },
  'allow-invalid-usernames': {
    title: '允许特殊字符玩家用户名',
    description: '是否允许带有除字母、数字、下划线以外非标准字符的用户名（仍受 16 字符长度限制）。',
  },
  'skip-bulkupdate-confirmation': {
    title: '跳过批量更新确认',
    description: '执行批量更新（/lp bulkupdate）时是否跳过二次确认。由于该操作具有不可逆性，通常建议保持 false。',
  },
  'disable-bulkupdate': {
    title: '完全禁用批量更新',
    description: '是否完全封禁游戏内及控制台执行批量更新命令的能力，防止误操作破坏数据库。',
  },
  'prevent-primary-group-removal': {
    title: '防止移除主权限组',
    description: '当管理员尝试使用 parent remove 移除玩家当前的主权限组时，是否自动将主组重置回 default 从而防止玩家失去主组。',
  },
  'update-client-command-list': {
    title: '实时向客户端同步命令补全列表',
    description: '当玩家权限发生变动后，是否立即向客户端发送数据包更新 Tab 键命令自动补全列表。',
  },
  'register-command-list-data': {
    title: '注册 Brigadier 命令数据',
    description: '是否尝试为 LP 命令注册现代化 Brigadier 丰富参数类型提示与补全。',
  },
  'resolve-command-selectors': {
    title: '解析原版目标选择器 (@a, @p)',
    description: '在 LP 命令参数中是否支持并展开 Minecraft 原版目标选择器（如 @a 全部玩家、@p 最近玩家）。',
  },
};

export const luckpermsDefinition: PluginConfigDocDefinition = {
  pluginNames: ['luckperms', 'lp'],
  fileNames: ['config.yml', 'config.yaml', 'config.conf', 'luckperms.conf'],
  docs: luckpermsConfigDocs,
};

export default luckpermsDefinition;
