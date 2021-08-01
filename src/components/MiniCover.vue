<template>
  <div style="position: relative;overflow: hidden;">
    <div :style="{'background-image': 'url(' + image + '?param=100y100)'}" class="cover" @click="onPlay">
      <div v-if="!isCurr" class="play">
        <svg-icon name="play-fill" class="play-icon" />
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

    const state = computed(() => store.state.audio.state)

    watch(state, () => {
      if (props.isCurr) {
        if (state.value) {
          player.value?.play()
        } else {
          player.value?.pause()
        }
      }
    })

    const onPlay = () => {
      ctx.emit('play')
    }
    return {
      player,
      playAnimation,
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
  border-radius: 8px;
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
  background: rgba(62, 62, 62, 0.75);
  border-radius: 8px;
}
</style>
