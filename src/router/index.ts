import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import recommend from '@/pages/recommend.vue'
import musicHall from '@/pages/musicHall.vue'
import historyPlay from '@/pages/historyPlay.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/recommend',
    component: Layout,
    children: [
      {
        path: 'recommend',
        component: recommend,
        meta: { title: 'PING' }
      },
      {
        path: 'musicHall',
        component: musicHall,
        meta: { title: 'PING' }
      },
      {
        path: 'historyPlay',
        component: historyPlay,
        meta: { title: 'PING' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
