<template>
  <div>
    <!-- 文件夹节点 -->
    <div
      v-if="node.isDir"
      class="flex items-center justify-between px-2 py-1 rounded-md cursor-pointer text-xs transition-colors hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 font-medium group select-none"
      :style="{ paddingLeft: `${depth * 12 + 6}px` }"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-1.5 min-w-0 flex-1">
        <chevron-down-icon
          class="text-xs text-zinc-400 shrink-0 transition-transform duration-200"
          :class="{ '-rotate-90': !isExpanded }"
        />
        <folder-open-icon v-if="isExpanded" class="text-xs text-amber-500 shrink-0" />
        <folder-icon v-else class="text-xs text-amber-500 shrink-0" />
        <span class="truncate font-mono text-[12px]" :title="node.name">{{ node.name }}</span>
      </div>
      <span class="text-[10px] text-zinc-400 shrink-0 font-mono">
        {{ countTotalFiles(node) }}
      </span>
    </div>

    <!-- 子节点递归渲染 -->
    <div v-if="node.isDir && isExpanded" class="space-y-0.5">
      <file-tree-node-item
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-file="selectedFile"
        @select-file="emit('select-file', $event)"
      />
    </div>

    <!-- 文件节点 -->
    <div
      v-else-if="!node.isDir && node.file"
      class="flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors gap-1.5 group select-none"
      :style="{ paddingLeft: `${depth * 12 + 18}px` }"
      :class="
        selectedFile?.relativePath === node.file.relativePath
          ? 'bg-[var(--color-primary)] text-white font-medium shadow-sm'
          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
      "
      @click="emit('select-file', node.file)"
    >
      <div class="flex items-center gap-1.5 min-w-0 flex-1">
        <file-icon class="text-xs shrink-0 opacity-70" />
        <span class="truncate font-mono text-[12px]" :title="node.name">{{ node.name }}</span>
      </div>
      <span
        class="text-[10px] font-mono shrink-0"
        :class="selectedFile?.relativePath === node.file.relativePath ? 'text-white/80' : 'text-zinc-400 group-hover:text-zinc-500'"
      >
        {{ formatSize(node.file.sizeBytes) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  ChevronDownIcon,
} from 'tdesign-icons-vue-next';
import type { PluginConfigFile } from '../types/pluginConfig';

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  isDir: boolean;
  file?: PluginConfigFile;
  children?: FileTreeNode[];
}

const props = withDefaults(
  defineProps<{
    node: FileTreeNode;
    depth?: number;
    selectedFile: PluginConfigFile | null;
  }>(),
  {
    depth: 0,
  }
);

const emit = defineEmits<{
  (e: 'select-file', file: PluginConfigFile): void;
}>();

const isExpanded = ref(false);

const countTotalFiles = (n: FileTreeNode): number => {
  if (!n.isDir) return 1;
  return (n.children || []).reduce((acc, c) => acc + countTotalFiles(c), 0);
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>
