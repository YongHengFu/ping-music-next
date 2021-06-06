<template>
  <div style="position: relative;width: 100vw;height: 100vh;overflow-y: hidden">
    <playView id="playView" :style="showPlayView?'':'transform:translateY(110%)'" />
    <router-view />
    <LoginDialog v-if="showDialog===0" class="login-dialog" />
    <UserDialog v-if="showDialog===1" class="user-dialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import playView from '@/pages/playView/playView.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import UserDialog from '@/components/UserDialog.vue'
// document.body.style.setProperty('--main-color', '#1DCF9F')

export default defineComponent({
  name: 'App',
  components: {
    playView,
    LoginDialog,
    UserDialog
  },
  setup() {
    const store = useStore()
    const showPlayView = computed(() => store.state.showPlayView)
    const showDialog = computed(() => store.state.showDialog)
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
