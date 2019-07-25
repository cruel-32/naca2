import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

@Module
class DialogStore extends VuexModule {
  snackBar:SnackbarTypes = {
    time:2000,
    isShowSnackbar:false,
    snackColor:"success",
    snackbarText:"",
  }

  @Mutation
  setSnackbar(snackBar:SnackbarTypes){
    this.snackBar = snackBar;
  }

  @Action
  async callSnackbar(snackBar:SnackbarTypes){
    this.setSnackbar(snackBar);
  }
}

export const dialogStore = new DialogStore({store, name: "DialogStore" })
