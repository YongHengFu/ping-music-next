import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import test from '../pages/test.vue'

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes: [
//     { path: '/', component: () => import('@/pages/test.vue') }
//   ]
// });

// export default router

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "test",
    component: test,
  }
];

 const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router