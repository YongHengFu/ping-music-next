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
import { getMusicDetail, getLyricById } from '../api/music'
export default defineComponent({
  name: 'Player',
  props: {
    jump: {
      type: Number
    }
  },
  data() {
    return {
      audio: null,
      index: -1,
      rand: [0],
      prevIndex: 0
    }
  },
  computed: {
    source() {
      // console.log(`https://music.163.com/song/media/outer/url?id=${this.musiclist[this.index]}.mp3`)
      return `https://music.163.com/song/media/outer/url?id=${this.musiclist[this.index]}.mp3`
    },
    state() {
      return this.$store.state.audio.state
    },
    volume() {
      return this.$store.state.audio.volume
    },
    mode() {
      return this.$store.state.audio.mode
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
    records() {
      return this.$store.state.records
    },
    currIndex() {
      return this.$store.state.currIndex
    }
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
      // this.radomList = this.musiclist
      this.index = 0
      this.$store.commit('setCurrIndex', this.index)
      this.getMusicDetails()
    },
    currIndex() {
      this.index = this.currIndex
      this.getLyric(this.currIndex)
    }
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
      this.setRecords(this.musiclist[this.index])
    },
    pause() {
      if (this.state) {
        const param = { prop: 'state', value: false }
        this.$store.commit('setAudio', param)
      }
    },
    ended() {
      if (this.mode <= 1) {
        if (this.index !== this.musiclist.length - 1) {
          this.index++
        } else if (this.mode === 0) {
          this.index = 0
        }
      } else if (this.mode === 2) {
        this.index = Math.floor(Math.random() * this.musiclist.length)
        while (this.rand.includes(this.index)) {
          this.index = Math.floor(Math.random() * this.musiclist.length)
        }
        this.rand.push(this.index)
        if (this.rand.length === this.musiclist.length) {
          this.rand = []
        }
      } else {
        const audio = document.getElementById('audio')
        if (audio !== null) {
          audio.play()
        }
      }
      this.$store.commit('setCurrIndex', this.index)
    },
    error() {
      this.next()
    },
    prev() {
      if (this.prevIndex !== 0) {
        const ind = this.musiclist.indexOf(this.records[this.prevIndex - 1])
        if (ind !== -1) {
          this.index = ind
        } else if (this.index !== 0) {
          this.index--
        } else {
          this.index = this.musiclist.length - 1
        }
      }
      this.$store.commit('setCurrIndex', this.index)
    },
    next() {
      if (this.mode === 2) {
        this.index = Math.floor(Math.random() * this.musiclist.length)
        while (this.rand.includes(this.index)) {
          this.index = Math.floor(Math.random() * this.musiclist.length)
        }
        this.rand.push(this.index)
        if (this.rand.length === this.musiclist.length) {
          this.rand = []
        }
      } else {
        if (this.index !== this.musiclist.length - 1) {
          this.index++
        } else {
          this.index = 0
        }
      }
      this.$store.commit('setCurrIndex', this.index)
    },
    getMusicDetails() {
      if (this.musiclist.length > 0) {
        const param = { ids: '' }
        for (let i = 0; i < this.musiclist.length; i++) {
          param.ids += this.musiclist[i]
          if (i < this.musiclist.length - 1) {
            param.ids += ','
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
                duration: item.dt / 1000,
                publishTime: item.publishTime
              })
            }
            this.$store.commit('setDetailList', details)
          }
        })
      }
    },
    setRecords(id) {
      const list = this.records
      const index = list.indexOf(id)
      if (index === -1) {
        list.push(id)
        this.prevIndex = list.length - 1
      } else {
        list.splice(index, 1)
        this.prevIndex = index
        list.push(id)
      }
      this.$store.commit('setRecords', list)
    },
    getLyric(index) {
      const param = { id: this.musiclist[index] }
      getLyricById(param).then((res) => {
        if (res.code === 200) {
          const param2 = { prop: 'lyric', value: res.lrc.lyric }
          this.$store.commit('setAudio', param2)
          // console.log(this.$store.state.audio.lyric)
        }
      })
    }
  }
})
</script>

<style scoped>

</style>
