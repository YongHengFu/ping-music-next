<template>
  <div style="position: relative;width: 100vw;height: 100vh">
    <playView id="playView" v-show="showPlayView" />
    <router-view v-show="!showPlayView"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import playView from '@/pages/playView.vue'
// document.body.style.setProperty('--main-color', '#1DCF9F')

export default defineComponent({
  name: 'App',
  components: {
    playView
  },
  computed: {
    showPlayView() {
      return this.$store.state.showPlayView
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
  /*position: absolute;*/
  min-width: 1000px;
  width: 100%;
  height: 100%;
  background: #404040;
  z-index: 100;
  /*background: #fafafa;*/
}
</style>
