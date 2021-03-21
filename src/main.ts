import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import '@/style/antd-ui.less'
import '@/style/personal.css'
import Router from './router'
import Vuex from './store'
import svgIcon from './components/svgIcon.vue'
import App from './App.vue'

const app = createApp(App)
app.use(Router)
app.use(Vuex)
app.use(Antd)
app.component('SvgIcon', svgIcon)
app.mount('#app')
