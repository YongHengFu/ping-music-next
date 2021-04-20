<template>
  <div class="view">
    <div class="container">
      <div class="left">
        <a-image :src="coverImage" class="cover" width="100%" />
        <div class="info">
          <div class="text">
            <span>Ping音乐</span>
            <span>FuYH</span>
          </div>
          <svg-icon name="love" />
        </div>
        <div class="control" />
      </div>
      <div ref="lyricScroll" class="right">
        <p
          v-for="(item,index) of lyricList"
          :id="'ly'+index"
          :key="item.time"
          :style="changeStyle(index)"
          class="lyric"
        >{{ item.lyric }}</p>
      </div>
    </div>
    <button @click="scroll">scroll</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import coverImage from '@/assets/image/cover.png'
// import { getMusicDetail, getLyricById } from '../api/music'
export default defineComponent({
  name: 'PlayView',
  data() {
    return {
      coverImage: coverImage,
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
      this.lyricIndex = 0
      this.analyzeLyric(this.lyric)
    },
    currentDura() {
      if (this.lyricList.length > 0 && this.lyricIndex > -1 && this.currentDura > this.lyricList[this.lyricIndex + 1].time) {
        this.lyricIndex++
      }
    }
  },
  created() {
    const rc = '[00:04.050]\n[00:12.570]难以忘记初次见你\n[00:16.860]一双迷人的眼睛\n[00:21.460]在我脑海里\n[00:23.960]你的身影 挥散不去\n[00:30.160]握你的双手感觉你的温柔\n[00:34.940]真的有点透不过气\n[00:39.680]你的天真 我想珍惜\n[00:43.880]看到你受委屈 我会伤心\n[00:48.180]喔\n[00:50.340]只怕我自己会爱上你\n[00:55.070]不敢让自己靠的太近\n[00:59.550]怕我没什么能够给你\n[01:04.030]爱你也需要很大的勇气\n[01:08.190]只怕我自己会爱上你\n[01:12.910]也许有天会情不自禁\n[01:17.380]想念只让自己苦了自己\n[01:21.840]爱上你是我情非得已\n[01:28.810]难以忘记初次见你\n[01:33.170]一双迷人的眼睛\n[01:37.700]在我脑海里 你的身影 挥散不去\n[01:46.360]握你的双手感觉你的温柔\n[01:51.120]真的有点透不过气\n[01:55.910]你的天真 我想珍惜\n[02:00.150]看到你受委屈 我会伤心\n[02:04.490]喔\n[02:06.540]只怕我自己会爱上你\n[02:11.240]不敢让自己靠的太近\n[02:15.750]怕我没什么能够给你\n[02:20.200]爱你也需要很大的勇气\n[02:24.570]只怕我自己会爱上你\n[02:29.230]也许有天会情不自禁\n[02:33.680]想念只让自己苦了自己\n[02:38.140]爱上你是我情非得已\n[03:04.060]什么原因 耶\n[03:07.730]我竟然又会遇见你\n[03:13.020]我真的真的不愿意\n[03:16.630]就这样陷入爱的陷阱\n[03:20.700]喔\n[03:22.910]只怕我自己会爱上你\n[03:27.570]不敢让自己靠的太近\n[03:32.040]怕我没什么能够给你\n[03:36.560]爱你也需要很大的勇气\n[03:40.740]只怕我自己会爱上你\n[03:45.460]也许有天会情不自禁\n[03:49.990]想念只让自己苦了自己\n[03:54.510]爱上你是我情非得已\n[03:58.970]爱上你是我情非得已\n[04:03.000]\n'
    this.analyzeLyric(rc)
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
    },
    changeStyle(index) {
      const style = {}
      if (index === this.lyricIndex) {
        style.background = '#FFFFFF'
      }
      if (index === 0) {
        style['margin-top'] = '50%'
      }
      if (index === this.lyricList.length - 1) {
        style['margin-bottom'] = '100%'
      }
      return style
    },
    scroll() {
      // const test = document.getElementById('ly' + this.lyricIndex)
      // console.log(test.offsetTop)
      if (this.lyricIndex < this.lyricList.length - 1) {
        document.getElementById('ly' + (++this.lyricIndex)).scrollIntoView()
        console.log(this.$refs.lyricScroll.scrollHeight - this.$refs.lyricScroll.scrollTop, this.$refs.lyricScroll.clientHeight)
        // if ((this.$refs.lyricScroll.scrollHeight - this.$refs.lyricScroll.scrollTop) < this.$refs.lyricScroll.clientHeight * (3 / 2)) {
        //   this.$refs.lyricScroll.scrollTop -= (this.$refs.lyricScroll.clientHeight / 2 - (this.$refs.lyricScroll.scrollHeight - this.$refs.lyricScroll.scrollTop - this.$refs.lyricScroll.clientHeight))
        // } else {
        //   this.$refs.lyricScroll.scrollTop -= this.$refs.lyricScroll.clientHeight / 2
        // }
        // if ((this.$refs.lyricScroll.scrollHeight - this.$refs.lyricScroll.scrollTop) > this.$refs.lyricScroll.clientHeight/2-10) {
        //   document.getElementById('ly' + (++this.lyricIndex)).scrollIntoView()
          this.$refs.lyricScroll.scrollTop -= this.$refs.lyricScroll.clientHeight / 2
        // }
        // this.$refs.lyricScroll.scrollTop -= this.$refs.lyricScroll.clientHeight / 2
      }
    }
  }
})
</script>

<style scoped>
.view{
  display: flex;
}
.container{
  width: 100%;
  height: 70%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.left{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 20%;
}
.right{
  width: 40%;
  height: 100%;
  padding: 0 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
.cover{

}
.info{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.text{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.lyric{
  padding: 5px 10px;
  user-select: none;
  border-radius: 5px;
}
.lyric:hover{
  background: #FFFFFF;
}
</style>
