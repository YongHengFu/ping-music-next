<template>
  <audio
    ref="audio"
    :src="source"
    :autoplay="auto"
    @durationchange="durationchange"
    @canplay="canplay"
    @play="play"
    @pause="pause"
    @ended="ended"
    @error="error"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Player',
  setup() {
    const store = useStore()
    const audio:any = ref(null)
    const source = ref('')
    const auto = ref(false)
    let rand = [0]
    let isFirst = true // 当前歌曲是否恢复的数据

    const musicList = computed(() => store.state.musicList)
    const currMusic = computed(() => store.state.currMusic)
    const waitNum = computed(() => store.state.waitNum)

    // 播放记录
    const records = computed(() => store.state.records)

    /* ------Audio------*/

    // 播放状态：暂停or播放
    const state = computed(() => store.state.audio.state)

    // 音量
    const volume = computed(() => store.state.audio.volume)

    // 播放模式：顺序、循环、随机、单曲
    const mode = computed(() => store.state.audio.mode)

    // 是否静音
    const mute = computed(() => store.state.audio.mute)

    // 是否跳到某一时刻播放
    const jump = computed(() => store.state.audio.jump)

    // 是否切换至上一曲
    const isPrev = computed(() => store.state.audio.prev)

    // 是否切换至下一曲
    const isNext = computed(() => store.state.audio.next)

    watch(currMusic, (newVal, oldVal) => {
      if (waitNum.value > 0 && newVal.index !== oldVal + 1) {
        store.commit('setWaitNum', 0)
      }
      source.value = `https://music.163.com/song/media/outer/url?id=${currMusic.value?.id}.mp3`
      if (isFirst) {
        isFirst = false
      } else {
        auto.value = true
      }
      setMediaMetadata()
    })

    watch(state, () => {
      if (audio.value) {
        if (state.value) {
          audio.value.play()
        } else {
          audio.value.pause()
        }
      }
    })

    watch(jump, () => {
      if (jump.value >= 0) {
        audio.value.currentTime = jump.value
        if (audio.value.readyState && audio.value.paused) {
          audio.value.play()
        }
        const param = { prop: 'jump', value: -1 }
        store.commit('setAudio', param)
      }
    })

    watch(isPrev, () => {
      if (isPrev.value) {
        prev()
        const param = { prop: 'prev', value: false }
        store.commit('setAudio', param)
      }
    })

    watch(isNext, () => {
      if (isNext.value) {
        next()
        const param = { prop: 'next', value: false }
        store.commit('setAudio', param)
      }
    })

    watch(volume, () => {
      audio.value.volume = volume.value
    })

    watch(mute, () => {
      audio.value.muted = mute.value
    })

    const durationchange = () => {
      const param = { prop: 'duration', value: audio.value.duration }
      store.commit('setAudio', param)
    }

    const progress = () => {
      const param = { prop: 'buffered', value: audio.value.buffered.end(audio.value.buffered.length - 1) }
      store.commit('setAudio', param)
    }

    const canplay = () => {
      audio.value.volume = store.state.audio.volume
      audio.value.ontimeupdate = function() {
        const param = { prop: 'currentTime', value: audio.value.currentTime }
        store.commit('setAudio', param)
      }
    }

    const play = () => {
      if (!state.value) {
        const param = { prop: 'state', value: true }
        store.commit('setAudio', param)
      }
      setRecords(currMusic.value.id)
    }

    const pause = () => {
      if (state.value) {
        const param = { prop: 'state', value: false }
        store.commit('setAudio', param)
      }
    }

    const ended = () => {
      let index = currMusic.value?.index
      if (mode.value <= 1) {
        if (index !== musicList.value.length - 1) {
          index++
        } else if (mode.value === 0) {
          index = 0
        }
      } else if (mode.value === 2) {
        index = Math.floor(Math.random() * musicList.value.length)
        while (rand.includes(index)) {
          index = Math.floor(Math.random() * musicList.value.length)
        }
        rand.push(index)
        if (rand.length === musicList.value.length) {
          rand = []
        }
      } else {
        if (audio !== null) {
          audio.value.play()
        }
      }
      store.commit('setCurrMusic', musicList.value[index])
    }

    const error = () => {
      next()
    }

    const prev = () => {
      let index = currMusic.value?.index
      if (index > 0) {
        index--
      }
      store.commit('setCurrMusic', musicList.value[index])
    }

    const next = () => {
      let index = currMusic.value?.index
      if (mode.value === 2 && waitNum.value === 0) {
        index = Math.floor(Math.random() * musicList.value.length)
        while (rand.includes(index)) {
          index = Math.floor(Math.random() * musicList.value.length)
        }
        rand.push(index)
        if (rand.length === musicList.value.length) {
          rand = []
        }
      } else {
        if (waitNum.value > 1) {
          store.commit('setWaitNum', waitNum.value - 1)
        }
        if (index !== musicList.value.length - 1) {
          index++
        } else {
          index = 0
        }
      }
      store.commit('setCurrMusic', musicList.value[index])
    }

    const setRecords = (id:string) => {
      const list = records.value
      const index = list.indexOf(id)
      if (index === -1) {
        list.push(id)
      } else {
        list.splice(index, 1)
        list.push(id)
      }
      store.commit('setRecords', list)
    }

    const initMediaSession = () => {
      const mediaNavigator:any = navigator
      if ('mediaSession' in navigator) {
        mediaNavigator.mediaSession.setActionHandler('play', () => {
          play()
        })
        mediaNavigator.mediaSession.setActionHandler('pause', () => {
          pause()
        })
        mediaNavigator.mediaSession.setActionHandler('previoustrack', () => {
          prev()
        })
        mediaNavigator.mediaSession.setActionHandler('nexttrack', () => {
          next()
        })
        // navigator.mediaSession.setActionHandler('seekbackward', () => {
        // })
        // navigator.mediaSession.setActionHandler('seekforward', () => {
        // })
      }
    }

    const setMediaMetadata = () => {
      if ('mediaSession' in navigator) {
        if (currMusic.value?.artist) {
          const artists = []
          for (const item of currMusic.value.artist) {
            artists.push(item.name)
          }
          const mediaNavigator:any = navigator
          mediaNavigator.mediaSession.metadata = new window.MediaMetadata({
            title: currMusic.value.name,
            artist: artists.join('/'),
            album: currMusic.value.album.name,
            artwork: [{ src: currMusic.value.album.picUrl }]
          })
        }
      }
    }

    const monitorKeyboard = () => {
      // 全局监听键盘事件
      window.onkeypress = (e: { code: string }) => {
        if (e && e.code === 'Space') {
          const param = { prop: 'state', value: !store.state.audio.state }
          store.commit('setAudio', param)
        }
      }

      window.onkeydown = (e: { ctrlKey: any; key: any }) => {
        const param = { prop: 'volume', value: store.state.audio.volume }
        const volume = Number(param.value.toFixed(1))
        if (e && e.ctrlKey) {
          switch (e.key) {
            case 'ArrowLeft':
              prev()
              break
            case 'ArrowRight':
              next()
              break
            case 'ArrowUp':
              if (volume < 1) {
                param.value = volume + 0.1
                store.commit('setAudio', param)
                param.prop = 'mute'
                param.value = false
                store.commit('setAudio', param)
              }
              break
            case 'ArrowDown':
              if (volume > 0) {
                param.value = volume - 0.1
                store.commit('setAudio', param)
              }
              break
          }
        }
      }
    }

    // 关闭页面或刷新前保存数据
    const saveState = () => {
      localStorage.setItem('musicList', JSON.stringify(store.state.musicList))
      const currMusic = store.state.currMusic
      if (currMusic) {
        localStorage.setItem('currMusic', JSON.stringify(currMusic))
      }
      localStorage.setItem('audio', JSON.stringify(store.state.audio))
    }

    // 恢复上次保存的数据
    const initState = () => {
      const musicListStr = localStorage.getItem('musicList')
      const currMusicStr = localStorage.getItem('currMusic')
      const audioStr = localStorage.getItem('audio')

      if (musicListStr) {
        store.commit('setMusicList', JSON.parse(musicListStr))
      }

      if (currMusicStr) {
        store.commit('setCurrMusic', JSON.parse(currMusicStr))
      }

      if (audioStr) {
        const audio = JSON.parse(audioStr)
        const param = { prop: 'key', value: 'value' }

        param.prop = 'duration'
        param.value = audio.duration
        store.commit('setAudio', param)

        if (audio.volume < 1 && audio.volume > 0) {
          param.prop = 'volume'
          param.value = audio.volume
          store.commit('setAudio', param)
        }

        param.prop = 'mode'
        param.value = audio.mode
        store.commit('setAudio', param)
      }
    }

    onMounted(() => {
      initMediaSession()
      monitorKeyboard()
      setTimeout(initState, 0)
      window.onbeforeunload = () => {
        saveState()
      }
    })

    return {
      audio,
      source,
      auto,
      durationchange,
      progress,
      canplay,
      play,
      pause,
      ended,
      error
    }
  }
})
</script>
