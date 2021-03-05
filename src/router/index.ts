import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        component: Layout,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
