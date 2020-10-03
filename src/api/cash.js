import request from '@/utils/request'

// 结算列表
export function cashList(query) {
  return request({
    url: '/cash/list',
    method: 'get',
    params: query
  })
}

// 结算审核 state  1通过  9驳回
export function cashReview(data) {
  return request({
    url: '/cash/review',
    method: 'post',
    data
  })
}

// 提现服务费获取
export function cashFee(query) {
  return request({
    url: '/config/fee',
    method: 'get',
    query
  })
}

// 提现服务费编辑
export function cashFeeUpdate(data) {
  return request({
    url: '/config/fee',
    method: 'post',
    data
  })
}