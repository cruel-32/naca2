import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

@Module
class MenuStore extends VuexModule {
  progress:boolean = false;

  @Mutation
  setProgress(progress:boolean){
    this.progress = progress;
  }

  @Action
  setProgressAction(payload:boolean){
    this.setProgress(payload);
  }

}

export const menuStore = new MenuStore({store, name: "menuStore" })
