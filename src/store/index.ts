import { createStore } from "vuex";

 const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    add(state) {
      state.count++;
    },
  },
  actions: {},
  modules: {},
});

export default store