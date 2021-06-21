<template>
  <div class="view">
    <div class="mask">
      <Image :src="imgUrl" style="width: 100%;height: 100%;object-fit: cover"/>
    </div>
    <div>
      <svg-icon name="down" style="font-size: 24px;margin: 20px 0 0 50px;color: #FFFFFF" @click="showPlayView" />
    </div>
    <div id="container" class="container">
      <div class="left">
        <img :src="imgUrl" class="cover" style="margin-bottom: 30px;width: 100%">
        <ControlBarMini />
      </div>
      <div class="right">
        <Lyric />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref } from 'vue'
import { useStore } from 'vuex'
import ControlBarMini from './components/ControlBarMini.vue'
import Lyric from './components/Lyric.vue'
import coverImage from '@/assets/image/cover.png'
import Image from '@/components/global/Image.vue'
export default defineComponent({
  name: 'PlayView',
  components: {
    Image,
    Lyric,
    ControlBarMini
  },
  setup() {
    const store = useStore()
    const currMusic = computed(() => store.state.currMusic)
    const imgUrl = ref(coverImage)

    watch(currMusic, () => {
      imgUrl.value = currMusic.value?.album.picUrl + '?param=800y800'
    })

    const showPlayView = () => {
      store.commit('setShowPlayView', false)
    }

    return {
      coverImage,
      imgUrl,
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
  user-select: none;
}
.mask{
  width: 100%;
  height: 100%;
  position: absolute;
  background: #5a5a5a;
  filter: blur(30px) opacity(0.5);
  z-index: -1;
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
