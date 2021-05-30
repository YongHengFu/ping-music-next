<template>
  <div class="container">
    <div v-show="showDivider" class="divider">
      <div class="divider-left">
        <span>{{ timeFormat(dividerTime) }}</span>
        <div v-for="n of 5" :key="n" class="mini-point" :style="'opacity:'+(10-n)/10" />
      </div>
      <div class="divider-right">
        <div v-for="n of 5" :key="n" class="mini-point" :style="'opacity:'+(n+4)/10" />
        <svg-icon name="play" style="font-size: 26px;color: var(--primary-color);cursor: pointer" @click="jumpByLyric" />
      </div>
    </div>
    <div
      ref="lyricBlock"
      class="lyricBlock"
      @mousedown="drag"
      @mouseenter="createMonitor"
      @mouseleave="cancelMonitor"
    >
      <div style="min-height: 35vh;width: 100%" />
      <span v-if="lyricList.length===0" style="font-size: 20px;color: #FFFFFF;text-align: center">FOREVER LOVE<br>FuYH</span>
      <div
        v-for="(item,index) of lyricList"
        :key="item.time"
        style="text-align: center;"
      >
        <!--        <span :ref="el => { if (el) lys[index] = el }" class="lyric" v-html="item.lyric" />-->
        <span :ref="el => { if (el) lys[index] = el }" class="lyric">{{ item.lyric }}</span>
      </div>
      <div style="min-height: 35vh;width: 100%" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, nextTick, onBeforeUpdate, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getLyricById } from '@/api/music'
export default defineComponent({
  name: 'Lyric',
  props: {
    lyricStr: String
  },
  setup() {
    const store = useStore()
    const lys = ref(<any>[])
    const lyricBlock = ref(<any>null)
    // let lyricStr = '[00:04.050]\n[00:12.570]难以忘记 初次见你\n[00:16.860]一双迷人的眼睛\n[00:21.460]在我脑海里\n[00:23.960]你的身影 挥散不去\n[00:30.160]握你的双手感觉你的温柔\n[00:34.940]真的有点透不过气\n[00:39.680]你的天真 我想珍惜\n[00:43.880]看到你受委屈 我会伤心\n[00:48.180]喔\n[00:50.340]只怕我自己会爱上你\n[00:55.070]不敢让自己靠的太近\n[00:59.550]怕我没什么能够给你\n[01:04.030]爱你也需要很大的勇气\n[01:08.190]只怕我自己会爱上你\n[01:12.910]也许有天会情不自禁\n[01:17.380]想念只让自己苦了自己\n[01:21.840]爱上你是我情非得已\n[01:28.810]难以忘记初次见你\n[01:33.170]一双迷人的眼睛\n[01:37.700]在我脑海里 你的身影 挥散不去\n[01:46.360]握你的双手感觉你的温柔\n[01:51.120]真的有点透不过气\n[01:55.910]你的天真 我想珍惜\n[02:00.150]看到你受委屈 我会伤心\n[02:04.490]喔\n[02:06.540]只怕我自己会爱上你\n[02:11.240]不敢让自己靠的太近\n[02:15.750]怕我没什么能够给你\n[02:20.200]爱你也需要很大的勇气\n[02:24.570]只怕我自己会爱上你\n[02:29.230]也许有天会情不自禁\n[02:33.680]想念只让自己苦了自己\n[02:38.140]爱上你是我情非得已\n[03:04.060]什么原因 耶\n[03:07.730]我竟然又会遇见你\n[03:13.020]我真的真的不愿意\n[03:16.630]就这样陷入爱的陷阱\n[03:20.700]喔\n[03:22.910]只怕我自己会爱上你\n[03:27.570]不敢让自己靠的太近\n[03:32.040]怕我没什么能够给你\n[03:36.560]爱你也需要很大的勇气\n[03:40.740]只怕我自己会爱上你\n[03:45.460]也许有天会情不自禁\n[03:49.990]想念只让自己苦了自己\n[03:54.510]爱上你是我情非得已\n[03:58.970]爱上你是我情非得已\n[04:03.000]\n'
    let lyricStr = '[00:00.000] 作词 : 郭莉达\n[00:01.000] 作曲 : 郭莉达\n[00:16.59][01:08.50]你和我都是孤独的鬼\n[00:20.69]有一样伪善的嘴\n[00:25.00]他和她都是快乐的人\n[00:29.10]看不到生命可悲\n[00:32.90][01:24.50][01:58.89][02:16.00]如果我带你回我北方的家\n[00:37.80][02:03.90]让你看那冬天的雪花\n[00:42.90][02:08.60]你是不是也会爱上它\n[00:46.80][02:12.70]远离阳光冰冷的花\n[01:12.98]承受着满身疲惫\n[01:16.98]也许有天我们流出眼泪\n[01:20.80]那样子十分狼狈\n[01:29.01][02:20.10]带你回忆过去的年华\n[01:33.50][02:24.90]如果你愿意爱我的话\n[01:37.80][02:29.10]那我们明天就出发\n'
    const lyricList = ref(<any>[])
    const index = ref(-1)
    const showDivider = ref(false)
    const dividerTime = ref(0)
    let prevIndex = -1
    let isJump = false

    onBeforeUpdate(() => {
      lys.value = []
    })

    const musicId = computed(() => store.state.musicList[store.state.currIndex])
    const state = computed(() => store.state.audio.state)
    const currTime = computed(() => store.state.audio.currentTime)
    const totalTime = computed(() => store.state.audio.duration)
    const jump = computed(() => store.state.audio.jump)

    watch(musicId, () => {
      if (prevIndex !== -1) {
        lys.value[prevIndex].style.transition = 'background-size 0s'
        lys.value[prevIndex].style['background-size'] = '0'
      }
      lyricList.value = []
      index.value = -1
      prevIndex = -1
      getLyricStr(musicId.value)
    })

    watch(currTime, () => {
      if (index.value < lyricList.value.length - 1 && currTime.value > lyricList.value[index.value + 1].time) {
        ++index.value
        lyricScroll(index.value)
      }
    })

    watch(state, () => {
      nextTick(() => {
        const currIndex = lys.value[index.value]
        if (currIndex) {
          if (!state.value) {
            currIndex.style.transition = 'background-size 0s'
            let progress = 0
            if (index.value < lyricList.value.length - 1) {
              progress = (lyricList.value[index.value + 1].time - currTime.value) / (lyricList.value[index.value + 1].time - lyricList.value[index.value].time)
            } else {
              progress = (totalTime.value - currTime.value) / (totalTime.value - lyricList.value[index.value].time)
            }
            currIndex.style['background-size'] = (1 - progress) * 100 + '%'
          } else {
            let time = 0
            if (index.value < lyricList.value.length - 1) {
              time = lyricList.value[index.value + 1].time - currTime.value
            } else {
              time = totalTime.value - currTime.value
            }
            currIndex.style.transition = 'background-size ' + time + 's ease-out'
            currIndex.style['background-size'] = '100%'
          }
        }
      })
    })

    const getJumpIndex = () => {
      if (jump.value < currTime.value) {
        for (let i = index.value; i > -1; i--) {
          if (lyricList.value[i].time < jump.value) {
            return i
          }
        }
      } else if (jump.value < lyricList.value[lyricList.value.length - 1].time) {
        for (let i = index.value; i < lyricList.value.length; i++) {
          if (lyricList.value[i].time > jump.value) {
            return i - 1
          }
        }
      } else {
        return lyricList.value.length - 1
      }
      return 0
    }

    watch(jump, () => {
      if (jump.value >= 0 && lyricList.value.length > 0) {
        isJump = true
        const jumpIndex = getJumpIndex()
        if (jumpIndex !== -1) {
          index.value = jumpIndex
          const currIndex = lys.value[index.value]
          let progress = 0
          if (index.value < lyricList.value.length - 1) {
            progress = (lyricList.value[index.value + 1].time - jump.value) / (lyricList.value[index.value + 1].time - lyricList.value[index.value].time)
          } else {
            progress = (totalTime.value - jump.value) / (totalTime.value - lyricList.value[index.value].time)
          }
          currIndex.style.transition = 'background-size 0s'
          currIndex.style['background-size'] = (1 - progress) * 100 + '%'
          lyricScroll(index.value)
        }
        isJump = false
      }
    })

    const getLyricStr = (id:string) => {
      getLyricById({ id: id }).then((res:any) => {
        if (res.code === 200) {
          lyricStr = res?.lrc?.lyric ?? ''
          if (lyricStr !== '') {
            analyzeLyric(lyricStr)
          }
        } else {
          setTimeout(() => {
            getLyricStr(musicId.value)
          }, 200)
        }
      }).catch(() => {
        setTimeout(() => {
          getLyricStr(musicId.value)
        }, 200)
      })
    }

    const formatLyricTime = (time:string) => {
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./
      const minMatch = time.match(regMin)
      const secMatch = time.match(regSec)
      const msMatch = time.match(regMs)

      if (minMatch && secMatch && msMatch && msMatch.index) {
        const min = parseInt(minMatch[0].slice(0, 2))
        let sec = parseInt(secMatch[0].slice(1, 3))
        const ms = time.slice(msMatch.index + 1, msMatch.index + 3)
        if (min !== 0) {
          sec += min * 60
        }
        return Number(sec + '.' + ms)
      } else {
        return null
      }
    }

    const analyzeLyric = (lyricStr:string) => {
      lyricList.value = []
      const list = []
      const ricList = lyricStr.split(/\n/)
      const regTime = /\[\d{2}:\d{2}.\d{1,3}\]/g
      for (const item of ricList) {
        const timeStr = item.match(regTime)
        if (timeStr !== null && timeStr.length > 0) {
          const lyric = item.replace(timeStr.join(''), '')
          for (let i = 0; i < timeStr.length; i++) {
            const time = formatLyricTime(timeStr[i].substring(1, timeStr[i].length - 1))
            let ric = ''
            if (lyric.trim() !== '') {
              ric = lyric
            } else {
              ric = '• • •'
            }
            const lyricItem = { time: time, lyric: ric }
            list.push(lyricItem)
          }
        }
      }
      lyricSort(list)
    }

    const lyricSort = (list: any) => {
      for (let i = 0; i < list.length - 1; i++) {
        let flag = true
        for (let j = i; j < list.length - 1; j++) {
          if (list[j].time > list[j + 1].time) {
            flag = false
            const t = list[j]
            list[j] = list[j + 1]
            list[j + 1] = t
          }
        }
        if (flag) {
          break
        }
      }
      lyricList.value = list
    }

    const lyricScroll = (index: number) => {
      if (index < lyricList.value.length) {
        if (!showDivider.value) {
          const first = lys.value[0].offsetTop
          const curr = lys.value[index].offsetTop
          lyricBlock.value.scrollTo({ left: 0, top: curr - first, behavior: 'smooth' })
        }
        lyricColor(index)
      }
    }

    const lyricColor = (index:number) => {
      if (prevIndex !== -1) {
        lys.value[prevIndex].style.transition = '0s'
        lys.value[prevIndex].style['background-size'] = '0'
      }
      prevIndex = index
      let time = 0
      if (isJump) {
        if (index === 0) {
          time = lyricList.value[0].time - jump.value
        } else if (index < lyricList.value.length - 1) {
          time = lyricList.value[index + 1].time - jump.value
        } else {
          time = totalTime.value - jump.value
        }
      } else {
        if (index === 0) {
          time = lyricList.value[0].time
        } else if (index < lyricList.value.length - 1) {
          time = lyricList.value[index + 1].time - lyricList.value[index].time
        } else {
          time = totalTime.value - lyricList.value[index].time
        }
      }
      nextTick(() => {
        if (state.value) {
          lys.value[index].style.transition = 'background-size ' + time + 's ease-out'
          lys.value[index].style['background-size'] = '100%'
        }
      })
    }

    const jumpByLyric = () => {
      const param = { prop: 'jump', value: dividerTime.value }
      store.commit('setAudio', param)
    }

    const timeFormat = (time:number) => {
      const timeM = time / 60
      const timeS = time % 60
      let timeMinute = ''
      let timeSeconds = ''
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
    }

    const wheelScroll = (e: { stopPropagation: () => void; cancelBubble: boolean; preventDefault: () => void; returnValue: boolean; wheelDelta: number; detail: number }) => {
      let direction = false // false: 上  true:下
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
      if (e.preventDefault) e.preventDefault()
      else e.returnValue = false
      if (e.wheelDelta) { // 判断Chrome滑轮事件
        if (e.wheelDelta > 0) { // 当滑轮向上滚动时
          direction = false
        }
        if (e.wheelDelta < 0) { // 当滑轮向下滚动时
          direction = true
        }
      } else if (e.detail) { // Firefox滑轮事件
        if (e.detail > 0) { // 当滑轮向上滚动时
          direction = true
        }
        if (e.detail < 0) { // 当滑轮向下滚动时
          direction = false
        }
      }
      const currTop:number = lyricBlock.value?.scrollTop
      const unit:number = lys.value[1].offsetTop - lys.value[0].offsetTop
      lyricBlock.value.scrollTo({ left: 0, top: (currTop + (direction ? unit : -unit)) })
      showDivider.value = true
      for (let i = 0; i < lyricList.value.length; i++) {
        const currRow = lys.value[i]?.offsetTop - lys.value[0]?.offsetTop
        if (currTop < currRow) {
          dividerTime.value = lyricList.value[i].time
          break
        }
      }
      hiddenDivider()
    }

    const drag = (e: { y: number }) => {
      showDivider.value = true
      const top:number = lyricBlock.value?.scrollTop
      document.onmousemove = (el) => {
        hiddenDivider()
        lyricBlock.value.scrollTo({ left: 0, top: top + (e.y - el.y) })
        const currTop:number = lyricBlock.value?.scrollTop
        for (let i = 0; i < lyricList.value.length; i++) {
          const currRow = lys.value[i]?.offsetTop - lys.value[0]?.offsetTop
          if (currTop < currRow) {
            dividerTime.value = lyricList.value[i].time
            break
          }
        }
      }

      document.onmouseup = function() {
        document.onmousemove = null
        document.onmouseup = null
      }
    }

    const debounce = (fn: { (): void; apply?: any }, wait: number | undefined) => {
      // eslint-disable-next-line no-undef
      let timer: NodeJS.Timeout | null = null
      return () => {
        const context = this
        const args = arguments
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        timer = setTimeout(function() {
          fn.apply(context, args)
        }, wait)
      }
    }

    const hiddenDivider = debounce(() => {
      showDivider.value = false
      const first = lys.value[0]?.offsetTop
      const curr = lys.value[index.value]?.offsetTop
      lyricBlock.value?.scrollTo({ left: 0, top: curr - first, behavior: 'smooth' })
    }, 2000)

    /*    const throttle = (func: { apply: (arg0: any, arg1: IArguments) => void }, wait: number) => {
      var previous = 0
      return () => {
        const now = Date.now()
        const context = this
        const args = arguments
        if (now - previous > wait) {
          func.apply(context, args)
          previous = now
        }
      }
    }*/

    // 鼠标移入歌词范围时，开始对鼠标滚轮监听
    const createMonitor = () => {
      lyricBlock.value.addEventListener('mousewheel', wheelScroll)
      lyricBlock.value.addEventListener('DOMMouseScroll', wheelScroll)
    }

    // 鼠标移出歌词范围时，取消对鼠标滚轮的监听
    const cancelMonitor = () => {
      lyricBlock.value.removeEventListener('mousewheel', wheelScroll)
      lyricBlock.value.removeEventListener('DOMMouseScroll', wheelScroll)
    }

    onMounted(() => {
      // analyzeLyric(lyricStr)
    })

    return {
      lys,
      lyricBlock,
      lyricList,
      index,
      showDivider,
      dividerTime,
      timeFormat,
      jumpByLyric,
      wheelScroll,
      createMonitor,
      cancelMonitor,
      drag
    }
  }
})
</script>

<style scoped>

/*隐藏滚动条 chrome和safari浏览器*/
::-webkit-scrollbar {
  display: none;
}

.container{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
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
  z-index: 0;
  transform: translateY(-50%);
}
.divider-left{
  width: 15%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.divider-right{
  width: 15%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mini-point{
  background: #FFFFFF;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  /*margin: 0 5px;*/
}
.lyricBlock{
  width: 70%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  /*padding: 35vh 0;*/
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  scrollbar-width: none; /*隐藏滚动条 Firefox浏览器*/
  /*box-shadow: 0 0px 50px rgba(64,64,64,1) inset;*/
  z-index: 1;
}
/*.lyricBlock:after{
  content: '';
  position: absolute;
  top: 90%;
  left: 15%;
  right: 15%;
  bottom: 0;
  z-index: 1;
  background: rgba(64,64,64,0.5);
  filter: blur(30px);
  !*box-shadow:inset 0px 100px 100px -100px rgba(64,64,64,1), inset 0px -100px 100px -100px rgba(64,64,64,1);*!
  !*box-shadow: 0 0px 50px 50px rgba(64,64,64,1) inset;*!
}*/
.lyric{
  font-size: 17px;
  line-height: 35px;
  user-select: none;
  background: #FFFFFF -webkit-linear-gradient(left, #1dcf9f, #53ecc3) no-repeat 0 0;
  background-size: 0;
  -webkit-background-clip: text;
  color: transparent;
  font-family: 'CustomFont';
}
</style>
