<template>
  <div class="visual-form-item w-full py-1.5" :style="{ paddingLeft: depth > 0 ? '12px' : '0' }">
    <!-- 1. 对象/字典类型 (嵌套卡片/折叠区) -->
    <div
      v-if="isObject(val)"
      class="border border-zinc-200/80 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 mb-2 shadow-xs"
    >
      <div
        class="flex items-center justify-between px-3 py-2 bg-zinc-100/70 dark:bg-zinc-800/70 border-b border-zinc-200/60 dark:border-zinc-800 cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-700/40 transition-colors overflow-hidden"
        @click="isExpanded = !isExpanded"
      >
        <div class="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <chevron-down-icon
            class="text-xs text-zinc-400 shrink-0 transition-transform duration-200"
            :class="{ '-rotate-90': !isExpanded }"
          />
          <folder-open-icon v-if="isExpanded" class="text-xs text-amber-500 shrink-0" />
          <folder-icon v-else class="text-xs text-amber-500 shrink-0" />
          <span class="font-bold text-xs font-mono text-zinc-800 dark:text-zinc-200 shrink-0" v-html="highlightText(String(keyName), filterKeyword)"></span>
          
          <t-tag size="small" variant="light" theme="default" class="!text-[10px] !px-1.5 !h-4 !rounded shrink-0">
            Object ({{ Object.keys(val).length }})
          </t-tag>

          <!-- 中文提示优先展示，旁边附带问号 tooltip 显示原有注释 -->
          <template v-if="docItem">
            <t-tooltip
              placement="top-left"
              theme="light"
            >
              <template #content>
                <div class="visual-tooltip-box">
                  <div class="visual-tooltip-title">【{{ docItem.title }}】</div>
                  <div class="visual-tooltip-text">{{ docItem.description }}</div>
                </div>
              </template>
              <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium cursor-help ml-1 hidden sm:flex items-center gap-1 min-w-0 max-w-[240px] md:max-w-xs overflow-hidden hover:opacity-85 transition-opacity">
                <span class="text-emerald-500 font-bold shrink-0 text-[10px]">#</span>
                <span class="truncate block min-w-0" v-html="highlightText(`${docItem.title}: ${docFirstLine}`, filterKeyword)"></span>
                <span v-if="docHasMore" class="text-[9px] text-emerald-500/80 shrink-0">(+)</span>
              </div>
            </t-tooltip>

            <!-- 问号显示原有英文注释 -->
            <t-tooltip
              v-if="commentText"
              placement="top"
              theme="light"
            >
              <template #content>
                <div class="visual-tooltip-box">
                  <div class="visual-tooltip-title font-mono">【配置项原注释】</div>
                  <div class="visual-tooltip-text font-mono text-[11px]">{{ commentText }}</div>
                </div>
              </template>
              <help-circle-icon class="text-xs text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-help shrink-0 ml-0.5 transition-colors" />
            </t-tooltip>
          </template>

          <!-- 未匹配到中文解释时，默认显示一行原注释 -->
          <t-tooltip
            v-else-if="commentText"
            placement="top-left"
            theme="light"
          >
            <template #content>
              <div class="visual-tooltip-box">
                <div class="visual-tooltip-text font-mono text-[11px]">{{ commentText }}</div>
              </div>
            </template>
            <div class="text-[11px] text-zinc-500 dark:text-zinc-400 cursor-help ml-1 hidden sm:flex items-center gap-1 min-w-0 max-w-[240px] md:max-w-xs overflow-hidden hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              <span class="text-amber-500 font-bold shrink-0 text-[10px]">#</span>
              <span class="truncate block min-w-0" v-html="highlightText(firstLineComment, filterKeyword)"></span>
              <span v-if="hasMoreComment" class="text-[9px] text-amber-500/80 shrink-0">(+)</span>
            </div>
          </t-tooltip>
        </div>

        <div class="flex items-center gap-1 shrink-0" @click.stop>
          <t-button size="small" variant="text" shape="square" class="!h-6 !w-6" @click="showAddChild = true">
            <template #icon><add-icon class="text-xs" /></template>
          </t-button>
          <t-popconfirm v-if="allowDelete" content="确定删除此配置组吗？" theme="danger" @confirm="handleDeleteSelf">
            <t-button size="small" variant="text" theme="danger" shape="square" class="!h-6 !w-6 hover:!bg-red-500/10">
              <template #icon><delete-icon class="text-xs" /></template>
            </t-button>
          </t-popconfirm>
        </div>
      </div>

      <div v-if="isExpanded" class="p-3 space-y-2">
        <div v-if="Object.keys(val).length === 0" class="text-xs text-zinc-400 italic py-1">
          (空配置对象)
        </div>

        <visual-form-item
          v-for="(childVal, childKey) in val"
          :key="childKey"
          :model-value="childVal"
          :key-name="childKey"
          :path="`${currentPathStr ? currentPathStr + '.' : ''}${childKey}`"
          :path-array="currentPathArray"
          :depth="depth + 1"
          :allow-delete="true"
          :comments-map="commentsMap"
          :chinese-docs="chineseDocs"
          :filter-keyword="filterKeyword"
          @update:model-value="updateChildValue(childKey, $event)"
          @delete="deleteChildKey(childKey)"
          @update-path="(p, v) => emit('update-path', p, v)"
          @delete-path="(p) => emit('delete-path', p)"
          @add-pair="(parentPath, k, v, c) => emit('add-pair', parentPath, k, v, c)"
        />

        <!-- 添加新属性弹窗 -->
        <t-dialog
          v-model:visible="showAddChild"
          :header="`在 [${keyName}] 中添加配置项`"
          width="420px"
          attach="body"
          @confirm="confirmAddChild"
        >
          <div class="space-y-3 py-2">
            <div>
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 block">配置键名 (Key)</label>
              <t-input v-model="newChildKey" placeholder="例如: timeout" size="small" class="!w-full" />
            </div>
            <div>
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 block">配置类型 (Type)</label>
              <t-select v-model="newChildType" size="small" class="!w-full">
                <t-option value="string" label="文本 (String)" />
                <t-option value="number" label="数值 (Number)" />
                <t-option value="boolean" label="开关 (Boolean)" />
                <t-option value="array" label="列表 (Array)" />
                <t-option value="object" label="对象/字典 (Object)" />
              </t-select>
            </div>
            <div>
              <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 block">配置注释说明 (可选)</label>
              <t-textarea
                v-model="newChildComment"
                placeholder="在此输入作者配置说明，将作为 # 注释写入文件上方..."
                size="small"
                :autosize="{ minRows: 2, maxRows: 4 }"
                class="!w-full !text-xs"
              />
            </div>
          </div>
        </t-dialog>
      </div>
    </div>

    <!-- 2. 数组/列表类型 -->
    <div
      v-else-if="Array.isArray(val)"
      class="border border-zinc-200/80 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 mb-2 shadow-xs"
    >
      <div
        class="flex items-center justify-between px-3 py-1.5 bg-zinc-100/70 dark:bg-zinc-800/70 border-b border-zinc-200/60 dark:border-zinc-800 cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-700/40 transition-colors overflow-hidden"
        @click="isExpanded = !isExpanded"
      >
        <div class="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <chevron-down-icon
            class="text-xs text-zinc-400 shrink-0 transition-transform duration-200"
            :class="{ '-rotate-90': !isExpanded }"
          />
          <view-list-icon class="text-xs text-indigo-500 shrink-0" />
          <span class="font-bold text-xs font-mono text-zinc-800 dark:text-zinc-200 shrink-0" v-html="highlightText(String(keyName), filterKeyword)"></span>

          <t-tag size="small" variant="light" theme="primary" class="!text-[10px] !px-1.5 !h-4 !rounded shrink-0">
            Array [{{ val.length }}]
          </t-tag>

          <!-- 中文提示优先展示，旁边附带问号 tooltip 显示原有注释 -->
          <template v-if="docItem">
            <t-tooltip
              placement="top-left"
              theme="light"
            >
              <template #content>
                <div class="visual-tooltip-box">
                  <div class="visual-tooltip-title">【{{ docItem.title }}】</div>
                  <div class="visual-tooltip-text">{{ docItem.description }}</div>
                </div>
              </template>
              <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium cursor-help ml-1 hidden sm:flex items-center gap-1 min-w-0 max-w-[240px] md:max-w-xs overflow-hidden hover:opacity-85 transition-opacity">
                <span class="text-emerald-500 font-bold shrink-0 text-[10px]">#</span>
                <span class="truncate block min-w-0" v-html="highlightText(`${docItem.title}: ${docFirstLine}`, filterKeyword)"></span>
                <span v-if="docHasMore" class="text-[9px] text-emerald-500/80 shrink-0">(+)</span>
              </div>
            </t-tooltip>

            <!-- 问号显示原有英文注释 -->
            <t-tooltip
              v-if="commentText"
              placement="top"
              theme="light"
            >
              <template #content>
                <div class="visual-tooltip-box">
                  <div class="visual-tooltip-title font-mono">【配置项原注释】</div>
                  <div class="visual-tooltip-text font-mono text-[11px]">{{ commentText }}</div>
                </div>
              </template>
              <help-circle-icon class="text-xs text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-help shrink-0 ml-0.5 transition-colors" />
            </t-tooltip>
          </template>

          <!-- 未匹配到中文解释时，默认显示一行原注释 -->
          <t-tooltip
            v-else-if="commentText"
            placement="top-left"
            theme="light"
          >
            <template #content>
              <div class="visual-tooltip-box">
                <div class="visual-tooltip-text font-mono text-[11px]">{{ commentText }}</div>
              </div>
            </template>
            <div class="text-[11px] text-zinc-500 dark:text-zinc-400 cursor-help ml-1 hidden sm:flex items-center gap-1 min-w-0 max-w-[240px] md:max-w-xs overflow-hidden hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
              <span class="text-amber-500 font-bold shrink-0 text-[10px]">#</span>
              <span class="truncate block min-w-0" v-html="highlightText(firstLineComment, filterKeyword)"></span>
              <span v-if="hasMoreComment" class="text-[9px] text-amber-500/80 shrink-0">(+)</span>
            </div>
          </t-tooltip>
        </div>

        <div class="flex items-center gap-1 shrink-0" @click.stop>
          <t-button size="small" variant="text" shape="square" class="!h-6 !w-6" @click="addArrayItem">
            <template #icon><add-icon class="text-xs" /></template>
          </t-button>
          <t-popconfirm v-if="allowDelete" content="确定删除此列表吗？" theme="danger" @confirm="handleDeleteSelf">
            <t-button size="small" variant="text" theme="danger" shape="square" class="!h-6 !w-6 hover:!bg-red-500/10">
              <template #icon><delete-icon class="text-xs" /></template>
            </t-button>
          </t-popconfirm>
        </div>
      </div>

      <div v-if="isExpanded" class="p-3 space-y-2">
        <div v-if="val.length === 0" class="text-xs text-zinc-400 italic py-1">
          (空列表，点击右上角 + 添加项)
        </div>

        <div
          v-for="(item, index) in val"
          :key="index"
          class="flex items-center gap-2 transition-all"
          :class="{ 'visual-search-target ring-2 ring-amber-400/80 rounded-md p-0.5': isArrayItemMatched(item) }"
        >
          <span class="text-[11px] font-mono text-zinc-400 w-5 text-right shrink-0">#{{ index }}</span>
          
          <div class="flex-1 min-w-0">
            <t-switch v-if="typeof item === 'boolean'" :model-value="item" @change="updateArrayItem(index, $event)" />
            <t-input
              v-else
              :model-value="String(item)"
              size="small"
              class="!w-full !font-mono text-xs"
              @change="updateArrayItem(index, $event)"
            />
          </div>

          <t-button
            size="small"
            variant="text"
            theme="danger"
            shape="square"
            class="!h-6 !w-6 shrink-0 opacity-60 hover:opacity-100"
            @click="deleteArrayItem(index)"
          >
            <template #icon><close-icon class="text-xs" /></template>
          </t-button>
        </div>
      </div>
    </div>

    <!-- 3. 基本数据类型 (String, Number, Boolean, Null) -->
    <div
      v-else
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group overflow-hidden"
    >
      <!-- 键名与外露单行注释说明 -->
      <div class="flex flex-col justify-center min-w-0 sm:w-2/5 pr-2 overflow-hidden">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="font-bold text-xs font-mono text-zinc-800 dark:text-zinc-200 truncate" :title="String(keyName)" v-html="highlightText(String(keyName), filterKeyword)"></span>
          <t-tag size="small" variant="light" theme="default" class="!text-[9px] !px-1 !h-3.5 !rounded shrink-0 opacity-60">
            {{ typeof val }}
          </t-tag>
        </div>

        <!-- 中文提示优先展示，旁边附带问号 tooltip 显示原有注释 -->
        <div v-if="docItem" class="flex items-center gap-1 min-w-0 mt-0.5">
          <t-tooltip
            placement="top-left"
            theme="light"
          >
            <template #content>
              <div class="visual-tooltip-box">
                <div class="visual-tooltip-title">【{{ docItem.title }}】</div>
                <div class="visual-tooltip-text">{{ docItem.description }}</div>
              </div>
            </template>
            <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium cursor-help hover:opacity-85 transition-opacity flex items-center gap-1 min-w-0 overflow-hidden">
              <span class="text-emerald-500 font-bold shrink-0 text-[10px]">#</span>
              <span class="truncate block min-w-0" v-html="highlightText(`${docItem.title}: ${docFirstLine}`, filterKeyword)"></span>
              <span v-if="docHasMore" class="text-[9px] text-emerald-500/80 shrink-0">(+)</span>
            </div>
          </t-tooltip>

          <!-- 问号显示原有英文注释 -->
          <t-tooltip
            v-if="commentText"
            placement="top"
            theme="light"
          >
            <template #content>
              <div class="visual-tooltip-box">
                <div class="visual-tooltip-title font-mono">【配置项原注释】</div>
                <div class="visual-tooltip-text font-mono text-[11px]">{{ commentText }}</div>
              </div>
            </template>
            <help-circle-icon class="text-xs text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-help shrink-0 transition-colors" />
          </t-tooltip>
        </div>

        <!-- 默认在外部展示一行原注释，溢出或多行时悬浮 Tooltip 展示完整 -->
        <t-tooltip
          v-else-if="commentText"
          placement="top-left"
          theme="light"
        >
          <template #content>
            <div class="visual-tooltip-box">
              <div class="visual-tooltip-text font-mono text-[11px]">{{ commentText }}</div>
            </div>
          </template>
          <div class="text-[11px] text-zinc-500 dark:text-zinc-400 cursor-help mt-0.5 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors flex items-center gap-1 min-w-0 overflow-hidden">
            <span class="text-amber-500 font-bold shrink-0 text-[10px]">#</span>
            <span class="truncate block min-w-0" v-html="highlightText(firstLineComment, filterKeyword)"></span>
            <span v-if="hasMoreComment" class="text-[9px] text-amber-500/80 shrink-0">(+)</span>
          </div>
        </t-tooltip>
      </div>

      <!-- 控件与操作 -->
      <div class="flex items-center gap-2 flex-1 sm:w-3/5 justify-end min-w-0">
        <!-- Boolean 开关 -->
        <div
          v-if="typeof val === 'boolean'"
          class="flex items-center gap-2 transition-all p-0.5"
          :class="{ 'visual-search-target ring-2 ring-amber-400/80 rounded-md': isValueMatched }"
        >
          <t-switch
            :model-value="val"
            size="medium"
            @change="handlePrimitiveChange($event)"
          />
          <span class="text-xs font-mono" :class="val ? 'text-emerald-600 font-bold' : 'text-zinc-400'">
            {{ val }}
          </span>
        </div>

        <!-- 枚举选项：渲染为 Select 下拉选择框 -->
        <div
          v-else-if="selectOptions.length > 0"
          class="w-full sm:w-64 flex-1 transition-all"
          :class="{ 'visual-search-target ring-2 ring-amber-400/80 rounded-md': isValueMatched }"
        >
          <t-select
            :model-value="val"
            size="small"
            :creatable="true"
            :filterable="true"
            :clearable="false"
            placeholder="请选择或输入"
            class="!font-mono !text-xs !w-full"
            @change="handlePrimitiveChange($event)"
          >
            <t-option
              v-for="opt in selectOptions"
              :key="String(opt.value)"
              :value="opt.value"
              :label="opt.label"
            >
              <div class="flex items-center justify-between w-full gap-2">
                <span class="font-mono text-xs">{{ opt.label }}</span>
                <span v-if="opt.description" class="text-[10px] text-zinc-400 shrink-0">{{ opt.description }}</span>
              </div>
            </t-option>
          </t-select>
        </div>

        <!-- Number 输入框 -->
        <div
          v-else-if="typeof val === 'number'"
          class="w-full sm:w-48 transition-all"
          :class="{ 'visual-search-target ring-2 ring-amber-400/80 rounded-md': isValueMatched }"
        >
          <t-input
            :model-value="String(val)"
            type="number"
            size="small"
            class="!font-mono !text-xs !w-full"
            @change="handlePrimitiveChange(Number($event))"
          />
        </div>

        <!-- String 输入框 -->
        <div
          v-else
          class="w-full sm:w-64 flex-1 transition-all"
          :class="{ 'visual-search-target ring-2 ring-amber-400/80 rounded-md': isValueMatched }"
        >
          <t-textarea
            v-if="String(val).includes('\n') || String(val).length > 60"
            :model-value="String(val)"
            :autosize="{ minRows: 1, maxRows: 4 }"
            size="small"
            class="!font-mono !text-xs !w-full"
            @change="handlePrimitiveChange($event)"
          />
          <t-input
            v-else
            :model-value="String(val ?? '')"
            size="small"
            class="!font-mono !text-xs !w-full"
            @change="handlePrimitiveChange($event)"
          />
        </div>

        <t-popconfirm v-if="allowDelete" content="确定删除此项吗？" theme="danger" @confirm="handleDeleteSelf">
          <t-button
            size="small"
            variant="text"
            theme="danger"
            shape="square"
            class="!h-6 !w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <template #icon><delete-icon class="text-xs" /></template>
          </t-button>
        </t-popconfirm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  FolderIcon,
  FolderOpenIcon,
  ChevronDownIcon,
  ViewListIcon,
  AddIcon,
  DeleteIcon,
  CloseIcon,
  HelpCircleIcon,
} from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { ConfigDocItem } from '../resources/configDescriptions/types';

const props = withDefaults(
  defineProps<{
    modelValue: any;
    keyName: string | number;
    path?: string;
    pathArray?: (string | number)[];
    depth?: number;
    allowDelete?: boolean;
    commentsMap?: Record<string, { commentBefore?: string; inlineComment?: string }>;
    chineseDocs?: Record<string, ConfigDocItem>;
    filterKeyword?: string;
  }>(),
  {
    path: '',
    pathArray: () => [],
    depth: 0,
    allowDelete: true,
    commentsMap: () => ({}),
    chineseDocs: () => ({}),
    filterKeyword: '',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'delete'): void;
  (e: 'update-path', path: (string | number)[], value: any): void;
  (e: 'delete-path', path: (string | number)[]): void;
  (e: 'add-pair', parentPath: (string | number)[], key: string, value: any, comment?: string): void;
}>();

const val = computed(() => props.modelValue);
const isExpanded = ref(true);

// 搜索关键字变化时，自动展开有匹配内容的目录
watch(
  () => props.filterKeyword,
  (kw) => {
    if (kw && kw.trim()) {
      isExpanded.value = true;
    }
  },
  { immediate: true }
);

const currentPathArray = computed(() => [...props.pathArray, props.keyName]);
const currentPathStr = computed(() => props.path || String(props.keyName));

// 中文对照文档匹配
const docItem = computed<ConfigDocItem | undefined>(() => {
  if (!props.chineseDocs) return undefined;
  const path = currentPathStr.value;
  return props.chineseDocs[path] || props.chineseDocs[path.toLowerCase()];
});

// 计算用于当前选择框的选项列表（包含当前可能自定义的值）
const selectOptions = computed(() => {
  if (!docItem.value?.options || docItem.value.options.length === 0) return [];
  const opts = [...docItem.value.options];
  const currentVal = val.value;
  if (currentVal !== undefined && currentVal !== null && currentVal !== '') {
    const exists = opts.some((o) => String(o.value) === String(currentVal));
    if (!exists) {
      opts.unshift({
        value: currentVal,
        label: `${currentVal} (当前值)`,
      });
    }
  }
  return opts;
});

const docFirstLine = computed(() => {
  if (!docItem.value) return '';
  const lines = docItem.value.description.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines[0] || '';
});

const docHasMore = computed(() => {
  if (!docItem.value) return false;
  const lines = docItem.value.description.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length > 1 || docFirstLine.value.length > 30;
});

const currentComment = computed(() => {
  return props.commentsMap?.[currentPathStr.value];
});

const commentText = computed(() => {
  if (!currentComment.value) return '';
  const parts: string[] = [];
  if (currentComment.value.commentBefore) {
    parts.push(currentComment.value.commentBefore);
  }
  if (currentComment.value.inlineComment) {
    parts.push(`[说明] ${currentComment.value.inlineComment}`);
  }
  return parts.join('\n');
});

const firstLineComment = computed(() => {
  if (!commentText.value) return '';
  const lines = commentText.value.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines[0] || '';
});

const hasMoreComment = computed(() => {
  if (!commentText.value) return false;
  const lines = commentText.value.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length > 1 || firstLineComment.value.length > 35;
});

// 搜索关键字高亮工具函数
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text: string, kw?: string): string => {
  if (!text) return '';
  if (!kw || !kw.trim()) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${escapeRegExp(escapeHtml(kw.trim()))})`, 'gi');
  return escaped.replace(
    regex,
    '<mark class="visual-search-target bg-amber-200/90 dark:bg-amber-400/30 text-amber-950 dark:text-amber-100 px-0.5 rounded-xs font-semibold">$1</mark>'
  );
};

const isObject = (item: any): boolean => {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
};

const isValueMatched = computed(() => {
  if (!props.filterKeyword || !props.filterKeyword.trim()) return false;
  if (isObject(val.value) || Array.isArray(val.value)) return false;
  return String(val.value ?? '').toLowerCase().includes(props.filterKeyword.toLowerCase().trim());
});

const isArrayItemMatched = (item: any): boolean => {
  if (!props.filterKeyword || !props.filterKeyword.trim()) return false;
  return String(item ?? '').toLowerCase().includes(props.filterKeyword.toLowerCase().trim());
};

// 基本类型变更
const handlePrimitiveChange = (newVal: any) => {
  emit('update:modelValue', newVal);
  emit('update-path', currentPathArray.value, newVal);
};

const handleDeleteSelf = () => {
  emit('delete');
  emit('delete-path', currentPathArray.value);
};

// 子属性变更
const updateChildValue = (childKey: string | number, newChildVal: any) => {
  const updated = { ...props.modelValue, [childKey]: newChildVal };
  emit('update:modelValue', updated);
  emit('update-path', [...currentPathArray.value, childKey], newChildVal);
};

// 删除子属性
const deleteChildKey = (childKey: string | number) => {
  const updated = { ...props.modelValue };
  delete updated[childKey];
  emit('update:modelValue', updated);
  emit('delete-path', [...currentPathArray.value, childKey]);
};

// 列表操作
const updateArrayItem = (index: number, newItemVal: any) => {
  const updated = [...props.modelValue];
  updated[index] = newItemVal;
  emit('update:modelValue', updated);
  emit('update-path', [...currentPathArray.value, index], newItemVal);
};

const deleteArrayItem = (index: number) => {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
  emit('delete-path', [...currentPathArray.value, index]);
};

const addArrayItem = () => {
  const updated = [...(props.modelValue || []), ''];
  emit('update:modelValue', updated);
  emit('update-path', [...currentPathArray.value, updated.length - 1], '');
};

// 添加子属性弹窗
const showAddChild = ref(false);
const newChildKey = ref('');
const newChildType = ref<'string' | 'number' | 'boolean' | 'array' | 'object'>('string');
const newChildComment = ref('');

const confirmAddChild = () => {
  const key = newChildKey.value.trim();
  if (!key) {
    MessagePlugin.warning('请输入键名');
    return;
  }
  if (props.modelValue && Object.prototype.hasOwnProperty.call(props.modelValue, key)) {
    MessagePlugin.warning('已存在同名键');
    return;
  }

  let initialVal: any = '';
  switch (newChildType.value) {
    case 'number':
      initialVal = 0;
      break;
    case 'boolean':
      initialVal = false;
      break;
    case 'array':
      initialVal = [];
      break;
    case 'object':
      initialVal = {};
      break;
    default:
      initialVal = '';
  }

  updateChildValue(key, initialVal);
  emit('add-pair', currentPathArray.value, key, initialVal, newChildComment.value.trim());

  newChildKey.value = '';
  newChildComment.value = '';
  showAddChild.value = false;
};
</script>

<style>
.visual-tooltip-box {
  max-width: 480px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px 2px;
}
.visual-tooltip-title {
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 4px;
  color: #0f172a;
}
.visual-tooltip-text {
  white-space: pre-line !important;
  word-break: break-word !important;
  line-height: 1.6;
  font-size: 11px;
  color: #334155;
}
.dark .visual-tooltip-title {
  color: #f8fafc;
}
.dark .visual-tooltip-text {
  color: #cbd5e1;
}
</style>
