<template>
  <audio
    id="audio"
    src="http://172.16.19.76:10000/hyjw/%E5%9C%A8%E9%9B%A8%E4%B8%AD-%E6%B1%AA%E5%B3%B0.mp3"
    controls
    autoplay
    @durationchange="durationchange"
    @loadeddata="loadeddata"
    @progress="progress"
    @canplay="canplay"
    @play="play"
    @pause="pause"
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
    source() {
      return this.$store.state.audio.src
    },
    state() {
      return this.$store.state.audio.state
    },
    volume() {
      return this.$store.state.audio.volume
    },
    mute() {
      return this.$store.state.audio.mute
    },
  },
  watch: {
    jump() {
      let audio = document.getElementById('audio')
      audio.currentTime = this.jump
      audio = document.getElementById('audio')
      if (audio.paused) {
        audio.play()
      }
    },
    state() {
      const audio = document.getElementById('audio')
      if (this.state) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    volume() {
      const audio = document.getElementById('audio')
      audio.volume = this.volume
    },
    mute() {
      const audio = document.getElementById('audio')
      audio.muted = !audio.muted
    },
  },
  methods: {
    durationchange() {
      const audio = document.getElementById('audio')
      const param = { prop: 'duration', value: audio.duration }
      this.$store.commit('setAudio', param)
    },
    loadeddata() {

    },
    progress() {
      const audio = document.getElementById('audio')
      const param = { prop: 'buffered', value: audio.buffered.end(audio.buffered.length - 1) }
      this.$store.commit('setAudio', param)
    },
    canplay() {
      const audio = document.getElementById('audio')
      audio.volume = this.$store.state.audio.volume
      const this_ = this
      audio.ontimeupdate = function() {
        const param = { prop: 'currentTime', value: audio.currentTime }
        this_.$store.commit('setAudio', param)
      }
    },
    play() {
      if (!this.state) {
        const param = { prop: 'state', value: true }
        this.$store.commit('setAudio', param)
      }
    },
    pause() {
      if (this.state) {
        const param = { prop: 'state', value: false }
        this.$store.commit('setAudio', param)
      }
    },
  },
})
</script>

<style scoped>

</style>
