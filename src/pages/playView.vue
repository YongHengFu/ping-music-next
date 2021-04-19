<template>
  <div v-if="lyricList.length > 0"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { getMusicDetail, getLyricById } from '../api/music'
export default defineComponent({
  name: 'PlayView',
  data() {
    return {
      lyricList: [],
      lyricIndex: 0
    }
  },
  computed: {
    lyric() {
      return this.$store.state.audio.lyric
    },
    currentDura() {
      return this.$store.state.audio.currentTime
    }
  },
  watch: {
    lyric() {
      // console.log(this.lyric)
      this.lyricIndex = 0
      this.analyzeLyric(this.lyric)
    },
    currentDura() {
      if (this.lyricList.length > 0 && this.lyricIndex > -1 && this.currentDura > this.lyricList[this.lyricIndex+1].time) {
        this.lyricIndex++
      }
    }
  },
  created() {

  },
  methods: {
    analyzeLyric(lyric) {
      const ricList = lyric.split(/\n/)
      // const timeList = []
      const lyricList = []
      let index = -1
      let item = ''
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
      for (let i = 0; i < ricList.length; i++) {
        item = ricList[i].trim()
        index = item.indexOf(']')
        if (index === item.length - 1) {
          ricList.splice(i, 1)
          i = i - 1
        } else {
          let time = ricList[i].match(regTime)[0]
          time = time.replace('[', '')
          time = time.replace(']', '')
          time = this.formatLyricTime(time)
          const item2 = { time: time, lyric: ricList[i].split(']')[1] }
          lyricList.push(item2)
        }
      }

      this.lyricList = lyricList
      // console.log(lyricList)
      // console.log(this.lyricList[2].split(']'))
    },
    formatLyricTime(time) { // 格式化歌词的时间 转换成 sss:ms
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./

      const min = parseInt(time.match(regMin)[0].slice(0, 2))
      let sec = parseInt(time.match(regSec)[0].slice(1, 3))
      const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
      if (min !== 0) {
        sec += min * 60
      }
      return Number(sec + '.' + ms)
    }
  }
})
</script>

<style scoped>

</style>
