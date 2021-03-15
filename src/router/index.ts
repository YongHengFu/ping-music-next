import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import recommend from '@/pages/recommend.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //     path: '/',
  //     name: 'index',
  //     component: Layout,
  // },
  {
    path: '/',
    redirect: '/recommend',
    component: Layout,
    children: [
      {
        path: 'recommend',
        component: recommend,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
