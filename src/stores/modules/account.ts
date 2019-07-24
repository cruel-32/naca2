import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import defaults from '@/api/defaults'
import accountApi from '@/api/account'

export interface UserTypes {
  displayName:string;
  email:string;
  emailVerified?:boolean;
  providerData?:any[];
}

@Module
class AccountStore extends VuexModule {
  currentUser:UserTypes|null = null;

  @Mutation
  setCurrentUser(user:UserTypes|null){
    console.log('setCurrentUser user : ', user);
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
    defaults.auth.onAuthStateChanged((user:any)=>{
      if(user){
        this.setCurrentUser(user);
      } else {
        this.setCurrentUser(null);
      }
    })
  }
}

export const accountStore = new AccountStore({store, name: "accountStore" })
