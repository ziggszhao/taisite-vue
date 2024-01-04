import request from "@/utils/request.js";

export function monitorServerInfo() {
  return request({
    url: '/api/monitor',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
  })
}