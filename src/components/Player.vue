<template>
  <audio
    id="audio"
    :src="source"
    autoplay
    @durationchange="durationchange"
    @loadeddata="loadeddata"
    @progress="progress"
    @canplay="canplay"
    @play="play"
    @pause="pause"
    @ended="ended"
    @error="error"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getMusicDetail } from '../api/music'
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
      return `https://music.163.com/song/media/outer/url?id=${this.musiclist[this.index]}.mp3`
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
    musiclist() {
      return this.$store.state.musicList
    },
    detailList() {
      return this.$store.state.detailList
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
    musiclist() {
      this.index = 0
      this.getMusicDetails()
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
      if (this.index !== this.musiclist.length - 1) {
        this.index++
        this.$store.commit('setCurrIndex', this.index)
      }
    },
    error() {
      if (this.index !== this.musiclist.length - 1) {
        this.index++
        this.$store.commit('setCurrIndex', this.index)
      }
    },
    getMusicDetails() {
      if (this.musiclist.length > 0) {
        const param = { ids: '' }
        for (let i = 0; i < this.musiclist.length; i++) {
          param.id += this.musiclist[i]
          if (i < this.musiclist.length - 1) {
            param.id += ','
          }
        }
        getMusicDetail(param).then((res) => {
          if (res.code === 200) {
            const songs = res.songs
            const details = []
            for (const item of songs) {
              details.push({
                id: item.id,
                name: item.name,
                artist: item.ar,
                album: item.al,
                mvId: item.mv,
              })
            }
            this.$store.commit('setDetailList', details)
          }
        })
      }
    },
  },
})
</script>

<style scoped>

</style>
