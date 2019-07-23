import Vue from 'vue'
import Vuex from 'vuex'
import AccountStore from './modules/account'
import EventStore from './modules/event'
import MemberStore from './modules/member'

Vue.use(Vuex);

export interface RootState {
  account:AccountStore;
  event:EventStore;
  member:MemberStore;
}

export default new Vuex.Store<RootState>({})
