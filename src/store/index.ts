import { createStore } from 'vuex'

const store = createStore({
  state: {
    blockNum: 5,
    playerState: false,
    source: '',
    audio: {
      state: false,
      src: '',
      buffered: 0,
      duration: 1,
      currentTime: 0,
      volume: 0.6,
      mute: false,
    },
    musicList: [],
  },
  mutations: {
    setBlockNum(state, num) {
      state.blockNum = num
    },
    setSource(state, src) {
      state.source = src
    },
    setAudio(state, param) {
      // @ts-ignore
      state.audio[param.prop] = param.value
    },
    setMusicList(state, list) {
      state.musicList = list
    },
  },
  getters: {
    getBlockNum(state) {
      return state.blockNum
    },
    getSource(state) {
      return state.source
    },
    getAudio(state) {
      return state.audio
    },
    getMusicList(state) {
      return state.musicList
    },
  },
  actions: {},
  modules: {},
})

export default store
