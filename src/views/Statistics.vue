<!-- <h1>통계페이지</h1>
<p>목표 개발 시작시간 : 데이터베이스가 어느 정도 쌓이는 시점에 스타트</p>

<h2>Todo List</h2>
<ol>
  <li>월별,연별 모임 횟수 통계</li>
  <li>모임 카테고리 횟수 통계</li>
  <li>모임 카테고리별 참여 인원 통계</li>
  <li>모임 지역별 통계</li>
  <li>모임 지역별 참여 인원 통계</li>
  <li>나이대별 분포도 및 평균연령 통계
  <li>개인별 참여시 가장 많이 같이 오는 사람 및 본 적이 없는 사람 집계</li>
</ol>
등등... 구상기획중... -->
<template>
  <v-list two-line>
    <template v-for="(item, index) in items">
      <v-subheader class="headline" style="color:rgba(0,0,0,.87);"
        v-if="item.header"
        :key="item.header"
      >
        <v-icon color="green">{{item.icon}}</v-icon> <span class="pl-1">{{ item.header }}</span>
      </v-subheader>

      <v-divider
        v-else-if="item.divider"
        :key="index"
      ></v-divider>

      <v-list-tile
        v-else
        :key="item.title"
        @click="viewStatistic(item.link)"
      >
        <v-list-tile-content>
          <v-list-tile-title v-html="item.title"></v-list-tile-title>
          <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>


<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class Statistics extends Vue {
  @Prop() currentUser: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){}


  items:any = [
    { header: '통계목록',icon:'insert_chart'},
    {
      title: '회원별 참여도 통계',
      subtitle: "회원별 참여날짜 및 기타 통계를 봅니다.",
      link: '/statistics/membersParti'
    },
    { divider: true},
    {
      title: '회원 나이대 통계',
      subtitle: "평균연령 및 나이대별 회원 분포도 등의 통계를 봅니다.",
      link: '/statistics/membersAge'
    },
    { divider: true},
    {
      title: '월별 모임 관련 통계',
      subtitle: "월별 모임 관련 통계를 봅니다.",
      link: '/statistics/meetingsStats'
    },
    { divider: true},
    {
      title: '연별 모임 관련 통계',
      subtitle: "연별 모임 관련 통계를 봅니다.",
      link: '/statistics/meetingsStatsYear'
    },
  ]
  created(){
    // console.log('currentUser : ', this.currentUser);
    // console.log('query : ', this.query);
    // console.log('params : ', this.params);
  }
  viewStatistic(link:string){
    // console.log('link : ', link)
    // this.showSnackbar('info', `${link} : 내년 구현예정입니다.`);
    this.$router.push(link);
  }
}
</script>

<style lang="scss">
</style>