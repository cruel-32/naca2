import { Module, VuexModule, Mutation, Action, getModule} from 'vuex-module-decorators'
import store from '@/stores'

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

@Module({ dynamic: true, store, name: 'MemberStore' })
export default class MemberStore extends VuexModule {
  members:Member[] = [];

  @Mutation
  private addMember(payload:any){
    console.log('MemberStore addMember payload : ', payload);
  }

  @Action
  public async testMember(payload:any){//{ state, commit, rootState }
    console.log('MemberStore testMember context : ', payload);
  }
}

export const memberStore = getModule(MemberStore)
