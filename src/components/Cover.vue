<template>
  <div :style="{'background-image': 'url(' + url + ')'}" class="cover" @click="clickBlock">
    <!--    <img :src="url" class="image">-->
    <div class="play" @click.stop="">
      <svg-icon name="play-fill" class="play-icon" />
      <div :style="{'background-image': 'url(' + url + ')'}" class="mask" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import coverImage from '../assets/image/cover2.jpg'
export default defineComponent({
  name: 'MiniCover',
  props: {
    content: Object
  },
  setup(props, ctx) {
    const imgUrl = props.content?.coverImgUrl ?? coverImage
    document.body.style.setProperty('--imgUrl', imgUrl)
    document.body.style.setProperty('background-image', 'url(' + imgUrl + ')')
    return {
      url: imgUrl
    }
  },
  methods: {
    clickBlock() {
      this.$router.push({ name: 'playList', params: { id: this.content?.id }})
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
  border-radius: 8px;
  transition: 0.2s;
  /*background-attachment: fixed;*/
  /*background-position: center;*/
  background-size: cover;
}
.cover:hover{
  transform: translateY(-10px);
  /*width: calc(var(--block-size) + 10px );*/
  /*height: calc(var(--block-size) + 10px );*/
}
.image{
  width: 100%;
  height: 100%;
  border-radius: 8px;
  z-index: 0;
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
  /*transform: scale(1.1);*/
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: blur(12px);
  background: rgba(134, 133, 133, 0.9);
  /*background-attachment: fixed;*/
  background-position: center;
  /*background-origin: content-box;*/
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
