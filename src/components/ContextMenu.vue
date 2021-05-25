<template>
  <div ref="menu" class="menu" :style="{ top: y+'px', left: x+'px' }">
    <div class="first">
      <img class="cover" :src="info?.album.picUrl+'?param=100y100'">
      <div class="info">
        <span class="music-name" style="font-size: 16px;padding: 0">{{ info?.name }}</span>
        <div>
          <span
            v-for="(item,index) of info?.artist"
            :key="item.id"
            style="font-weight: 300;padding: 0"
          >
            <span class="discolour">{{ item?.name }}</span>
            <span v-if="index!==info?.artist.length-1">/</span>
          </span>
        </div>
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
import { defineComponent, computed, onMounted, ref, onUpdated } from 'vue'
import { useStore } from 'vuex'
import coverImage from '@/assets/image/cover2.jpg'
export default defineComponent({
  name: 'ContextMenu',
  props: {
    pointX: Number,
    pointY: Number,
    info: Object
  },
  setup(props, ctx) {
    const store = useStore()
    const menu = ref()
    const x = ref(props.pointX)
    const y = ref(props.pointY)

    const getX = () => {
      if (props.pointX + menu.value.clientWidth > window.document.body.offsetWidth) {
        return window.document.body.offsetWidth - menu.value.clientWidth - 80
      } else {
        return props.pointX
      }
    }
    const getY = () => {
      if (props.pointY + menu.value.clientHeight > window.document.body.offsetHeight) {
        return window.document.body.offsetHeight - menu.value.clientHeight - 80
      } else {
        return props.pointY
      }
    }

    onUpdated(() => {
      x.value = getX()
      y.value = getY()
    })
    return {
      menu,
      coverImage,
      x,
      y
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
  width: 250px;
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
