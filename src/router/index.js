import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkName: "users" */ '../components/users/Users.vue')
const Rights = () => import(/* webpackChunkName: "power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "power" */ '../components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName: "goods" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods/Params.vue')
const Goods = () => import(/* webpackChunkName: "goods" */ '../components/goods/Goods.vue')
const Add = () => import(/* webpackChunkName: "goods" */ '../components/goods/Add.vue')
const Order = () => import(/* webpackChunkName: "order" */ '../components/order/Order.vue')

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
