<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-left>

        <v-list-tile three-line
          class="custom_tile"
          v-for="item in items"
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

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  items:any = [
    {title:"모임관리", subtitle:"모임 생성,삭제 출석관리", link:"/events", icon:"date_range", color:"amber", iconClass:"" },
    {title:"회원관리", subtitle:"회원목록과 기타 관리", link:"/members", icon:"people", color:"brown", iconClass:"" },
    {title:"통계보기", subtitle:"여러가지 통계 보기", link:"/statistics", icon:"insert_chart", color:"blue-grey", iconClass:"" },
  ];
  goPage(link:string){
    this.$router.push(link);
  }
}
</script>

<style scoped lang="scss">
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