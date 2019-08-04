// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './vuex/store'
import Http from './util/request'
import Vant from 'vant'
import 'vant/lib/index.css'
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)

Vue.prototype.Http = Http

Vue.use(Vuex)
Vue.use(Vant)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
