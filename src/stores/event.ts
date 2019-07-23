interface EventState {
  events:Event[];
}

interface Event {
  uid:string;
  date:number;
  title:string;
  placeKeys:string;
  contentKeys:string[];
  memberKeys:string[];
}


export const namespaced = true;
export const state:EventState = {
  events : []
}

export const mutations = {
  addEvent(state:any, payload:any){
    console.log('test addEvent state : ', state);
    console.log('test addEvent payload : ', payload);
  }
}

export const actions = {
  testEvent(context:any){//{ state, commit, rootState }
    console.log('test testEvent context : ', context);
    console.log('test testEvent context : ', context);
  }
}
