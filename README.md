# MSLX 服务端插件配置中心

适用于 MSLX 的服务端插件配置文件管理插件，支持可视化表单与源码双模式编辑、YAML 注释完整保留、官方默认模板对比与中文对照提示。

## 核心特性

- 双模式编辑：表单与源码（CodeMirror）自由切换。
- 注释无损：基于 YAML AST，保存时保留原文件所有注释、格式与空行。
- 中文对照：匹配中文说明，原英文注释收折至问号提示。
- 枚举下拉：常见选项渲染为可搜索、可自定义输入的下拉框。
- 模板对比：从 Jar 包提取初始配置并排对比。
- 快捷搜索：支持键名、数值、说明与注释全文检索及定位。
- 自动备份：保存前自动在 `.backup/` 创建备份。

## 中文注释贡献指南

对照库目录：`Frontend/src/resources/configDescriptions/plugins/`

系统通过 `import.meta.glob` 自动扫描加载 `plugins/` 下所有翻译文件，**无需手动修改任何引入或注册代码**，只需在此目录新建文件即可生效。

### 1. 新建插件翻译文件

在 `Frontend/src/resources/configDescriptions/plugins/` 目录下新建 TypeScript 文件（如 `essentials.ts`）：

```typescript
import type { PluginConfigDocDefinition } from '../types';

export default {
  pluginNames: ['essentials', 'ess'], // 匹配的插件名称
  fileNames: ['config.yml'],          // 匹配的文件名（未声明时默认匹配 config.yml 与 config.yaml）
  docs: {
    // 顶层键
    'locale': {
      title: '语言区域',
      description: '设置插件语言文件，例如 zh 或 en。',
      options: [
        { value: 'zh', label: 'zh (中文)' },
        { value: 'en', label: 'en (英文)' },
      ],
    },
    // 嵌套键使用点分隔路径
    'chat.radius': {
      title: '聊天半径',
      description: '局部聊天范围（方块）。0 为全局聊天。',
    },
  },
} satisfies PluginConfigDocDefinition;
```

字段说明：
- `pluginNames`：匹配的插件名标识（不区分大小写）。
- `fileNames`（可选）：目标文件名。未填写时默认匹配 `config.yml` 与 `config.yaml`。
- `docs`：中文说明字典。支持一级键（如 `debug`）与点分隔路径（如 `database.mysql.host`）。
- `options`（可选）：固定候选项列表，配置后自动渲染为可搜索下拉框。

### 2. 验证并提交

```bash
cd Frontend && pnpm build
```

构建无报错后直接提交 PR 即可。

## 构建与部署

### 环境要求

- .NET 10.0 SDK
- Node.js >= 18, pnpm

### 构建命令

```bash
# 1. 构建前端
cd Frontend
pnpm install && pnpm build
cd ..

# 2. 构建单文件插件
dotnet build -c Release
```

输出路径：`bin/Release/net10.0/MSLX.Plugin.Config.Editor.dll`

将该 DLL 复制到 MSLX Daemon 的 `DaemonData/Plugins/` 目录并重启 Daemon 即可生效。