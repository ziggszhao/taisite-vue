import request from "~/utils/request.js";

export function queryCaseWithProjectApi(params) {
  return request({
    url: '/api/autoTest/case/queryCaseWithProject',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data:params
  })
}

