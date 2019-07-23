import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

export interface SnackbarTypes {
  time:number;
  isShowSnackbar:boolean;
  snackColor:string;
  snackbarText:string;
}

@Module
class DialogStore extends VuexModule {
  snackBar:SnackbarTypes = {
    time:2000,
    isShowSnackbar:true,
    snackColor:"success",
    snackbarText:"",
  }

  @Mutation
  setSnackbar(snackBar:SnackbarTypes){
    console.log('setSnackbar : ', snackBar);
    this.snackBar = snackBar;
  }

  @Action
  async callSnackbar(snackBar:SnackbarTypes){
    this.setSnackbar(snackBar);
  }
}

export const dialogStore = new DialogStore({store, name: "DialogStore" })
