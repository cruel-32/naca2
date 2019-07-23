<template>
  <v-app
    app
  >
    <Home></Home>

    <v-snackbar
      v-model="snackBar.isShowSnackbar"
      :color="snackBar.snackColor"
      :multi-line="true"
      :timeout="snackBar.time"
    >
      {{ snackBar.snackbarText }}
      <v-btn
        dark
        flat
        @click="closeSnackbar"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-btn
      flat
      @click="openSnackbar"
    >
      Close
    </v-btn>

  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { UserTypes, accountStore } from "@/stores/modules/account"
import { EventTypes, eventStore } from "@/stores/modules/event"
import { SnackbarTypes, dialogStore } from "@/stores/modules/dialog"
import { MemberTypes, memberStore } from "@/stores/modules/member"

import Home from "@/views/Home.vue"


@Component({
  name: 'App',
  components: {
    Home
  },
})
export default class extends Vue {
  get currentUser(){
    return accountStore.currentUser
  }
  get events(){
    return eventStore.events
  }
  get snackBar(){
    return dialogStore.snackBar
  }
  get members(){
    return memberStore.members
  }
  created(){
    console.log('this.currentUser : ', this.currentUser);
    console.log('this.events : ', this.events);
    console.log('this.snackBar : ', this.snackBar);
    console.log('this.members : ', this.members);
  }
  closeSnackbar(){
    console.log('closeSnackbar');
    this.snackBar.snackbarText = "닫기 테스트중입니다"; //프로퍼티 값변경 가능
    this.snackBar.isShowSnackbar = false; //프로퍼티 값변경 가능
    dialogStore.callSnackbar(this.snackBar);
  }
  openSnackbar(){
    this.snackBar.snackbarText = "열기 테스트중입니다"; //프로퍼티 값변경 가능
    this.snackBar.isShowSnackbar = true; //프로퍼티 값변경 가능
    dialogStore.callSnackbar(this.snackBar);
  }
}
</script>
