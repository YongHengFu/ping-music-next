<template>
  <div class="container">
    <Image :src="imgUrl" :play-icon="true" :type="0" class="cover" style="border-radius: 8px" @click="onOpen" @play="onPlay"/>
    <div class="list">
      <p style="font-size: 22px;font-weight: bolder;margin-bottom: 10px">{{ data.name }}</p>
      <div v-for="(item,index) of data.tracks" :key="item.first" class="music">
        <svg-icon class="number" :name="['one','two','three'][index] " />
        <span class="title">{{ item.first }}-{{ item.second }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import coverImage from '@/assets/image/cover2.jpg'
import Image from '@/components/global/Image.vue'
export default defineComponent({
  name: 'BoardBlock',
  components: { Image },
  props: {
    data: {
      type: Object
    }
  },
  setup(props, ctx) {
    let imgUrl = coverImage
    imgUrl = props?.data?.coverImgUrl + '?param=300y300'
    const onOpen = () => {
      ctx.emit('open')
    }
    const onPlay = () => {
      ctx.emit('play')
    }
    return {
      imgUrl,
      onOpen,
      onPlay
    }
  }
})
</script>

<style scoped>
.container{
  display: flex;
  flex-direction: row;
  background: #efefef;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.container:hover{
  transform: translateY(-10px);
}
.cover{
  position: relative;
  width: var(--block-size);
  height: var(--block-size);
  border-radius: 8px;
  transition: 0.2s;
  background-size: cover;
  cursor: pointer;
  margin-right: 20px;
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
.list{
  width: calc(100% - var(--block-size) - 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.music{
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.number{
  min-width: 14px;
  margin-right: 10px;
  color: red;
}
.title{
  font-size: 14px;
  color: #525151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  padding-right: 10px;
}
</style>
