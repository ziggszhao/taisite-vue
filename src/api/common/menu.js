import request from '@/utils/request.js'
export function getRouteMenusApi() {
  return request({
    url: '/api/menu/userMenuList',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
  })
}