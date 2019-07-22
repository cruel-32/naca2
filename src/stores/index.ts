import Vue from 'vue'
import Vuex from 'vuex'
import eventStore from './event'
import memberStore from './member'

Vue.use(Vuex);

export default new Vuex.Store({
  modules : {
    eventStore,
    memberStore
  }
})
