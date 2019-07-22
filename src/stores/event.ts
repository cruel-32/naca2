export default {
  namespaced: true,
  state: {
    events : []
  },
  mutations: {
    addEvent(state:any, payload:any){
      console.log('test addEvent state : ', state);
      console.log('test addEvent payload : ', payload);
    }
  },
  actions: {
    testEvent(context:any){//{ state, commit, rootState }
      console.log('test testEvent context : ', context);
      console.log('test testEvent context : ', context);
    }
  },
  getters: {
    
  }
}