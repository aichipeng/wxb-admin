import request from '@/utils/request'

// 活动列表
export function feedbackList(query) {
    return request({
        url: '/feedback/list',
        method: 'get',
        params: query
    })
}