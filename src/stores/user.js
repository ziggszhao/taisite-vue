import { logoutApi } from '@/api/common/login'
import { getRouteMenusApi } from '~/api/common/menu.js'
import { getUserInfoApi } from '@/api/common/user'
// import { rootRoute } from '~@/router/dynamic-routes'
import { rootRoute,generateFlatRoutes, generateTreeRoutes } from '~@/router/generate-route'
import { DYNAMIC_LOAD_WAY, DynamicLoadEnum } from '~@/utils/constant'

export const useUserStore = defineStore('user', () => {
  const routerData = shallowRef()
  const menuData = shallowRef([])
  const userInfo = shallowRef()
  const token = useAuthorization()
  const userAvatar = computed(() => userInfo.value?.userAvatar)
  const nickName = computed(() => userInfo.value?.nickName ?? userInfo.value?.userName)





  const getMenuRoutes = async () => {
    const { data } = await getRouteMenusApi()
    return generateTreeRoutes(data ?? [])
  }

  const generateDynamicRoutes = async () => {
    const dynamicLoadWay = DYNAMIC_LOAD_WAY === DynamicLoadEnum.BACKEND ? getMenuRoutes : generateRoutes
    const { menuData: treeMenuData, routeData } = await dynamicLoadWay()

    menuData.value = treeMenuData

    routerData.value = {
      ...rootRoute,
      children: generateFlatRoutes(routeData),
    }
    return routerData.value
  }

  // 获取用户信息
  const getUserInfo = async () => {
    // 获取用户信息
    const { data } = await getUserInfoApi()
    userInfo.value=data
    userInfo.value.userAvatar=userInfo.value.userAvatar+'?'+ Math.random()
  }


  const logout = async () => {
    // 退出登录
    // 1. 清空用户信息
    try {
      await logoutApi()
      userInfo.value = null
    }
    finally {
      token.value = null
      routerData.value = undefined
      menuData.value = []
    }
  }

  return {
    nickName,
    userAvatar,
    userInfo,
    getUserInfo,
    logout,
    routerData,
    menuData,
    generateDynamicRoutes,
  }
})
