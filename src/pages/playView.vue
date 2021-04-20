<template>
  <div class="view">
    <button @click="showPlayView">down</button>
    <div id="container" class="container">
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
      <div id="lyricScroll" ref="lyricScroll" class="right">
        <!--        <span-->
        <!--          v-for="(item,index) of lyricList"-->
        <!--          :id="'ly'+index"-->
        <!--          ref="ly"-->
        <!--          :key="item.time"-->
        <!--          style="position: relative;display: block"-->
        <!--        >-->
        <!--          <span-->
        <!--            :style="changeStyle(index)"-->
        <!--            class="lyric2"-->
        <!--          >{{ item.lyric }}</span>{{ item.lyric }}-->
        <!--        </span>-->
        <div
          v-for="(item,index) of lyricList"
          :id="'ly'+index"
          ref="ly"
          :key="item.time"
          style="position: relative"
        >
          <div style="display: inline-block;position: relative">
            <span
                class="lyric"
            >{{ item.lyric }}</span>
            <span
                :style="changeStyle(index)"
                class="lyric2"
            >{{ item.lyric }}</span>
          </div>

        </div>
      </div>
    </div>
    <!--    <button @click="scroll">scroll</button>-->
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
      console.log(this.lyric)
      this.analyzeLyric(this.lyric)
      this.$nextTick(function() {
        const viewHeight = document.getElementById('container').clientHeight
        document.getElementById('ly0').style.marginTop = viewHeight / 2 + 'px'
        document.getElementById('ly' + (this.lyricList.length - 1)).style.marginBottom = viewHeight / 2 + 'px'
      })
    },
    currentDura() {
      if (this.lyricList.length > 0 && this.lyricIndex >= 0 && this.lyricIndex < this.lyricList.length - 1 && this.currentDura > this.lyricList[this.lyricIndex + 1].time) {
        this.scroll()
        // this.lyricIndex++
      }
    },
    lyricList() {

    }
  },
  async created() {
    // if(this.lyric)
    // this.analyzeLyric(this.lyric)
    // const rc = '[00:04.050]\n[00:12.570]难以忘记初次见你\n[00:16.860]一双迷人的眼睛\n[00:21.460]在我脑海里\n[00:23.960]你的身影 挥散不去\n[00:30.160]握你的双手感觉你的温柔\n[00:34.940]真的有点透不过气\n[00:39.680]你的天真 我想珍惜\n[00:43.880]看到你受委屈 我会伤心\n[00:48.180]喔\n[00:50.340]只怕我自己会爱上你\n[00:55.070]不敢让自己靠的太近\n[00:59.550]怕我没什么能够给你\n[03:07.730]我竟然又会遇见你\n[03:13.020]我真的真的不愿意\n[03:16.630]就这样陷入爱的陷阱\n[03:20.700]喔\n[04:03.000]\n'
    // await this.analyzeLyric(rc)
  },
  mounted() {
    // this.$nextTick(function() {
    //   const viewHeight = document.getElementById('container')
    //   console.log(viewHeight)
    //   document.getElementById('ly0').style.marginTop = viewHeight / 2 + 'px'
    //   document.getElementById('ly' + (this.lyricList.length - 1)).style.marginBottom = viewHeight / 2 + 'px'
    // })
  },
  methods: {
    showPlayView() {
      this.$store.commit('setShowPlayView', false)
    },
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
      // const viewHeight = document.getElementById('lyricScroll').clientHeight
      const style = {}
      if (index < this.lyricList.length -2) {
        style.transition = 'width ' + (this.lyricList[index+1].time - this.lyricList[index].time) + 's linear'
        // console.log(index, (this.lyricList[index + 1].time - this.lyricList[index].time))
      }
      if (index === this.lyricIndex) {
        // style.background = '#FFFFFF'
        if (index > 1) {
          // style.transition = 'width ' + (this.lyricList[index].time - this.lyricList[index - 1].time) + 's'
          // style.transition = 'width 5' + 's linear'
        }
        style.visibility = 'visible'
        style.width = '100%'
      }
      // if (index === 0) {
      //   style['margin-top'] = viewHeight + 'px'
      // }
      // if (index === this.lyricList.length - 1) {
      //   style['margin-bottom'] = viewHeight + 'px'
      // }
      return style
    },
    scroll() {
      if (this.lyricIndex < this.lyricList.length - 1) {
        this.lyricIndex++
        document.getElementById('ly' + (this.lyricIndex)).scrollIntoView({ behaviour: 'smooth' })
        const curr = document.getElementById('ly' + this.lyricIndex).offsetTop
        const last = document.getElementById('ly' + (this.lyricList.length - 1)).offsetTop
        const viewHeight = document.getElementById('lyricScroll').clientHeight
        const lyricScroll = this.$refs.lyricScroll
        if ((lyricScroll.scrollHeight - lyricScroll.scrollTop) <= viewHeight) {
          lyricScroll.scrollTop -= last - curr
        } else {
          lyricScroll.scrollTop -= viewHeight / 2
        }
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
  height: 70vh;
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
  /*display: flex;*/
  /*flex-direction: column;*/
  /*justify-content: flex-start;*/
  /*transition: 3s;*/
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
  display: inline-block;
}
.lyric:hover{
  background: #FFFFFF;
}
.lyric2{
  color: var(--primary-color);
  padding: 5px 10px;
  user-select: none;
  border-radius: 5px;
  position: absolute;
  display: inline-block;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
  width: 0;
  text-overflow: clip;
  overflow: hidden;
  white-space:nowrap;
  transition: width 10s linear;
}
</style>
