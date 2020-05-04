import { service } from './request'

export const getOrderList = () => {
  return service.post('/api/order/getOrderList')
}

export const getLogistics = () => {
  return service.post('/api/order/getLogistics')
}