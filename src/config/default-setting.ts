import type { LayoutSetting } from '~@/stores/app'

export default {
  title: 'Taisite测试平台',
  theme: 'light',
  logo: '/logo.svg',
  collapsed: false,
  drawerVisible: false,
  colorPrimary: '#1677FF',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixedSider: true,
  splitMenus: false,
  header: true,
  menu: true,
  watermark: true,
  menuHeader: true,
  footer: false,
  colorWeak: false,
  multiTab: true,
  multiTabFixed: true,
  keepAlive: true,
  accordionMode: false,
  leftCollapsed: true,
  compactAlgorithm: true,
  headerHeight: 48,
  copyright: '2024 ziggs.zhao个人出品',
  animationName: 'slide-fadein-right',
} as LayoutSetting

export const animationNameList = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Fadein Up',
    value: 'slide-fadein-up',
  },
  {
    label: 'Fadein Right',
    value: 'slide-fadein-right',
  },
  {
    label: 'Zoom Fadein',
    value: 'zoom-fadein',
  },
  {
    label: 'Fadein',
    value: 'fadein',
  },
]
export type AnimationNameValueType = 'none' | 'slide-fadein-up' | 'slide-fadein-right' | 'zoom-fadein' | 'fadein'
