import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

@Module
class DialogStore extends VuexModule {
  snackBar:ISnackbarTypes = {
    time:2000,
    isShowSnackbar:false,
    snackColor:"success",
    snackText:"",
  }

  @Mutation
  setSnackbar(snackBar:ISnackbarTypes){
    this.snackBar = snackBar;
  }

  @Action
  showSnackbar(payload:ISnackbarTypes){
    const snackBar:ISnackbarTypes = Object.assign(this.snackBar, {isShowSnackbar:true}, payload);
    this.setSnackbar(snackBar);
  }

  @Action
  hideSnackbar(){
    const snackBar:ISnackbarTypes = Object.assign(this.snackBar, {
      isShowSnackbar:false,
    });
    this.setSnackbar(snackBar);
  }
}

export const dialogStore = new DialogStore({store, name: "dialogStore" })
