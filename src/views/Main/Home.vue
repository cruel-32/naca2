<template>
  <div class="home_container">
    <div v-for="(item,index) in sideMenuItems" :key="index" @click="$router.push({name:item.link,})">
      <h2 class="headline"><v-icon >{{item.icon}}</v-icon>{{item.title}}</h2>
      <p>{{item.subtitle}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  sideMenuItems:SideMenuTypes[] = [
    {
      icon: 'date_range', iconClass: 'amber lighten-1 white--text', color:"amber",
      title: '이벤트관리', subtitle: '이벤트 생성,삭제 출석관리', link: "events",
    },
    {
      icon: 'people', iconClass: 'amber lighten-1 white--text', color:"brown",
      title: '회원관리', subtitle: '회원 신규,수정,삭제 관리', link: "members",
    },
    {
      icon: 'insert_chart', iconClass: 'amber lighten-1 white--text', color:"blue-grey",
      title: '통계보기', subtitle: '여러가지 통계 보기', link: "dashboard",
    }
  ];
  
}
</script>

<style scoped lang="scss">
.home_container {
  display:flex;
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