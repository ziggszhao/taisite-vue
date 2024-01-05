<script setup lang="ts">
import {pick} from '@v-c/utils'
import BasicLayout from './basic-layout/index.vue'
import SettingDrawer from './components/setting-drawer/index.vue'
import MultiTab from './multi-tab/index.vue'
import {animationNameList} from '~@/config/default-setting'
import {
  FormOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  WechatOutlined
} from '@ant-design/icons-vue';
import GlobalLayoutFooter from '~/layouts/components/global-footer/index.vue'
import projectSelect from "~/pages/auto-test/components/project-select.vue";

defineOptions({
  name: 'ProLayout',
})
const appStore = useAppStore()
const {layoutSetting} = storeToRefs(appStore)
const userStore = useUserStore()
const layoutMenu = useLayoutMenu()
const {t} = useI18nLocale()
const {selectedKeys, openKeys} = storeToRefs(layoutMenu)
const {isMobile, isPad} = useQueryBreakpoints()
const contactUsImg = ref("https://taisite-1251159423.cos.ap-shanghai.myqcloud.com/logo/contact_me.jpg")
const visibleModal = ref<boolean>(false)
const visiblePopover = ref<boolean>(false);
const rateValue = ref<number>(5)
const flag: Ref<boolean | null> = ref(false)

function showModal() {
  visibleModal.value = true
}

function unShowModal() {
  visibleModal.value = false;
}

function unShowPopover() {
  visiblePopover.value = false;
}

function reload() {
  location.reload()
}

const screen = () => {
  let element = document.documentElement;
  // 不全屏是null,返回false,
  flag.value = document.fullscreenElement === null ? false : true
  // false是进入全屏状态
  if (flag.value) {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  } else {
    // 全屏
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }
  // 切换文本状态（只是用在文本上，文本不是动态可以忽略）
  flag.value = !flag.value
}

watch(isPad, (val) => {
  if (val)
    appStore.toggleCollapsed(true)
  else appStore.toggleCollapsed(false)
})
const layoutProps = computed(() =>
    pick(appStore.layoutSetting, [
      'fixedHeader',
      'fixedSider',
      'splitMenus',
      'menuHeader',
      'header',
      'menu',
      'layout',
      'footer',
      'contentWidth',
      'compactAlgorithm',
    ]),
)
</script>

<template>
  <BasicLayout :collapsed="layoutSetting.collapsed" :theme="layoutSetting.theme" :menu-data="userStore.menuData"
               v-bind="layoutProps" :selected-keys="selectedKeys"
               :open-keys="layoutSetting.layout === 'top' ? [] : openKeys"
               :copyright="layoutSetting.copyright" :is-mobile="isMobile" :logo="layoutSetting.logo"
               :title="layoutSetting.title"
               :accordion-mode="layoutSetting.accordionMode" :left-collapsed="layoutSetting.leftCollapsed"
               :header-height="layoutSetting.headerHeight" @update:open-keys="layoutMenu.handleOpenKeys"
               @update:selected-keys="layoutMenu.handleSelectedKeys" @update:collapsed="appStore.toggleCollapsed">
    <template #headerActions>
      <projectSelect/>
      <a-tooltip placement="bottom">
        <template #title>
          <span>切换模式</span>
        </template>
        <span
            hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer
            @click="appStore.toggleTheme(layoutSetting.theme === 'dark' ? 'light' : 'dark')"
        >
              <!-- 亮色和暗黑模式切换按钮 -->
              <template v-if="layoutSetting.theme === 'light'">
                <carbon-moon style="font-size: 18px;"/>
              </template>
              <template v-else>
                <carbon-sun style="font-size: 18px;"/>
              </template>
            </span>
      </a-tooltip>
      <a-tooltip placement="bottom">
        <template #title>
          <span>联系作者</span>
        </template>
        <span
            hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer
        >
        <WechatOutlined style="font-size: 18px;color:#1AAD19" @click="showModal()"/>
        </span>
      </a-tooltip>
      <a-tooltip placement="bottom">
        <template #title>
          <span>全屏</span>
        </template>
        <span
            hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer
        >
        <FullscreenOutlined v-if="!flag" @click="screen()" style="font-size: 18px;"/>
        <FullscreenExitOutlined v-else @click="screen()" style="font-size: 18px;"/>
          </span>
      </a-tooltip>
      <a-tooltip placement="bottom">
        <template #title>
          <span>刷新页面</span>
        </template>
        <span
            hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer
        >
        <ReloadOutlined style="font-size: 18px;" @click="reload()"/>
           </span>
      </a-tooltip>
      <UserAvatar/>
      <!-- <SelectLang />
      <GithubLink />
      <template v-if="!isMobile">
        <GiteeLink />
        <DocLink />
      </template> -->
    </template>
    <template #contentPrefix>
      <MultiTab v-if="layoutSetting.multiTab"/>
      <a-popover v-model:open="visiblePopover" trigger="click" placement="topRight" arrow-point-at-center>
        <template #title>
          <div style="text-align: center;">
            <span>非常需要您对本站的评价</span>
          </div>
        </template>
        <template #content>
          <div style="margin: 28px;text-align: center;">
            <a-radio-group v-model:value="rateValue">
              <a-radio :value="1">非常不满意</a-radio>
              <a-radio :value="2">不满意</a-radio>
              <a-radio :value="3">一般</a-radio>
              <a-radio :value="4">满意</a-radio>
              <a-radio :value="5">非常满意</a-radio>
            </a-radio-group>
          </div>
          <div style="margin: 28px;text-align: center;">
            <a-textarea show-count :maxlength="100" placeholder="请输入您宝贵的意见"/>
          </div>
          <div style="margin-bottom: 18px;text-align: center;">
            <a-button type="primary" @click="unShowPopover()">提交您宝贵的评价</a-button>
          </div>
        </template>
        <a-float-button type="primary" shape="square" :style="{
          bottom: '110px',

        }">
          <template #icon>
            <FormOutlined/>
          </template>
        </a-float-button>
      </a-popover>
    </template>

    <template #renderFooterLinks/>

    <a-watermark h-full flex flex-col flex-1
                 :content="!layoutSetting.watermark ? '' : 'ziggs.zhao' ?? layoutSetting.title">
      <RouterView>
        <template #default="{ Component }">
          <component :is="Component"/>
        </template>
      </RouterView>
      <GlobalLayoutFooter
          :copyright="layoutSetting.copyright" icp="苏ICP备2023035009号-1"
          class="main-bottom-wrapper"
      >
      </GlobalLayoutFooter>
    </a-watermark>
  </BasicLayout>
  <SettingDrawer v-model:open="layoutSetting.drawerVisible" :t="t" :theme="layoutSetting.theme"
                 :color-primary="layoutSetting.colorPrimary" :color-weak="layoutSetting.colorWeak"
                 :multi-tab="layoutSetting.multiTab"
                 :multi-tab-fixed="layoutSetting.multiTabFixed" :animation-name-list="animationNameList"
                 :animation-name="layoutSetting.animationName" :keep-alive="layoutSetting.keepAlive"
                 :accordion-mode="layoutSetting.accordionMode" :left-collapsed="layoutSetting.leftCollapsed"
                 :watermark="layoutSetting.watermark" v-bind="layoutProps" :layout-setting="layoutSetting"
                 @setting-change="appStore.changeSettingLayout"/>
  <a-modal v-model:open="visibleModal" title="联系作者" @ok="unShowModal()" okText="确认" width="380px" height="430px"
           centered>
    <template #footer>
      <a-button key="submit" type="primary" @click="unShowModal()">确认</a-button>
    </template>
    <p>
      <img :src="contactUsImg + '?' + Math.random()" alt="微信二维码" width="330px" height="400px">
    </p>
  </a-modal>
</template>

<style scoped>
.main-bottom-wrapper {
  height: 60px;
  margin-top: 25px;
  text-align: center;
  flex: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 25px;
}</style>
