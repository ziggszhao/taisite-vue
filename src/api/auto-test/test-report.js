import request from "@/utils/request.js";

export function queryAnyReportWithProjectIdApi(params) {
    return request({
        url: '/api/autoTest/report/queryAnyReportWithProjectId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}

export function queryAnyReportWithReportIdApi(params) {
    return request({
        url: '/api/autoTest/report/queryAnyReportWithReportId',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method: 'post',
        data:params
    })
}