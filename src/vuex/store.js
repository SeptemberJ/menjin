import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  openId: null
}
// actions dispatch触发
const actions = {
  updateOpenId ({commit, state}, OpenId) {
    commit('setOpenId', OpenId)
  }
}

const mutations = {
  setOpenId (state, OpenId) {
    state.openId = OpenId
  }
}

export default new Vuex.Store({
  state,
  modules: {
  },
  // getters,
  actions,
  mutations,
  plugins: [vuexLocal.plugin]
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
