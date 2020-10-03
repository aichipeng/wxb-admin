import request from '@/utils/request'

// 物流配置
export function shipList(query) {
  return request({
    url: '/ship/list',
    method: 'get',
    params: query
  })
}

// 添加物流
export function shipCreate(data) {
  return request({
    url: '/ship/create',
    method: 'post',
    data
  })
}

// 编辑物流
export function shipUpdate(data) {
  return request({
    url: '/ship/update',
    method: 'post',
    data
  })
}