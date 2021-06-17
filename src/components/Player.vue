<template>
  <audio
    ref="audio"
    :src="source"
    autoplay
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
    let rand = [0]
    let prevIndex = 0

    // 待播列表 [id]
    const musicList = computed(() => store.state.musicList)
    const currMusic = computed(() => store.state.currMusic)
    // 当前播放歌曲在列表中的位置

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

    watch(currMusic, () => {
      source.value = `https://music.163.com/song/media/outer/url?id=${currMusic.value?.id}.mp3`
    })

    watch(state, () => {
      if (audio !== null) {
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
        if (audio.value.paused) {
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
      // setRecords(musicList.value[currIndex.value])
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
      if (prevIndex !== 0) {
        const ind = musicList.value.indexOf(records.value[prevIndex - 1])
        if (ind !== -1) {
          index = ind
        } else if (index !== 0) {
          index--
        } else {
          index = musicList.value.length - 1
        }
      }
      store.commit('setCurrMusic', musicList.value[index])
    }

    const next = () => {
      let index = currMusic.value?.index
      if (mode.value === 2) {
        index = Math.floor(Math.random() * musicList.value.length)
        while (rand.includes(index)) {
          index = Math.floor(Math.random() * musicList.value.length)
        }
        rand.push(index)
        if (rand.length === musicList.value.length) {
          rand = []
        }
      } else {
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
        prevIndex = list.length - 1
      } else {
        list.splice(index, 1)
        prevIndex = index
        list.push(id)
      }
      store.commit('setRecords', list)
    }

    const initMediaSession = () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: 'PingMusic',
          artist: 'FuYH',
          album: 'ForeverLove',
          artwork: [{ src: 'cover.jpg' }]
        })
        navigator.mediaSession.setActionHandler('play', () => {
          play()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
          pause()
        })
        navigator.mediaSession.setActionHandler('seekbackward', () => {
        })
        navigator.mediaSession.setActionHandler('seekforward', () => {
        })
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          prev()
        })
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          next()
        })
      }
    }

    const updateMediaSession = () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: currMusic.value.name,
          artist: currMusic.value.artist.name,
          album: currMusic.value.album.name,
          artwork: [{ src: currMusic.value.album.picUrl }]
        })
      }
    }

    onMounted(() => {
      initMediaSession()
    })

    return {
      audio,
      source,
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
