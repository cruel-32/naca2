<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <ProgressComp :propData="date == null"></ProgressComp>
        <v-card class="pt-3 pa-3">
          <h1 class="headline">
            <v-icon color="#009688">date_range</v-icon>
            월별 모임 통계
          </h1>
          <p class="pt-2 caption">
            *보고싶은 월을 선택하세요
          </p>
          <v-date-picker
            v-model="date"
            type="month"
            color="green lighten-1"
            header-color="primary"
            @change="changePickMonth"
            locale="ko"
          ></v-date-picker>
          <!-- v-model="dates" -->
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { MeetingService } from '../service/MeetingService';
import ProgressComp from '../components/ProgressComp.vue';

@Component({
  components : {
    ProgressComp
  }
})
export default class MeetingsStats extends Vue {
  @Prop() currentUser: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){}

  date:any = this.$moment(new Date).format('YYYY-MM-DD');

  created(){
    // console.log('currentUser : ', this.currentUser);
    // console.log('query : ', this.query);
    // console.log('params : ', this.params);
  }

  changePickMonth(month){
    this.$router.push(`/statistics/meetingsStatsDetail/${month}`);
  }
}
</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
.v-btn--right {
    right: 26px;
}
</style>