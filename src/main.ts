import { createApp } from 'vue'
import '@/style/antd-ui.less'
import '@/style/personal.css'
import Router from './router'
import Vuex from './store'
import svgIcon from './components/svgIcon.vue'
import App from './App.vue'

Router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // @ts-ignore
    document.title = to.meta.title // 根据路由动态显示页面title
  }
  next()
})

const app = createApp(App)
app.use(Router)
app.use(Vuex)
app.component('SvgIcon', svgIcon)
app.mount('#app')
