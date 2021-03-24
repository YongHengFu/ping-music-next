<template>
  <audio
    id="audio"
    src="http://172.16.19.76:10000/hyjw/%E9%BB%84%E6%A2%85%E6%88%8F-%E6%85%95%E5%AE%B9%E6%99%93%E6%99%93.mp3"
    autoplay="autoplay"
    controls
    @durationchange="durationchange"
    @loadeddata="loadeddata"
    @progress="progress"
    @canplay="canplay"
  />
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Player',
  props: {
    jump: {
      type: Number,
    },
  },
  data() {
    return {
      audio: null,
    }
  },
  computed: {
    source: function() {
      this.startPlay()
      return this.$store.state.audio.src
    },
  },
  watch: {
    jump() {
      const audio = document.getElementById('audio')
      audio.currentTime = this.jump
      console.log('jump :' + this.jump)
    },
  },
  methods: {
    durationchange() {
      const audio = document.getElementById('audio')
      this.$store.state.audio.duration = audio.duration
    },
    loadeddata() {
      // const audio = document.getElementById('audio')
      // console.log(JSON.stringify(audio))
    },
    progress() {
      const audio = document.getElementById('audio')
      console.log('缓冲进度' + audio.buffered.end(audio.buffered.length - 1))
    },
    canplay() {
      const audio = document.getElementById('audio')
      this.$store.state.audio.volume = audio.volume
      const this_ = this
      audio.ontimeupdate = function() {
        const param = { prop: 'currentTime', value: audio.currentTime }
        this_.$store.commit('setAudio', param)
      }
    },
    audioPlay() {

    },
    audioJump() {

    },
  },
})
</script>

<style scoped>

</style>
