<template>
  <div class="visual-form-editor flex-1 w-full h-full min-h-0 flex flex-col overflow-hidden bg-white dark:bg-zinc-900">
    <!-- 顶部工具条 -->
    <div class="px-4 py-2 bg-zinc-50/80 dark:bg-zinc-950/30 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-2 shrink-0">
      <div class="flex items-center gap-1.5 flex-1 max-w-md">
        <t-input
          v-model="filterKeyword"
          placeholder="搜索键名、数值或注释 (Enter定位下一处)..."
          size="small"
          clearable
          class="!rounded-md"
          @enter="handleSearchEnter"
          @clear="handleSearchClear"
        >
          <template #prefix-icon><search-icon class="text-zinc-400" /></template>
        </t-input>

        <!-- 匹配位置与总数标签 -->
        <t-tag
          v-if="filterKeyword.trim()"
          size="small"
          variant="light"
          :theme="totalMatches > 0 ? 'primary' : 'warning'"
          class="!text-[10px] shrink-0 font-mono"
        >
          {{ totalMatches > 0 ? `${currentMatchIndex >= 0 ? currentMatchIndex + 1 : 1}/${totalMatches}` : '无匹配' }}
        </t-tag>

        <!-- 上下定位按钮组 -->
        <div v-if="filterKeyword.trim() && totalMatches > 0" class="flex items-center gap-0.5 shrink-0 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded border border-zinc-200/80 dark:border-zinc-700/80">
          <t-tooltip content="上一处 (Shift + Enter)" placement="top">
            <t-button
              size="small"
              variant="text"
              shape="square"
              class="!h-6 !w-6 !rounded hover:!bg-zinc-200 dark:hover:!bg-zinc-700"
              @click="goToPrevMatch"
            >
              <template #icon><chevron-up-icon class="text-xs text-zinc-600 dark:text-zinc-300" /></template>
            </t-button>
          </t-tooltip>

          <t-tooltip content="下一处 (Enter)" placement="top">
            <t-button
              size="small"
              variant="text"
              shape="square"
              class="!h-6 !w-6 !rounded hover:!bg-zinc-200 dark:hover:!bg-zinc-700"
              @click="goToNextMatch"
            >
              <template #icon><chevron-down-icon class="text-xs text-zinc-600 dark:text-zinc-300" /></template>
            </t-button>
          </t-tooltip>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <t-tag
          v-if="hasChineseDocs"
          size="small"
          variant="light"
          theme="success"
          class="!text-[10px] !px-2 !rounded-md font-medium hidden md:inline-flex"
        >
          已载入中文说明对照
        </t-tag>

        <t-button size="small" theme="primary" variant="outline" class="!rounded-md shrink-0" @click="showAddRoot = true">
          <template #icon><add-icon /></template> 添加配置项
        </t-button>
      </div>
    </div>

    <!-- 主表单区（独立垂直滚动） -->
    <div ref="scrollContainerRef" class="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-2 relative">
      <div v-if="!formData || Object.keys(formData).length === 0" class="py-16 text-center text-zinc-400 text-xs">
        <p class="mb-2">暂无配置项</p>
        <t-button size="small" theme="primary" variant="base" @click="showAddRoot = true">
          添加第一个配置项
        </t-button>
      </div>

      <div v-else-if="filterKeyword.trim() && Object.keys(filteredData).length === 0" class="py-16 text-center text-zinc-400 text-xs">
        <p class="mb-2">未找到与「{{ filterKeyword }}」匹配的配置项或注释</p>
        <t-button size="small" variant="text" theme="primary" @click="filterKeyword = ''">
          清除搜索条件
        </t-button>
      </div>

      <template v-else>
        <visual-form-item
          v-for="(val, key) in filteredData"
          :key="key"
          :model-value="val"
          :key-name="key"
          :path="String(key)"
          :path-array="[]"
          :depth="0"
          :allow-delete="true"
          :comments-map="comments"
          :chinese-docs="chineseDocs"
          :filter-keyword="filterKeyword"
          @update:model-value="handleUpdateKey(key, $event)"
          @delete="handleDeleteKey(key)"
          @update-path="(path, value) => emit('update-path', path, value)"
          @delete-path="(path) => emit('delete-path', path)"
          @add-pair="(parentPath, k, v, c) => emit('add-pair', parentPath, k, v, c)"
        />
      </template>
    </div>

    <!-- 添加根配置项弹窗 -->
    <t-dialog
      v-model:visible="showAddRoot"
      header="添加根配置项"
      width="420px"
      attach="body"
      @confirm="confirmAddRoot"
    >
      <div class="space-y-3 py-2">
        <div>
          <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 block">配置键名 (Key)</label>
          <t-input v-model="newRootKey" placeholder="例如: server-ip 或 settings" size="small" class="!w-full" />
        </div>
        <div>
          <label class="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 block">配置类型 (Type)</label>
          <t-select v-model="newRootType" size="small" class="!w-full">
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
            v-model="newRootComment"
            placeholder="在此输入配置项说明，将作为 # 注释写入文件上方..."
            size="small"
            :autosize="{ minRows: 2, maxRows: 4 }"
            class="!w-full !text-xs"
          />
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { SearchIcon, AddIcon, ChevronUpIcon, ChevronDownIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import VisualFormItem from './VisualFormItem.vue';
import { findConfigDocMap, type ConfigDocMap } from '../resources/configDescriptions';

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>;
    fileName?: string;
    pluginName?: string;
    comments?: Record<string, { commentBefore?: string; inlineComment?: string }>;
  }>(),
  {
    comments: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'update-path', path: (string | number)[], value: any): void;
  (e: 'delete-path', path: (string | number)[]): void;
  (e: 'add-pair', parentPath: (string | number)[], key: string, value: any, comment?: string): void;
}>();

const formData = computed(() => props.modelValue || {});
const filterKeyword = ref('');

// 智能匹配当前插件配置的中文对照库
const chineseDocs = computed<ConfigDocMap>(() => {
  return findConfigDocMap(props.pluginName, props.fileName);
});

const hasChineseDocs = computed(() => Object.keys(chineseDocs.value).length > 0);

// 深度递归搜索：搜索键名、数值、中文说明与注释，精准保留匹配分支
function deepFilter(
  obj: any,
  kw: string,
  comments: Record<string, any>,
  cDocs: ConfigDocMap,
  currentPath: string[] = []
): { matches: boolean; data: any; matchCount: number } {
  if (!kw) return { matches: true, data: obj, matchCount: 0 };

  if (Array.isArray(obj)) {
    const filteredArr: any[] = [];
    let anyChildMatched = false;
    let count = 0;
    for (let i = 0; i < obj.length; i++) {
      const childRes = deepFilter(obj[i], kw, comments, cDocs, [...currentPath, String(i)]);
      if (childRes.matches) {
        anyChildMatched = true;
        count += childRes.matchCount;
        filteredArr.push(childRes.data);
      }
    }
    return { matches: anyChildMatched, data: anyChildMatched ? filteredArr : [], matchCount: count };
  } else if (obj !== null && typeof obj === 'object') {
    const filteredObj: Record<string, any> = {};
    let anyChildMatched = false;
    let count = 0;
    for (const [k, v] of Object.entries(obj)) {
      const childPath = [...currentPath, k];
      const pathStr = childPath.join('.');
      const commentInfo = comments[pathStr];
      const commentText = (commentInfo?.commentBefore || '') + ' ' + (commentInfo?.inlineComment || '');
      const docItem = cDocs[pathStr] || cDocs[k];
      const docOptionsText = docItem?.options ? docItem.options.map((o) => `${o.label} ${o.value} ${o.description || ''}`).join(' ') : '';
      const docText = docItem ? `${docItem.title} ${docItem.description} ${docOptionsText}` : '';

      const keyMatches = k.toLowerCase().includes(kw);
      const docMatches = docText.toLowerCase().includes(kw);
      const commentMatches = commentText.toLowerCase().includes(kw);
      const childRes = deepFilter(v, kw, comments, cDocs, childPath);

      if (keyMatches || docMatches || commentMatches || childRes.matches) {
        anyChildMatched = true;
        count += (keyMatches ? 1 : 0) + (docMatches ? 1 : 0) + (commentMatches ? 1 : 0) + childRes.matchCount;
        // 如果当前 key 或 doc 或 comment 匹配，则展示其完整子树；否则展示下层匹配分支
        filteredObj[k] = (keyMatches || docMatches || commentMatches) ? v : childRes.data;
      }
    }
    return { matches: anyChildMatched, data: anyChildMatched ? filteredObj : {}, matchCount: count };
  } else {
    const valMatches = String(obj ?? '').toLowerCase().includes(kw);
    return { matches: valMatches, data: obj, matchCount: valMatches ? 1 : 0 };
  }
}

const searchResult = computed(() => {
  if (!filterKeyword.value.trim()) {
    return { data: formData.value, matchCount: 0 };
  }
  const kw = filterKeyword.value.toLowerCase().trim();
  const res = deepFilter(formData.value, kw, props.comments || {}, chineseDocs.value);
  return { data: res.data || {}, matchCount: res.matchCount };
});

const filteredData = computed(() => searchResult.value.data);

const handleUpdateKey = (key: string | number, newVal: any) => {
  const updated = { ...props.modelValue, [key]: newVal };
  emit('update:modelValue', updated);
  emit('update-path', [key], newVal);
};

const handleDeleteKey = (key: string | number) => {
  const updated = { ...props.modelValue };
  delete updated[key];
  emit('update:modelValue', updated);
  emit('delete-path', [key]);
};

// 添加根项
const showAddRoot = ref(false);
const newRootKey = ref('');
const newRootType = ref<'string' | 'number' | 'boolean' | 'array' | 'object'>('string');
const newRootComment = ref('');

const confirmAddRoot = () => {
  const key = newRootKey.value.trim();
  if (!key) {
    MessagePlugin.warning('请输入配置键名');
    return;
  }
  if (props.modelValue && Object.prototype.hasOwnProperty.call(props.modelValue, key)) {
    MessagePlugin.warning('已存在同名配置项');
    return;
  }

  let initialVal: any = '';
  switch (newRootType.value) {
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

  handleUpdateKey(key, initialVal);
  emit('add-pair', [], key, initialVal, newRootComment.value.trim());

  newRootKey.value = '';
  newRootComment.value = '';
  showAddRoot.value = false;
};

// 搜索上下定位导航逻辑
const scrollContainerRef = ref<HTMLElement | null>(null);
const totalMatches = ref(0);
const currentMatchIndex = ref(-1);
let hasJumped = false;

const clearActiveMatch = () => {
  if (!scrollContainerRef.value) return;
  const activeEls = scrollContainerRef.value.querySelectorAll('.visual-search-target-active');
  activeEls.forEach((el) => el.classList.remove('visual-search-target-active'));
};

const getTargets = (): HTMLElement[] => {
  if (!scrollContainerRef.value) return [];
  return Array.from(scrollContainerRef.value.querySelectorAll<HTMLElement>('.visual-search-target'));
};

const scrollToTarget = (target: HTMLElement) => {
  const container = scrollContainerRef.value;
  if (!container) return;

  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const currentScrollTop = container.scrollTop;
  const relativeTop = targetRect.top - containerRect.top + currentScrollTop;
  const targetScrollTop = relativeTop - (container.clientHeight / 2) + (targetRect.height / 2);

  container.scrollTo({
    top: Math.max(0, targetScrollTop),
    behavior: 'smooth',
  });
};

const highlightTarget = (targets: HTMLElement[], index: number, doScroll: boolean = true) => {
  clearActiveMatch();
  if (!targets || targets.length === 0 || index < 0 || index >= targets.length) return;

  const target = targets[index];
  if (!target) return;

  target.classList.add('visual-search-target-active');

  if (doScroll) {
    scrollToTarget(target);
  }
};

const updateTargetsState = async (resetIndex: boolean = false) => {
  await nextTick();
  const targets = getTargets();
  totalMatches.value = targets.length;

  if (totalMatches.value === 0) {
    currentMatchIndex.value = -1;
    clearActiveMatch();
    return;
  }

  if (resetIndex || currentMatchIndex.value === -1 || currentMatchIndex.value >= totalMatches.value) {
    currentMatchIndex.value = 0;
  }

  highlightTarget(targets, currentMatchIndex.value, false);
};

// 监听搜索词变化
watch(
  () => filterKeyword.value,
  async (newKw) => {
    hasJumped = false;
    clearActiveMatch();
    if (!newKw || !newKw.trim()) {
      currentMatchIndex.value = -1;
      totalMatches.value = 0;
      return;
    }
    await updateTargetsState(true);
  }
);

const goToNextMatch = async () => {
  if (!filterKeyword.value.trim()) return;
  await nextTick();
  const targets = getTargets();
  totalMatches.value = targets.length;
  if (targets.length === 0) return;

  if (!hasJumped) {
    hasJumped = true;
    currentMatchIndex.value = 0;
  } else {
    currentMatchIndex.value = (currentMatchIndex.value + 1) % targets.length;
  }

  highlightTarget(targets, currentMatchIndex.value, true);
};

const goToPrevMatch = async () => {
  if (!filterKeyword.value.trim()) return;
  await nextTick();
  const targets = getTargets();
  totalMatches.value = targets.length;
  if (targets.length === 0) return;

  if (!hasJumped) {
    hasJumped = true;
    currentMatchIndex.value = targets.length - 1;
  } else {
    currentMatchIndex.value = (currentMatchIndex.value - 1 + targets.length) % targets.length;
  }

  highlightTarget(targets, currentMatchIndex.value, true);
};

const handleSearchEnter = (_val: string, ctx?: { e: KeyboardEvent }) => {
  const e = ctx?.e;
  e?.preventDefault?.();
  if (e?.shiftKey) {
    goToPrevMatch();
  } else {
    goToNextMatch();
  }
};

const handleSearchClear = () => {
  filterKeyword.value = '';
  currentMatchIndex.value = -1;
  totalMatches.value = 0;
  clearActiveMatch();
};
</script>

<style scoped>
.custom-scrollbar {
  overscroll-behavior: contain;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 120, 120, 0.4);
}

:deep(.visual-search-target) {
  transition: background-color 0.15s ease, color 0.15s ease;
}

/* 选中的标记（仿 Chrome/VSCode 原生搜索高亮：清晰鲜明的橙色白字，无异形描边） */
:deep(mark.visual-search-target-active) {
  background-color: #f97316 !important; /* 经典橙色高亮 */
  color: #ffffff !important;
  border-radius: 2px !important;
  padding: 0 2px !important;
  font-weight: 700 !important;
  outline: none !important;
  box-shadow: 0 1px 3px rgba(249, 115, 22, 0.4) !important;
}

/* 选中的数值或输入控件外框 */
:deep(div.visual-search-target-active) {
  outline: none !important;
  box-shadow: 0 0 0 2px #f97316 !important;
  border-radius: 6px !important;
  background-color: rgba(249, 115, 22, 0.04) !important;
}
</style>
