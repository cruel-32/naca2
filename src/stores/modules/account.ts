import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/stores'

interface User {
  name:string;
  email:string;
  photoURL:string;
}

@Module({ dynamic: true, store, name: 'AccountStore' })
export default class AccountStore extends VuexModule {
  currentUser:User|null = null;
  @Mutation
  setCurrentUser(payload:User){
    console.log('payload : ', payload);
  }
  @Action
  async login(context:any){//{ state, commit, rootState }
    console.log('actions login : ');
  }

}

export const accountStore = getModule(AccountStore)
