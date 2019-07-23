<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    {{snackBar.isShowSnackbar}}
    {{snackBar.snackColor}}
    {{snackBar.time}}
    {{snackBar.snackbarText}}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { SnackbarTypes, dialogStore } from "@/stores/modules/dialog"


@Component({
  components: {
  },
})
export default class Home extends Vue {
  get snackBar(){
    return dialogStore.snackBar
  }
  created(){
    console.log('this.snackBar : ', this.snackBar);
  }
  closeSnackbar(){
    console.log('closeSnackbar');
    this.snackBar.isShowSnackbar = false; //프로퍼티 값변경 가능
    dialogStore.callSnackbar(this.snackBar);
  }
  openSnackbar(){
    this.snackBar.isShowSnackbar = true; //프로퍼티 값변경 가능
    dialogStore.callSnackbar(this.snackBar);
  }
}
</script>
