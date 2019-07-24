<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        events
        <!-- <ProgressComp :propData="meetingsMonth == null"></ProgressComp> -->
        <!-- <v-card class="pt-3 pa-3">
          <h1 class="headline">
            <v-icon color="#009688">date_range</v-icon>
            이달의 모임(벙) 목록
          </h1>
          <p class="pt-2 caption">
            *모임을 생성 혹은 수정,삭제하고나 하는 날짜를 클릭하세요<br/>
            *이미 모임이 있는 날은 초록색으로 마킹되어 있습니다<br/>
          </p>
          <v-date-picker
            full-width
            v-model="date"
            ref="picker"
            event-color="green lighten-1"
            :reactive="true"
            :picker-date.sync="pickerDate"
            :events="checkMeetingDay"
            @change="changePickDay"
            locale="ko"
          ></v-date-picker>
        </v-card>
        <v-card>
          이 달의 벙 횟수 : {{this.dates && this.dates.length}}
        </v-card> -->
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';

@Component({
  components : {
  }
})
export default class Meeting extends Vue {

  // changePickDay(){
  //   const meetingKey = this.$moment(this.date).format('YYYYMMDD');
  //   const path = `/meeting/${meetingKey}`;
  //   if(this.currentUser){
  //     this.$router.push(path)
  //   } else {
  //     this.showSnackbar('error','로그인이 필요합니다');
  //   }
  // }

  // @Watch('pickerDate')
  // dateChanged(changedDate:any){
  //   if(changedDate.length > 4){
  //     // console.log('mmmmmm : ',this.$moment(changedDate)['_d']);
  //     this.getMeetingsMonth(this.$moment(changedDate)['_d']);
  //   }
  // }
  
  // date:any = '';//this.$moment(new Date).format('YYYY-MM-DD');
  // dates:any = null;
  // meetingsMonth:any = null;
  // pickerDate:any = null;

  // getMeetingsMonth(pDate:Date=new Date()){
  //   const date:string = this.$moment(pDate).format('YYYYMM');
  //   this.dates = [];  
  //   MeetingService.getMeetings({
  //     startAt : `${date}01`,
  //     endAt : `${date}32`
  //   })
  //   .then((res:any)=>{
  //     if(res.val()){
  //       res = res.val();
  //       this.meetingsMonth = res;
  //       this.dates = Object.keys(res).map((key:any)=>{
  //         return this.$moment(key.toString()).format('YYYY-MM-DD')
  //       })
  //     } else {
  //       this.meetingsMonth = {};
  //     }
  //   });
  // }
  // checkMeetingDay(event:any){
  //   if(this.dates && this.dates.find((date:any)=> date == event)){
  //     return true
  //   } else {
  //     return false
  //   }
  // }
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