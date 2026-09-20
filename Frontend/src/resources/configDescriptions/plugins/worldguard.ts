import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

/**
 * WorldGuard config.yml 中文对照字典
 * 说明：WorldGuard 主配置文件内容很少，大部分常用配置位于
 * worlds/<世界名>/config.yml（每世界配置）。每世界配置未写的键
 * 会自动继承主配置中的同名键，因此两份文件可共用本字典。
 * 来源：EngineHub/WorldGuard version/7.0.x 源码内建默认值
 */
export const worldguardConfigDocs: ConfigDocMap = {
  // ========== 主配置专用 (仅 config.yml 生效) ==========
  'regions.uuid-migration.perform-on-next-start': {
    title: '下次启动执行 UUID 迁移',
    description: '下次启动时是否将区域数据中的玩家名迁移为 UUID，默认 true（执行一次后自动改为 false）。\n一般无需手动改动，迁移失败时可重新设为 true 再跑一次。',
  },
  'regions.uuid-migration.keep-names-that-lack-uuids': {
    title: '保留无法解析的玩家名',
    description: 'UUID 迁移时，是否保留那些查不到对应 UUID 的玩家名（如已改名或假人），默认 true。\n设为 false 会将这些条目从区域成员中移除。',
  },
  'regions.use-creature-spawn-event': {
    title: '使用生物生成事件检测',
    description: '用 CreatureSpawnEvent 来执行区域生物生成保护，默认 true。\n与某些生成类插件冲突时可尝试关闭。',
  },
  'regions.use-pre-creature-spawn-event': {
    title: '使用预生成事件检测 (Paper)',
    description: '使用 Paper 服务端提供的更早的 PreCreatureSpawnEvent 进行拦截，默认 true。\n拦截更早更彻底，仅在 Paper 系服务端有效。',
  },
  'regions.disable-bypass-by-default': {
    title: '默认关闭区域绕过权限',
    description: '为 true 时，拥有 worldguard.region.bypass.* 权限的管理员默认不自动绕过区域限制，默认 false。\n管理员可用 /rg bypass 命令手动切换绕过状态。',
  },
  'regions.announce-bypass-status': {
    title: '提示绕过状态',
    description: '管理员进出区域时，是否向其发送当前区域绕过（bypass）状态的提示消息，默认 false。',
  },
  'auto-invincible': {
    title: '权限自动无敌',
    description: '为 true 时，拥有 worldguard.auto-invincible 权限的玩家进服后自动处于无敌状态，默认 false。',
  },
  'auto-invincible-group': {
    title: '权限组自动无敌',
    description: '为 true 时，属于 worldguard-auto-invincible 权限组的玩家进服后自动无敌，默认 false。',
  },
  'auto-no-drowning-group': {
    title: '权限组自动免溺水',
    description: '为 true 时，属于 worldguard-auto-no-drowning 权限组的玩家进服后不会溺水，默认 false。',
  },
  'use-player-move-event': {
    title: '监听玩家移动事件',
    description: '是否监听玩家移动以触发 entry/exit、greeting 等区域旗标，默认 true。\n关闭可略微提升性能，但进出区域类旗标将全部失效。',
  },
  'use-player-teleports': {
    title: '传送时也触发移动检测',
    description: '玩家传送（含传送门、珍珠）时是否同样触发区域进出检测，默认 true。\n建议保持开启，否则玩家可传送绕过 entry 类旗标。',
  },
  'use-particle-effects': {
    title: '使用粒子效果',
    description: '是否允许区域旗标使用粒子效果（如自定义旗标展示），默认 true。',
  },
  'disable-permission-cache': {
    title: '禁用权限缓存',
    description: '是否禁用 WorldGuard 内部的权限检查结果缓存，默认 false。\n仅排查权限不生效问题时临时开启，日常保持关闭以获得最佳性能。',
  },
  'security.deop-everyone-on-join': {
    title: '进服自动取消 OP',
    description: '为 true 时，任何玩家进服都会被自动取消 OP 身份，默认 false。\n用于账号被盗等紧急安全场景，平时请勿开启。',
  },
  'security.block-in-game-op-command': {
    title: '禁止游戏内 OP 命令',
    description: '为 true 时禁止在游戏内使用 /op 命令（控制台不受影响），默认 false。\n可防止被盗号的管理员给自己 OP。',
  },
  'host-keys': {
    title: 'Host Key 验证列表',
    description: '按玩家登录域名区分验证的键值列表（域名: 任意密钥串）。\n配置了 host key 的玩家必须通过对应域名进服才会被视为已验证身份，用于域名防伪登录。',
  },
  'security.host-keys-allow-forge-clients': {
    title: '允许 Forge 客户端绕过 Host Key',
    description: '为 true 时，使用 Forge/FML 客户端的玩家不执行 host-keys 验证，默认 false。\nForge 客户端握手信息会破坏域名验证，混端服可能需要开启。',
  },
  'regions.sql.use': {
    title: '使用 MySQL 存储区域',
    description: '是否使用 MySQL 数据库存储区域数据，默认 false（使用 YAML 文件）。\n注意：官方已宣布将在未来版本移除 SQL 支持，建议保持 YAML 存储。',
  },
  'regions.sql.dsn': {
    title: '数据库连接地址 (DSN)',
    description: '区域 MySQL 存储的 JDBC 连接串，默认 jdbc:mysql://localhost/worldguard。\n仅在 regions.sql.use 为 true 时生效。',
  },
  'regions.sql.username': {
    title: '数据库用户名',
    description: '连接区域数据库使用的用户名，默认 worldguard。',
  },
  'regions.sql.password': {
    title: '数据库密码',
    description: '连接区域数据库使用的密码，默认 worldguard，请务必修改。',
  },
  'regions.sql.table-prefix': {
    title: '数据库表名前缀',
    description: '区域数据表名前缀，默认为空。多服共用一个数据库时可加前缀区分。',
  },
  'custom-metrics-charts': {
    title: '匿名统计图表',
    description: '是否向 bStats 提交匿名统计数据图表，默认 true。\n用于官方了解插件使用情况，可随时关闭，不影响功能。',
  },

  // ========== 每世界配置 (主配置与 worlds/<世界>/config.yml 通用) ==========

  // 1. 基础与保护 (Protection)
  'summary-on-start': {
    title: '启动时输出配置摘要',
    description: '服务器启动加载该世界配置时，是否在控制台打印一份启用功能摘要，默认 true。',
  },
  'op-permissions': {
    title: 'OP 拥有全部 WG 权限',
    description: '为 true 时，OP 玩家自动拥有 WorldGuard 的全部权限，默认 true。\n使用了权限插件精细化授权的服务器可设为 false。',
  },
  'build-permission-nodes.enable': {
    title: '启用建造权限节点',
    description: '为 true 时，玩家必须拥有 worldguard.build 权限才能在世界上放置/破坏方块，默认 false。\n开启后没给权限的玩家将无法进行任何建造，请先在权限插件中授权。',
  },
  'build-permission-nodes.deny-message': {
    title: '建造被拒绝提示语',
    description: '玩家因缺少 worldguard.build 权限被阻止操作时收到的提示消息，支持 & 颜色代码。',
  },
  'protection.item-durability': {
    title: '工具耐久消耗',
    description: '玩家在世界中挖掘方块时工具是否消耗耐久，默认 true。\n设为 false 则全服工具永不磨损。',
  },
  'protection.remove-infinite-stacks': {
    title: '移除无限堆叠物品',
    description: '为 true 时清除物品栏中数量为负数的“无限堆叠”作弊物品，默认 false。\n此类物品多来自旧版本漏洞，现代版本一般无需开启。',
  },
  'protection.disable-xp-orb-drops': {
    title: '禁用经验球掉落',
    description: '为 true 时，挖掘方块、击杀生物不再掉落经验球，默认 false。',
  },
  'protection.use-max-priority-association': {
    title: '按最高优先级区域判定归属',
    description: '多个区域重叠时，按最高优先级区域判定玩家的区域归属（影响某些按归属计算的旗标），默认 false。',
  },
  'event-handling.block-entity-spawns-with-untraceable-cause': {
    title: '拦截来源不明的实体生成',
    description: '严格模式：拦截无法追溯生成来源的实体（常见于部分刷怪插件/机制），默认 false。\n开启可能误伤正常机制，谨慎使用。',
  },
  'event-handling.ignore-hopper-item-move-events': {
    title: '忽略漏斗物品移动检测',
    description: '为 true 时不再监听漏斗传输物品事件，默认 false。\n漏斗极多的大型红石服可开启以提升性能，但漏斗相关保护会失效。',
  },
  'event-handling.break-hoppers-on-denied-move': {
    title: '破坏越权漏斗',
    description: '当漏斗试图从受保护容器中吸物品被拦截时，是否直接破坏该漏斗，默认 true。\n设为 false 则仅拦截不破坏。',
  },
  'gameplay.block-potions': {
    title: '禁止使用的药水列表',
    description: '填写药水效果 ID 列表，玩家使用含这些效果的药水/喷溅药水时会被拦截，默认为空。',
  },
  'gameplay.block-potions-overly-reliably': {
    title: '彻底拦截药水',
    description: '为 true 时以更激进的方式拦截 block-potions 中的药水（含滞留型等），默认 false。',
  },
  'gameplay.disable-conduit-effects': {
    title: '禁用潮涌核心效果',
    description: '为 true 时玩家不会获得潮涌核心提供的增益效果，默认 false。',
  },
  'simulation.sponge.enable': {
    title: '模拟海绵吸水',
    description: '为 true 时启用类似经典版本的海绵吸水功能（配合 radius 与 redstone），默认 false。\n属于怀旧玩法，与现代原版海绵机制无关。',
  },
  'simulation.sponge.radius': {
    title: '海绵吸水半径',
    description: '模拟海绵的吸水半径（单位：格），默认 3。仅在 simulation.sponge.enable 为 true 时生效。',
  },
  'simulation.sponge.redstone': {
    title: '红石控制海绵',
    description: '为 true 时模拟海绵仅在接收到红石信号时吸水，默认 false。',
  },
  'default.pumpkin-scuba': {
    title: '南瓜头水下呼吸',
    description: '为 true 时，戴着南瓜头的玩家可以在水下呼吸，默认 false。',
  },
  'default.disable-health-regain': {
    title: '禁用自然生命回复',
    description: '为 true 时玩家饱食度满时不再自动回血，默认 false。\n常用于硬核生存服。',
  },
  'physics.no-physics-gravel': {
    title: '沙砾无重力',
    description: '为 true 时沙砾失去支撑也不会下落，默认 false。',
  },
  'physics.no-physics-sand': {
    title: '沙子无重力',
    description: '为 true 时沙子失去支撑也不会下落，默认 false。',
  },
  'physics.vine-like-rope-ladders': {
    title: '藤蔓式绳梯',
    description: '为 true 时梯子可像藤蔓一样悬挂放置（无需依附方块下方支撑），默认 false。',
  },
  'physics.allow-portal-anywhere': {
    title: '允许任意位置生成传送门',
    description: '为 true 时取消下界传送门生成的位置限制，默认 false。\n开启后可能产生异常传送门，谨慎使用。',
  },
  'physics.disable-water-damage-blocks': {
    title: '免疫水破坏的方块列表',
    description: '填写方块 ID 列表，这些方块不会被水流冲毁（如红石线、火把），默认为空。',
  },
  // 2. 点火 (Ignition)
  'ignition.block-tnt': {
    title: '完全禁用 TNT',
    description: '为 true 时 TNT 无法被点燃引爆（完全不炸），默认 false。\n仅想保留爆炸效果但不破坏方块时，请改用 ignition.block-tnt-block-damage。',
  },
  'ignition.block-tnt-block-damage': {
    title: 'TNT 不破坏方块',
    description: '为 true 时 TNT 仍会爆炸并造成伤害，但不会破坏任何方块，默认 false。\n适合保留 TNT 玩法又要保护建筑的服务器。',
  },
  'ignition.block-lighter': {
    title: '禁用打火石点火',
    description: '为 true 时玩家无法使用打火石/火焰弹点燃方块，默认 false。\n可防止熊孩子在野外放火。',
  },

  // 3. 火焰 (Fire)
  'fire.disable-lava-fire-spread': {
    title: '禁止岩浆引燃火焰',
    description: '为 true 时岩浆不会在周围方块上产生火焰，默认 false。\n能防止岩浆湖意外烧毁木质建筑。',
  },
  'fire.disable-all-fire-spread': {
    title: '禁止一切火焰蔓延',
    description: '为 true 时火焰不会向周围方块蔓延扩散（已点燃的方块仍会烧毁），默认 false。\n建筑服常用的防火手段。',
  },
  'fire.disable-fire-spread-blocks': {
    title: '禁止火焰蔓延到的方块列表',
    description: '填写方块 ID 列表，火焰无法蔓延至这些方块上，默认为空。\n比 disable-all-fire-spread 更精细的控制方式。',
  },
  'fire.lava-spread-blocks': {
    title: '允许岩浆引燃的方块列表',
    description: '填写方块 ID 列表，仅这些方块允许被岩浆点燃，默认为空。\n留空表示不限制（除非 disable-lava-fire-spread 已开启）。',
  },

  // 4. 生物与爆炸 (Mobs)
  'mobs.block-creeper-explosions': {
    title: '完全禁用苦力怕爆炸',
    description: '为 true 时苦力怕爆炸被完全取消（无伤害无破坏），默认 false。',
  },
  'mobs.block-creeper-block-damage': {
    title: '苦力怕不破坏方块',
    description: '为 true 时苦力怕仍会爆炸伤人，但不破坏方块，默认 false。\n生存服最常用的防爆设置。',
  },
  'mobs.block-wither-explosions': {
    title: '禁用凋灵出生爆炸',
    description: '为 true 时凋灵被召唤时的出生大爆炸被完全取消，默认 false。',
  },
  'mobs.block-wither-block-damage': {
    title: '凋灵不破坏方块',
    description: '为 true 时凋灵的攻击和身体冲撞不破坏方块，默认 false。',
  },
  'mobs.block-wither-skull-explosions': {
    title: '禁用凋灵之首爆炸',
    description: '为 true 时凋灵发射的凋灵之首爆炸被完全取消，默认 false。',
  },
  'mobs.block-wither-skull-block-damage': {
    title: '凋灵之首不破坏方块',
    description: '为 true 时凋灵之首命中仍有伤害，但不破坏方块，默认 false。',
  },
  'mobs.block-enderdragon-block-damage': {
    title: '末影龙不破坏方块',
    description: '为 true 时末影龙飞行冲撞不会破坏方块，默认 false。',
  },
  'mobs.block-enderdragon-portal-creation': {
    title: '禁止末影龙生成传送门',
    description: '为 true 时末影龙被击杀后不会生成返回传送门与龙蛋，默认 false。\n用于反复刷龙的玩法服。',
  },
  'mobs.block-fireball-explosions': {
    title: '禁用火球爆炸',
    description: '为 true 时恶魂/烈焰人等发射的火球爆炸被完全取消，默认 false。',
  },
  'mobs.block-fireball-block-damage': {
    title: '火球不破坏方块',
    description: '为 true 时火球爆炸仍有伤害，但不破坏方块，默认 false。',
  },
  'mobs.block-windcharge-explosions': {
    title: '禁用风爆弹爆炸',
    description: '为 true 时旋风人风爆弹（Wind Charge）的爆炸效果被取消，默认 false。',
  },
  'mobs.anti-wolf-dumbness': {
    title: '狼防呆模式',
    description: '为 true 时驯服的狼不会因为追逐骷髅等而乱跑送死，默认 false。\n属于趣味保护选项。',
  },
  'mobs.disable-enderman-griefing': {
    title: '禁止末影人搬方块',
    description: '为 true 时末影人不会搬起或放下方块，默认 false。\n防止建筑被末影人抠出洞。',
  },
  'mobs.disable-snowman-trails': {
    title: '禁止雪傀儡留雪',
    description: '为 true 时雪傀儡走过的地方不再留下雪层，默认 false。',
  },
  'mobs.block-painting-destroy': {
    title: '画不可被破坏',
    description: '为 true 时画无法被任何方式破坏，默认 false。',
  },
  'mobs.block-item-frame-destroy': {
    title: '物品展示框不可被破坏',
    description: '为 true 时物品展示框无法被任何方式破坏，默认 false。',
  },
  'mobs.block-armor-stand-destroy': {
    title: '盔甲架不可被破坏',
    description: '为 true 时盔甲架无法被任何方式破坏，默认 false。',
  },
  'mobs.block-plugin-spawning': {
    title: '禁止插件生成生物',
    description: '为 true 时阻止其他插件通过代码生成生物（CUSTOM 生成原因），默认 true。\n注意：这会影响刷怪塔插件、NPC 插件等正常工作，按需调整。',
  },
  'mobs.block-above-ground-slimes': {
    title: '禁止地表史莱姆生成',
    description: '为 true 时史莱姆不会在地面以上自然生成，默认 false。',
  },
  'mobs.block-other-explosions': {
    title: '禁用其他来源爆炸',
    description: '为 true 时取消无法归类的其他爆炸（如部分模组/插件爆炸），默认 false。',
  },
  'mobs.block-zombie-door-destruction': {
    title: '禁止僵尸破门',
    description: '为 true 时僵尸无法破坏木门，默认 false。',
  },
  'mobs.block-vehicle-entry': {
    title: '禁止生物进入载具',
    description: '为 true 时怪物/动物无法坐进船、矿车等载具，默认 false。',
  },
  'mobs.block-creature-spawn': {
    title: '禁止生成的生物列表',
    description: '填写生物类型 ID 列表（如 minecraft:zombie），这些生物将无法在世界中生成，默认为空。',
  },

  // 5. 玩家伤害 (Player Damage)
  'player-damage.disable-fall-damage': {
    title: '禁用摔落伤害',
    description: '为 true 时玩家摔落不受伤害，默认 false。',
  },
  'player-damage.disable-lava-damage': {
    title: '禁用岩浆伤害',
    description: '为 true 时玩家接触岩浆不受伤害，默认 false。',
  },
  'player-damage.disable-fire-damage': {
    title: '禁用火焰伤害',
    description: '为 true 时玩家不会被火烧伤，默认 false。',
  },
  'player-damage.disable-lightning-damage': {
    title: '禁用雷击伤害',
    description: '为 true 时玩家被雷劈不受伤害，默认 false。',
  },
  'player-damage.disable-drowning-damage': {
    title: '禁用溺水伤害',
    description: '为 true 时玩家水下氧气耗尽也不受伤害，默认 false。',
  },
  'player-damage.disable-suffocation-damage': {
    title: '禁用窒息伤害',
    description: '为 true 时玩家被方块掩埋（卡墙）不受窒息伤害，默认 false。',
  },
  'player-damage.disable-contact-damage': {
    title: '禁用接触伤害',
    description: '为 true 时玩家触碰仙人掌、甜浆果丛等不受伤害，默认 false。',
  },
  'player-damage.teleport-on-suffocation': {
    title: '窒息时自动传送脱困',
    description: '为 true 时，玩家开始窒息会被自动传送到附近安全位置而非扣血，默认 false。',
  },
  'player-damage.disable-void-damage': {
    title: '禁用虚空伤害',
    description: '为 true 时玩家掉入虚空不受伤害，默认 false。常与 teleport-on-void-falling 配合使用。',
  },
  'player-damage.teleport-on-void-falling': {
    title: '掉入虚空自动传送回地面',
    description: '为 true 时，玩家掉入虚空会被传送回出生点/安全位置，默认 false。\n空岛、主城防虚空死亡的常用设置。',
  },
  'player-damage.reset-fall-on-void-teleport': {
    title: '虚空传送时重置摔落高度',
    description: '为 true 时，虚空传送回地面后重置摔落距离，避免落地摔死，默认 false。\n仅在 teleport-on-void-falling 开启时有意义。',
  },
  'player-damage.disable-explosion-damage': {
    title: '禁用爆炸伤害',
    description: '为 true 时玩家不受任何爆炸伤害，默认 false。',
  },
  'player-damage.disable-mob-damage': {
    title: '禁用生物攻击伤害',
    description: '为 true 时玩家不会被怪物攻击伤害，默认 false。',
  },
  'player-damage.disable-death-messages': {
    title: '禁用死亡消息',
    description: '为 true 时玩家死亡不在聊天栏显示原版死亡提示，默认 false。',
  },

  // 6. 箱子保护 (Chest Protection)
  'chest-protection.enable': {
    title: '启用牌子锁箱子',
    description: '为 true 时开启经典的“牌子贴箱子自动上锁”功能，默认 false。\n玩家手持牌子右键箱子即可将其锁定为私人箱子。',
  },
  'chest-protection.disable-off-check': {
    title: '关闭时跳过箱子检测',
    description: '当箱子保护功能处于关闭状态（enable 为 false 或被管理员关闭）时，是否完全跳过相关检测，默认 true。\n保持 true 可避免无用性能开销。',
  },

  // 7. 作物与蛋类保护 (Crops / Turtle Egg / Sniffer Egg)
  'crops.disable-creature-trampling': {
    title: '禁止生物踩踏耕地',
    description: '为 true 时怪物和动物踩到耕地不会使其退化，默认 false。',
  },
  'crops.disable-player-trampling': {
    title: '禁止玩家踩踏耕地',
    description: '为 true 时玩家跳跃落到耕地上不会踩坏农田，默认 false。\n生存服常用的人性化设置。',
  },
  'turtle-egg.disable-creature-trampling': {
    title: '禁止生物踩碎海龟蛋',
    description: '为 true 时生物踩踏不会破坏海龟蛋，默认 false。',
  },
  'turtle-egg.disable-player-trampling': {
    title: '禁止玩家踩碎海龟蛋',
    description: '为 true 时玩家踩踏不会破坏海龟蛋，默认 false。',
  },
  'sniffer-egg.disable-creature-trampling': {
    title: '禁止生物踩碎嗅探兽蛋',
    description: '为 true 时生物踩踏不会破坏嗅探兽蛋，默认 false。',
  },
  'sniffer-egg.disable-player-trampling': {
    title: '禁止玩家踩碎嗅探兽蛋',
    description: '为 true 时玩家踩踏不会破坏嗅探兽蛋，默认 false。',
  },

  // 8. 天气 (Weather)
  'weather.prevent-lightning-strike-blocks': {
    title: '避雷方块列表',
    description: '填写方块 ID 列表，闪电不会击中这些方块，默认为空。',
  },
  'weather.disable-lightning-strike-fire': {
    title: '雷击不产生火焰',
    description: '为 true 时闪电击中方块后不会留下火焰，默认 false。',
  },
  'weather.disable-thunderstorm': {
    title: '禁用雷暴天气',
    description: '为 true 时该世界不会出现雷暴（仍可能下雨），默认 false。',
  },
  'weather.disable-weather': {
    title: '禁用所有天气变化',
    description: '为 true 时该世界永远保持晴天，不再下雨/下雪，默认 false。\n注意：仅阻止天气“开始”，已经在下的雨不会立刻停止。',
  },
  'weather.disable-pig-zombification': {
    title: '禁止猪被雷击变异',
    description: '为 true 时猪被雷劈不会变成僵尸猪灵，默认 false。',
  },
  'weather.disable-villager-witchification': {
    title: '禁止村民被雷击变异',
    description: '为 true 时村民被雷劈不会变成女巫，默认 false。',
  },
  'weather.disable-powered-creepers': {
    title: '禁止闪电苦力怕',
    description: '为 true 时苦力怕被雷劈不会变成闪电（高压）苦力怕，默认 false。',
  },
  'weather.always-raining': {
    title: '永远下雨',
    description: '为 true 时该世界强制保持下雨状态，默认 false。\n与 disable-weather 不要同时开启。',
  },
  'weather.always-thundering': {
    title: '永远雷暴',
    description: '为 true 时该世界强制保持雷暴状态，默认 false。',
  },

  // 9. 动态生长与融化 (Dynamics)
  'dynamics.disable-mushroom-spread': {
    title: '禁止蘑菇蔓延',
    description: '为 true 时蘑菇不会向周围扩散生长，默认 false。',
  },
  'dynamics.disable-ice-melting': {
    title: '禁止冰融化',
    description: '为 true 时冰块不会因光照融化，默认 false。',
  },
  'dynamics.disable-snow-melting': {
    title: '禁止雪融化',
    description: '为 true 时雪层不会因光照融化，默认 false。',
  },
  'dynamics.disable-snow-formation': {
    title: '禁止积雪形成',
    description: '为 true 时下雪天地面不会积雪，默认 false。',
  },
  'dynamics.disable-ice-formation': {
    title: '禁止结冰',
    description: '为 true 时水面不会结冰，默认 false。',
  },
  'dynamics.disable-leaf-decay': {
    title: '禁止树叶自然枯萎',
    description: '为 true 时砍掉树干后树叶不会自动消失，默认 false。\n注意：大量残留树叶可能影响性能和美观。',
  },
  'dynamics.disable-grass-growth': {
    title: '禁止草方块蔓延',
    description: '为 true 时草方块不会向泥土蔓延，默认 false。',
  },
  'dynamics.disable-mycelium-spread': {
    title: '禁止菌丝蔓延',
    description: '为 true 时菌丝不会向泥土蔓延，默认 false。',
  },
  'dynamics.disable-vine-growth': {
    title: '禁止藤蔓生长',
    description: '为 true 时藤蔓不会向下/向旁生长，默认 false。',
  },
  'dynamics.disable-rock-growth': {
    title: '禁止滴水石生长',
    description: '为 true 时滴水石锥不会生长，默认 false。',
  },
  'dynamics.disable-sculk-growth': {
    title: '禁止幽匿方块蔓延',
    description: '为 true 时幽匿催发体不会蔓延幽匿类方块，默认 false。',
  },
  'dynamics.disable-crop-growth': {
    title: '禁止农作物生长',
    description: '为 true 时小麦、胡萝卜等农作物停止生长，默认 false。',
  },
  'dynamics.disable-soil-dehydration': {
    title: '禁止耕地干涸',
    description: '为 true 时耕地缺水也不会退化成泥土，默认 false。',
  },
  'dynamics.disable-soil-moisture-change': {
    title: '锁定耕地湿度',
    description: '为 true 时耕地湿度完全不变化（不会变湿也不会变干），默认 false。',
  },
  'dynamics.disable-coral-block-fade': {
    title: '禁止珊瑚失活',
    description: '为 true 时珊瑚离开水不会褪色死亡，默认 false。',
  },
  'dynamics.disable-copper-block-fade': {
    title: '禁止铜块氧化',
    description: '为 true 时铜块不会随时间氧化变色，默认 false。',
  },
  'dynamics.disable-lava-harden': {
    title: '禁止岩浆遇水固化',
    description: '为 true 时岩浆接触水不会变成石头/黑曜石，默认 false。\n会破坏刷石机等机制，谨慎开启。',
  },
  'dynamics.snow-fall-blocks': {
    title: '允许积雪的方块列表',
    description: '填写方块 ID 列表，仅这些方块上可以积雪，默认为空（不限制）。',
  },
};

export const worldguardDefinition: PluginConfigDocDefinition = {
  pluginNames: ['worldguard', 'wg'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: worldguardConfigDocs,
};

export default worldguardDefinition;
