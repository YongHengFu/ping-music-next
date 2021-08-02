<template>
  <div class="image-container" :class="{'move-up':animation===1}" :style="{'border-radius':borderRadius}">
    <div class="content" :class="{'enlarge':animation===2}">
      <img :src="imageUrl" :style="{'border-radius':borderRadius}" style="width: 100%;height:100%;" @error="fallback">
      <div v-if="playIcon" class="play" @click.stop="onPlay">
        <svg-icon name="play-fill" class="play-icon" />
        <div class="mask" :style="{'background-image': 'url('+imageUrl+')'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import cover from '@/assets/image/cover.png'
import avatar from '@/assets/image/avatar.png'

export default defineComponent({
  name: 'Image',
  props: {
    src: String,
    radius: String,
    type: Number,
    animation: Number,
    playIcon: Boolean
  },
  setup(props, ctx) {
    // const fallback = ref('')
    const imageUrl = ref(props.src)
    const borderRadius = ref('0')
    watch(props, () => {
      if (props.src === '') {
        fallback()
      } else {
        imageUrl.value = props.src
      }
    })
    if (props.radius) {
      borderRadius.value = props.radius
    }
    const fallback = () => {
      if (props.type === undefined) {
        imageUrl.value = ''
        return
      }
      switch (props.type) {
        case 0:
          imageUrl.value = cover
          break
        case 1:
          imageUrl.value = avatar
          break
        default:
          imageUrl.value = cover
      }
    }

    const onPlay = () => {
      ctx.emit('play')
    }
    return {
      imageUrl,
      borderRadius,
      fallback,
      onPlay
    }
  }
})
</script>

<style scoped>
.image-container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.5s;
  position: relative;
  background: #e3e3e3;
}
.image-container .content{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  transition: transform 0.5s;
}
.move-up:hover{
  transform: translateY(-10px);
}
.enlarge:hover{
  transform: scale(1.2);
}
.play{
  height: 40%;
  aspect-ratio: 1/1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  overflow: hidden;
  border-radius: 50%;
  background: rgb(191, 189, 189);
  visibility: hidden;
  transition: width 0.2s, height 0.2s;
}
.image-container:hover .play{
  visibility: visible;
}
.play-icon{
  width: 60%;
  height: 60%;
  color: #FFFFFF;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 2;
}
.mask{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(8px);
  background: rgba(134, 133, 133, 0.9);
  z-index: 1;
  transition: filter 0.5s;
  background-position:center;
  background-size: 400%;
}
.play:hover .mask{
  filter: blur(18px);
}
</style>
