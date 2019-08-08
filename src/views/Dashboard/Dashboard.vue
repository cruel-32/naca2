<template>
  <div class="layout-flex">
    <div v-for="(item,index) in dashboardMenu" :key="index" @click="$router.push(item.link)">
      <h2 class="headline"><v-icon>{{item.icon}}</v-icon>{{item.title}}</h2>
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
      icon: 'people',
      title: '회원 개인 통계',
      subtitle: "회원 개인 통계를 봅니다.",
      link: '/dashboard/members'
    },
    {
      icon: 'insert_chart',
      title: '회원 전체 통계',
      subtitle: "회원 전체 통계를 봅니다.",
      link: '/dashboard/memberAll'
    },
    {
      icon: 'date_range',
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
  flex-direction: column;
  justify-content:center;
  align-items:center;
  > div {
    cursor: pointer;
    flex: 0 1 auto;
    padding:20px;
    text-align:right;
  }
}
</style>