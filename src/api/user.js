import request from '@/utils/request'

// 用户列表
export function userList(query) {
  return request({
    url: '/seller/list',
    method: 'get',
    params: query
  })
}

// 驾照审核
// export function authDriving(data) {
//   return request({
//     url: '/user/authDriving',
//     method: 'post',
//     data
//   })
// }
