import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import API_UTILS from '@/utils/API_UTILS'
import accountApi from '@/api/account'

@Module
class AccountStore extends VuexModule {
  currentUser:UserTypes|null = null;

  @Mutation
  setCurrentUser(user:UserTypes|null){
    this.currentUser=user;
  }

  @Action
  async login(){
    const {user} = await accountApi.signInGoogle();
    return user;
  }

  @Action
  async logout(){
    let error = await accountApi.signOut();
    if(!error){
      return 'success';
    }
  }

  @Action
  async onAuthStateChanged(){
    API_UTILS.auth.onAuthStateChanged((user:any)=>{
      if(user){
        this.setCurrentUser(user);
      } else {
        this.setCurrentUser(null);
      }
    })
  }
}

export const accountStore = new AccountStore({store, name: "accountStore" })
