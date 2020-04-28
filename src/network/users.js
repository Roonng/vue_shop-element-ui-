// import { request } from './request'

// export function getUserList() {
//   return request({
//     url: '/api/users/userlist'
//   })
// }

import { service } from './request'

export const getUserList = () => {
  return service.post('/api/users/userlist')
}