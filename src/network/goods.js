import { service } from './request'

export const getCategories = () => {
  return service.post('/api/goods/getCategories')
}

export const getGoodsAttr = () => {
  return service.post('/api/goods/getGoodsAttr')
}

export const getGoodsList = () => {
  return service.post('/api/goods/getGoodsList')
}