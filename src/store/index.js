import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import flow from './modules/flow/'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    flow
  },
  getters
})

export default store
