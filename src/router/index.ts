import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import recommend from '@/pages/recommend.vue'
import musicHall from '@/pages/MusicHall/musicHall.vue'
import myLike from '@/pages/myLike/myLike.vue'
import historyPlay from '@/pages/historyPlay/historyPlay.vue'
import playList from '@/pages/playList/playList.vue'
import album from '@/pages/album/album.vue'
import artist from '@/pages/artist/artist.vue'
import videoPlayer from '@/pages/videoPlayer/VideoPlayer.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/recommend',
    component: Layout,
    children: [
      {
        path: 'recommend',
        component: recommend,
        meta: { title: 'PING', keepAlive: true }
      },
      {
        path: 'musicHall',
        component: musicHall,
        meta: { title: 'PING', keepAlive: true }
      },
      {
        path: 'myLike',
        component: myLike,
        meta: { title: 'PING', keepAlive: true }
      },
      {
        path: 'historyPlay',
        component: historyPlay,
        meta: { title: 'PING', keepAlive: true }
      },
      {
        path: 'playList/:id',
        name: 'playList',
        component: playList,
        meta: { title: 'PING', keepAlive: false }
      },
      {
        path: 'album/:id',
        name: 'album',
        component: album,
        meta: { title: 'PING', keepAlive: false }
      },
      {
        path: 'artist/:id',
        name: 'artist',
        component: artist,
        meta: { title: 'PING', keepAlive: false }
      },
      {
        path: 'videoPlayer/:id',
        name: 'videoPlayer',
        component: videoPlayer,
        meta: { title: 'PING', keepAlive: false }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
