import request from "~/utils/request.js";

export function queryEnvWithProjectIdApi(params) {
    return request({
        url: '/api/autoTest/env/queryEnvWithProjectId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function updateEnvApi(params) {
    return request({
        url: '/api/autoTest/env/update',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function insertEnvApi(params) {
    return request({
        url: '/api/autoTest/env/insert',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}