import request from '@/utils/request'

export function updateUserInfo(params) {
  return request({
    url: '/api/user/updateUserBaseInfo',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'post',
    data: params,
  })
}

export function getUserInfoApi() {
  return request({
    url: '/api/user/currentUser',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'post',
  })
}

export function queryUserMaskBindInfoApi() {
  return request({
    url: '/api/user/queryUserMaskBindInfo',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'post',
  })
}
