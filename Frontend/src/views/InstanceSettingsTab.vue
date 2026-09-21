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
          class="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 p-8 text-center overflow-y-auto"
        >
          <extension-icon size="48px" class="opacity-30 mb-3" />
          <p class="text-sm font-medium mb-1">请在左侧选择一个插件配置文件开始编辑</p>
          <p class="text-xs text-zinc-400">支持可视化键值表单、YAML/JSON/TOML 源码高亮与快捷键保存 (Ctrl+S / ⌘S)</p>

          <!-- 贡献引导 -->
          <div
            class="mt-6 px-4 py-3 rounded-lg border border-zinc-200/70 dark:border-zinc-700/60 bg-zinc-50/60 dark:bg-zinc-800/40 max-w-sm w-full"
          >
            <div class="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <svg viewBox="0 0 16 16" class="w-4 h-4 fill-current" aria-hidden="true">
                <path
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                />
              </svg>
              <span>想让常用插件的中文化注释更完善？</span>
            </div>
            <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5 leading-relaxed">
              本编辑器的插件注释数据由社区维护，欢迎到 GitHub 仓库
              <a
                :href="REPO_URL"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-dotted underline-offset-2"
              >贡献一份注释</a>
              ，帮助更多人轻松看懂插件配置。
            </p>

            <!-- 贡献者列表 -->
            <div class="mt-3 pt-3 border-t border-zinc-200/70 dark:border-zinc-700/60">
              <template v-if="contributors.length > 0">
                <p class="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  ❤ 这些伙伴贡献了插件注释
                </p>
                <div class="flex flex-wrap items-center justify-center gap-2.5">
                  <a
                    v-for="c in contributors"
                    :key="c.login"
                    :href="c.html_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex flex-col items-center gap-1 w-12 group"
                    :title="c.login"
                  >
                    <img
                      :src="GITHUB_AVATAR_PROXY + c.avatar_url"
                      :alt="c.login"
                      loading="lazy"
                      class="w-8 h-8 rounded-full ring-1 ring-zinc-200 dark:ring-zinc-700 group-hover:ring-blue-400 transition-all"
                      @error="($event.target as HTMLImageElement).src = c.avatar_url"
                    />
                    <span class="text-[10px] text-zinc-400 dark:text-zinc-500 truncate w-full text-center group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {{ c.login }}
                    </span>
                  </a>
                </div>
              </template>
              <p v-else class="text-[11px] text-zinc-400 dark:text-zinc-500">
                {{ contributorsLoading ? '正在获取贡献者列表...' : '' }}
              </p>
            </div>
          </div>
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
import { ref, shallowRef, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
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

// GitHub 贡献引导
const REPO_URL = 'https://github.com/luluxiaoyu/mslx-plugin-config-editor';
// 头像加速代理地址
const GITHUB_AVATAR_PROXY = 'https://hk-gh.mslmc.cn/';

interface GithubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const contributors = ref<GithubContributor[]>([]);
const contributorsLoading = ref(false);

const fetchContributors = async () => {
  if (contributors.value.length > 0) return;
  contributorsLoading.value = true;
  try {
    const resp = await fetch('https://api.github.com/repos/luluxiaoyu/mslx-plugin-config-editor/contributors', {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!resp.ok) return;
    const data = (await resp.json()) as GithubContributor[];
    contributors.value = Array.isArray(data) ? data : [];
  } catch {
    // 网络异常时静默忽略，不影响主功能
  } finally {
    contributorsLoading.value = false;
  }
};

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
  fetchContributors();
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
