import request from "~/utils/request.js";

export function chatGptRequestApi(params) {
    return request({
        url: '/api/user/chat',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data: params,
    })
}