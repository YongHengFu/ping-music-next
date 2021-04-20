import { createStore } from 'vuex'

const store = createStore({
  state: {
    blockNum: 5,
    playerState: false,
    source: '',
    audio: {
      state: false,
      buffered: 0,
      duration: 1,
      currentTime: 0,
      volume: 0.6,
      mode: 0, // 0:列表循环 1：顺序播放 2：随机播放 3：单曲循环
      mute: false, // 是否静音,
      lyric: '' // 歌词
    },
    musicList: [],
    detailList: [],
    currIndex: 0,
    records: [],
    loading: false,
    showPlayView: false
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
    setDetailList(state, list) {
      state.detailList = list
    },
    setCurrIndex(state, index) {
      state.currIndex = index
    },
    setRecords(state, list) {
      state.records = list
    },
    setLoading(state, value) {
      state.loading = value
    },
    setShowPlayView(state, value) {
      state.showPlayView = value
    }
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
    getDetailList(state) {
      return state.detailList
    },
    getCurrIndex(state) {
      return state.currIndex
    },
    getRecords(state) {
      return state.records
    },
    getLoading(state) {
      return state.loading
    },
    getShowPlayView(state) {
      return state.showPlayView
    }
  },
  actions: {},
  modules: {}
})

export default store
