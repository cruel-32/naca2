<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-card class="pt-3 pa-3">
          <h1 class="headline">
            <v-icon color="#009688">date_range</v-icon>
            이달의 모임(벙) 목록
          </h1>
          <p class="pt-2 caption">
            *모임을 생성 혹은 수정,삭제하고나 하는 날짜를 클릭하세요<br/>
            *이미 모임이 있는 날은 초록색으로 마킹되어 있습니다<br/>
          </p>

          <v-dialog
            v-model="eventsDialog"
            max-width="290"
          >
            <v-card>
              <v-card-text>
                <v-card-title class="headline">{{samedayEvents.length}}개의 벙이 있습니다</v-card-title>
                <v-btn block
                   v-for="(event) of samedayEvents"
                  :key="event.uid"
                  @click="goEventDetail(event.uid)"
                >
                  {{event.title}}
                </v-btn>
              </v-card-text>
              <v-card-actions>
                <v-btn block dark color="success" @click="goCreateEvent()">
                  {{clickedYYYYMMDD}} 벙만들기
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
          이 달의 벙 횟수 : {{events && events.length}}
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import {eventStore} from "@/stores/modules/event";

@Component
export default class Meeting extends Vue {
  date:any = '';
  clickedYYYYMMDD:any = '';
  pickedYYYYMM:any = null;
  samedayEvents:any[] = [];
  eventsDialog:boolean = false;
  colors:string[] = [
    "info",
    "blue-grey",
  ]

  get events(){
    return eventStore.events
  }

  changePickedDay(date:string){
    this.clickedYYYYMMDD = date;
    const clickedDate = parseInt(date.split('-').join(''));
    this.samedayEvents = this.events.filter((event)=> event.date === clickedDate);
    this.eventsDialog = true;
  }

  @Watch('pickedYYYYMM')
  dateChanged(changedDate:any){
    if(changedDate.length > 4){
      const changedDateArr = changedDate.split('-')
      eventStore.getEventsRange({
        startAt: parseInt(changedDateArr.join('')+'01'),
        endAt: parseInt(changedDateArr.join('')+'31'),
      });
    }
  }
  
  checkEventDay(eventDay:any){
    const YYYYMMDD:number = parseInt(eventDay.split('-').join(''));
    return this.events.find((event:any)=> event.date === YYYYMMDD) ? true : false;
  }

  goCreateEvent(){
    const date = `${this.clickedYYYYMMDD.split('-').join('')}-${this.samedayEvents.length+1}`
    console.log('만들러가기 date : ', date);
  }
  
  goEventDetail(YYYYMMDD:number){
      this.$router.push(`/events/${YYYYMMDD}`);
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