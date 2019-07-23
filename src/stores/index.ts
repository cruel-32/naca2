import Vue from 'vue'
import Vuex from 'vuex'
// import AccountStore from './modules/account'
// import EventStore from './modules/event'
// import MemberStore from './modules/member'
// import DialogStore from './modules/dialog'

// import {dialogStore} from './modules/dialog'

Vue.use(Vuex);

// export interface RootState {
//   account:AccountStore;
//   event:EventStore;
//   member:MemberStore;
//   dialog:DialogStore;
// }

export default new Vuex.Store({
  modules : {
    // AccountStore,
    // EventStore,
    // MemberStore,
    // DialogStore,
  }
})
