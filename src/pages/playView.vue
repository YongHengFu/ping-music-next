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
        <div style="width: 100%;display: flex;align-items: center;color: #FFFFFF">
          <span>{{ currFormat }}</span>
          <ProgressBar origin-key="playView" style="width: 100%;margin: 0 10px" />
          <span>{{ totalFormat }}</span>
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
      <div class="right">
        <div v-show="showDivider" class="divider">
          <span>00:00&nbsp;&nbsp;&nbsp;· · · · ·</span>
          <div style="display: flex;align-items: center">
            <span>· · · · ·&nbsp;&nbsp;&nbsp;</span>
            <a @click="jumpByLyric">
              <svg-icon name="playAll" />
            </a>
          </div>
        </div>
        <div id="lyricScroll" ref="lyricScroll" class="lyricBlock" @wheel="wheelScroll">
          <div
            v-for="(item,index) of lyricList"
            :id="'ly'+index"
            :key="item.time"
            style="position: relative;font-size: 17px"
          >
            <span class="lyric">{{ item.lyric }}</span>
            <span :id="'lyricCurr'+index" class="lyricCurr">{{ item.lyric }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--    <button @click="jumpByLyric">test</button>-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import VolumeBar from '@/components/VolumeBar.vue'
import coverImage from '@/assets/image/cover.png'
// import { getMusicDetail, getLyricById } from '../api/music'
function debounce(fn, wait) {
  var timer = null
  return function() {
    var context = this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, wait)
  }
}
function throttle(func, wait) {
  var previous = 0
  return function() {
    const now = Date.now()
    const context = this
    const args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
export default defineComponent({
  name: 'PlayView',
  components: {
    ProgressBar,
    VolumeBar
  },
  data() {
    return {
      currFormat: '00:00',
      totalFormat: '00:00',
      coverImage: coverImage,
      isVolumeBar: false,
      modeList: ['order', 'loop', 'random', 'single'],
      lyricList: [],
      lyricIndex: 0,
      isJump: false,
      prevRow: -1,
      showDivider: false
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
    totalDura() {
      return this.$store.state.audio.duration
    },
    state() {
      return this.$store.state.audio.state
    },
    mode() {
      return this.$store.state.audio.mode
    },
    mute() {
      return this.$store.state.audio.mute
    },
    jump() {
      return this.$store.state.audio.jump
    }
  },
  watch: {
    lyric() {
      this.lyricIndex = 0
      this.prevRow = -1
      this.analyzeLyric(this.lyric)
    },
    currentDura() {
      this.currFormat = this.timeFormat(this.currentDura)
      if (this.lyricIndex < this.lyricList.length - 1 && this.currentDura > this.lyricList[this.lyricIndex + 1].time) {
        this.scroll()
      }
    },
    totalDura() {
      this.totalFormat = this.timeFormat(this.totalDura)
    },
    state() {
      this.$nextTick(() => {
        const index = this.lyricIndex
        const curr = document.getElementById('lyricCurr' + index)
        if (curr !== null) {
          if (!this.state) {
            curr.style.transition = '0s'
            curr.style.width = curr.offsetWidth + 'px'
          } else {
            let time = 0
            if (index < this.lyricList.length - 2) {
              time = this.lyricList[index + 1].time - this.currentDura
            } else {
              time = this.totalDura - this.currentDura
            }
            curr.style.transition = 'width ' + time + 's linear'
            curr.style.width = '100%'
          }
        }
      })
    },
    async jump() {
      this.isJump = true
      const curr = this.currentDura
      if (this.jump >= 0) {
        if (this.jump < curr) {
          for (let i = this.lyricIndex; i > -1; i--) {
            if (this.lyricList[i].time < this.jump) {
              this.lyricIndex = i - 1
              break
            }
          }
        } else if (this.jump < this.lyricList[this.lyricList.length - 1].time) {
          for (let i = this.lyricIndex; i < this.lyricList.length; i++) {
            if (this.lyricList[i].time > this.jump) {
              this.lyricIndex = i - 2
              break
            }
          }
        } else {
          this.lyricIndex = this.lyricList.length - 2
        }
        let width = 0
        if (this.lyricIndex < this.lyricList.length - 2) {
          width = (this.lyricList[this.lyricIndex + 2].time - this.jump) / (this.lyricList[this.lyricIndex + 2].time - this.lyricList[this.lyricIndex + 1].time)
        } else {
          width = (this.totalDura - this.jump) / (this.totalDura - this.lyricList[this.lyricIndex + 1].time)
        }
        const next = document.getElementById('lyricCurr' + (this.lyricIndex + 1))
        next.style.visibility = 'visible'
        next.style.width = (1 - width) * 100 + '%'
        await this.scroll()
        this.isJump = false
      }
    }
  },
  created() {
    // const rc = '[00:04.050]\n[00:12.570]难以忘记初次见你\n[00:16.860]一双迷人的眼睛\n[00:21.460]在我脑海里\n[00:23.960]你的身影 挥散不去\n[00:30.160]握你的双手感觉你的温柔\n[00:34.940]真的有点透不过气\n[00:39.680]你的天真 我想珍惜\n[00:43.880]看到你受委屈 我会伤心\n[00:48.180]喔\n[00:50.340]只怕我自己会爱上你\n[00:55.070]不敢让自己靠的太近\n[00:59.550]怕我没什么能够给你\n[01:04.030]爱你也需要很大的勇气\n[01:08.190]只怕我自己会爱上你\n[01:12.910]也许有天会情不自禁\n[01:17.380]想念只让自己苦了自己\n[01:21.840]爱上你是我情非得已\n[01:28.810]难以忘记初次见你\n[01:33.170]一双迷人的眼睛\n[01:37.700]在我脑海里 你的身影 挥散不去\n[01:46.360]握你的双手感觉你的温柔\n[01:51.120]真的有点透不过气\n[01:55.910]你的天真 我想珍惜\n[02:00.150]看到你受委屈 我会伤心\n[02:04.490]喔\n[02:06.540]只怕我自己会爱上你\n[02:11.240]不敢让自己靠的太近\n[02:15.750]怕我没什么能够给你\n[02:20.200]爱你也需要很大的勇气\n[02:24.570]只怕我自己会爱上你\n[02:29.230]也许有天会情不自禁\n[02:33.680]想念只让自己苦了自己\n[02:38.140]爱上你是我情非得已\n[03:04.060]什么原因 耶\n[03:07.730]我竟然又会遇见你\n[03:13.020]我真的真的不愿意\n[03:16.630]就这样陷入爱的陷阱\n[03:20.700]喔\n[03:22.910]只怕我自己会爱上你\n[03:27.570]不敢让自己靠的太近\n[03:32.040]怕我没什么能够给你\n[03:36.560]爱你也需要很大的勇气\n[03:40.740]只怕我自己会爱上你\n[03:45.460]也许有天会情不自禁\n[03:49.990]想念只让自己苦了自己\n[03:54.510]爱上你是我情非得已\n[03:58.970]爱上你是我情非得已\n[04:03.000]\n'
    // this.analyzeLyric(rc)
    this.lyricIndex = 0
    if (this.lyric !== '') {
      this.analyzeLyric(this.lyric)
    }
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
    formatLyricTime(time) {
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
    timeFormat(time) {
      const timeM = time / 60
      const timeS = time % 60
      let timeMinute: string = ''
      let timeSeconds: string = ''
      if (timeM < 10) {
        timeMinute = `0${timeM}`
      } else {
        timeMinute = `${timeM}`
      }
      if (timeS < 10) {
        timeSeconds = `0${timeS}`
      } else {
        timeSeconds = `${timeS}`
      }
      timeMinute = timeMinute.substr(0, 2)
      timeSeconds = timeSeconds.substr(0, 2)
      return `${timeMinute}:${timeSeconds}`
    },
    scroll() {
      if (this.lyricIndex < this.lyricList.length - 1) {
        this.lyricIndex++
        this.Color(this.lyricIndex)
        if (!this.showDivider) {
          const frist = document.getElementById('ly0').offsetTop
          const curr = document.getElementById('ly' + (this.lyricIndex)).offsetTop
          const lyricScroll = document.getElementById('lyricScroll')
          lyricScroll.scrollTo({ left: 0, top: curr - frist, behavior: 'smooth' })
        }
      }
    },
    Color(index) {
      if (this.prevRow !== -1) {
        const prev = document.getElementById('lyricCurr' + this.prevRow)
        prev.style.transition = '0s'
        prev.style.visibility = 'hidden'
        prev.style.width = '0'
      }
      this.prevRow = index
      let time = 0
      if (this.isJump) {
        if (index < this.lyricList.length - 1) {
          time = this.lyricList[index + 1].time - this.jump
        } else {
          time = this.totalDura - this.jump
        }
      } else {
        if (index < this.lyricList.length - 1) {
          time = this.lyricList[index + 1].time - this.lyricList[index].time
        } else {
          time = this.totalDura - this.lyricList[index].time
        }
      }
      this.$nextTick(() => {
        const curr = document.getElementById('lyricCurr' + index)
        curr.style.visibility = 'visible'
        if (this.state) {
          curr.style.transition = 'width ' + time + 's linear'
          curr.style.width = '100%'
        }
      })
    },
    jumpByLyric() {
      const lyricScroll = document.getElementById('lyricScroll')
      const currTop = lyricScroll.scrollTop
      // const totalTop = lyricScroll.scrollHeight
      for (let i = 0; i < this.lyricList.length; i++) {
        const currRow = document.getElementById('ly' + i).offsetTop - document.getElementById('ly0').offsetTop
        if (currTop < currRow) {
          const param = { prop: 'jump', value: this.lyricList[i].time }
          this.$store.commit('setAudio', param)
          this.showDivider = false
          break
        }
      }
    },

    wheelScroll(e) {
      // const firefox = navigator.userAgent.indexOf('Firefox') != -1
      // e = e || window.event
      // if (e.stopPropagation) e.stopPropagation()
      // else e.cancelBubble = true
      // if (e.preventDefault) e.preventDefault()
      // else e.returnValue = false
      // const isUp = (firefox && e.detail < 0) || (!firefox && e.wheelDelta > 0)
      // let distance = document.getElementById('ly1').offsetTop - document.getElementById('ly0').offsetTop
      // distance = isUp ? -distance : distance
      // const lyricScroll = document.getElementById('lyricScroll')
      // lyricScroll.scrollTo({ left: 0, top: lyricScroll.scrollTop + distance, behavior: 'smooth' })
      this.showDivider = true
      this.hiddenDivider(this)
    },
    hiddenDivider: debounce((vm) => {
      vm.showDivider = false
      const frist = document.getElementById('ly0').offsetTop
      const curr = document.getElementById('ly' + (vm.lyricIndex)).offsetTop
      const lyricScroll = document.getElementById('lyricScroll')
      lyricScroll.scrollTo({ left: 0, top: curr - frist, behavior: 'smooth' })
    }, 2000),

    manualScroll(e) {
      const lyricScroll = document.getElementById('lyricScroll')
      // const top = lyricScroll.scrollTop
      const this_ = this
      document.onmousemove = function(el) {
        this_.manual(this_, el, e, lyricScroll)
      }
      document.onmouseup = function() {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    manual: throttle((vm, el, e, lyricScroll) => {
      const top = lyricScroll.scrollTop
      lyricScroll.scrollTo({ left: 0, top: top - (el.y - e.y), behavior: 'smooth' })
    }, 150)
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
    filter: blur(200px);
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
  width: 25%;
  margin-right: 5%;
}
.right{
  width: 40%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}
.lyricBlock{
  max-width: 85%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 35vh 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.divider{
  width: 100%;
  color: #FFFFFF;
  position: absolute;
  top: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  /*transform: translateY(-50%);*/
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
  padding: 12px 10px;
  user-select: none;
  display: inline-block;
  color: #FFFFFF;
  /*text-overflow: clip;*/
  /*white-space:nowrap;*/
}

.lyricCurr{
  color: var(--primary-color);
  padding: 12px 10px;
  user-select: none;
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
}
</style>
