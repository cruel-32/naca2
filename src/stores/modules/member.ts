import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import memberApi from '@/api/member'

@Module
class MemberStore extends VuexModule {
  members:MemberTypes[] = [];

  @Mutation
  private setMembers(members:MemberTypes[]){
    this.members = members;
  }

  @Action
  public async getMembers(){
    const members = await memberApi.getMembers();
    this.setMembers(members);
  }

}

export const memberStore = new MemberStore({store, name: "memberStore" })
