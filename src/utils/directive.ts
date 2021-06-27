import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
const appType = createApp({})
// 自定义指令
export default function init(vueApp:typeof appType) {
  let app = null
  app = vueApp

  // 根据id跳转到歌手页面
  app.directive('artist', {
    beforeUpdate(el, binding) {
      if (el) {
        if (binding?.value) {
          el.onclick = () => {
            router.push('/artist/' + binding?.value).then(() => {
              if (store.state.showPlayView) {
                store.commit('setShowPlayView', false)
              }
            })
          }
        } else {
          el.style.color = '#cccccc'
          el.style.cursor = 'auto'
        }
      }
    }
  })

  // 根据id跳转到专辑页面
  app.directive('album', {
    beforeUpdate(el, binding) {
      if (el) {
        if (binding?.value) {
          el.onclick = () => {
            router.push('/album/' + binding?.value).then(() => {
              if (store.state.showPlayView) {
                store.commit('setShowPlayView', false)
              }
            })
          }
        } else {
          el.style.color = '#cccccc'
          el.style.cursor = 'auto'
        }
      }
    }
  })
}
