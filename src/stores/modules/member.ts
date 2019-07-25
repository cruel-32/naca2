import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

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
