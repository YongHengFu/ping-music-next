import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import recommend from '@/pages/recommend.vue'
import musicHall from '@/pages/musicHall.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/recommend',
    component: Layout,
    children: [
      {
        path: 'recommend',
        component: recommend,
        meta: { title: '推荐' },
      },
      {
        path: 'musicHall',
        component: musicHall,
        meta: { title: '音乐馆' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
