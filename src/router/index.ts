import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import recommend from '@/pages/recommend.vue'
import musicHall from '@/pages/MusicHall/musicHall.vue'
import historyPlay from '@/pages/historyPlay.vue'
import playList from '@/pages/playList/playList.vue'

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
      },
      {
        path: 'playList/:id',
        name: 'playList',
        component: playList,
        meta: { title: 'PING' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
