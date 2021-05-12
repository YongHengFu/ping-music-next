<template>
  <div class="container">
    <div v-show="showDivider" class="divider">
      <span>00:00&nbsp;&nbsp;&nbsp;· · · · ·</span>
      <div style="display: flex;align-items: center">
        <span>· · · · ·&nbsp;&nbsp;&nbsp;</span>
        <svg-icon name="play" style="font-size: 26px;color: var(--primary-color);cursor: pointer" @click="jumpByLyric" />
      </div>
    </div>
    <div ref="lyricBlock" class="lyricBlock" @wheel="wheelScroll">
      <span v-if="lyricList.length===0" style="font-size: 20px;color: #FFFFFF;text-align: center">相信美好生活<br>FuYH</span>
      <span
        v-for="(item,index) of lyricList"
        :ref="el => { if (el) lys[index] = el }"
        :key="item.time"
        class="lyric"
      >
        {{ item.lyric }}
      </span>
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
    // let lyricStr = '[00:04.050]\n[00:12.570]难以忘记初次见你\n[00:16.860]一双迷人的眼睛\n[00:21.460]在我脑海里\n[00:23.960]你的身影 挥散不去\n[00:30.160]握你的双手感觉你的温柔\n[00:34.940]真的有点透不过气\n[00:39.680]你的天真 我想珍惜\n[00:43.880]看到你受委屈 我会伤心\n[00:48.180]喔\n[00:50.340]只怕我自己会爱上你\n[00:55.070]不敢让自己靠的太近\n[00:59.550]怕我没什么能够给你\n[01:04.030]爱你也需要很大的勇气\n[01:08.190]只怕我自己会爱上你\n[01:12.910]也许有天会情不自禁\n[01:17.380]想念只让自己苦了自己\n[01:21.840]爱上你是我情非得已\n[01:28.810]难以忘记初次见你\n[01:33.170]一双迷人的眼睛\n[01:37.700]在我脑海里 你的身影 挥散不去\n[01:46.360]握你的双手感觉你的温柔\n[01:51.120]真的有点透不过气\n[01:55.910]你的天真 我想珍惜\n[02:00.150]看到你受委屈 我会伤心\n[02:04.490]喔\n[02:06.540]只怕我自己会爱上你\n[02:11.240]不敢让自己靠的太近\n[02:15.750]怕我没什么能够给你\n[02:20.200]爱你也需要很大的勇气\n[02:24.570]只怕我自己会爱上你\n[02:29.230]也许有天会情不自禁\n[02:33.680]想念只让自己苦了自己\n[02:38.140]爱上你是我情非得已\n[03:04.060]什么原因 耶\n[03:07.730]我竟然又会遇见你\n[03:13.020]我真的真的不愿意\n[03:16.630]就这样陷入爱的陷阱\n[03:20.700]喔\n[03:22.910]只怕我自己会爱上你\n[03:27.570]不敢让自己靠的太近\n[03:32.040]怕我没什么能够给你\n[03:36.560]爱你也需要很大的勇气\n[03:40.740]只怕我自己会爱上你\n[03:45.460]也许有天会情不自禁\n[03:49.990]想念只让自己苦了自己\n[03:54.510]爱上你是我情非得已\n[03:58.970]爱上你是我情非得已\n[04:03.000]\n'
    let lyricStr = '[00:00.000] 作词 : 周耀辉\n[00:01.000] 作曲 : 刘志远\n[00:30.0]似乎谈过恋爱  似乎还在等待\n[00:37.0]有一个男生总是说他睡不著\n[00:40.0]我劝他去看医生买些安眠药\n[00:45.0]还有一个说他寂寞希望生活热闹\n[00:49.0]他应该去找一支小花猫来拥抱\n[00:52.0]OH...  约会三次  已觉得  太糟糕\n[00:56.0]对著开水与白面包\n[01:01.0]有一个男生说欣赏我的活泼\n[01:05.0]可是我流泪他就会手足无措\n[01:09.0]还有一个说他想一生一世照顾我\n[01:13.0]我怀疑他知不知道自己说什么\n[01:17.0]OH...  约会三次  已觉得  太糟糕\n[01:21.0]对著开水与白面包\n[01:25.0]我胃口不好还是他们没味道\n[01:28.0]我讨厌开水也忍受不了白面包\n[01:35.0]（music）\n[01:50.0]有一个男生说跟我一起不错\n[01:54.0]却不断数落以前女朋友的错\n[01:58.0]还有一些模模糊糊都说爱上了我\n[02:02.0]他们说的太多  却没有说过什么\n[02:06.0]OH...  约会三次  已觉得  太糟糕\n[02:10.0]对著开水与白面包\n[02:14.0]我胃口不好还是他们没味道\n[02:17.0]我讨厌开水也忍受不了白面包\n[02:23.0]（music）\n[02:40.0]似乎谈过恋爱  似乎还在等待\n[02:48.0]有一个男生说跟我一起不错\n[02:52.0]却不断数落以前女朋友的错\n[02:56.0]还有一些模模糊糊都说爱上了我\n[03:00.0]他们说的太多  却没有说过什么\n[03:04.0]OH...  约会三次  已觉得  太糟糕\n[03:08.0]对著开水与白面包\n[03:12.0]我胃口不好还是他们没味道\n[03:15.0]我讨厌开水也忍受不了白面包\n'
    const lyricList = ref(<any>[])
    const index = ref(-1)
    const showDivider = ref(false)
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
        lys.value[prevIndex].style.transition = '0s'
        lys.value[prevIndex].style['background-size'] = '0%'
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
      const currIndex = lys.value[index.value]
      if (currIndex) {
        if (!state.value) {
          currIndex.style.transition = '0s'
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
          currIndex.style.transition = time + 's ease-out'
          currIndex.style['background-size'] = '100%'
        }
      }
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
      isJump = true
      if (jump.value >= 0) {
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
          currIndex.style.transition = '0s'
          currIndex.style['background-size'] = (1 - progress) * 100 + '%'
          lyricScroll(index.value)
        }
      }
      isJump = false
    })

    const getLyricStr = (id:string) => {
      getLyricById({ id: id }).then((res:any) => {
        if (res.code === 200) {
          lyricStr = res?.lrc?.lyric ?? ''
          if (lyricStr !== '') {
            analyzeLyric(lyricStr)
          }
        }
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
      const ricList = lyricStr.split(/\n/)
      const regTime = /\[\d{2}:\d{2}.\d{1,3}\]/
      for (const item of ricList) {
        const timeStr = item.match(regTime)
        if (timeStr !== null && timeStr.length === 1) {
          const time = formatLyricTime(timeStr[0].substring(1, timeStr[0].length - 1))
          const lyric = item.replace(timeStr[0], '')
          if (lyric.trim() !== '') {
            const lyricItem = { time: time, lyric: lyric }
            lyricList.value.push(lyricItem)
          }
        }
      }
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
        lys.value[prevIndex].style['background-size'] = '0%'
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
          lys.value[index].style.transition = time + 's ease-out'
          lys.value[index].style['background-size'] = '100%'
        }
      })
    }

    const jumpByLyric = () => {
      const currTop = lyricBlock.value.scrollTop
      for (let i = 0; i < lyricList.value.length; i++) {
        const currRow = lys.value[i].offsetTop - lys.value[0].offsetTop
        if (currTop < currRow) {
          const param = { prop: 'jump', value: lyricList.value[i].time }
          store.commit('setAudio', param)
          showDivider.value = false
          break
        }
      }
    }

    const wheelScroll = () => {
      showDivider.value = true
      hiddenDivider()
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
      const first = lys.value[0].offsetTop
      const curr = lys.value[index.value].offsetTop
      lyricBlock.value.scrollTo({ left: 0, top: curr - first, behavior: 'smooth' })
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

    onMounted(() => {

    })
    return {
      lys,
      lyricBlock,
      lyricList,
      index,
      showDivider,
      jumpByLyric,
      wheelScroll
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

.container{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}
.lyricBlock{
  /*max-width: 85%;*/
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
  /*z-index: -1;*/
  /*transform: translateY(-50%);*/
}
.lyric{
  font-size: 17px;
  line-height: 40px;
  /*padding: 12px 0px;*/
  user-select: none;
  display: inline-block;
  background: #FFFFFF -webkit-linear-gradient(left, var(--primary-color), var(--primary-color)) no-repeat 0 0;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 0%;
}
</style>
