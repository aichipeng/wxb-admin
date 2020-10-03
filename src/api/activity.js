import request from '@/utils/request'

// 活动列表
export function activityList(query) {
  return request({
    url: '/activity/list',
    method: 'get',
    params: query
  })
}