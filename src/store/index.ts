import { createStore } from 'vuex'

const store = createStore({
  state: {
    blockNum: 5,
    playerState: false,
  },
  mutations: {
    setBlockNum(state, num) {
      state.blockNum = num
    },
  },
  getters: {
    getBlockNum(state) {
      return state.blockNum
    },
  },
  actions: {},
  modules: {},
})

export default store
