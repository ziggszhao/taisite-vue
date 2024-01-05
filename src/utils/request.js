import axios from 'axios'
import { AxiosLoading } from './loading'
import { STORAGE_AUTHORIZE_KEY, useAuthorization } from '~/composables/authorization.js'
import { ContentTypeEnum } from '~#/http-enum'
import router from '~/router'
import {notification} from 'ant-design-vue'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_BASE_API ?? '/',
  timeout: 6000, // 请求超时时间
  headers: { 'Content-Type': ContentTypeEnum.JSON },
})
const axiosLoading = new AxiosLoading()
// 异常拦截处理器
function errorHandler(error) {
  const token = useAuthorization()
  if (error.response) {
    const { data, status, statusText } = error.response
    // const data = error.response.data
    if (error.response.status === 403) {
      notification.error({
        message: '403',
        description: data?.message || statusText,
        duration: 3,
      })
    }
    else if (error.response.status === 401) {
      notification.error({
        message: '401',
        description: data?.message || statusText,
        duration: 3,
      })
      /**
       * 这里处理清空用户信息和token的逻辑，后续扩展
       */
      token.value = null
      router
        .push({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        })
        .then(() => {
        })
    }
    else if (status === 500) {
      notification.error({
        message: '500',
        description: data?.message || statusText,
        duration: 3,
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config) => {
  if (
    import.meta.env.DEV
      && import.meta.env.VITE_APP_BASE_API_DEV
      && import.meta.env.VITE_APP_BASE_URL_DEV
  ) {
    //  替换url的请求前缀baseUrl
    config.baseURL = import.meta.env.VITE_APP_BASE_API_DEV
  }
  else {
    //  替换url的请求前缀baseUrl
    config.baseURL = import.meta.env.VITE_APP_BASE_URL
  }
  const { loading } = config
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  const token = useAuthorization()
  if (token.value && config.token !== false)
    config.headers.set(STORAGE_AUTHORIZE_KEY, token.value)
  // 增加多语言的配置
  const { locale } = useI18nLocale()
  config.headers.set('Accept-Language', locale.value ?? 'zh-CN')
  if (loading)
    axiosLoading.addLoading()
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  },
}

export default request

export {
  installer as VueAxios,
  request as axios,
}
