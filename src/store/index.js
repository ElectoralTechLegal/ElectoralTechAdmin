import Vue from 'vue'
import Vuex from 'vuex'
import authModule from './authModule/index'
import settingsModule from './settingsModule/index'
import generalsModule from './generalsModule/index'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    authModule,
    settingsModule,
    generalsModule
  },
  strict: debug
})
