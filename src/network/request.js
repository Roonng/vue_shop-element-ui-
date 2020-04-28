import axios from 'axios'

// export function request(config) {
//   const instance = axios.create({
//     baseURL: 'http://rap2.taobao.org:38080/app/mock/250613',
//     timeout: 5000
//   })
//   return instance(config)
// }


export const service = axios.create({
  baseURL: 'http://rap2.taobao.org:38080/app/mock/250613'
})