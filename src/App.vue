<template>
  <div style="position: relative;width: 100vw;height: 100vh;overflow-y: hidden">
    <Player ref="player" />
    <playView id="playView" :style="showPlayView?'':'transform:translateY(110%)'" />
    <router-view />
    <LoginDialog v-if="showDialog===0" class="login-dialog" />
    <UserDialog v-if="showDialog===1" class="user-dialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Player from '@/components/Player.vue'
import playView from '@/pages/playView/playView.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import UserDialog from '@/components/UserDialog.vue'
// document.body.style.setProperty('--main-color', '#1DCF9F')

export default defineComponent({
  name: 'App',
  components: {
    Player,
    playView,
    LoginDialog,
    UserDialog
  },
  setup() {
    const store = useStore()
    const showPlayView = computed(() => store.state.showPlayView)
    const showDialog = computed(() => store.state.showDialog)

    window.onbeforeunload = () => {
      saveState()
    }

    onMounted(() => {
      initState()
    })

    // 关闭页面或刷新前保存数据
    const saveState = () => {
      localStorage.setItem('musicList', JSON.stringify(store.state.musicList))
      const currMusic = store.state.currMusic
      if (currMusic) {
        localStorage.setItem('currMusic', JSON.stringify(currMusic))
      }
      localStorage.setItem('audio', JSON.stringify(store.state.audio))
    }

    // 恢复上次保存的数据
    const initState = () => {
      const musicListStr = localStorage.getItem('musicList')
      const currMusicStr = localStorage.getItem('currMusic')
      const audioStr = localStorage.getItem('audio')

      if (musicListStr) {
        store.commit('setMusicList', JSON.parse(musicListStr))
      }

      if (currMusicStr) {
        store.commit('setCurrMusic', JSON.parse(currMusicStr))
      }

      if (audioStr) {
        const audio = JSON.parse(audioStr)
        const param = { prop: 'key', value: 'value' }

        param.prop = 'duration'
        param.value = audio.duration
        store.commit('setAudio', param)

        // param.prop = 'currentTime'
        // param.value = audio.currentTime
        // store.commit('setAudio', param)

        if (audio.volume < 1 && audio.volume > 0) {
          param.prop = 'volume'
          param.value = audio.volume
          store.commit('setAudio', param)
        }

        param.prop = 'mode'
        param.value = audio.mode
        store.commit('setAudio', param)

        param.prop = 'jump'
        param.value = audio.currentTime
        store.commit('setAudio', param)
      }
    }

    return {
      showPlayView,
      showDialog
    }
  }
})
</script>

<style>
:root{
  --primary-color: #1DCF9F;
  --light-color: rgba(29, 207, 159, 0.1);
  /*--primary-color: rgb(244, 93, 93);*/
  --block-size: 160px;
  --block-num: 5;
}
::-webkit-scrollbar {
  width: 6px; /* 纵向滚动条*/
  height: 6px; /* 横向滚动条 */
  background-color: #fff;
}

/*定义滑块*/
::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 20px;
}
#playView{
  position: absolute;
  min-width: 1200px;
  width: 100%;
  height: 100%;
  background: #404040;
  z-index: 10000;
  transition: 0.5s;
  /*background: #fafafa;*/
}
.login-dialog{
  min-width: 1200px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
}
.user-dialog{
  min-width: 200px;
  position: absolute;
  top: 60px;
  right: 30px;
  z-index: 10000;
}
.playView-enter-from,
.playView-leave-to{
  transform: translateY(100%);
}
.playView-enter-active,
.playView-leave-active{
  transition: 0.3s;
}

.discolour {
  cursor: pointer;
  color: rgb(102, 102, 102);
}
.discolour:hover {
  color: var(--primary-color);
}
</style>
