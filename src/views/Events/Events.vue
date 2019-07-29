<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-card class="pt-3 pa-3">
          <h1 class="headline">
            <v-icon color="#009688">date_range</v-icon>
            이달의 이벤트 목록
          </h1>
          <p class="pt-2 caption">
            *이벤트를 생성 혹은 수정,삭제하고나 하는 날짜를 클릭하세요<br/>
            *이미 이벤트가 있는 날은 초록색으로 마킹되어 있습니다<br/>
          </p>

          <v-dialog
            v-model="eventsDialog"
            max-width="290"
          >
            <v-card>
              <v-card-text>
                <v-card-title class="headline">{{samedayEvents.length}}개의 이벤트가 있습니다</v-card-title>
                <v-btn block
                   v-for="(event) of samedayEvents"
                  :key="event.key"
                  @click="goEventDetail(event.key)"
                >
                  {{event.title}}
                </v-btn>
              </v-card-text>
              <v-card-actions>
                <v-btn block dark color="success" @click="goCreateEvent()">
                  {{clickedYYYYMMDD}} 이벤트 만들기
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-date-picker
            full-width
            v-model="date"
            ref="picker"
            event-color="green lighten-1"
            :reactive="true"
            :picker-date.sync="pickedYYYYMM"
            :events="checkEventDay"
            @change="changePickedDay"
            locale="ko"
          ></v-date-picker>

        </v-card>
        <v-card>
          이 달의 이벤트 횟수 : {{events && events.length}}
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { accountStore } from "@/stores/modules/account"
import { eventStore } from "@/stores/modules/event";
import { dialogStore } from "@/stores/modules/dialog"

@Component
export default class Meeting extends Vue {
  today:string = this.$moment(new Date).format('YYYY-MM-DD');
  date:string = '';
  clickedYYYYMMDD:any = '';
  pickedYYYYMM:any = null;
  samedayEvents:EventTypes[] = [];
  eventsDialog:boolean = false;
  colors:string[] = [
    "info",
    "blue-grey",
  ]

  get currentUser(){
    return accountStore.currentUser
  }

  get events(){
    return eventStore.events
  }

  get snackBar(){
    return dialogStore.snackBar
  }

  changePickedDay(date:string){
    this.clickedYYYYMMDD = date;
    const clickedDate = parseInt(date.split('-').join(''));
    this.samedayEvents = this.events.filter((event)=> event.date === clickedDate);
    this.eventsDialog = true;
  }

  @Watch('pickedYYYYMM')
  dateChanged(changedDate:any){
    this.date = this.today.slice(0,7) === changedDate ? this.today : changedDate;
    if(changedDate.length > 4){
      const changedDateArr = changedDate.split('-')
      const dateRange:DateRange = {
        startAt: parseInt(changedDateArr.join('')+'01'),
        endAt: parseInt(changedDateArr.join('')+'31'),
      }
      eventStore.getEventsRange(dateRange);
    }
  }
  
  checkEventDay(eventDay:any){
    const YYYYMMDD:number = parseInt(eventDay.split('-').join(''));
    return this.events.find((event:any)=> event.date === YYYYMMDD) ? true : false;
  }

  goCreateEvent(){
    if(!this.currentUser){
      dialogStore.showSnackbar({snackColor:'error',snackbarText:'로그인이 필요합니다'});
    } else {
      this.$router.push({
        path:`/event/detail`,
        query: {
          date : this.clickedYYYYMMDD
        }
      });
    }
  }
  
  goEventDetail(key:string){
    console.log('key : ', key);
    this.$router.push(`/event/detail/${key}`);
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