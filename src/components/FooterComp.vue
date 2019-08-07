<template>
  <v-card height="56px" flat>
    <v-speed-dial
      bottom
      left
      fixed
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <v-btn
        slot="activator"
        color="amber darken-2"
        dark
        fab
        @click="$router.go(-1)"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-speed-dial>

    <v-speed-dial
      v-model="fab"
      bottom
      right
      fixed
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <v-btn
        v-model="fab"
        slot="activator"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>account_circle</v-icon>
        <v-icon>close</v-icon>
      </v-btn>

      <v-btn
        fab
        dark
        color="green"
        @click="showSnackbar({snackColor: 'info', snackText: '퀵메뉴 : 신규멤버를 생성합니다'})"
        :to="{name : 'memberCreate'}"
      >
        <v-icon>person_add</v-icon>
      </v-btn>

      <v-btn
        fab
        dark
        color="indigo"
        @click="showSnackbar({snackColor:'info',snackText:'퀵메뉴 : 오늘 날짜로 이벤트를 생성합니다'})"
        :to="{path : `/events/detail`}"
      >
        <v-icon>add_alarm</v-icon>
      </v-btn>
    </v-speed-dial>


    <v-bottom-nav
      :value="true"
      fixed
      shift
      dark
      :color="pageColor"
    >
      <v-btn flat :to="{name : 'home'}">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn flat :to="{name : 'events'}">
        <span>Events</span>
        <v-icon>date_range</v-icon>
      </v-btn>

      <v-btn flat :to="{name : 'members'}">
        <span>Members</span>
        <v-icon>people</v-icon>
      </v-btn>

      <v-btn flat :to="{name : 'dashboard'}">
        <span>Dashboard</span>
        <v-icon>insert_chart</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { dialogStore } from "@/stores/modules/dialog";

@Component
export default class FooterComp extends Vue {
  get snackBar(){return dialogStore.snackBar}

  pageNum:number = 4;
  fab:boolean = false;
  joinDate:any = this.$moment(new Date()).format('YYYY-MM-DD');

  get pageColor() {
    let color = '';
    if(this.$route.path.indexOf('/member') == 0 ){
      color = 'blue-grey';
    } else if(this.$route.path.indexOf('/member') == 0 ){
      color = 'teal';
    } else if(this.$route.path.indexOf('/dashboard') == 0 ){
      color = 'brown';
    } else {
      color = '#666666'
    }
    return color;
  }

  showSnackbar(snackBar:SnackbarTypes){
    dialogStore.showSnackbar(snackBar);
  }
}
</script>

<style lang="scss">
.v-speed-dial--fixed, .v-speed-dial--absolute {
  z-index:20;
}
.v-speed-dial--bottom:not(.v-speed-dial--absolute) {
  bottom: 50px;
}
</style>