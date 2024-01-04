import request from '@/utils/request.js'

export function loginApi(params) {
  return request({
    url: '/login',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'post',
    data: params,
  })
}

export function logoutApi() {
  return request({
    url: '/logout',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'post',
  })
}
