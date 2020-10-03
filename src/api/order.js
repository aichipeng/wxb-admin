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
// 订单详情
// export function detailOrder(id) {
//   return request({
//     url: '/order/detail',
//     method: 'get',
//     params: { id }
//   })
// }
// 修改订单
// export function remarkOrder(data) {
//   return request({
//     url: '/order/remark',
//     method: 'post',
//     data
//   })
// }
