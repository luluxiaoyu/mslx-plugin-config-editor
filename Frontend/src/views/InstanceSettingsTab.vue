<template>
  <div
    class="config-editor-root -m-4 -mb-20 md:m-0 md:-ml-8 md:-mr-2 md:-mb-12 h-[75vh] md:h-[72vh] flex flex-col md:flex-row overflow-hidden bg-white dark:bg-zinc-900"
  >
    <!-- 移动端：上方 / PC端：左侧 插件与文件树 -->
    <div
      class="w-full md:w-64 lg:w-72 shrink-0 h-[38%] md:h-full min-h-0 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden"
    >
      <plugin-tree-sidebar
        :plugins="pluginList"
        :loading="loadingScan"
        :selected-file="selectedFile"
        :selected-plugin="selectedPlugin"
        @select-file="handleSelectFile"
        @refresh="fetchPluginList"
      />
    </div>

    <!-- 移动端：下方 / PC端：右侧 工作台与编辑器 -->
    <div
      class="flex-1 w-full min-w-0 min-h-0 md:h-full flex flex-col bg-white dark:bg-zinc-900 overflow-hidden relative"
    >
      <!-- 顶部工具栏 -->
      <div
        v-if="selectedFile"
        class="px-2.5 py-1.5 md:px-4 md:py-2 border-b border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-2 bg-zinc-50/50 dark:bg-zinc-950/20 shrink-0"
      >
        <!-- 移动端第1行 / PC端左区：路径、状态与模式切换 -->
        <div class="flex items-center justify-between md:justify-start gap-2 min-w-0 w-full md:w-auto">
          <!-- 路径信息与状态 -->
          <div class="flex items-center gap-1.5 min-w-0">
            <file-icon class="text-zinc-500 shrink-0 text-xs md:text-sm" />
            <div class="flex items-center gap-1 text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate max-w-[130px] sm:max-w-[200px] md:max-w-none">
              <span class="font-bold text-zinc-900 dark:text-zinc-100 truncate">{{ selectedPlugin?.pluginName }}</span>
              <span class="text-zinc-400">/</span>
              <span class="truncate">{{ selectedFile.name }}</span>
            </div>

            <t-tag
              v-if="isDirty"
              theme="warning"
              variant="light"
              size="small"
              class="!text-[10px] !px-1.5 !h-4 !rounded shrink-0"
            >
              ● 未保存
            </t-tag>
            <t-tag
              v-else
              theme="success"
              variant="light"
              size="small"
              class="!text-[10px] !px-1.5 !h-4 !rounded shrink-0"
            >
              已同步
            </t-tag>
          </div>

          <!-- 模式切换（移动端靠右，PC端紧随路径） -->
          <div class="flex items-center shrink-0 md:ml-4">
            <t-radio-group
              v-model="viewMode"
              variant="default-filled"
              size="small"
              @change="handleViewModeChange"
            >
              <t-radio-button value="code">
                <span class="flex items-center gap-1 text-xs">
                  <code-icon class="text-xs" /> 源码模式
                </span>
              </t-radio-button>
              <t-radio-button value="visual">
                <span class="flex items-center gap-1 text-xs">
                  <view-module-icon class="text-xs" /> 可视化模式
                </span>
              </t-radio-button>
            </t-radio-group>
          </div>
        </div>

        <!-- 移动端第2行（横向平滑滚动防截断防吞） / PC端右侧操作按钮组 -->
        <div class="flex items-center justify-start md:justify-end gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto py-0.5 shrink-0">
          <t-checkbox v-model="createBackup" size="small" class="!text-xs text-zinc-500 mr-1 shrink-0 whitespace-nowrap">
            自动备份 (.bak)
          </t-checkbox>

          <t-tooltip content="从 Jar 包内提取初始默认配置进行并排对比">
            <t-button
              size="small"
              variant="outline"
              class="!rounded-lg !bg-white dark:!bg-zinc-800 shrink-0 whitespace-nowrap text-xs"
              :loading="loadingTemplate"
              @click="openTemplateDiff"
            >
              <template #icon><swap-icon /></template> 模版对比
            </t-button>
          </t-tooltip>

          <t-tooltip content="在文件管理器中定位到此插件目录并关闭当前配置面板">
            <t-button
              size="small"
              variant="outline"
              class="!rounded-lg !bg-white dark:!bg-zinc-800 shrink-0 whitespace-nowrap text-xs"
              @click="openInFileManager"
            >
              <template #icon><folder-open-icon /></template> 定位文件
            </t-button>
          </t-tooltip>

          <t-button
            size="small"
            theme="primary"
            class="!rounded-lg shadow-sm shrink-0 whitespace-nowrap text-xs"
            :loading="saving"
            :disabled="!isDirty"
            @click="handleSave"
          >
            <template #icon><save-icon /></template> 保存配置
          </t-button>
        </div>
      </div>

      <!-- 编辑器主体（满高，独立滚动） -->
      <div class="flex-1 min-h-0 h-full w-full overflow-hidden flex flex-col relative">
        <template v-if="selectedFile">
          <!-- 源码模式 (CodeMirror 6) -->
          <code-mirror-editor
            v-if="viewMode === 'code'"
            v-model="editorContent"
            :file-name="selectedFile.name"
            class="flex-1 min-h-0 h-full w-full"
            @save="handleSave"
          />

          <!-- 可视化表单模式 -->
          <visual-form-editor
            v-else
            :model-value="visualData"
            :comments="visualComments"
            :file-name="selectedFile.name"
            :plugin-name="selectedPlugin?.pluginName || selectedPlugin?.jarFileName"
            class="flex-1 min-h-0 h-full w-full"
            @update:model-value="handleVisualUpdate"
            @update-path="handleVisualPathUpdate"
            @delete-path="handleVisualPathDelete"
            @add-pair="handleVisualAddPair"
          />
        </template>

        <!-- 空状态 -->
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 p-8 text-center"
        >
          <extension-icon size="48px" class="opacity-30 mb-3" />
          <p class="text-sm font-medium mb-1">请在左侧选择一个插件配置文件开始编辑</p>
          <p class="text-xs text-zinc-400">支持可视化键值表单、YAML/JSON/TOML 源码高亮与快捷键保存 (Ctrl+S / ⌘S)</p>
        </div>

        <!-- 内容加载遮罩 -->
        <div
          v-if="loadingContent"
          class="absolute inset-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs flex items-center justify-center z-20"
        >
          <t-loading size="medium" text="正在读取配置文件内容..." />
        </div>
      </div>
    </div>

    <!-- 模版对比弹窗 -->
    <template-diff-modal
      v-if="selectedFile && selectedPlugin"
      v-model:visible="showDiffModal"
      :plugin-name="selectedPlugin.pluginName"
      :file-name="selectedFile.name"
      :current-content="editorContent"
      :default-content="templateDefaultContent"
      @apply-default="handleApplyDefault"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import {
  FileIcon,
  SaveIcon,
  SwapIcon,
  FolderOpenIcon,
  ExtensionIcon,
  CodeIcon,
  ViewModuleIcon,
} from 'tdesign-icons-vue-next';
import YAML from 'yaml';
import {
  parseYamlWithComments,
  updateYamlValue,
  deleteYamlValue,
  addYamlPair,
  setInObject,
  deleteInObject,
  type CommentMap,
} from '../utils/yamlAstHelper';

import type { PluginInfo, PluginConfigFile } from '../types/pluginConfig';
import {
  getPluginScanList,
  getConfigFileContent,
  saveConfigFile,
  getJarDefaultTemplate,
} from '../api/configEditor';

import PluginTreeSidebar from '../components/PluginTreeSidebar.vue';
import CodeMirrorEditor from '../components/CodeMirrorEditor.vue';
import VisualFormEditor from '../components/VisualFormEditor.vue';
import TemplateDiffModal from '../components/TemplateDiffModal.vue';

const props = defineProps<{
  serverId?: number;
  instanceId?: number;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'saved'): void;
  (e: 'close'): void;
}>();

const router = useRouter();
const route = useRoute();

// 当前实例 ID 计算
const targetInstanceId = computed(() => {
  return props.instanceId || props.serverId || parseInt(route.params.serverId as string) || 0;
});

// 状态管理
const loadingScan = ref(false);
const loadingContent = ref(false);
const loadingTemplate = ref(false);
const saving = ref(false);
const createBackup = ref(true);

const viewMode = ref<'code' | 'visual'>('visual');
const visualData = ref<Record<string, any>>({});
const visualComments = ref<CommentMap>({});
const yamlDoc = shallowRef<YAML.Document | null>(null);

const pluginList = ref<PluginInfo[]>([]);
const selectedPlugin = ref<PluginInfo | null>(null);
const selectedFile = ref<PluginConfigFile | null>(null);

const editorContent = ref('');
const savedContent = ref('');

const showDiffModal = ref(false);
const templateDefaultContent = ref('');

// 是否有未保存修改
const isDirty = computed(() => editorContent.value !== savedContent.value);

// 模式切换
const handleViewModeChange = (val: 'code' | 'visual') => {
  if (val === 'visual') {
    const ext = selectedFile.value?.name.split('.').pop()?.toLowerCase();
    if (ext === 'yml' || ext === 'yaml') {
      try {
        const parsed = parseYamlWithComments(editorContent.value);
        yamlDoc.value = parsed.doc;
        visualData.value = parsed.data;
        visualComments.value = parsed.comments;
      } catch (err: any) {
        MessagePlugin.error(`YAML 语法解析错误，无法切换为可视化模式: ${err.message || err}`);
        viewMode.value = 'code';
      }
    } else if (ext === 'json') {
      try {
        visualData.value = JSON.parse(editorContent.value || '{}');
        visualComments.value = {};
        yamlDoc.value = null;
      } catch (err: any) {
        MessagePlugin.error(`JSON 语法解析错误，无法切换为可视化模式: ${err.message || err}`);
        viewMode.value = 'code';
      }
    } else {
      MessagePlugin.warning('当前文件格式暂不支持可视化表单模式，已保持源码模式');
      viewMode.value = 'code';
    }
  }
};

// 基于 AST 的精准局部更新（100% 保留所有原有注释、空行与排版格式）
const handleVisualPathUpdate = (path: (string | number)[], newVal: any) => {
  const ext = selectedFile.value?.name.split('.').pop()?.toLowerCase();
  if ((ext === 'yml' || ext === 'yaml') && yamlDoc.value) {
    try {
      editorContent.value = updateYamlValue(yamlDoc.value, path, newVal);
      setInObject(visualData.value, path, newVal);
    } catch (err) {
      console.warn('AST 精准更新失败，降级全量序列化:', err);
      setInObject(visualData.value, path, newVal);
      handleVisualUpdate(visualData.value);
    }
  } else {
    setInObject(visualData.value, path, newVal);
    handleVisualUpdate(visualData.value);
  }
};

// 基于 AST 的精准删除
const handleVisualPathDelete = (path: (string | number)[]) => {
  const ext = selectedFile.value?.name.split('.').pop()?.toLowerCase();
  if ((ext === 'yml' || ext === 'yaml') && yamlDoc.value) {
    try {
      editorContent.value = deleteYamlValue(yamlDoc.value, path);
      deleteInObject(visualData.value, path);
    } catch (err) {
      console.warn('AST 删除失败:', err);
      deleteInObject(visualData.value, path);
      handleVisualUpdate(visualData.value);
    }
  } else {
    deleteInObject(visualData.value, path);
    handleVisualUpdate(visualData.value);
  }
};

// 基于 AST 的新增键值与注释
const handleVisualAddPair = (parentPath: (string | number)[], key: string, val: any, comment?: string) => {
  const ext = selectedFile.value?.name.split('.').pop()?.toLowerCase();
  if ((ext === 'yml' || ext === 'yaml') && yamlDoc.value) {
    try {
      editorContent.value = addYamlPair(yamlDoc.value, parentPath, key, val, comment);
      const parsed = parseYamlWithComments(editorContent.value);
      yamlDoc.value = parsed.doc;
      visualData.value = parsed.data;
      visualComments.value = parsed.comments;
    } catch (err) {
      console.warn('AST 新增配置项失败:', err);
    }
  } else {
    if (parentPath.length === 0) {
      visualData.value[key] = val;
    } else {
      setInObject(visualData.value, [...parentPath, key], val);
    }
    handleVisualUpdate(visualData.value);
  }
};

// 全量更新兜底（针对 JSON 等）
const handleVisualUpdate = (newVal: Record<string, any>) => {
  visualData.value = newVal;
  const ext = selectedFile.value?.name.split('.').pop()?.toLowerCase();
  if (ext === 'yml' || ext === 'yaml') {
    editorContent.value = YAML.stringify(newVal);
  } else if (ext === 'json') {
    editorContent.value = JSON.stringify(newVal, null, 2);
  }
};

// 获取插件扫描列表
const fetchPluginList = async () => {
  if (!targetInstanceId.value) return;
  loadingScan.value = true;
  try {
    const res = await getPluginScanList(targetInstanceId.value);
    pluginList.value = res.plugins || [];

    // 如果之前选中的文件不再存在，重置选择
    if (selectedFile.value) {
      const stillExists = pluginList.value.some((p) =>
        p.files.some((f) => f.relativePath === selectedFile.value?.relativePath)
      );
      if (!stillExists) {
        selectedPlugin.value = null;
        selectedFile.value = null;
        editorContent.value = '';
        savedContent.value = '';
      }
    }
  } catch (err: any) {
    MessagePlugin.error(`获取插件列表失败: ${err.message || err}`);
  } finally {
    loadingScan.value = false;
  }
};

// 切换选择文件
const handleSelectFile = async (plugin: PluginInfo, file: PluginConfigFile) => {
  if (selectedFile.value?.relativePath === file.relativePath) return;

  // 检查未保存修改
  if (isDirty.value) {
    const confirmDialog = DialogPlugin.confirm({
      header: '未保存修改',
      body: `文件「${selectedFile.value?.name}」有尚未保存的更改，切换后更改将丢失，是否继续？`,
      theme: 'warning',
      onConfirm: () => {
        confirmDialog.hide();
        doLoadFile(plugin, file);
      },
    });
  } else {
    doLoadFile(plugin, file);
  }
};

const doLoadFile = async (plugin: PluginInfo, file: PluginConfigFile) => {
  selectedPlugin.value = plugin;
  selectedFile.value = file;
  loadingContent.value = true;

  try {
    const content = await getConfigFileContent(targetInstanceId.value, file.relativePath);
    editorContent.value = content;
    savedContent.value = content;

    // 若当前处于可视化模式，自动解析
    if (viewMode.value === 'visual') {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'yml' || ext === 'yaml') {
        try {
          const parsed = parseYamlWithComments(content);
          yamlDoc.value = parsed.doc;
          visualData.value = parsed.data;
          visualComments.value = parsed.comments;
        } catch {
          viewMode.value = 'code';
        }
      } else if (ext === 'json') {
        try {
          visualData.value = JSON.parse(content || '{}');
          visualComments.value = {};
          yamlDoc.value = null;
        } catch {
          viewMode.value = 'code';
        }
      } else {
        viewMode.value = 'code';
      }
    }
  } catch (err: any) {
    MessagePlugin.error(`读取文件内容失败: ${err.message || err}`);
  } finally {
    loadingContent.value = false;
  }
};

// 保存配置
const handleSave = async () => {
  if (!selectedFile.value || !isDirty.value) return;
  saving.value = true;

  try {
    await saveConfigFile(
      targetInstanceId.value,
      selectedFile.value.relativePath,
      editorContent.value,
      createBackup.value
    );
    savedContent.value = editorContent.value;
    MessagePlugin.success(
      createBackup.value ? '保存成功（已生成 .bak 备份）' : '保存成功'
    );
    emit('saved');
    emit('success');
  } catch (err: any) {
    MessagePlugin.error(`保存失败: ${err.message || err}`);
  } finally {
    saving.value = false;
  }
};

// 打开模版对比
const openTemplateDiff = async () => {
  if (!selectedPlugin.value || !selectedFile.value) return;
  loadingTemplate.value = true;

  try {
    const defaultTemplate = await getJarDefaultTemplate(
      targetInstanceId.value,
      selectedPlugin.value.jarFileName,
      selectedFile.value.name
    );
    templateDefaultContent.value = defaultTemplate;
    showDiffModal.value = true;
  } catch (err: any) {
    MessagePlugin.warning(`获取模版失败: ${err.message || 'Jar 包内未找到同名模版'}`);
  } finally {
    loadingTemplate.value = false;
  }
};

// 应用原版模版内容
const handleApplyDefault = (content: string) => {
  editorContent.value = content;
  if (viewMode.value === 'visual') {
    handleViewModeChange('visual');
  }
  MessagePlugin.info('已应用初始默认模版，请确认后点击保存');
};

// 在文件管理器中打开（直接页面跳转刷新，确保关闭弹窗并定位）
const openInFileManager = () => {
  if (!selectedPlugin.value) return;
  const dirPath = selectedPlugin.value.configDirPath || 'plugins';
  emit('close');
  const targetUrl = `/instance/files/${targetInstanceId.value}?path=${encodeURIComponent(dirPath)}`;
  window.location.href = targetUrl;
};

onMounted(() => {
  fetchPluginList();
});

watch(
  () => targetInstanceId.value,
  () => {
    fetchPluginList();
  }
);
</script>

<style scoped>
@reference "@/style/tailwind/index.css";

.config-editor-root {
  overscroll-behavior: contain;
}
</style>
