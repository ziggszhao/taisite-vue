import request from "~/utils/request.js";

export function queryAnyCaseWithProjectIdApi(params) {
  return request({
    url: '/api/autoTest/case/queryAnyCaseWithProjectId',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

export function queryValidCaseWithProjectIdApi(params) {
  return request({
    url: '/api/autoTest/case/queryValidCaseWithProjectId',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

export function queryAnyCaseWithCaseIdApi(params) {
  return request({
    url: '/api/autoTest/case/queryAnyCaseWithCaseId',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

export function insertCaseApi(params) {
  return request({
    url: '/api/autoTest/case/insert',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

export function updateCaseApi(params) {
  return request({
    url: '/api/autoTest/case/update',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

export function deleteCaseApi(params) {
  return request({
    url: '/api/autoTest/case/delete',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

export function runCaseApi(params) {
  return request({
    url: '/api/autoTest/case/run',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

