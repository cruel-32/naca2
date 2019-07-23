import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

export interface UserTypes {
  name:string;
  email:string;
  photoURL:string;
}

@Module
class AccountStore extends VuexModule {
  currentUser:UserTypes|null = null;
  @Mutation
  setCurrentUser(payload:UserTypes){
    console.log('payload : ', payload);
  }
  @Action
  async login(context:any){//{ state, commit, rootState }
    console.log('actions login : ');
  }

}

export const accountStore = new AccountStore({store, name: "accountStore" })
