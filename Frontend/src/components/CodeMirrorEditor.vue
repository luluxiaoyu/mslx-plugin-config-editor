<template>
  <div class="codemirror-wrapper flex-1 w-full h-full min-h-0 relative flex flex-col overflow-hidden">
    <codemirror
      v-model="code"
      :placeholder="'请输入配置内容...'"
      :style="{ height: '100%', width: '100%' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="editorExtensions"
      :disabled="readonly"
      class="flex-1 min-h-0 h-full w-full overflow-hidden text-[13px] font-mono leading-relaxed"
      @ready="handleReady"
      @keydown="handleKeyDown"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { yaml } from '@codemirror/lang-yaml';
import { json } from '@codemirror/lang-json';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { Compartment } from '@codemirror/state';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    fileName?: string;
    readonly?: boolean;
  }>(),
  {
    modelValue: '',
    fileName: 'config.yml',
    readonly: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'save'): void;
}>();

const code = ref(props.modelValue);
const view = shallowRef<EditorView | null>(null);
const isDarkMode = ref(false);

const languageCompartment = new Compartment();
const themeCompartment = new Compartment();

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== code.value) {
      code.value = newVal;
    }
  }
);

watch(code, (newVal) => {
  emit('update:modelValue', newVal);
});

// 检测系统暗黑模式
const checkDarkMode = () => {
  const root = document.documentElement;
  isDarkMode.value =
    root.getAttribute('theme-mode') === 'dark' ||
    root.classList.contains('dark') ||
    root.getAttribute('data-theme') === 'dark';
};

let observer: MutationObserver | null = null;
onMounted(() => {
  checkDarkMode();
  observer = new MutationObserver(checkDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['theme-mode', 'class', 'data-theme'],
  });
});

onUnmounted(() => {
  observer?.disconnect();
});

const getLanguageExtension = (fileName?: string) => {
  const ext = (fileName || '').split('.').pop()?.toLowerCase();
  if (ext === 'yml' || ext === 'yaml') {
    return yaml();
  }
  if (ext === 'json') {
    return json();
  }
  return [];
};

const editorExtensions = computed(() => {
  const exts: any[] = [
    history(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      {
        key: 'Mod-s',
        run: () => {
          emit('save');
          return true;
        },
      },
    ]),
    EditorView.lineWrapping,
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    languageCompartment.of(getLanguageExtension(props.fileName)),
    themeCompartment.of(isDarkMode.value ? oneDark : []),
  ];

  return exts;
});

const handleReady = (payload: { view: EditorView }) => {
  view.value = payload.view;
};

// 动态重配置语言
watch(
  () => props.fileName,
  (newFileName) => {
    if (view.value) {
      view.value.dispatch({
        effects: languageCompartment.reconfigure(getLanguageExtension(newFileName)),
      });
    }
  }
);

// 动态重配置主题
watch(isDarkMode, (dark) => {
  if (view.value) {
    view.value.dispatch({
      effects: themeCompartment.reconfigure(dark ? oneDark : []),
    });
  }
});

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    emit('save');
  }
};
</script>

<style scoped>
.codemirror-wrapper :deep(.cm-editor) {
  height: 100% !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.codemirror-wrapper :deep(.cm-scroller) {
  height: 100% !important;
  overflow: auto !important;
  font-size: 13px;
  line-height: 1.6;
}

.codemirror-wrapper :deep(.cm-focused) {
  outline: none;
}
</style>
