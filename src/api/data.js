import request from '@/utils/request'

// 数据列表
export function dataList(query) {
  return request({
    url: '/data/list',
    method: 'get',
    params: query
  })
}

// 数据列表详情
export function dataListDetail(query) {
    return request({
      url: '/data/details',
      method: 'get',
      params: query
    })
  }