import Vue from 'vue'
import Vuex from 'vuex'
import * as eventStore from './event'
import * as memberStore from './member'

Vue.use(Vuex);

export default new Vuex.Store({
  modules : {
    eventStore,
    memberStore
  }
})
