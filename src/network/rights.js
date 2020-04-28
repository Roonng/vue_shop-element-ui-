import { service } from './request'

export const getRoles = () => {
  return service.post('/api/rights/getRoles')
}

export const getRights = () => {
  return service.post('/api/rights/getRights')
}