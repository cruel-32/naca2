<template>
  <v-app
    app
  >
    <SideComp></SideComp>
    <HeaderComp></HeaderComp>

    <v-content class="pb-5">
      <ProgressComp></ProgressComp>
      <router-view v-scroll="onScroll">
      </router-view>
    </v-content>

    <FooterComp></FooterComp>
    
    <v-snackbar
      v-model="snackBar.isShowSnackbar"
      :color="snackBar.snackColor"
      :multi-line="true"
      :timeout="snackBar.time"
    >
      {{ snackBar.snackText }}
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

import { accountStore } from "@/stores/modules/account"
// import { EventTypes, eventStore } from "@/stores/modules/event"
import { dialogStore } from "@/stores/modules/dialog"
// import { MemberTypes, memberStore } from "@/stores/modules/member"

import SideComp from "@/components/SideComp.vue"
import HeaderComp from "@/components/HeaderComp.vue"
import FooterComp from "@/components/FooterComp.vue"
import ProgressComp from "@/components/ProgressComp.vue"


@Component({
  name: 'App',
  components: {
    HeaderComp,SideComp,FooterComp,ProgressComp
  },
  computed: {
    snackBar(){
      return dialogStore.snackBar
    }
  }
})
export default class extends Vue {
  moundted(){
    this.$validator.localize('en', {
      custom : {
        title: {
          required : (field:any) => `${field} 이벤트 제목을 적으세요`,
          max: (field:any,count:number) => `${field}필드는 ${count} 자를 초과할 수 없습니다`
        },
        place: {
          required : (field:any) => `${field} 이벤트 장소를 선택하세요`,
        },
        contents: {
          required : (field:any) => `${field} 이벤트 컨텐츠를 선택하세요`,
          min : (field:any, count:number) => `이벤트 ${field}를 ${count}개 이상 선택하세요`
        },
        date : {
          required : (field:any) => `${field} 날짜를 선택하세요`
        },
        name: {
          required : (field:any) => `${field} 회원 이름을 적으세요`,
          max: (field:any,count:number) => `${field}필드는 ${count} 자를 초과할 수 없습니다`
        },
        address: {
          required : (field:any) => `${field} 사는 곳을 적으세요`,
          max: (field:any,count:number) => `${field}필드는 ${count} 자를 초과할 수 없습니다`
        }
      }
    });
  }
  
  created(){
    accountStore.onAuthStateChanged(); //전체앱 통틀어 한번만 실행
    console.log('App launched');
  }
  
  onScroll(){
  }

  closeSnackbar(){
    dialogStore.hideSnackbar();
  }
}
</script>
<style lang="scss">
  .v-content__wrap * {
    transition: none !important;
  }
</style>

