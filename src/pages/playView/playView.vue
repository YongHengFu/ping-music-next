<template>
  <div class="view">
    <div class="mask">
      <img :src="currMusic?currMusic.album.picUrl:coverImage" style="width: 100%;height: 100%;object-fit: cover">
    </div>
    <div>
      <svg-icon name="down" style="font-size: 24px;margin: 20px 0 0 50px;color: #FFFFFF" @click="showPlayView" />
    </div>
    <div id="container" class="container">
      <div class="left">
        <a-image :src="currMusic?currMusic.album.picUrl:coverImage" class="cover" width="100%" style="margin-bottom: 30px" />
        <ControlBarMini />
      </div>
      <div class="right">
        <Lyric />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import ControlBarMini from './components/ControlBarMini.vue'
import Lyric from './components/Lyric.vue'
import coverImage from '@/assets/image/cover.png'
export default defineComponent({
  name: 'PlayView',
  components: {
    Lyric,
    ControlBarMini
  },
  setup() {
    const store = useStore()

    const detailList = computed(() => store.state.detailList)
    const currIndex = computed(() => store.state.currIndex)
    const currMusic = computed(() => detailList.value[currIndex.value])

    const showPlayView = () => {
      store.commit('setShowPlayView', false)
    }

    return {
      coverImage,
      currMusic,
      showPlayView
    }
  }
})
</script>

<style scoped>

::-webkit-scrollbar {
  display: none;
  width: 6px; /* 纵向滚动条*/
  height: 6px; /* 横向滚动条 */
  background-color: #8e0e0e;
}

/*定义滑块*/
::-webkit-scrollbar-thumb {
  display: none;
  background-color: #c93636;
  border-radius: 20px;
}

.view{
  display: flex;
  flex-direction: column;
  position: relative;
}
.mask{
  width: 100%;
  height: 100%;
  position: absolute;
  background: #5a5a5a;
  filter: blur(30px) opacity(0.5);
  z-index: -1;
  /*animation: maskAnimation 2s infinite alternate linear;*/
}
@keyframes maskAnimation {
  from{
    filter: blur(30px) ;
  }
  to{
    filter: blur(200px);
  }
}
.container{
  width: 100%;
  height: 70vh;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.left{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 25%;
  margin-right: 5%;
}
.right{
  width: 40%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}
.cover{
  border-radius: 5px;
}
</style>
