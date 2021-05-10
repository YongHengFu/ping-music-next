<template>
  <audio
    ref="audio"
    :src="source"
    autoplay
    @durationchange="durationchange"
    @progress="progress"
    @canplay="canplay"
    @play="play"
    @pause="pause"
    @ended="ended"
    @error="error"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { getMusicDetail, getLyricById } from '@/api/music'
export default defineComponent({
  name: 'Player2',
  setup() {
    const store = useStore()
    const audio = ref(null)
    let rand = [0]
    let prevIndex = 0

    // 待播列表 [id]
    const musiclist = computed(() => store.state.musicList)

    // 当前播放歌曲在列表中的位置
    const currIndex = computed(() => store.state.currIndex)

    // 播放记录
    const records = computed(() => store.state.records)

    // 待播列表 [详情]
    // const detailList = computed(() => store.state.detailList)

    /* ------Audio------*/

    // 当前播放歌曲的url
    const source = computed(() => `https://music.163.com/song/media/outer/url?id=${musiclist[currIndex]}.mp3`)

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
    const isPrev = computed(() => store.state.audio.isPrev)

    // 是否切换至下一曲
    const isNext = computed(() => store.state.audio.isNext)

    watch(currIndex, () => {
      getLyric(currIndex)
    })

    watch(state, () => {
      if (state) {
        audio.play()
      } else {
        audio.pause()
      }
    })

    watch(jump, () => {
      if (jump >= 0) {
        audio.currentTime = jump
        if (audio.paused) {
          audio.play()
        }
      }
    })

    watch(isPrev, () => {
      if (isPrev) {
        prev()
        const param = { prop: 'prev', value: false }
        store.commit('setAudio', param)
      }
    })

    watch(isNext, () => {
      if (isNext) {
        next()
        const param = { prop: 'next', value: false }
        store.commit('setAudio', param)
      }
    })

    watch(volume, () => {
      audio.volume = volume
    })

    watch(mute, () => {
      audio.mute = mute
    })

    watch(musiclist, () => {
      store.commit('setCurrIndex', 0)
      getMusicDetails()
    })

    watch(musiclist.length, () => {
      store.commit('setCurrIndex', 0)
      getMusicDetails()
    })

    const durationchange = () => {
      const param = { prop: 'duration', value: audio.duration }
      store.commit('setAudio', param)
    }

    const progress = () => {
      const param = { prop: 'buffered', value: audio.buffered.end(audio.buffered.length - 1) }
      store.commit('setAudio', param)
    }

    const canplay = () => {
      audio.volume = store.state.audio.volume
      audio.ontimeupdate = function() {
        const param = { prop: 'currentTime', value: audio.currentTime }
        store.commit('setAudio', param)
      }
    }

    const play = () => {
      if (!state) {
        const param = { prop: 'state', value: true }
        store.commit('setAudio', param)
      }
      setRecords(musiclist[currIndex])
    }

    const pause = () => {
      if (state) {
        const param = { prop: 'state', value: false }
        store.commit('setAudio', param)
      }
    }

    const ended = () => {
      let index = currIndex
      if (mode <= 1) {
        if (index !== musiclist.length - 1) {
          index++
        } else if (mode === 0) {
          index = 0
        }
      } else if (mode === 2) {
        index = Math.floor(Math.random() * musiclist.length)
        while (rand.includes(index)) {
          index = Math.floor(Math.random() * musiclist.length)
        }
        rand.push(index)
        if (rand.length === musiclist.length) {
          rand = []
        }
      } else {
        if (audio !== null) {
          audio.play()
        }
      }
      store.commit('setCurrIndex', index)
    }

    const error = () => {
      next()
    }

    const prev = () => {
      let index = currIndex
      if (prevIndex !== 0) {
        const ind = musiclist.indexOf(records[prevIndex - 1])
        if (ind !== -1) {
          index = ind
        } else if (index !== 0) {
          index--
        } else {
          index = musiclist.length - 1
        }
      }
      store.commit('setCurrIndex', index)
    }

    const next = () => {
      let index = currIndex
      if (mode === 2) {
        index = Math.floor(Math.random() * musiclist.length)
        while (rand.includes(index)) {
          index = Math.floor(Math.random() * musiclist.length)
        }
        rand.push(index)
        if (rand.length === musiclist.length) {
          rand = []
        }
      } else {
        if (index !== musiclist.length - 1) {
          index++
        } else {
          index = 0
        }
      }
      store.commit('setCurrIndex', index)
    }

    const getMusicDetails = () => {
      if (musiclist.length > 0) {
        const param = { ids: '' }
        for (let i = 0; i < musiclist.length; i++) {
          param.ids += musiclist[i]
          if (i < musiclist.length - 1) {
            param.ids += ','
          }
        }
        getMusicDetail(param).then((res) => {
          if (res.code === 200) {
            const songs = res.songs
            const details = []
            for (const item of songs) {
              details.push({
                id: item.id,
                name: item.name,
                artist: item.ar,
                album: item.al,
                mvId: item.mv,
                duration: item.dt / 1000,
                publishTime: item.publishTime
              })
            }
            store.commit('setDetailList', details)
          }
        })
      }
    }

    const setRecords = (id) => {
      const list = records
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

    const getLyric = (index) => {
      getLyricById({ id: musiclist[index] }).then((res) => {
        if (res.code === 200) {
          const param = { prop: 'lyric', value: res.lrc.lyric }
          store.commit('setAudio', param)
        }
      })
    }

    return {
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
