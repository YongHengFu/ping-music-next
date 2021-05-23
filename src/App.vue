<template>
  <div style="position: relative;width: 100vw;height: 100vh;overflow: hidden">
    <playView id="playView" :style="showPlayView?'':'transform:translateY(110%)'" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import playView from '@/pages/playView/playView.vue'
// document.body.style.setProperty('--main-color', '#1DCF9F')

export default defineComponent({
  name: 'App',
  components: {
    playView
  },
  setup() {
    const store = useStore()
    const showPlayView = computed(() => store.state.showPlayView)
    return {
      showPlayView
    }
  }
})
</script>

<style>
:root{
  --primary-color: #1DCF9F;
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
