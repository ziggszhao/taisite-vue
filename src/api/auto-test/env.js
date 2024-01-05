import request from "~/utils/request.js";

export function queryAnyEnvWithProjectIdApi(params) {
    return request({
        url: '/api/autoTest/env/queryAnyEnvWithProjectId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function queryValidEnvWithProjectIdApi(params) {
    return request({
        url: '/api/autoTest/env/queryValidEnvWithProjectId',
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

export function changeEnvStatusApi(params) {
    return request({
        url: '/api/autoTest/env/changeEnvStatus',
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

export function deleteEnvApi(params) {
    return request({
        url: '/api/autoTest/env/delete',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}