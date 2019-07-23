<template>
  <v-app
    app
  >
    <router-view />

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
import { mapState, mapActions } from 'vuex'

import { UserTypes, accountStore } from "@/stores/modules/account"
import { EventTypes, eventStore } from "@/stores/modules/event"
import { SnackbarTypes, dialogStore } from "@/stores/modules/dialog"
import { MemberTypes, memberStore } from "@/stores/modules/member"

@Component({
  name: 'App',
  components: {
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
  open(){
  }
  closeSnackbar(){
    console.log('closeSnackbar');
  }
  openSnackbar(){
    console.log('openSnackbar');
    const info:SnackbarTypes = {
      time:2000,
      isShowSnackbar:true,
      snackColor:"success",
      snackbarText:"tettete",
    }
    dialogStore.callSnackbar(info);
  }
}
</script>
