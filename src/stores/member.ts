interface MemberState {
  members:Member[];
}

interface Member {
  uid:string;
  address:string;
  birth:number;
  gender:string;
  grade:number
  joinDate:number
  mail:string;
  outDay:number
  eventsKeys:string[];
  phone:number;
}

export const namespaced = true;
export const state:MemberState = {
  members : []
}

export const mutations = {
  addMember(state:any, payload:any){
    console.log('test addMember state : ', state);
    console.log('test addMember payload : ', payload);
  }
}

export const actions = {
  testMember(context:any){//{ state, commit, rootState }
    console.log('test testMember context : ', context);
    console.log('test testMember context : ', context);
  }
}
