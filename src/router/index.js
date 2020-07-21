import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/home/welcome',
      children: [
        {
          path: '/home/welcome',
          component: Welcome
        },
        {
          path: '/home/users',
          component: Users
        },
        {
          path: '/home/rights',
          component: Rights
        },
        {
          path: '/home/roles',
          component: Roles
        },
        {
          path: '/home/categories',
          component: Cate
        },
        {
          path: '/home/params',
          component: Params
        },
        {
          path: '/home/Goods',
          component: Goods
        },
        {
          path: '/home/goods/add',
          component: Add
        },
        {
          path: '/home/orders',
          component: Order
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
