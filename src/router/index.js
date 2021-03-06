import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../views/users/Users')
const Rights = () => import('../views/rights/Rights')
const Roles = () => import('../views/rights/Roles')
const Categories = () => import('../views/goods/Categories')
const Params = () => import('../views/goods/Params')
const GoodsList = () => import('../views/goods/GoodsList')
const GoodsAdd = () => import('../views/goods/GoodsAdd')
const Order = () => import('../views/order/Order')

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },{
          path: '/users',
          component: Users
        },{
          path: '/rights',
          component: Rights
        },{
          path: '/roles',
          component: Roles
        },{
          path: '/categories',
          component: Categories
        },{
          path: '/params',
          component: Params
        },{
          path: '/goods',
          component: GoodsList
        },{
          path: '/goods/add',
          component: GoodsAdd
        },{
          path: '/order',
          component: Order
        }
      ]
    }

    
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
