import request from '@/utils/request'

// 用户列表（卖家管理）
export function userListServer(query) {
  return request({
    url: '/seller/list',
    method: 'get',
    params: query
  })
}

// 用户导出（卖家）
export function serverExport(query) {
  return request({
    url: '/seller/excel',
    method: 'get',
    params: query
  })
}

// 用户列表（买家管理）
export function userListClient(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

// 用户导出（买家）
export function clientExport(query) {
  return request({
    url: '/user/excel',
    method: 'get',
    params: query
  })
}

