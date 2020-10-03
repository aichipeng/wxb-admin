import request from '@/utils/request'

export function isContact(query) {
  return request({
    url: '/join/isContact',
    method: 'get',
    params: query
  })
}

export function joinList(query) {
  return request({
    url: '/join/list',
    method: 'get',
    params: query
  })
}