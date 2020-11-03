import request from '@/utils/request'
import Qs from 'qs'

export function listOrder(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query,
    paramsSerializer: function (params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

export function orderExport(query) {
  return request({
    url: '/order/excel',
    method: 'get',
    params: query
  })
}

// 订单关闭原因列表
export function closeList(query) {
  return request({
    url: '/close/list',
    method: 'get',
    params: query
  })
}

// 订单关闭原因添加
export function closeCreate(query) {
  return request({
    url: '/close/add',
    method: 'get',
    params: query
  })
}

// 订单关闭原因修改
export function closeUpdate(query) {
  return request({
    url: '/close/update',
    method: 'get',
    params: query
  })
}