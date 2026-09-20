import type { ConfigDocMap, PluginConfigDocDefinition } from '../types';

const BOOLEAN_OPTIONS = [
  { value: true, label: 'true (开启)' },
  { value: false, label: 'false (关闭)' },
];

/**
 * PlaceholderAPI config.yml 中文对照字典
 * 官方默认配置来源：https://github.com/PlaceholderAPI/PlaceholderAPI/blob/master/src/main/resources/config.yml
 */
export const placeholderapiConfigDocs: ConfigDocMap = {
  check_updates: {
    title: '检查更新',
    description: '是否自动检查 PlaceholderAPI 的新版本并在控制台提示。默认开启。',
    options: BOOLEAN_OPTIONS,
  },
  cloud_enabled: {
    title: '启用扩展云 (eCloud)',
    description: '是否启用在线扩展市场。\n开启后可通过 /papi ecloud 下载各插件提供的变量扩展包（如玩家名、经济、服务器信息等）。\n默认开启。\n常用命令：/papi ecloud list all 查看可下载的扩展，/papi ecloud download <名称> 安装。',
    options: BOOLEAN_OPTIONS,
  },
  cloud_sorting: {
    title: '扩展市场排序方式',
    description: '/papi ecloud list 列表中的扩展排序依据。\n默认按名称 (name) 排序，也可按作者或更新时间排序。',
    options: [
      { value: 'name', label: 'name (按名称排序)' },
      { value: 'author', label: 'author (按作者排序)' },
      { value: 'latest', label: 'latest (按更新时间排序)' },
    ],
  },
  boolean: {
    title: '布尔值显示文本',
    description: '%placeholderapi_is_prime% 等变量返回布尔值时的显示文本。\n可将 true/false 显示为自定义文字（如 是/否），需重启或重载后生效。',
  },
  'boolean.true': {
    title: 'true 显示为',
    description: '布尔值为 true 时显示的文字，默认 yes。\n可改为中文，如 是。',
  },
  'boolean.false': {
    title: 'false 显示为',
    description: '布尔值为 false 时显示的文字，默认 no。\n可改为中文，如 否。',
  },
  date_format: {
    title: '日期时间格式',
    description: '占位符输出日期/时间时使用的格式，默认 MM/dd/yy HH:mm:ss。\n使用 Java SimpleDateFormat 语法：\n- yyyy-MM-dd → 2026-09-20\n- HH:mm → 14:30\n- MM月dd日 → 09月20日',
  },
  detect_malicious_expansions: {
    title: '检测恶意扩展',
    description: '是否扫描已安装的扩展是否存在恶意行为（如私自收集数据）。\n检测到疑似恶意扩展时会在控制台警告。默认开启，建议保持。',
    options: BOOLEAN_OPTIONS,
  },
  use_adventure_provided_replacer: {
    title: '使用 Adventure 替换引擎',
    description: '替换变量时改用 Adventure 库自带的替换器。\n仅当使用组件（Component）替换的插件出现性能问题或显示异常时才需开启。默认关闭。',
    options: BOOLEAN_OPTIONS,
  },
  debug: {
    title: '调试模式',
    description: '开启后输出详细的变量替换日志，仅排查问题时开启，日常使用建议关闭。',
    options: BOOLEAN_OPTIONS,
  },
};

const PAPI_DEFINITION: PluginConfigDocDefinition = {
  pluginNames: ['placeholderapi'],
  fileNames: ['config.yml', 'config.yaml'],
  docs: placeholderapiConfigDocs,
};

export const placeholderapiDefinition: PluginConfigDocDefinition = PAPI_DEFINITION;

export default PAPI_DEFINITION;
