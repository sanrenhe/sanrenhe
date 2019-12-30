import Vue from "vue";
import Vuex from 'vuex'
import getters from './getters'
import appData from './appData'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    appData:appData as any
  },
  getters
})

export default store
