<template>
  <div class="menu" :style="{ top: pointY+'px', left:pointX+'px' }">
    <div class="first">
      <img class="cover" :src="coverImage">
      <div class="info">
        <span class="music-name" style="font-size: 16px;padding: 0">海阔天空</span>
        <span style="font-weight: 300;padding: 0">Beyond</span>
      </div>
    </div>
    <HR align="center" width="100%" color="#cccccc" size="0.6" />
    <div class="second">
      <span>播放</span>
      <span>下一首播放</span>
    </div>
    <HR align="center" width="100%" color="#cccccc" size="0.6" />
    <div class="third">
      <span>添加到我的喜欢</span>
      <span>添加到歌单</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import coverImage from '@/assets/image/cover2.jpg'
export default defineComponent({
  name: 'ContextMenu',
  props: {
    pointX: Number,
    pointY: Number
  },
  setup(props, ctx) {
    const store = useStore()
    return {
      coverImage
    }
  }
})
</script>

<style scoped>
.menu{
  display: flex;
  flex-direction: column;
  padding: 10px 10px 0 10px;
  border-radius: 10px;
  position: fixed;
  width: 200px;
  max-width: 250px;
  background: #FFFFFF;
  z-index: 100;
}
/*.menu:before{
  content: '';
  background: #bb1f1f;
  filter: blur(8px);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}*/
.first{
  display: flex;
}
.cover{
  min-width: 50px;
  height: 50px;
  border-radius: 8px;
}
.info{
  max-width: 150px;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.music-name{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.second{
  display: flex;
  flex-direction: column;
}
.third{
  display: flex;
  flex-direction: column;
}
span{
  font-weight: bolder;
  padding: 10px;
}
</style>
