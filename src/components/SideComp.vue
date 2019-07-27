<template>
  <v-navigation-drawer
    persistent
    temporary
    :mini-variant="miniVariant"
    :clipped="true"
    v-model="drawer"
    enable-resize-watcher
    fixed
    app
    dark
  > 
    <v-btn icon @click="toggleDrawer()">
      <v-icon x-large>clear</v-icon>
    </v-btn>
    <v-card-title dark class="pt-3 pb-3 d-flex">
      <div v-if="currentUser" style="text-align:center;">
        <img class="draw-user" :src="currentUser.providerData[0].photoURL" alt="avatar">
        <span class="d-block title" style="color:#fff;">{{currentUser.displayName}}</span>
        <span class="d-block caption" style="color:#fff;">{{currentUser.email}}</span>
        <v-btn @click="login()" color="info">NACA에서 로그아웃</v-btn>
      </div>
      <div v-if="!currentUser" class="pt-4 pb-3" style="text-align:center;">
        <div>
          <v-icon x-large>account_circle</v-icon>
        </div>
        <v-btn @click="logout()" color="info">구글 아이디로 로그인</v-btn>
      </div>
    </v-card-title>

    <v-layout row>
      <v-flex>
        <v-card>
          <v-list two-line subheader>
            <v-list-tile
              v-for="item in sideMenuItems"
              :key="item.title"
              avatar
              @click="goPage(item.link)"
            >
              <v-list-tile-avatar>
                <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
              
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon >
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { accountStore } from "@/stores/modules/account"
import { dialogStore } from "@/stores/modules/dialog"
import { menuStore } from "@/stores/modules/menu"

@Component({})
export default class SideComp extends Vue {
  get snackBar(){
    return dialogStore.snackBar
  }
  get currentUser(){
    return accountStore.currentUser
  }
  get drawer(){
    return menuStore.drawer
  }
  set drawer(value:boolean){
    menuStore.setDrawerAction(value);
  }
  get miniVariant(){
    return menuStore.miniVariant
  }
  get sideMenuItems(){
    return menuStore.sideMenuItems
  }
  toggleDrawer(){
    menuStore.setDrawerAction(!this.drawer);
  }
  goPage(name:string){
    this.$router.push({
      name,
    });
  }
  async login(){
    const user = await accountStore.login();
    if(user){
      this.snackBar.snackColor = "success";
      this.snackBar.snackbarText = `어서오세요 ${user.displayName}님`;
      this.snackBar.isShowSnackbar = true;
      dialogStore.callSnackbar(this.snackBar);
    }
  }
  async logout(){
    const result = await accountStore.logout();
    if(result){
      this.snackBar.snackColor = "success";
      this.snackBar.snackbarText = "로그아웃되었습니다";
      this.snackBar.isShowSnackbar = true;
      dialogStore.callSnackbar(this.snackBar);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.draw-user {
  display:block;
  width:80px;
  margin:10px auto;
}
</style>