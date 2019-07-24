<template>
  <v-app
    app
  >
    <SideComp></SideComp>
    <HeaderComp></HeaderComp>

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
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { UserTypes, accountStore } from "@/stores/modules/account"
import { EventTypes, eventStore } from "@/stores/modules/event"
import { SnackbarTypes, dialogStore } from "@/stores/modules/dialog"
import { MemberTypes, memberStore } from "@/stores/modules/member"

import Home from "@/views/Home.vue"
import SideComp from "@/components/SideComp.vue"
import HeaderComp from "@/components/HeaderComp.vue"
import account from './api/account';


@Component({
  name: 'App',
  components: {
    Home,HeaderComp,SideComp
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
    accountStore.onAuthStateChanged(); //전체앱 통틀어 한번만 실행
  }
  closeSnackbar(){
    this.snackBar.snackbarText = "닫기 테스트중입니다"; //프로퍼티 값변경 가능
    this.snackBar.isShowSnackbar = false; //프로퍼티 값변경 가능
    dialogStore.callSnackbar(this.snackBar);
  }
}
</script>
