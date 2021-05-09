<template>
  <div :style="{'background-image': 'url(' + imgUrl + ')'}" class="cover" @click="onPlay">
    <div class="play">
      <svg-icon name="play-fill" class="play-icon" />
      <div :style="{'background-image': 'url(' + imgUrl + ')'}" class="mask" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import coverImage from '../assets/image/cover2.jpg'
export default defineComponent({
  name: 'MiniCover',
  props: {
    image: String
  },
  setup(props, ctx) {
    let imgUrl = coverImage
    imgUrl = props?.image + '?param=100y100'
    const onPlay = () => {
      ctx.emit('play')
    }
    return {
      imgUrl,
      onPlay
    }
  }
})
</script>

<style scoped>
:root{
  --imgUrl: '/src/assets/image/cover2.jpg'
}
.cover{
  position: relative;
  width: var(--block-size);
  height: var(--block-size);
  border-radius: 5px;
  transition: 0.2s;
  background-size: cover;
}
/*.cover:hover{*/
/*  transform: translateY(-10px);*/
/*}*/
.play{
  width: 50%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  overflow: hidden;
  border-radius: 50%;
  background: rgb(212, 212, 212);
  visibility: hidden;
  transition: width 0.2s, height 0.2s;
}
.cover:hover .play{
  visibility: visible;
}
/*.play:hover{*/
/*  width: 28%;*/
/*  height: 28%;*/
/*}*/
.mask{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(5px);
  background: rgba(134, 133, 133, 0.9);
  background-position: center;
  background-size: 300%;
  z-index: 1;
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
</style>
