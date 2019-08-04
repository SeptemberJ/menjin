import Vue from 'vue'
import Vuex from 'vuex'

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
  mutations
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
