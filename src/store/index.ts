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
    detailList: [],
    currIndex: 0,
    records: [],
    loading: false,
    showPlayView: false,
    showLoginDialog: false,
    loginState: false // false：未登录  true：已登录
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
    pushMusicList(state, item) { // 加入播放列表
      // @ts-ignore
      state.musicList.push(item)
    },
    insertMusicList(state, item) { // 插队（下一首播放）
      // @ts-ignore
      state.musicList.splice(state.currIndex + 1, 0, item)
    },
    removeMusicList(state, index) { // 移出播放列表
      state.musicList.splice(index, 1)
    },
    setDetailList(state, list) {
      state.detailList = list
    },
    pushDetailList(state, item) { // 加入播放列表
      // @ts-ignore
      state.detailList.push(item)
    },
    insertDetailList(state, item) { // 插队（下一首播放）
      // @ts-ignore
      state.detailList.splice(state.currIndex + 1, 0, item)
    },
    removeDetailList(state, index) { // 移出播放列表
      state.detailList.splice(index, 1)
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
    },
    setShowLoginDialog(state, value) {
      state.showLoginDialog = value
    },
    setLoginState(state, value) {
      state.loginState = value
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
    },
    getShowLoginDialog(state) {
      return state.showLoginDialog
    },
    getLoginState(state) {
      return state.loginState
    }
  },
  actions: {},
  modules: {}
})

export default store
