import request from "~/utils/request.js";

export function queryProjectInfoWithUserIdApi() {
    return request({
        url: '/api/project/queryProjectInfoWithUserId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
    })
}