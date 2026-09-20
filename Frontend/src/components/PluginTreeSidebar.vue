<template>
  <div class="flex-1 w-full h-full min-h-0 flex flex-col bg-zinc-50/70 dark:bg-zinc-950/40 select-none overflow-hidden">
    <!-- 顶部搜索栏 -->
    <div class="p-2 md:p-3 border-b border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
      <div class="flex items-center gap-2">
        <t-input
          v-model="searchText"
          placeholder="搜索插件或文件..."
          clearable
          size="small"
          class="!rounded-lg shadow-sm flex-1"
        >
          <template #prefix-icon>
            <search-icon class="text-zinc-400" />
          </template>
        </t-input>
        <t-tooltip content="刷新插件列表">
          <t-button
            variant="outline"
            size="small"
            shape="square"
            :loading="loading"
            class="!rounded-lg shrink-0 !bg-white dark:!bg-zinc-900 border-zinc-200 dark:border-zinc-700"
            @click="emit('refresh')"
          >
            <refresh-icon />
          </t-button>
        </t-tooltip>
      </div>

      <div class="flex items-center justify-between mt-1 md:mt-2 px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>共 {{ plugins.length }} 个插件</span>
        <span>{{ totalConfigsCount }} 个配置文件</span>
      </div>
    </div>

    <!-- 插件树与文件列表（独立垂直滚动） -->
    <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-1.5 md:p-2 space-y-1 md:space-y-1.5">
      <div v-if="filteredPlugins.length === 0" class="py-12 flex flex-col items-center justify-center text-zinc-400 text-xs text-center px-4">
        <file-icon size="32px" class="opacity-40 mb-2" />
        <span>{{ searchText ? '未找到匹配的插件或文件' : '暂未检测到插件' }}</span>
      </div>

      <div
        v-for="plugin in filteredPlugins"
        :key="plugin.jarFileName"
        class="border border-zinc-200/50 dark:border-zinc-800/60 rounded-lg overflow-hidden bg-white/60 dark:bg-zinc-900/40 transition-all duration-200"
      >
        <!-- 插件卡片头部 -->
        <div
          class="flex items-center justify-between p-2.5 cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-colors gap-2"
          @click="toggleExpand(plugin.jarFileName)"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <chevron-down-icon
              v-if="plugin.hasConfigDir && plugin.files.length > 0"
              class="text-xs text-zinc-400 shrink-0 transition-transform duration-200"
              :class="{ '-rotate-90': !isExpanded(plugin.jarFileName) }"
            />
            <div
              v-else
              class="w-1.5 h-1.5 rounded-full shrink-0"
              :class="plugin.hasConfigDir ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'"
            ></div>

            <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate" :title="plugin.pluginName">
              {{ plugin.pluginName }}
            </span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <t-tag
              v-if="!plugin.enabled"
              theme="default"
              size="small"
              variant="light"
              class="!text-[10px] !px-1 !h-4 !rounded"
            >
              已禁用
            </t-tag>
            <t-tag
              v-if="plugin.version"
              theme="primary"
              size="small"
              variant="light"
              class="!text-[10px] !px-1.5 !h-4 !rounded font-mono"
            >
              v{{ plugin.version }}
            </t-tag>
            <span
              v-if="plugin.hasConfigDir && plugin.files.length > 0"
              class="text-[10px] font-mono px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
            >
              {{ plugin.files.length }}
            </span>
          </div>
        </div>

        <!-- 配置文件子列表：支持递归展开树 -->
        <div
          v-if="isExpanded(plugin.jarFileName)"
          class="border-t border-zinc-100 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-950/20 py-1"
        >
          <div v-if="plugin.hasConfigDir && plugin.files.length > 0" class="space-y-0.5 px-1">
            <file-tree-node-item
              v-for="treeNode in getPluginFileTree(plugin)"
              :key="treeNode.id"
              :node="treeNode"
              :depth="0"
              :selected-file="selectedFile"
              @select-file="emit('select-file', plugin, $event)"
            />
          </div>

          <!-- 未生成配置提示 -->
          <div v-else class="px-3 py-2 text-[11px] text-zinc-400 dark:text-zinc-500 italic">
            未生成配置目录（需开机生成）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  SearchIcon,
  RefreshIcon,
  FileIcon,
  ChevronDownIcon,
} from 'tdesign-icons-vue-next';
import type { PluginInfo, PluginConfigFile } from '../types/pluginConfig';
import FileTreeNodeItem, { type FileTreeNode } from './FileTreeNodeItem.vue';

const props = defineProps<{
  plugins: PluginInfo[];
  loading: boolean;
  selectedFile: PluginConfigFile | null;
  selectedPlugin: PluginInfo | null;
}>();

const emit = defineEmits<{
  (e: 'select-file', plugin: PluginInfo, file: PluginConfigFile): void;
  (e: 'refresh'): void;
}>();

const searchText = ref('');

// 默认全折叠状态
const expandedKeys = ref<Record<string, boolean>>({});

const isExpanded = (key: string) => {
  if (searchText.value.trim()) return true; // 搜索时默认展开匹配项
  return expandedKeys.value[key] === true;
};

const toggleExpand = (key: string) => {
  expandedKeys.value[key] = !isExpanded(key);
};

const totalConfigsCount = computed(() => {
  return props.plugins.reduce((acc, p) => acc + (p.files?.length || 0), 0);
});

// 构建文件树缓存
const treeCache = new Map<string, FileTreeNode[]>();

const getPluginFileTree = (plugin: PluginInfo): FileTreeNode[] => {
  const cacheKey = `${plugin.jarFileName}-${plugin.files.length}-${plugin.files.map(f => f.name).join(',')}`;
  if (treeCache.has(cacheKey)) {
    return treeCache.get(cacheKey)!;
  }

  const tree = buildFileTree(plugin.files);
  treeCache.set(cacheKey, tree);
  return tree;
};

// 文件路径转树形结构
function buildFileTree(files: PluginConfigFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (const file of files) {
    const parts = file.name.split('/');
    let currentLevel = root;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (isLast) {
        currentLevel.push({
          id: `file:${file.relativePath}`,
          name: part,
          path: file.relativePath,
          isDir: false,
          file,
        });
      } else {
        let dirNode = currentLevel.find((n) => n.isDir && n.name === part);
        if (!dirNode) {
          dirNode = {
            id: `dir:${currentPath}`,
            name: part,
            path: currentPath,
            isDir: true,
            children: [],
          };
          currentLevel.push(dirNode);
        }
        currentLevel = dirNode.children!;
      }
    }
  }

  // 排序：文件夹优先，然后按文件名自然排序
  const sortNodes = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });
    for (const n of nodes) {
      if (n.children) sortNodes(n.children);
    }
  };

  sortNodes(root);
  return root;
}

// 搜索过滤
const filteredPlugins = computed(() => {
  if (!searchText.value.trim()) return props.plugins;
  const keyword = searchText.value.toLowerCase().trim();

  return props.plugins
    .map((plugin) => {
      const matchPlugin =
        plugin.pluginName.toLowerCase().includes(keyword) ||
        plugin.jarFileName.toLowerCase().includes(keyword);

      const matchingFiles = plugin.files.filter((f) =>
        f.name.toLowerCase().includes(keyword)
      );

      if (matchPlugin) return plugin;
      if (matchingFiles.length > 0) {
        return {
          ...plugin,
          files: matchingFiles,
        };
      }
      return null;
    })
    .filter((p): p is PluginInfo => p !== null);
});
</script>

<style scoped>
.custom-scrollbar {
  overscroll-behavior: contain;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 120, 120, 0.4);
}
</style>
