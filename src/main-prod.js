import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 字体图标
import './assets/fonts/iconfont.css'
// 全局样式表
import './assets/css/global.css'
// 配置axios基本请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 请求拦截，携带token
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  console.log(config)
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMilliseconds() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
