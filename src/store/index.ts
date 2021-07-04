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
      jump: -1,
      prev: false,
      next: false,
      lyric: '' // 歌词
    },
    musicList: [],
    currMusic: {
      index: -1
    },
    likeList: [],
    collectArtistList: [],
    records: [],
    loading: false,
    showPlayView: false,
    showDialog: -1, // 0：登录弹窗 1：用户信息弹窗
    loginState: false, // false：未登录  true：已登录
    refreshLogin: false
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
    setCurrMusic(state, music) {
      state.currMusic = music
    },
    setLikeList(state, list) {
      state.likeList = list
    },
    setCollectArtistList(state, list) {
      state.collectArtistList = list
    },
    setRecords(state, list) {
      state.records = list
    },
    setLoading(state, value) {
      state.loading = value
    },
    setShowPlayView(state, value) {
      state.showPlayView = value
    },
    setShowDialog(state, value) {
      state.showDialog = value
    },
    setLoginState(state, value) {
      state.loginState = value
    },
    setRefreshLogin(state, value) {
      state.refreshLogin = value
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
    getCurrMusic(state) {
      return state.currMusic
    },
    getLikeList(state) {
      return state.likeList
    },
    getCollectArtistList(state) {
      return state.collectArtistList
    },
    getRecords(state) {
      return state.records
    },
    getLoading(state) {
      return state.loading
    },
    getShowPlayView(state) {
      return state.showPlayView
    },
    getShowDialog(state) {
      return state.showDialog
    },
    getLoginState(state) {
      return state.loginState
    },
    getRefreshLogin(state) {
      return state.refreshLogin
    }
  },
  actions: {},
  modules: {}
})

export default store
