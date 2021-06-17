<template />

<script lang="ts">
import { Howl, Howler } from 'howler'
import { defineComponent, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Player',
  setup() {
    const store = useStore()
    let audio:any = {}
    let source = ''
    let rand = [0]
    let prevIndex = 0
    let interval = null

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
      source = `https://music.163.com/song/media/outer/url?id=${currMusic.value?.id}.mp3`
      initAudio(source)
    })

    watch(state, () => {
      if (audio !== null) {
        if (state.value) {
          audio.play()
        } else {
          audio.pause()
        }
      }
    })

    watch(jump, () => {
      if (jump.value >= 0) {
        audio.seek(jump.value)
        if (!audio.playing()) {
          audio.play()
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
      Howler.volume(volume.value)
    })

    watch(mute, () => {
      audio.mute(mute.value)
    })

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
          audio.play()
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

    const initAudio = (src) => {
      audio = new Howl({
        src: src,
        html5: true,
        autoplay: true,
        onload: () => {
          interval = setInterval(() => {
            const param = { prop: 'currentTime', value: audio.seek() }
            store.commit('setAudio', param)
          }, 1000)
        }
      })
    }

    onMounted(() => {
      Howler.usingWebAudio = true
      Howler.volume = store.state.audio.volume
      initMediaSession()
    })

    return {
      audio,
      source,
      play,
      pause,
      ended,
      error
    }
  }
})
</script>
