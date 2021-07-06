<template>
  <div ref="menu" class="menu" :style="{ top: y+'px', left: x+'px' }">
    <div class="first">
      <img class="cover" :src="info.image+'?param=100y100'">
      <div class="info">
        <span class="music-name" style="font-size: 16px;">{{ info.name }}</span>
        <div class="artist">
          <span
            v-for="(item,index) of info.artists"
            :key="item.id"
          >
            <span v-artist="item?.id" class="discolour">{{ item.name }}</span>
            <span v-if="index!==info.artists.length-1">/</span>
          </span>
        </div>
      </div>
    </div>
    <HR align="center" width="100%" color="#cccccc" />
    <div class="second">
      <span class="option" @click="playNow">播放</span>
      <span class="option" @click="playWait">下一首播放</span>
    </div>
    <HR align="center" width="100%" color="#cccccc" />
    <div class="third">
      <span class="option">添加到我的喜欢</span>
      <span class="option">添加到歌单</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onBeforeUnmount } from 'vue'
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

    const playNow = () => {
      ctx.emit('playNow')
    }

    const playWait = () => {
      ctx.emit('playWait')
    }

    onMounted(() => {
      x.value = getX()
      y.value = getY()
      document.onmousedown = (e) => {
        if (!menu.value.contains(e.target)) {
          ctx.emit('close')
        }
      }
      document.onwheel = () => {
        ctx.emit('close')
        document.onwheel = null
      }
    })

    onBeforeUnmount(() => {
      document.onmousedown = null
      document.onwheel = null
    })
    return {
      menu,
      coverImage,
      x,
      y,
      playNow,
      playWait
    }
  }
})
</script>

<style scoped>
.menu{
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
  position: fixed;
  /*max-width: 250px;*/
  min-width: 200px;
  background: #FFFFFF;
  z-index: 100;
  user-select: none;
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
  margin-bottom: 5px;
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
  font-weight: bolder;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.artist{
  font-weight: 300;
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
.option{
  font-weight: bolder;
  padding: 10px;
  cursor: pointer;
}
.option:hover{
  background: rgba(236, 236, 236, 0.53);
  border-radius: 8px;
}
</style>
