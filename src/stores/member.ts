export default {
  namespaced: true,
  state: {
    members : []
  },
  mutations: {
    addMember(state:any, payload:any){
      console.log('test addMember state : ', state);
      console.log('test addMember payload : ', payload);
    }
  },
  actions: {
    testMember(context:any){//{ state, commit, rootState }
      console.log('test testMember context : ', context);
      console.log('test testMember context : ', context);
    }
  },
  getters: {
    
  }
}