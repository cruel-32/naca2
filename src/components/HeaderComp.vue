<template>
  <v-toolbar app :clipped-left="true" dark>
    <v-toolbar-side-icon @click.stop="toggleSideCompDrawer()">
    </v-toolbar-side-icon>

    <router-link :to="{name : 'home'}">
      <v-icon v-html="'home'"></v-icon>
    </router-link>

    <v-toolbar-title v-text="title"></v-toolbar-title>

    <v-spacer></v-spacer>

    <div class="user login" v-if="currentUser">
      <v-avatar
        :tile="false"
        :size="24"
        color="grey lighten-4"
      >
        <v-btn icon :to="{name : 'account'}">
          <img :src="currentUser && currentUser.providerData[0].photoURL" :alt="currentUser && currentUser.email">
        </v-btn>
      </v-avatar>
      <v-btn class="logout hidden-xs-only" @click="logout">로그아웃</v-btn>
    </div>

    <div class="user" v-if="!currentUser">
      <v-btn icon>
        <v-icon @click="login()">account_circle</v-icon>
      </v-btn>
    </div>

  </v-toolbar>
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
  get drawer(){ return menuStore.drawer }

  //local data
  title:string = 'NACA System 2.0';

  toggleSideCompDrawer(){
    menuStore.setDrawerAction(!this.drawer);
  }

  async login(){
    const user = await accountStore.login();
    if(user){
      dialogStore.showSnackbar({snackColor:'success', snackbarText:`어서오세요 ${user.displayName}님`});
    }
  }
  
  async logout(){
    const result = await accountStore.logout();
    if(result){
      dialogStore.showSnackbar({snackColor:'success', snackbarText:`로그아웃되었습니다`});

    }
  }
}
</script>

<style scoped lang="scss">
</style>