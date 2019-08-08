<template>
  <div class="home_container">
    <v-list-tile three-line
      class="custom_tile"
      v-for="item in sideMenuItems"
      :key="item.title"
      avatar
      @click="goPage(item.link)"
    >
      <v-list-tile-avatar>
        <v-icon :color="item.color" :class="[item.iconClass]" >{{ item.icon }}</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
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
  
  goPage(name:string){
    this.$router.push({
      name,
    });
  }
}
</script>

<style scoped lang="scss">
.home_container {
  display:flex;
  height:100%;
  flex-direction: column;
  > div {
    flex: 1 1 auto;
  }
}

.custom_tile {
  margin: 30px 0 15px 5%;
  .v-icon {
    font-size:40px;
  }
  .v-list__tile__title {
    font-size:24px;
  }
  .v-list__tile__sub-title {
    font-size:18px;
  }

}
</style>