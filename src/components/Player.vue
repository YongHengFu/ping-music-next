<template>
  <audio
    id="audio"
    :src="list.length>0?list[index]:null"
    autoplay
    @durationchange="durationchange"
    @loadeddata="loadeddata"
    @progress="progress"
    @canplay="canplay"
    @play="play"
    @pause="pause"
    @ended="ended"
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
      index: 0,
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
    list() {
      return this.$store.state.musicList
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
    list() {
      this.index = 0
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
    ended() {
      if (this.index !== this.list.length - 1) {
        this.index++
      }
    },
  },
})
</script>

<style scoped>

</style>
