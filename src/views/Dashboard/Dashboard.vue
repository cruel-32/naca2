<template>
  <div class="layout-flex">
    <div v-for="(item,index) in dashboardMenu" :key="index" @click="$router.push(item.link)">
      <h2 class="headline"><v-icon color="green">insert_chart</v-icon>{{item.title}}</h2>
      <p>{{item.subtitle}}</p>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';

@Component
export default class Dashboard extends Vue {
  //stores
  // { header: '통계목록',icon:'insert_chart'},
   dashboardMenu:any = [
    {
      title: '회원 개인 통계',
      subtitle: "회원 개인 통계를 봅니다.",
      link: '/dashboard/members'
    },
    {
      title: '회원 전체 통계',
      subtitle: "회원 전체 통계를 봅니다.",
      link: '/dashboard/memberAll'
    },
    {
      title: '이벤트 통계',
      subtitle: "이벤트 통계를 봅니다.",
      link: '/dashboard/eventAll'
    },
  ]
}
</script>

<style lang="scss">
.layout-flex {
  display: flex;
  height:100%;
  align-items: center;
  flex-direction: column;
  padding-top:56px;
  > div {
    flex:1 1 100%;
    text-align: center;
  }
}
</style>