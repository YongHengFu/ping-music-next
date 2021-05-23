<template>
  <div style="position: relative;overflow: hidden;border-radius: 8px;">
    <div :style="{'background-image': 'url(' + imgUrl + ')','filter': isCurr?'blur(3px)':''}" class="cover" @click="onPlay">
      <div v-if="!isCurr" class="play">
        <svg-icon name="play-fill" class="play-icon" />
        <div :style="{'background-image': 'url(' + imgUrl + ')'}" class="mask" />
      </div>
    </div>
    <div v-if="isCurr" class="play-animation">
      <lottie-player
        ref="player"
        autoplay
        loop
        mode="bounce"
        :src="playAnimation"
        style="width: 40px;height: 40px;padding-top: 5px"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, watch, defineComponent, ref } from 'vue'
import '@lottiefiles/lottie-player'
import playAnimation from '@/assets/lottie/sonicWave2.json'
import coverImage from '@/assets/image/cover2.jpg'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'MaxCover',
  props: {
    image: String,
    isCurr: Boolean
  },
  setup(props, ctx) {
    const store = useStore()
    const player = ref()
    let imgUrl = coverImage
    imgUrl = props?.image + '?param=100y100'

    const state = computed(() => store.state.audio.state)

    watch(state, () => {
      if (props.isCurr) {
        if (state.value) {
          player.value.play()
        } else {
          player.value.pause()
        }
      }
    })

    const onPlay = () => {
      ctx.emit('play')
    }
    return {
      player,
      playAnimation,
      imgUrl,
      onPlay
    }
  }
})
</script>

<style scoped>
.cover{
  position: relative;
  width: 50px;
  height: 50px;
  background-size: cover;
  cursor: pointer;
}
.play{
  width: 50%;
  height: 50%;
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
.play-animation{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(85, 85, 85, 0.25);
}
</style>
