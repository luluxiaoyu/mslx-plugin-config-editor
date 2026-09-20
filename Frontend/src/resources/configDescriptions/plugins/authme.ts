import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

const BACKEND_OPTIONS = [
  { value: 'SQLITE', label: 'SQLite 本地数据库 (默认，单人/小服推荐)' },
  { value: 'MYSQL', label: 'MySQL 远程数据库' },
  { value: 'MARIADB', label: 'MariaDB 远程数据库' },
  { value: 'POSTGRESQL', label: 'PostgreSQL 远程数据库' },
];

const PASSWORD_HASH_OPTIONS = [
  { value: 'SHA256', label: 'SHA256 (默认，兼容性最好，推荐)' },
  { value: 'ARGON2', label: 'ARGON2 (安全性最高，需系统安装 argon2 库)' },
  { value: 'BCRYPT', label: 'BCrypt (安全性较高)' },
  { value: 'BCRYPT2Y', label: 'BCrypt 2Y (BCrypt 变种)' },
  { value: 'PBKDF2', label: 'PBKDF2 (迭代次数见 pbkdf2Rounds)' },
  { value: 'SALTEDSHA512', label: 'SaltedSHA512 (加盐 SHA512)' },
  { value: 'PHPBB', label: 'phpBB 论坛兼容' },
  { value: 'MYBB', label: 'MyBB 论坛兼容' },
  { value: 'WORDPRESS', label: 'WordPress 兼容' },
  { value: 'XENFORO', label: 'XenForo 论坛兼容' },
  { value: 'CUSTOM', label: 'CUSTOM 自定义算法 (仅限开发者)' },
];

const SPEED_RESTORE_OPTIONS = [
  { value: 'RESTORE', label: 'RESTORE 恢复玩家原有速度' },
  { value: 'DEFAULT', label: 'DEFAULT 始终设为默认速度' },
  { value: 'MAX_RESTORE', label: 'MAX_RESTORE 取当前速度与原速度的最大值' },
  { value: 'RESTORE_NO_ZERO', label: 'RESTORE_NO_ZERO 恢复原速度，为 0 时设为默认 (推荐)' },
];

/**
 * AuthMe (AuthMeReloaded) config.yml 中文对照字典
 */
export const authmeConfigDocs: ConfigDocMap = {
  // 1. 数据源设置 (DataSource)
  'DataSource': {
    title: '数据源设置',
    description: 'AuthMe 存储玩家账号数据（密码、邮箱、登录状态等）的数据库配置。\n单机小服用默认 SQLITE 即可；群组服或多端互通请使用 MySQL/MariaDB。',
  },
  'DataSource.backend': {
    title: '数据库类型',
    description: '账号数据的存储后端。\n- 默认 SQLITE，无需额外配置，适合单服务器。\n- 使用 BungeeCord/Velocity 群组或网站对接时，应改用 MYSQL / MARIADB / POSTGRESQL，并关闭下方 caching。',
    options: BACKEND_OPTIONS,
  },
  'DataSource.caching': {
    title: '启用数据库缓存',
    description: '是否在内存中缓存账号数据以减少数据库查询。\n- 默认 true。\n- 在 BungeeCord 群组环境或有网站同时读写数据库时必须设为 false，否则会出现数据不同步。',
  },
  'DataSource.mySQLHost': {
    title: '数据库主机地址',
    description: '远程数据库的服务器地址，默认 127.0.0.1（本机）。仅使用 MYSQL/MARIADB/POSTGRESQL 时生效。',
  },
  'DataSource.mySQLPort': {
    title: '数据库端口',
    description: '远程数据库端口，MySQL/MariaDB 默认 3306，PostgreSQL 默认 5432。注意该项是字符串，需加引号。',
  },
  'DataSource.mySQLUseSSL': {
    title: '数据库使用 SSL 连接',
    description: '是否通过 SSL 加密连接数据库，默认 true。若数据库未开启 SSL 导致连接失败，可设为 false。',
  },
  'DataSource.mySQLCheckServerCertificate': {
    title: '校验数据库服务器证书',
    description: '是否校验数据库的 SSL 证书。\n⚠️ 不建议设为 false，仅在明确知道风险（如自签名证书）时才可关闭。',
  },
  'DataSource.mySQLAllowPublicKeyRetrieval': {
    title: '允许获取 RSA 公钥',
    description: '允许客户端向数据库服务器获取 RSA 公钥的高级选项，不懂请勿修改。',
  },
  'DataSource.mySQLUsername': {
    title: '数据库用户名',
    description: '连接数据库使用的账号，默认 authme。',
  },
  'DataSource.mySQLPassword': {
    title: '数据库密码',
    description: '连接数据库使用的密码。请务必修改为强密码，不要使用默认的 12345！',
  },
  'DataSource.mySQLDatabase': {
    title: '数据库名称',
    description: '存储 AuthMe 数据的数据库名，默认 authme。使用 SQLITE 时作为本地数据库文件名。',
  },
  'DataSource.mySQLTablename': {
    title: '数据表名',
    description: '存储账号数据的表名，默认 authme。与论坛/CMS 共用数据库时可修改以对接。',
  },
  'DataSource.mySQLColumnId': {
    title: 'ID 列名',
    description: '用于排序数据的自增 ID 列名，默认 id。对接已有网站数据库时才需要修改。',
  },
  'DataSource.mySQLColumnName': {
    title: '玩家名列名',
    description: '存储/校验玩家昵称的列名，默认 username。',
  },
  'DataSource.mySQLRealName': {
    title: '真实玩家名列名',
    description: '存储玩家真实大小写昵称（RealName）的列名，默认 realname。',
  },
  'DataSource.mySQLColumnPassword': {
    title: '密码列名',
    description: '存储玩家密码哈希的列名，默认 password。',
  },
  'DataSource.mySQLColumnSalt': {
    title: '密码盐列名',
    description: '存储密码盐值（salt）的列名。部分论坛算法（如 phpBB）需要单独的盐列，不需要时留空。',
  },
  'DataSource.mySQLColumnEmail': {
    title: '邮箱列名',
    description: '存储玩家绑定邮箱的列名，默认 email。',
  },
  'DataSource.mySQLColumnLogged': {
    title: '登录状态列名',
    description: '标记玩家是否已登录的列名，默认 isLogged。网站对接时可据此判断玩家在线状态。',
  },
  'DataSource.mySQLColumnHasSession': {
    title: '会话状态列名',
    description: '标记玩家是否拥有有效会话的列名，默认 hasSession。',
  },
  'DataSource.mySQLtotpKey': {
    title: '二步验证密钥列名',
    description: '存储玩家 TOTP 二步验证密钥的列名，默认 totp。',
  },
  'DataSource.mySQLColumnIp': {
    title: '最后 IP 列名',
    description: '存储玩家最后登录 IP 的列名，默认 ip。',
  },
  'DataSource.mySQLColumnLastLogin': {
    title: '最后登录时间列名',
    description: '存储玩家最后登录时间戳的列名，默认 lastlogin。',
  },
  'DataSource.mySQLColumnRegisterDate': {
    title: '注册日期列名',
    description: '存储账号注册日期的列名，默认 regdate。',
  },
  'DataSource.mySQLColumnRegisterIp': {
    title: '注册 IP 列名',
    description: '存储注册时 IP 地址的列名，默认 regip。',
  },
  'DataSource.mySQLlastlocX': {
    title: '下线位置 X 列名',
    description: '存储玩家下线位置 X 坐标的列名，默认 x。需开启 settings.restrictions.SaveQuitLocation。',
  },
  'DataSource.mySQLlastlocY': {
    title: '下线位置 Y 列名',
    description: '存储玩家下线位置 Y 坐标的列名，默认 y。',
  },
  'DataSource.mySQLlastlocZ': {
    title: '下线位置 Z 列名',
    description: '存储玩家下线位置 Z 坐标的列名，默认 z。',
  },
  'DataSource.mySQLlastlocWorld': {
    title: '下线位置世界列名',
    description: '存储玩家下线时所在世界名的列名，默认 world。',
  },
  'DataSource.mySQLlastlocYaw': {
    title: '下线位置偏航角列名',
    description: '存储玩家下线时视角偏航角 (Yaw) 的列名，默认 yaw。',
  },
  'DataSource.mySQLlastlocPitch': {
    title: '下线位置俯仰角列名',
    description: '存储玩家下线时视角俯仰角 (Pitch) 的列名，默认 pitch。',
  },
  'DataSource.mySQLPlayerUUID': {
    title: '玩家 UUID 列名',
    description: '存储玩家 UUID 的列名（可选），默认留空不启用。',
  },
  'DataSource.mySQLColumnPremiumUUID': {
    title: '正版 UUID 列名',
    description: '存储正版玩家 Mojang UUID 的列名，默认 premiumUUID。未开启正版验证的玩家该列为空。',
  },
  'DataSource.poolSize': {
    title: '数据库连接池大小',
    description: '数据库连接池的最大连接数，默认 10。人数很多的服务器可适当调大。',
  },
  'DataSource.maxLifetime': {
    title: '连接最大生命周期 (秒)',
    description: '连接池中单个连接的最长存活时间，默认 1800 秒。\n应至少比数据库的 wait_timeout 小 30 秒，否则可能出现连接被数据库断开的报错。',
  },

  // 2. 外部论坛/CMS 对接 (ExternalBoardOptions)
  'ExternalBoardOptions': {
    title: '外部论坛/CMS 对接设置',
    description: '与 phpBB、XenForo、WordPress 等外部网站程序共用账号数据时的对接配置。纯游戏服无需修改。',
  },
  'ExternalBoardOptions.mySQLColumnGroup': {
    title: '用户组列名',
    description: '存储玩家用户组的列名，默认留空不启用。',
  },
  'ExternalBoardOptions.nonActivedUserGroup': {
    title: '未激活用户组 ID',
    description: '仅允许已激活账号登录时，填写论坛中"未激活用户"的组 ID。-1 表示禁用该功能。',
  },
  'ExternalBoardOptions.mySQLOtherUsernameColumns': {
    title: '其他用户名列',
    description: '除主用户名列外，还需要同步写入玩家名的其他列（区分大小写），用于某些论坛结构。',
  },
  'ExternalBoardOptions.bCryptLog2Round': {
    title: 'BCrypt 加密轮数',
    description: 'BCrypt 的 log2 轮数，默认 12。数值越大越安全但越慢，不懂请勿修改。',
  },
  'ExternalBoardOptions.phpbbTablePrefix': {
    title: 'phpBB 表前缀',
    description: 'phpBB 安装时设置的表前缀，默认 phpbb_。',
  },
  'ExternalBoardOptions.phpbbActivatedGroupId': {
    title: 'phpBB 已激活组 ID',
    description: 'phpBB 中默认注册用户组的 ID，默认 2。',
  },
  'ExternalBoardOptions.IPBTablePrefix': {
    title: 'IP Board 表前缀',
    description: 'IP Board 安装时设置的表前缀，默认 ipb_。',
  },
  'ExternalBoardOptions.IPBActivatedGroupId': {
    title: 'IP Board 已激活组 ID',
    description: 'IP Board 中默认注册用户组的 ID，默认 3。',
  },
  'ExternalBoardOptions.XFTablePrefix': {
    title: 'XenForo 表前缀',
    description: 'XenForo 安装时设置的表前缀，默认 xf_。',
  },
  'ExternalBoardOptions.XFActivatedGroupId': {
    title: 'XenForo 已激活组 ID',
    description: 'XenForo 中默认注册用户组的 ID，默认 2。',
  },
  'ExternalBoardOptions.wordpressTablePrefix': {
    title: 'WordPress 表前缀',
    description: 'WordPress 安装时设置的表前缀，默认 wp_。',
  },

  // 3. 基础设置 (settings)
  'settings': {
    title: '基础设置',
    description: 'AuthMe 的核心行为配置，包括会话、消息语言、登录限制、注册、密码安全等子节。',
  },
  'settings.sessions': {
    title: '会话 (免密登录) 设置',
    description: '会话功能：玩家登录成功后记住其 IP，短时间内同 IP 再次进服无需重新登录。',
  },
  'settings.sessions.enabled': {
    title: '启用会话功能',
    description: '开启后玩家登录成功会记录 IP 和昵称，超时时间内同 IP 再进服可免密登录。\n⚠️ 默认 false。对使用动态 IP 的玩家体验提升有限；对安全性要求极高的服务器建议保持关闭。',
  },
  'settings.sessions.timeout': {
    title: '会话超时时间 (分钟)',
    description: '会话的有效时长，默认 10 分钟。超时或 IP 变动后会话即失效，需要重新登录。',
  },
  'settings.messagesLanguage': {
    title: '消息语言',
    description: 'AuthMe 提示消息的语言代码（如 en、zhcn）。\n可用语言列表见官方 translations 文档。中文服主请填 zhcn（简体中文）或 zhhk/zhtw。',
  },
  'settings.perPlayerLocale': {
    title: '按玩家客户端语言发送消息',
    description: '开启后按每位玩家的客户端语言发送提示，无对应语言时回退到 messagesLanguage。\n希望所有玩家看到统一语言时设为 false。',
  },
  'settings.forceVaultHook': {
    title: '强制挂钩 Vault 权限',
    description: '强制 AuthMe 通过 Vault 而非特定权限插件的接口来处理权限组，默认 false。一般无需修改。',
  },
  'settings.logLevel': {
    title: '日志级别',
    description: 'AuthMe 输出日志的详细程度。\n- INFO：只输出常规消息\n- FINE：额外输出细节（如密码错误），默认值\n- DEBUG：排错用的调试日志',
    options: [
      { value: 'INFO', label: 'INFO 常规消息' },
      { value: 'FINE', label: 'FINE 详细消息 (默认)' },
      { value: 'DEBUG', label: 'DEBUG 调试模式' },
    ],
  },
  'settings.useAsyncTasks': {
    title: '异步执行认证任务',
    description: '是否将密码哈希、数据库查询等耗时操作放到异步线程执行。\n强烈建议保持 true（默认），否则每次登录/注册都会造成主线程卡顿，使用 Argon2/BCrypt 或远程数据库时尤为明显。',
  },
  'settings.serverName': {
    title: '服务器名称',
    description: '服务器显示名，用于部分消息占位符（如欢迎消息中的 {SERVER}）。',
  },


  // 4. 登录限制 (settings.restrictions)
  'settings.restrictions': {
    title: '登录限制设置',
    description: '未登录/未注册玩家的行为限制，是 AuthMe 保护服务器的核心部分。',
  },
  'settings.restrictions.allowChat': {
    title: '允许未登录玩家聊天',
    description: '是否允许未登录的玩家发言，默认 false。\n⚠️ 注意：此功能同时也会拦截所有未列在 allowCommands 中的命令。开启有安全风险，建议保持关闭。',
  },
  'settings.restrictions.hideChat': {
    title: '对未登录玩家隐藏聊天',
    description: '是否让未登录玩家看不到聊天内容，防止进服即被聊天刷屏。',
  },
  'settings.restrictions.allowCommands': {
    title: '未登录可用命令白名单',
    description: '未登录玩家允许执行的命令列表，默认仅包含 /login、/register、/email、/captcha、/2fa 等认证命令。\n⚠️ 随意添加其他命令可能被利用绕过登录保护，请谨慎。',
  },
  'settings.restrictions.maxRegPerIp': {
    title: '每个 IP 最大注册数',
    description: '同一 IP 允许注册的账号数量上限，默认 1。设为 0 表示不限制（不推荐，易被批量注册小号）。',
  },
  'settings.restrictions.minNicknameLength': {
    title: '最小用户名长度',
    description: '允许进服的最短用户名长度，默认 3。',
  },
  'settings.restrictions.maxNicknameLength': {
    title: '最大用户名长度',
    description: '允许进服的最长用户名长度，默认 16（Minecraft 官方上限）。',
  },
  'settings.restrictions.ForceSingleSession': {
    title: '强制单人会话',
    description: '开启后在线玩家不会因"从其他位置登录"而被踢出，可防止同名抢号等安全漏洞，强烈建议保持 true。',
  },
  'settings.restrictions.ForceSpawnLocOnJoin': {
    title: '强制回出生点设置',
    description: '登录成功后把指定世界中的玩家强制传送到出生点，并覆盖其下线位置。\n与 teleportUnAuthedToSpawn（进服即传送）不同，此项是登录后传送。',
  },
  'settings.restrictions.ForceSpawnLocOnJoin.enabled': {
    title: '启用强制回出生点',
    description: '开启后，下方 worlds 列表中的世界里登录的玩家会被传送回出生点。主城服/登录服常用。',
  },
  'settings.restrictions.ForceSpawnLocOnJoin.worlds': {
    title: '强制回出生点的世界列表',
    description: '需要强制传送出生点的世界名列表（区分大小写）。',
  },
  'settings.restrictions.SaveQuitLocation': {
    title: '保存下线位置',
    description: '是否保存玩家退出时的坐标，下次登录后传送回原地。默认 false。\n若配合 ForceSpawnLocOnJoin 使用请保持关闭，避免冲突。',
  },
  'settings.restrictions.AllowRestrictedUser': {
    title: '启用受限用户功能',
    description: '开启后，AllowedRestrictedUser 中列出的账号只能从指定 IP 登录，常用于保护管理号。',
  },
  'settings.restrictions.AllowedRestrictedUser': {
    title: '受限用户 IP 绑定列表',
    description: '格式："玩家名;IP"，支持 * 通配符（如 127.0.0.*）或以 regex: 开头的正则。\n名称不区分大小写。例：admin;127.0.0.1',
  },
  'settings.restrictions.banUnsafedIP': {
    title: '封禁受限账号的异常 IP',
    description: '是否直接封禁尝试用受限用户名从不匹配 IP 登录的地址。默认 false，仅踢出。',
  },
  'settings.restrictions.kickNonRegistered': {
    title: '踢出未注册玩家',
    description: '是否立即踢出未注册的进服玩家。默认 false。\n开启后相当于封闭注册的服务器（白名单制），请确认已关闭公开注册或有其他注册渠道。',
  },
  'settings.restrictions.kickOnWrongPassword': {
    title: '密码错误时踢出',
    description: '玩家输错登录密码时是否将其踢出服务器，默认 true。',
  },
  'settings.restrictions.teleportUnAuthedToSpawn': {
    title: '未登录传送到出生点',
    description: '玩家进服未登录时是否先传送到出生点，登录后再传送回原位置。可防止他人在下线位置蹲守。',
  },
  'settings.restrictions.allowMovement': {
    title: '允许未登录玩家移动',
    description: '是否允许未登录玩家走动，默认 false。\n⚠️ 开启有安全风险（可能配合漏洞利用），仅在特殊需求（如登录大厅需走动）时开启，并配合 allowedMovementRadius 限制范围。',
  },
  'settings.restrictions.loginTimeout': {
    title: '登录超时时间 (秒)',
    description: '玩家进服后多少秒内未完成登录将被踢出，默认 30 秒。设为 0 禁用。',
  },
  'settings.restrictions.registerTimeout': {
    title: '注册超时时间 (秒)',
    description: '新玩家进服后多少秒内未完成注册将被踢出，默认 30 秒。设为 0 禁用。',
  },
  'settings.restrictions.allowedNicknameCharacters': {
    title: '允许的用户名字符 (正则)',
    description: '用户名允许包含的字符正则，默认 [a-zA-Z0-9_]*（仅字母数字下划线）。\n想允许中文名可改成更宽松的正则，但可能与部分插件不兼容。',
  },
  'settings.restrictions.allowedMovementRadius': {
    title: '未登录移动范围半径',
    description: '未登录玩家可活动的半径（格），默认 100。设为 0 表示不限制。仅在 allowMovement 为 true 时生效。',
  },
  'settings.restrictions.ProtectInventoryBeforeLogIn': {
    title: '登录前保护背包',
    description: '登录前隐藏/保护玩家背包物品，防止窥屏或物品复制漏洞，默认 true。需要安装 PacketEvents 插件。',
  },
  'settings.restrictions.DenyTabCompleteBeforeLogin': {
    title: '登录前禁用 Tab 补全',
    description: '登录前是否禁用命令 Tab 自动补全，防止探测服务器命令。需要安装 PacketEvents 插件。',
  },
  'settings.restrictions.displayOtherAccounts': {
    title: '显示同 IP 其他账号',
    description: '玩家进服时是否向拥有 authme.admin.accounts 权限的管理员显示该玩家的其他小号。',
  },
  'settings.restrictions.spawnPriority': {
    title: '出生点优先级',
    description: 'AuthMe 确定出生点位置的插件优先级顺序，逗号分隔。\n- authme：使用 AuthMe 自己设置的出生点\n- essentials / cmi / multiverse：使用对应插件的出生点\n- default：世界默认出生点\n- server：应用世界 spawnRadius 规则（随机落点）',
  },
  'settings.restrictions.maxLoginPerIp': {
    title: '每个 IP 最大登录数',
    description: '同一 IP 同时登录的账号数上限，默认 0（不限制）。可有效防止多开小号。',
  },
  'settings.restrictions.maxJoinPerIp': {
    title: '每个 IP 最大进服数',
    description: '同一 IP 同时加入服务器的连接数上限（含未登录），默认 0（不限制）。',
  },
  'settings.restrictions.noTeleport': {
    title: '完全禁止 AuthMe 传送玩家',
    description: '设为 true 后 AuthMe 永远不会传送玩家（包括登录前后）。\n⚠️ 会同时使 teleportUnAuthedToSpawn 和 ForceSpawnLocOnJoin 失效。',
  },
  'settings.restrictions.allowedPasswordCharacters': {
    title: '允许的密码字符 (正则)',
    description: '密码允许包含的字符正则，默认 [!-~]*（所有可见 ASCII 字符），推荐保持默认。\n可在 regex101.com 测试正则。',
  },
  'settings.GameMode': {
    title: '游戏模式设置',
    description: '玩家进服时的游戏模式处理。',
  },
  'settings.GameMode.ForceSurvivalMode': {
    title: '强制生存模式',
    description: '玩家进服时是否强制切换为生存模式，默认 false。生存服建议开启以防权限配置失误。',
  },
  'settings.unrestrictions': {
    title: '免登录白名单',
    description: '让指定账号或容器界面绕过登录验证，主要用于兼容 MOD 假人（如 BuildCraft 机器人）。',
  },
  'settings.unrestrictions.UnrestrictedName': {
    title: '免登录账号名单',
    description: '列表中的账号名（不区分大小写）无需注册/登录即可游戏。\n⚠️ 高风险选项！任何人使用这些名字进服都无需验证，仅用于 MOD/NPC 假人，切勿填入真实玩家名。',
  },
  'settings.unrestrictions.UnrestrictedInventories': {
    title: '免登录容器界面名单',
    description: '列表中的容器界面名（不区分大小写）在未登录时也能打开。\n⚠️ 自行承担风险，仅用于兼容某些 MOD。',
  },


  // 5. 密码安全 (settings.security)
  'settings.security': {
    title: '密码安全设置',
    description: '密码长度限制、加密算法与弱密码黑名单等。',
  },
  'settings.security.minPasswordLength': {
    title: '密码最小长度',
    description: '注册密码的最短长度，默认 5。建议提高到 6-8 以提升账号安全性。',
  },
  'settings.security.passwordMaxLength': {
    title: '密码最大长度',
    description: '注册密码的最长长度，默认 30。',
  },
  'settings.security.passwordHash': {
    title: '密码加密算法',
    description: '密码的哈希加密算法，默认 SHA256。\n- SHA256：兼容性最好，适合需要与网站对接的场景\n- ARGON2：目前最安全，但需要系统安装 argon2 C 库\n- 更换算法后旧密码无法直接验证，可配合 legacyHashes 平滑迁移。\n完整算法列表见官方 hash_algorithms 文档。',
    options: PASSWORD_HASH_OPTIONS,
  },
  'settings.security.legacyHashes': {
    title: '旧算法兼容列表',
    description: '更换 passwordHash 算法后，在此填入旧算法名（如 SHA1）。\n玩家登录时若新算法验证失败会尝试旧算法，验证通过后自动迁移为新哈希。',
  },
  'settings.security.doubleMD5SaltLength': {
    title: 'SALTED2MD5 盐长度',
    description: '使用 SALTED2MD5（MD5(MD5(密码)+盐)）算法时的盐长度，默认 8。一般无需修改。',
  },
  'settings.security.pbkdf2Rounds': {
    title: 'PBKDF2 迭代轮数',
    description: 'passwordHash 设为 PBKDF2 时的迭代轮数，默认 10000。数值越大越安全但验证越慢。',
  },
  'settings.security.unsafePasswords': {
    title: '弱密码黑名单',
    description: '禁止使用的弱密码列表（必须全小写），注册或改密时命中即被拒绝。\n建议保留 help（避免与命令冲突）并补充常见弱密码如 123456、password、qwerty。',
  },

  // 6. 注册设置 (settings.registration)
  'settings.registration': {
    title: '注册设置',
    description: '玩家账号注册的方式与流程配置。',
  },
  'settings.registration.enabled': {
    title: '开启注册功能',
    description: '是否允许玩家注册账号，默认 true。\n⚠️ 关闭后新玩家无法自行注册（需配合 restrictions.kickNonRegistered 或管理员手动注册），相当于封闭服务器。',
  },
  'settings.registration.messageInterval': {
    title: '登录/注册提醒间隔 (秒)',
    description: '每隔多少秒向未认证玩家发送登录/注册提醒消息，默认 5 秒。',
  },
  'settings.registration.force': {
    title: '强制注册登录',
    description: '是否要求所有玩家必须注册并登录后才能游玩，默认 true。\n⚠️ 设为 false 后未登录玩家可自由游玩，服务器将失去账号保护，强烈不建议关闭。',
  },
  'settings.registration.type': {
    title: '注册方式',
    description: '- PASSWORD：玩家自行设置密码（默认，最常用）\n- EMAIL：玩家提供邮箱，系统生成密码并发送到邮箱（需配置好 Email 大节）',
    options: [
      { value: 'PASSWORD', label: 'PASSWORD 密码注册 (默认)' },
      { value: 'EMAIL', label: 'EMAIL 邮箱注册 (系统生成密码)' },
    ],
  },
  'settings.registration.secondArg': {
    title: '注册命令第二参数',
    description: '/register 命令的第二个参数要求：\n- NONE：不需要第二参数\n- CONFIRMATION：重复输入一次密码/邮箱确认（默认）\n- EMAIL_OPTIONAL：密码注册时可选择性填邮箱\n- EMAIL_MANDATORY：密码注册时必须填邮箱（便于找回密码）',
    options: [
      { value: 'NONE', label: 'NONE 无需第二参数' },
      { value: 'CONFIRMATION', label: 'CONFIRMATION 二次确认 (默认)' },
      { value: 'EMAIL_OPTIONAL', label: 'EMAIL_OPTIONAL 可选填邮箱' },
      { value: 'EMAIL_MANDATORY', label: 'EMAIL_MANDATORY 必须填邮箱' },
    ],
  },
  'settings.registration.forceKickAfterRegister': {
    title: '注册成功后踢出',
    description: '注册成功后是否把玩家踢出服务器，默认 false。不要与 forceLoginAfterRegister 同时使用。',
  },
  'settings.registration.forceLoginAfterRegister': {
    title: '注册后要求重新登录',
    description: '注册成功后是否要求玩家再执行一次 /login，默认 false。',
  },
  'settings.registration.dialog': {
    title: '登录/注册对话框设置',
    description: '新版 AuthMe 的图形化登录/注册对话框（Dialog UI）配置。',
  },
  'settings.registration.dialog.showForgotPasswordButton': {
    title: '显示"忘记密码"按钮',
    description: '在登录对话框中显示"忘记密码"按钮，点击后用填写的邮箱执行 /email recover。\n需要配置好邮件服务才有实际作用。',
  },
  'settings.registration.dialog.showBody': {
    title: '显示对话框说明文字',
    description: '在登录/注册/二步验证对话框中显示简短说明，帮助玩家理解需要做什么。',
  },
  'settings.registration.dialog.preJoin.enable': {
    title: '进服前弹出对话框',
    description: '在 Paper/Folia 的 pre-join 阶段就弹出登录/注册对话框。非 Paper/Folia 平台无效。',
  },
  'settings.registration.dialog.preJoin.showCancelButton': {
    title: 'pre-join 对话框显示取消按钮',
    description: '关闭后玩家只能提交对话框或自行断开连接。',
  },
  'settings.registration.dialog.preJoin.allowCloseWithEscape': {
    title: '允许 ESC 关闭 pre-join 对话框',
    description: '默认 false，对话框会一直停留直到提交、取消或超时断开。',
  },
  'settings.registration.dialog.preJoin.registerCancelKicks': {
    title: '取消注册对话框时踢出',
    description: '设为 false 时，取消 pre-join 注册对话框的玩家会进服并改弹进服后的注册对话框。',
  },
  'settings.registration.dialog.preJoin.loginCancelKicks': {
    title: '取消登录对话框时踢出',
    description: '默认 true。设为 false 时，取消 pre-join 登录对话框的玩家会以 limbo 状态进服，可使用 /email recover 找回。',
  },
  'settings.registration.dialog.postJoin.enable': {
    title: '进服后使用图形对话框',
    description: '进服后以图形对话框代替聊天栏提示进行登录/注册。\n需要 Minecraft 1.21.6+ (Spigot) 或 1.21.11+ (Paper)，旧版本自动忽略。',
  },


  // 7. 消息与欢迎 (settings 顶层)
  'settings.useWelcomeMessage': {
    title: '启用欢迎消息',
    description: '登录成功后是否向玩家展示 welcome.txt 中的欢迎内容。\n支持颜色代码与占位符：{PLAYER} 玩家名、{ONLINE} 在线人数、{MAXPLAYERS} 最大人数、{IP} 玩家 IP、{WORLD} 所在世界、{SERVER} 服务器名、{COUNTRY} 玩家国家等。',
  },
  'settings.broadcastWelcomeMessage': {
    title: '全服广播欢迎消息',
    description: 'true 时把欢迎消息广播给全服玩家，false 时仅发送给本人。',
  },
  'settings.delayJoinMessage': {
    title: '延迟进服消息',
    description: '是否延迟进服提示，等玩家登录成功后再显示。',
  },
  'settings.customJoinMessage': {
    title: '自定义进服消息',
    description: '登录成功后显示的自定义进服消息，留空则使用原版消息。\n可用变量：{PLAYERNAME} 玩家名（无颜色）、{DISPLAYNAME} 显示名（带颜色）、{DISPLAYNAMENOCOLOR} 显示名（无颜色）。',
  },
  'settings.removeUnloggedLeaveMessage': {
    title: '隐藏未登录玩家的退出消息',
    description: '未登录就离开的玩家不显示退出消息，可减少刷屏。',
  },
  'settings.removeJoinMessage': {
    title: '隐藏所有进服消息',
    description: '是否完全移除进服提示消息。',
  },
  'settings.removeLeaveMessage': {
    title: '隐藏所有退出消息',
    description: '是否完全移除退出提示消息。',
  },
  'settings.applyBlindEffect': {
    title: '登录前施加致盲效果',
    description: '玩家登录/注册前给予失明药水效果，默认 false。',
  },
  'settings.preventOtherCase': {
    title: '禁止大小写冒名登录',
    description: '开启后严格区分用户名大小写：已注册 Xephi 时，XEPHI/xephi 等变体无法进服。\n强烈建议保持 true，防止大小写冒名顶替。',
  },
  'settings.enablePremium': {
    title: '正版自动登录',
    description: '开启后拥有正版 Minecraft 账号的玩家可跳过密码验证（需玩家先用 /premium 开启）。\n- online-mode=true 的服务端直接可用\n- 离线模式 + 代理：需设置 Hooks.bungeecord=true\n- 离线模式无代理：需要 PacketEvents 做加密验证，否则自动关闭\n默认 false。',
  },

  // 8. 权限组切换 (GroupOptions)
  'GroupOptions': {
    title: '权限组切换设置',
    description: '登录前后将玩家切换到指定权限组，是重要的防漏洞手段。',
  },
  'GroupOptions.enablePermissionCheck': {
    title: '启用登录前权限组切换',
    description: '开启后 AuthMe 会在玩家登录前将其移入下方指定的权限组。建议开启并配合权限插件使用。',
  },
  'GroupOptions.registeredPlayerGroup': {
    title: '已注册未登录玩家权限组',
    description: '已注册但尚未登录的玩家被临时移入的权限组名（区分大小写！）。\n建议在权限插件中为该组配置极少权限，这样即使有人冒名登录也无法进行破坏。\n登录成功后玩家会被移回原权限组。组名写错会导致玩家权限被清空！',
  },
  'GroupOptions.unregisteredPlayerGroup': {
    title: '未注册玩家权限组',
    description: '未注册玩家进服时所在的权限组名（区分大小写），作用同上。',
  },

  // 9. 邮件设置 (Email)
  'Email': {
    title: '邮件设置',
    description: '通过 SMTP 发送邮件，用于密码找回、邮箱注册等功能。\n配置后建议用 /email 命令测试能否正常发信。国内可用 QQ 邮箱/163 邮箱的 SMTP 服务（需开通授权码）。',
  },
  'Email.mailSMTP': {
    title: 'SMTP 服务器地址',
    description: '发信 SMTP 服务器主机名，默认 smtp.gmail.com。\n常用：QQ 邮箱 smtp.qq.com，163 邮箱 smtp.163.com。',
  },
  'Email.mailPort': {
    title: 'SMTP 端口',
    description: '端口决定加密方式：\n- 465：SSL/TLS 加密（默认，推荐）\n- 587：STARTTLS 加密\n- 25：明文，可配合 useTls 启用 STARTTLS',
  },
  'Email.useTls': {
    title: '启用 STARTTLS (仅端口 25)',
    description: '仅在 mailPort 为 25 时生效：是否在明文连接上启用 STARTTLS 加密。465/587 端口强制加密，此项无效。',
  },
  'Email.mailAccount': {
    title: '发信邮箱账号',
    description: '用于登录 SMTP 发信的邮箱账号，通常就是完整邮箱地址。',
  },
  'Email.mailPassword': {
    title: '发信邮箱密码',
    description: '邮箱密码或 SMTP 授权码。QQ/163 等邮箱需使用独立授权码而非登录密码。',
  },
  'Email.mailAddress': {
    title: '发件人地址',
    description: '当 mailAccount 不是邮箱地址时，在此填写实际显示的发件人邮箱。',
  },
  'Email.mailSenderName': {
    title: '发件人显示名',
    description: '自定义发件人名称，替代默认的账号名显示在邮件中（如你的服务器名）。',
  },
  'Email.RecoveryPasswordLength': {
    title: '找回密码长度',
    description: '通过邮件找回时生成的新密码长度，默认 8 位。',
  },
  'Email.mailSubject': {
    title: '邮件主题',
    description: '找回密码邮件的标题，可改成你的服务器名方便玩家识别。',
  },
  'Email.maxRegPerEmail': {
    title: '每个邮箱最大注册数',
    description: '同一邮箱允许绑定的账号数量上限，默认 1。类似 restrictions.maxRegPerIp。',
  },
  'Email.recallPlayers': {
    title: '提醒玩家绑定邮箱',
    description: '是否定期提醒未绑定邮箱的玩家添加邮箱（便于找回密码）。',
  },
  'Email.delayRecall': {
    title: '绑定邮箱提醒间隔 (分钟)',
    description: '提醒绑定邮箱的调度间隔，默认 5 分钟。仅 recallPlayers 开启时生效。',
  },
  'Email.emailBlacklisted': {
    title: '邮箱域名黑名单',
    description: '禁止使用这些域名的邮箱注册（默认含 10minutemail.com 一次性邮箱）。可添加更多临时邮箱域名。',
  },
  'Email.emailWhitelisted': {
    title: '邮箱域名白名单',
    description: '填写后仅允许这些域名的邮箱注册。留空表示不限制（黑名单仍生效）。',
  },
  'Email.generateImage': {
    title: '以图片发送新密码',
    description: '找回密码时将新密码绘制为图片发送，防纯文本抓取。默认 false。',
  },
  'Email.emailOauth2Token': {
    title: 'OAuth2 令牌',
    description: '使用 OAuth2 认证（如 Gmail）发信时的访问令牌。普通授权码方式无需填写。',
  },
  'Email.sslCheckServerIdentity': {
    title: '校验邮件服务器证书',
    description: 'SSL/TLS 连接时是否校验 SMTP 服务器证书主机名。\n仅在邮件服务器使用自签名证书时才可设为 false，否则建议保持 true。',
  },


  // 10. 插件联动 (Hooks)
  'Hooks': {
    title: '插件联动设置',
    description: '与其他插件（Multiverse、BungeeCord、Essentials 等）的联动开关。',
  },
  'Hooks.multiverse': {
    title: '联动 Multiverse 出生点',
    description: '是否通过 Multiverse 获取出生点位置，默认 true。未安装 Multiverse 时自动忽略。',
  },
  'Hooks.bungeecord': {
    title: 'BungeeCord 模式',
    description: '服务器处于 BungeeCord/Velocity 代理后端时设为 true。\n⚠️ 同时记得把 DataSource.caching 设为 false，并使用远程数据库保证多端数据同步。',
  },
  'Hooks.sendPlayerTo': {
    title: '登录后跳转的群组子服',
    description: 'BungeeCord 环境下，玩家注册/登录成功后自动发送到的子服名称。留空则不跳转。',
  },
  'Hooks.proxySharedSecret': {
    title: '代理共享密钥',
    description: '用于验证代理端 AuthMe 插件发来的自动登录消息的共享密钥。\n必须与 AuthMe Velocity/Bungee 代理端配置中的 proxySharedSecret 一致，且所有后端服务器保持一致。\n⚠️ 留空将禁用自动登录（所有 perform.login 消息都会被拒绝）。',
  },
  'Hooks.disableSocialSpy': {
    title: '进服时关闭 Essentials 私聊监听',
    description: '玩家进服时自动关闭 Essentials 的 SocialSpy 功能，默认 false。',
  },
  'Hooks.useEssentialsMotd': {
    title: '进服时显示 Essentials MOTD',
    description: '玩家进服时是否自动执行 Essentials 的 /motd 命令展示服务器公告。',
  },

  // 11. 服务器保护 (Protection)
  'Protection': {
    title: '服务器保护设置',
    description: '基于国家的登录限制与反机器人（AntiBot）保护。',
  },
  'Protection.enableProtection': {
    title: '启用国家/IP 保护',
    description: '开启国家白/黑名单登录限制功能，默认 false。需配合下方 geoIpDatabase 使用。',
  },
  'Protection.enableProtectionRegistered': {
    title: '对已注册玩家也生效',
    description: '国家保护是否同样作用于已注册的玩家，默认 true。',
  },
  'Protection.geoIpDatabase': {
    title: 'GeoIP 数据库设置',
    description: '用于判断玩家 IP 所属国家的 MaxMind GeoIP 数据库配置。',
  },
  'Protection.geoIpDatabase.enabled': {
    title: '启用 GeoIP 数据库',
    description: '是否下载并使用 GeoIP 数据库进行国家判定，默认 true。',
  },
  'Protection.geoIpDatabase.clientId': {
    title: 'MaxMind 客户端 ID',
    description: '下载 GeoIP 数据库所需的 MaxMind 账号 clientId。\n需在 maxmind.com 注册获取，获取教程可参考 EssentialsX Wiki 的 GeoIP 页面。',
  },
  'Protection.geoIpDatabase.licenseKey': {
    title: 'MaxMind 许可证密钥',
    description: '下载 GeoIP 数据库所需的 MaxMind licenseKey，与 clientId 配套使用。',
  },
  'Protection.countries': {
    title: '允许的国家白名单',
    description: '仅允许这些国家的 IP 进服和注册，使用 ISO 3166 国家代码（如 CN、US、GB），本机地址用 LOCALHOST。\n⚠️ 务必加引号（如 "CN"）。国家代码表见 MaxMind 官方文档。',
  },
  'Protection.countriesBlacklist': {
    title: '禁止的国家黑名单',
    description: '不允许这些国家的 IP 进服和注册（默认 A1 即匿名代理）。同样务必加引号。',
  },
  'Protection.enableAntiBot': {
    title: '启用自动反机器人',
    description: '开启后短时间内大量连接涌入时自动启动 AntiBot 保护模式，默认 true。建议保持开启。',
  },
  'Protection.antiBotInterval': {
    title: 'AntiBot 检测间隔 (秒)',
    description: '统计登录请求的时间窗口，默认 5 秒。',
  },
  'Protection.antiBotSensibility': {
    title: 'AntiBot 触发阈值',
    description: '检测间隔内超过该数量的登录请求即自动开启 AntiBot 模式，默认 10。',
  },
  'Protection.antiBotDuration': {
    title: 'AntiBot 持续时长 (分钟)',
    description: '自动 AntiBot 模式的持续时间，默认 10 分钟。',
  },
  'Protection.antiBotDelay': {
    title: 'AntiBot 启动延迟 (秒)',
    description: '触发后延迟多少秒再激活 AntiBot 模式，默认 60 秒。',
  },
  'Protection.quickCommands': {
    title: '快速命令防护',
    description: '防止进服后立即执行命令的脚本/机器人行为。',
  },
  'Protection.quickCommands.denyCommandsBeforeMilliseconds': {
    title: '进服后命令禁止时长 (毫秒)',
    description: '玩家进服后在该毫秒数内执行命令将被踢出，默认 1000（1 秒）。正常玩家不会受影响。',
  },


  // 12. 数据清理 (Purge)
  'Purge': {
    title: '数据清理 (Purge) 设置',
    description: '自动清理长期未登录的旧账号及其关联数据。\n⚠️ 清理不可逆，开启前请确认已做好数据库备份。',
  },
  'Purge.useAutoPurge': {
    title: '启用自动清理',
    description: '是否自动清理长期未使用的账号，默认 false。',
  },
  'Purge.daysBeforeRemovePlayer': {
    title: '清理闲置天数',
    description: '超过多少天未登录的账号将被清理，默认 60 天。',
  },
  'Purge.removePlayerDat': {
    title: '同时删除 player.dat',
    description: '清理账号时是否删除世界存档中的玩家 player.dat 文件（含背包、末影箱等数据），默认 false。',
  },
  'Purge.removeEssentialsFile': {
    title: '同时删除 Essentials 玩家文件',
    description: '清理时是否删除 Essentials/userdata/ 下的玩家 yml 文件，默认 false。',
  },
  'Purge.defaultWorld': {
    title: '玩家数据所在主世界',
    description: '存储 player.dat 的主世界名，默认 world。',
  },
  'Purge.removeLimitedCreativesInventories': {
    title: '同时删除 LimitedCreative 背包',
    description: '清理时是否删除 LimitedCreative 插件的玩家背包文件，默认 false。',
  },
  'Purge.removeAntiXRayFile': {
    title: '同时删除 AntiXRay 数据',
    description: '清理时是否删除 AntiXRayData 插件的玩家数据文件，默认 false。',
  },
  'Purge.removePermissions': {
    title: '同时删除权限数据',
    description: '清理时是否一并删除玩家的权限插件数据，默认 false。',
  },

  // 13. 安全设置 (Security)
  'Security': {
    title: '安全设置',
    description: '数据库故障处理、验证码、临时封禁、找回码等安全相关配置。',
  },
  'Security.SQLProblem': {
    title: '数据库故障处理',
    description: '数据库连接失败时的应对策略。',
  },
  'Security.SQLProblem.stopServer': {
    title: '数据库故障时停止服务器',
    description: '无法连接数据库时是否直接关闭服务器，默认 true。\n⚠️ 设为 false 后数据库故障时 AuthMe 会自动禁用，服务器将完全失去登录保护！',
  },
  'Security.console': {
    title: '控制台日志设置',
    description: 'AuthMe 控制台日志的输出方式。',
  },
  'Security.console.logConsole': {
    title: '输出日志到独立文件',
    description: '是否将 AuthMe 的日志同时写入单独的日志文件，便于审计排查，默认 true。',
  },
  'Security.captcha': {
    title: '验证码设置',
    description: '多次输错密码后要求输入验证码，防止暴力破解。',
  },
  'Security.captcha.useCaptcha': {
    title: '启用登录验证码',
    description: '玩家连续输错密码达到上限后，需要输入验证码才能继续尝试，默认 false。建议开启防爆破。',
  },
  'Security.captcha.maxLoginTry': {
    title: '触发验证码的错误次数',
    description: '连续输错多少次密码后要求输入验证码，默认 5 次。',
  },
  'Security.captcha.captchaLength': {
    title: '验证码长度',
    description: '验证码的字符长度，默认 5 位。',
  },
  'Security.captcha.captchaCountReset': {
    title: '错误计数重置时间 (分钟)',
    description: '多少分钟后重置玩家的登录错误计数，默认 60 分钟。',
  },
  'Security.captcha.requireForRegistration': {
    title: '注册时要求验证码',
    description: '玩家注册前是否也需要输入验证码，默认 false。可防批量注册机器人。',
  },
  'Security.tempban': {
    title: '临时封禁设置',
    description: '连续输错密码过多时临时封禁 IP。',
  },
  'Security.tempban.enableTempban': {
    title: '启用临时封禁',
    description: '是否对连续输错密码的 IP 进行临时封禁，默认 false。',
  },
  'Security.tempban.maxLoginTries': {
    title: '封禁前允许的错误次数',
    description: '允许的最大登录失败次数，超过后封禁 IP，默认 10 次。',
  },
  'Security.tempban.tempbanLength': {
    title: '临时封禁时长 (分钟)',
    description: 'IP 被封禁的时长，默认 480 分钟（8 小时）。',
  },
  'Security.tempban.minutesBeforeCounterReset': {
    title: '失败计数重置时间 (分钟)',
    description: '多少分钟后重置该 IP/用户名的失败计数，默认 480 分钟（8 小时）。',
  },
  'Security.tempban.customCommand': {
    title: '自定义封禁命令',
    description: '触发封禁时执行的自定义命令（替代内置封禁），可用占位符 %player%、%ip%。留空则使用内置封禁。',
  },
  'Security.recoveryCode': {
    title: '找回码设置',
    description: '玩家忘记密码且无法收邮件时，由管理员生成找回码协助重置密码。',
  },
  'Security.recoveryCode.length': {
    title: '找回码长度',
    description: '找回码的字符数，默认 8。设为 0 禁用找回码功能。',
  },
  'Security.recoveryCode.validForHours': {
    title: '找回码有效期 (小时)',
    description: '找回码的有效时长，默认 4 小时。',
  },
  'Security.recoveryCode.maxTries': {
    title: '找回码最大尝试次数',
    description: '输入找回码的最大错误次数，默认 3 次。',
  },
  'Security.recoveryCode.passwordChangeTimeout': {
    title: '找回后改密时限 (分钟)',
    description: '使用找回码找回后，玩家需在多少分钟内完成改密，默认 2 分钟。',
  },
  'Security.emailRecovery': {
    title: '邮件找回设置',
    description: '通过邮件找回密码的限制。',
  },
  'Security.emailRecovery.cooldown': {
    title: '找回邮件冷却时间 (秒)',
    description: '两次发送找回邮件之间的最小间隔，默认 60 秒。防止邮件功能被恶意滥用。',
  },
  'Security.privacy': {
    title: '隐私设置',
    description: '邮箱显示与验证码有效期等隐私相关配置。',
  },
  'Security.privacy.enableEmailMasking': {
    title: '邮箱打码显示',
    description: '开启后 /email show 显示的邮箱会被部分打码（如 my.***@***mple.com），保护玩家隐私。',
  },
  'Security.privacy.verificationCodeExpiration': {
    title: '验证码有效期 (分钟)',
    description: '邮箱验证码的有效时长，默认 10 分钟。',
  },


  // 14. Limbo 状态处理 (limbo)
  'limbo': {
    title: 'Limbo (待登录) 状态设置',
    description: '玩家登录前，AuthMe 会临时移除其 OP、飞行、速度等属性，登录后再恢复。\n本节定义这些属性的保存与恢复方式。详见官方 Wiki 的 Limbo players 页面。',
  },
  'limbo.persistence': {
    title: 'Limbo 数据持久化',
    description: '除内存存储外，是否/如何把 limbo 数据写入磁盘。服务器崩溃后重启可正确恢复玩家的 OP、飞行等状态。',
  },
  'limbo.persistence.type': {
    title: '持久化方式',
    description: '- DISABLED：不写入磁盘\n- INDIVIDUAL_FILES：每个玩家单独一个文件（默认，直观）\n- DISTRIBUTED_FILES：按 UUID 分散到多个文件（适合大服，减少文件数）',
    options: [
      { value: 'DISABLED', label: 'DISABLED 禁用磁盘存储' },
      { value: 'INDIVIDUAL_FILES', label: 'INDIVIDUAL_FILES 每玩家独立文件 (默认)' },
      { value: 'DISTRIBUTED_FILES', label: 'DISTRIBUTED_FILES 分散存储 (大服推荐)' },
    ],
  },
  'limbo.persistence.distributionSize': {
    title: '分散存储的文件数',
    description: '仅 DISTRIBUTED_FILES 模式生效：把玩家按 UUID 分散到多少个文件中。\n例如预计 100 个未登录玩家，设为 SIXTEEN 则平均每文件约 6 人。\n⚠️ 修改此项会迁移全部数据，数据量大时请重启服务器修改，不要用 /authme reload。',
    options: [
      { value: 'ONE', label: 'ONE (1 个文件)' },
      { value: 'FOUR', label: 'FOUR (4 个文件)' },
      { value: 'EIGHT', label: 'EIGHT (8 个文件)' },
      { value: 'SIXTEEN', label: 'SIXTEEN (16 个文件，默认)' },
      { value: 'THIRTY_TWO', label: 'THIRTY_TWO (32 个文件)' },
      { value: 'SIXTY_FOUR', label: 'SIXTY_FOUR (64 个文件)' },
      { value: 'ONE_TWENTY', label: 'ONE_TWENTY (128 个文件)' },
      { value: 'TWO_FIFTY', label: 'TWO_FIFTY (256 个文件)' },
    ],
  },
  'limbo.restoreAllowFlight': {
    title: '飞行权限恢复方式',
    description: '登录后如何处理玩家的"允许飞行"属性：\n- RESTORE：恢复登录前的状态（默认）\n- ENABLE：始终允许飞行\n- DISABLE：始终禁止飞行\n- NOTHING：AuthMe 完全不干预该属性',
    options: [
      { value: 'RESTORE', label: 'RESTORE 恢复原状态 (默认)' },
      { value: 'ENABLE', label: 'ENABLE 始终允许飞行' },
      { value: 'DISABLE', label: 'DISABLE 始终禁止飞行' },
      { value: 'NOTHING', label: 'NOTHING 不干预' },
    ],
  },
  'limbo.restoreFlySpeed': {
    title: '飞行速度恢复方式',
    description: '登录后如何恢复玩家的飞行速度，默认 RESTORE_NO_ZERO。',
    options: SPEED_RESTORE_OPTIONS,
  },
  'limbo.restoreWalkSpeed': {
    title: '行走速度恢复方式',
    description: '登录后如何恢复玩家的行走速度，默认 RESTORE_NO_ZERO。取值含义同 restoreFlySpeed。',
    options: SPEED_RESTORE_OPTIONS,
  },
  'limbo.recreateEnderPearls': {
    title: '重建丢失的末影珍珠',
    description: '登录后若原来掷出的末影珍珠实体已找不到，是否重新生成它。\n设为 false 则仅恢复仍然存在的珍珠。',
  },

  // 15. 备份系统 (BackupSystem)
  'BackupSystem': {
    title: '备份系统设置',
    description: 'AuthMe 账号数据库的自动备份配置。',
  },
  'BackupSystem.ActivateBackup': {
    title: '启用备份功能',
    description: '备份功能总开关，默认 false。设为 false 时下方所有备份选项均无效。\n建议开启以防数据库损坏丢号。',
  },
  'BackupSystem.OnServerStart': {
    title: '开服时备份',
    description: '服务器启动时自动创建一次备份，默认 false。',
  },
  'BackupSystem.OnServerStop': {
    title: '关服时备份',
    description: '服务器关闭时自动创建一次备份，默认 true。',
  },
  'BackupSystem.MysqlWindowsPath': {
    title: 'MySQL 安装路径 (仅 Windows)',
    description: '仅 Windows 系统需要：MySQL 的安装目录路径（用于调用备份工具）。Linux 服主忽略此项。',
  },
};

export const authmeDefinition: PluginConfigDocDefinition = {
  pluginNames: ['authme', 'authmereloaded'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: authmeConfigDocs,
};

export default authmeDefinition;

