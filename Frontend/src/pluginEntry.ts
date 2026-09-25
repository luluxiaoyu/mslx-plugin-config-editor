import { markRaw } from 'vue';
import { AdjustmentIcon } from 'tdesign-icons-vue-next';
import InstanceSettingsTab from './views/InstanceSettingsTab.vue';
import './style.css';

export const pluginConfig = {
  name: '服务端插件配置中心',
  version: '1.0.3.3',
  description: '在实例设置中直接管理和编辑 Minecraft 服务端插件的配置文件',
  
  // 注入到实例配置侧边栏选项卡
  extensions: [
    {
      slot: 'instance-settings-tab',
      label: '插件配置',
      icon: AdjustmentIcon,
      component: markRaw(InstanceSettingsTab),
    },
  ],
};