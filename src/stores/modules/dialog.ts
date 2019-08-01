import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

@Module
class DialogStore extends VuexModule {
  snackBar:SnackbarTypes = {
    time:2000,
    isShowSnackbar:false,
    snackColor:"success",
    snackText:"",
  }

  @Mutation
  setSnackbar(snackBar:SnackbarTypes){
    this.snackBar = snackBar;
  }

  @Action
  showSnackbar(payload:SnackbarTypes){
    const snackBar:SnackbarTypes = Object.assign(this.snackBar, {isShowSnackbar:true}, payload);
    this.setSnackbar(snackBar);
  }

  @Action
  hideSnackbar(){
    const snackBar:SnackbarTypes = Object.assign(this.snackBar, {
      isShowSnackbar:false,
    });
    this.setSnackbar(snackBar);
  }
}

export const dialogStore = new DialogStore({store, name: "dialogStore" })
