<template>
  <div>
    <div :style="{'background-image': 'url(' + imgUrl + ')'}" class="cover" @click="onOpen">
      <div class="play" @click.stop="onPlay">
        <svg-icon name="play-fill" class="play-icon" />
        <div :style="{'background-image': 'url(' + imgUrl + ')'}" class="mask" />
      </div>
    </div>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import coverImage from '@/assets/image/cover2.jpg'
export default defineComponent({
  name: 'MaxCover',
  props: {
    image: String,
    text: String
  },
  setup(props, ctx) {
    let imgUrl = coverImage
    imgUrl = props?.image + '?param=300y300'
    const title = props?.text ?? 'null'
    const onOpen = () => {
      ctx.emit('open')
    }
    const onPlay = () => {
      ctx.emit('play')
    }
    return {
      imgUrl,
      title,
      onOpen,
      onPlay
    }
  }
})
</script>

<style scoped>
.cover{
  position: relative;
  width: var(--block-size);
  height: var(--block-size);
  border-radius: 8px;
  transition: 0.2s;
  background-size: cover;
  cursor: pointer;
}
.cover:hover{
  transform: translateY(-10px);
}
.play{
  width: 25%;
  height: 25%;
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
.cover:hover .play{
  visibility: visible;
}
.play:hover{
  width: 28%;
  height: 28%;
}
.mask{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(12px);
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
.title{
  font-size: 14px;
  width: var(--block-size);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
</style>
