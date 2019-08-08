<template>
  <div class="header">

    <v-avatar
      class="user"
      :tile="false"
      :size="20"
      color="grey lighten-4"
    >
      <v-btn icon v-if="currentUser" @click="viewLogoutConfirm = true">
        <img :src="currentUser && currentUser.providerData[0].photoURL" :alt="currentUser && currentUser.email">
      </v-btn>
      <v-btn icon v-if="!currentUser">
        <v-icon @click="login()">account_circle</v-icon>
      </v-btn>
    </v-avatar>


    <v-dialog
      v-model="viewLogoutConfirm"
    >
      <v-card>
        <v-card-title class="headline">로그아웃 하시겠습니까?</v-card-title>
        <v-card-text>
          로그아웃합니다
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            right
            @click="viewLogoutConfirm = false"
            outline
            depressed
          >
            취소
          </v-btn>
          <v-btn
            right
            color="red darken-1"
            @click="logout()"
            outline
            depressed
          >
            로그아웃
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { accountStore } from "@/stores/modules/account"
import { dialogStore } from "@/stores/modules/dialog"
import { menuStore } from "@/stores/modules/menu"

@Component
export default class HeaderComp extends Vue {
  //stores
  get snackBar(){ return dialogStore.snackBar}
  get currentUser(){ return accountStore.currentUser }

  //local data
  viewLogoutConfirm:boolean = false;

  async login(){
    const user = await accountStore.login();
    if(user){
      dialogStore.showSnackbar({snackColor:'success', snackText:`어서오세요 ${user.displayName}님`});
    }
  }
  
  async logout(){
    const result = await accountStore.logout();
    if(result){
      this.viewLogoutConfirm = false;
      dialogStore.showSnackbar({snackColor:'success', snackText:`로그아웃되었습니다`});
    }
  }
}
</script>

<style scoped lang="scss">
.header{
  .v-avatar {
    position:fixed;
    top:18px;
    right:18px;
    z-index:30;
  }
}
</style>