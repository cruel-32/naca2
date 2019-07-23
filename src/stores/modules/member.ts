import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

export interface MemberTypes {
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

@Module
class MemberStore extends VuexModule {
  members:MemberTypes[] = [];

  @Mutation
  private addMember(payload:any){
    console.log('MemberStore addMember payload : ', payload);
  }

  @Action
  public async testMember(payload:any){//{ state, commit, rootState }
    console.log('MemberStore testMember context : ', payload);
  }
}

export const memberStore = new MemberStore({store, name: "memberStore" })
