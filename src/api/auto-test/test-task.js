import request from "@/utils/request.js";


export function queryAnyTaskWithTaskIdApi(params) {
    return request({
        url: '/api/autoTest/task/queryAnyTaskWithTaskId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function queryAnyTaskWithProjectIdApi(params) {
    return request({
        url: '/api/autoTest/task/queryAnyTaskWithProjectId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function insertTaskApi(params) {
    return request({
        url: '/api/autoTest/task/insert',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function updateTaskApi(params) {
    return request({
        url: '/api/autoTest/task/update',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function runTaskApi(params) {
    return request({
        url: '/api/autoTest/task/run',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function deleteTaskApi(params) {
    return request({
        url: '/api/autoTest/task/delete',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}