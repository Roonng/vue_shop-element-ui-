import { service } from './request'

export const getCategories = () => {
  return service.post('/api/goods/getCategories')
}