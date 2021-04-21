<template>
  <div class="view">
    <div class="mask">
      <img :src="currMusic?currMusic.album.picUrl:coverImage" style="width: 100%;height: 100%;object-fit: cover">
    </div>
    <div>
      <svg-icon name="down" style="font-size: 24px;margin: 20px 0 0 50px;color: #FFFFFF" @click="showPlayView" />
    </div>
    <div id="container" class="container">
      <div class="left">
        <a-image :src="currMusic?currMusic.album.picUrl:coverImage" class="cover" width="100%" style="margin-bottom: 30px" />
        <div class="info">
          <div class="text">
            <span style="color: #FFFFFF;font-size: 18px;font-weight: bolder">{{ currMusic ? currMusic.name : 'Ping音乐' }}</span>
            <span v-if="!currMusic" style="color: #cccccc">FuYH</span>
            <div v-else>
              <span
                v-for="(item,index) of currMusic.artist"
                :key="item.id"
                class="discolour"
                style="color: #cccccc;cursor: pointer"
              >{{ item.name }}{{ index===currMusic.artist.length-1? '' : '/' }}</span>
            </div>
          </div>
          <svg-icon name="love" />
        </div>
        <div style="width: 100%">
          <ProgressBar2 origin-key="playView" @jumpTo="jumpTo" />
        </div>
        <div class="control">
          <div>
            <svg-icon
              :name="modeList[mode]"
              class="discolour"
              style="font-size: 20px;"
              @click="switchMode"
            />
          </div>
          <svg-icon
            name="prev"
            class="discolour prev-button"
            style="font-size: 26px"
            @click="prev"
          />
          <svg-icon
            :name="state ? 'pause' : 'play'"
            style="font-size: 40px; color: var(--primary-color)"
            @click="changeState"
          />
          <svg-icon
            name="next"
            class="discolour next-button"
            style="font-size: 26px"
            @click="next"
          />
          <div class="volume">
            <svg-icon
              :name="mute?'volume_mute':'volume'"
              class="discolour"
              style="font-size: 20px"
              @click="volumeMute"
            />
            <VolumeBar v-show="!mute" class="volumeBar" origin-key="playView" />
          </div>
        </div>
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
          <div style="display: inline-block;position: relative;font-size: 17px">
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
// import { FullscreenOutlined } from '@ant-design/icons-vue'
import ProgressBar2 from '@/components/ProgressBar2.vue'
import VolumeBar from '@/components/VolumeBar.vue'
import coverImage from '@/assets/image/cover.png'
// import { getMusicDetail, getLyricById } from '../api/music'
export default defineComponent({
  name: 'PlayView',
  components: {
    ProgressBar2,
    VolumeBar
  },
  data() {
    return {
      coverImage: coverImage,
      isVolumeBar: false,
      modeList: ['order', 'loop', 'random', 'single'],
      lyricList: [],
      lyricIndex: 0
    }
  },
  computed: {
    detailList() {
      return this.$store.state.detailList
    },
    currIndex() {
      return this.$store.state.currIndex
    },
    currMusic() {
      return this.detailList[this.currIndex]
    },
    lyric() {
      return this.$store.state.audio.lyric
    },
    currentDura() {
      return this.$store.state.audio.currentTime
    },
    state() {
      return this.$store.state.audio.state
    },
    // currentDura() {
    //   return this.$store.state.audio.currentTime
    // },
    totalDura() {
      return this.$store.state.audio.duration
    },
    mode() {
      return this.$store.state.audio.mode
    },
    mute() {
      return this.$store.state.audio.mute
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
    const rc = '[00:04.050]\n[00:12.570]难以忘记初次见你\n[00:16.860]一双迷人的眼睛\n[00:21.460]在我脑海里\n[00:23.960]你的身影 挥散不去\n[00:30.160]握你的双手感觉你的温柔\n[00:34.940]真的有点透不过气\n[00:39.680]你的天真 我想珍惜\n[00:43.880]看到你受委屈 我会伤心\n[00:48.180]喔\n[00:50.340]只怕我自己会爱上你\n[00:55.070]不敢让自己靠的太近\n[00:59.550]怕我没什么能够给你\n[03:07.730]我竟然又会遇见你\n[03:13.020]我真的真的不愿意\n[03:16.630]就这样陷入爱的陷阱\n[03:20.700]喔\n[04:03.000]\n'
    await this.analyzeLyric(rc)
  },
  mounted() {

  },
  methods: {
    showPlayView() {
      this.$store.commit('setShowPlayView', false)
    },
    switchMode() {
      let param = {}
      if (this.mode !== this.modeList.length - 1) {
        param = { prop: 'mode', value: this.mode + 1 }
      } else {
        param = { prop: 'mode', value: 0 }
      }
      this.$store.commit('setAudio', param)
    },
    changeState(): void {
      const param = { prop: 'state', value: !this.state }
      this.$store.commit('setAudio', param)
    },
    volumeMute() {
      const param = { prop: 'mute', value: !this.$store.state.audio.mute }
      this.$store.commit('setAudio', param)
    },
    prev() {
      const param = { prop: 'prev', value: true }
      this.$store.commit('setAudio', param)
    },
    next() {
      const param = { prop: 'next', value: true }
      this.$store.commit('setAudio', param)
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
      if (index < this.lyricList.length - 2) {
        style.transition = 'width ' + (this.lyricList[index + 1].time - this.lyricList[index].time) + 's linear'
        // console.log(index, (this.lyricList[index + 1].time - this.lyricList[index].time))
      }
      if (index === this.lyricIndex) {
        // style.background = '#FFFFFF'
        if (index > 1) {
          // style.transition = 'width ' + (this.lyricList[index].time - this.lyricList[index - 1].time) + 's'
          // style.transition = 'width 5' + 's linear'
        }
        style.visibility = 'visible'
        style['line-height'] = '1'
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

::-webkit-scrollbar {
  display: none;
  width: 6px; /* 纵向滚动条*/
  height: 6px; /* 横向滚动条 */
  background-color: #8e0e0e;
}

/*定义滑块*/
::-webkit-scrollbar-thumb {
  display: none;
  background-color: #c93636;
  border-radius: 20px;
}

.view{
  display: flex;
  flex-direction: column;
  position: relative;
}
.mask{
  width: 100%;
  height: 100%;
  position: absolute;
  background: #5a5a5a;
  filter: blur(30px) opacity(0.5);
  z-index: -1;
  /*animation: maskAnimation 2s infinite alternate linear;*/
}
@keyframes maskAnimation {
  from{
    filter: blur(30px) ;
  }
  to{
    filter: blur(30px);
  }
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
  width: 30%;
  height: 100%;
  padding: 0 20px 0 20px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  /*transition: 3s;*/
}
.cover{
  border-radius: 5px;
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
.control{
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.discolour {
  color: #FFFFFF;
}

.discolour:hover {
  color: var(--primary-color);
}
.prev-button {
  color: #FFFFFF;
  margin: 0 20px 0 30px;
}

.next-button {
  color: #FFFFFF;
  margin: 0 30px 0 20px;
}
.volume{
  position: relative;
}
.volumeBar{
  width: 0;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: 0.3s;
}
.volume:hover .volumeBar{
  width: 100px;
}
.lyric{
  line-height: 18px;
  padding: 5px 10px;
  user-select: none;
  display: inline-block;
  color: #FFFFFF;
}

.lyric2{
  line-height: 18px;
  color: var(--primary-color);
  padding: 5px 10px;
  user-select: none;
  position: absolute;
  display: inline-block;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
  width: 0;
  /*text-overflow: clip;*/
  /*overflow: hidden;*/
  white-space:nowrap;
}
</style>
