import { createApp } from 'vue'
import '@/style/antd-ui.less'
import '@/style/personal.css'
import Router from '@/router'
import Vuex from '@/store'
import svgIcon from '@/components/svgIcon.vue'
import Image from '@/components/global/Image.vue'
import initDirective from '@/utils/directive'
// @ts-ignore
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import App from '@/App.vue'

Router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // @ts-ignore
    document.title = to.meta.title // 根据路由动态显示页面title
  }
  next()
})

const app = createApp(App)
// 加载自定义指令
initDirective(app)
app.use(Router)
app.use(Vuex)
app.use(VuePlyr, { plyr: {}})
app.component('SvgIcon', svgIcon)
app.component('Image', Image)
app.mount('#app')
