<template>
  <v-layout column align-center>
    <v-container grid-list-md>
      <v-layout wrap pt-3>
      
        <v-flex xs12 sm12 md12 class="sticky title">
          <h1 class="headline">
            <v-icon color="green">insert_chart</v-icon> {{member.name}}님의 통계
            <v-btn class="ma-2" small tile outline color="success" @click="$router.push(`/member/detail/${member.key}`)">
              회원정보보기
            </v-btn>
          </h1>
        </v-flex>

        <v-flex xs6 sm6 md6 class="sticky range">
          <v-menu
            v-model="viewStartAt"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            full-width
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startAt"
                label="통계 범위 선택 (from)"
                persistent-hint
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="startAt" type="month" no-title @input="viewStartAt = false"></v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs6 sm6 md6 class="sticky range">
          <v-menu
            v-model="viewEndAt"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            full-width
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endAt"
                label="통계 범위 선택 (to)"
                persistent-hint
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="endAt" type="month" no-title @input="viewEndAt = false"></v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <v-subheader>월별 참여 횟수</v-subheader>
          <div id="partiChart" class="chart"></div>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <v-subheader>만난 회원 목록</v-subheader>
          <div id="familiarMembersChart" class="chart"></div>
        </v-flex>

      </v-layout>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { accountStore } from "@/stores/modules/account"
import { eventStore } from "@/stores/modules/event";
import { contentStore } from "@/stores/modules/content";
import { placeStore } from "@/stores/modules/place";
import { gradeStore } from "@/stores/modules/grade";
import { memberStore } from "@/stores/modules/member";
import { dialogStore } from "@/stores/modules/dialog";
import { menuStore } from "@/stores/modules/menu";
import { debounce } from "typescript-debounce-decorator";
import { classGrade } from '@/declare/enums/member';
import ApexCharts from 'apexcharts'

import colors from 'vuetify/es5/util/colors';
import API_UTILS from '@/utils/API_UTILS'

@Component
export default class DashboardMemberDetail extends Vue {
   //props
  @Prop() params: any;

  //stores
  get member(){return memberStore.member}
  get currentUser(){return accountStore.currentUser}
  get snackBar(){return dialogStore.snackBar}
  get events(){return eventStore.events}
  get members(){return memberStore.members}
  get places(){return placeStore.places}
  get contents(){return contentStore.contents}

  get joinDateString(){
    return this.$moment(this.member.joinDate.toString()).format('YYYY-MM-DD')
  }

  set joinDateString(YYYY_MM_DD:string){
    this.member.joinDate = parseInt(this.$moment(YYYY_MM_DD).format('YYYYMMDD'));
  }
  
  get birthString(){
    return this.$moment(this.member.birth.toString()).format('YYYY-MM-DD')
  }

  set birthString(YYYY_MM_DD:string){
    this.member.birth = parseInt(this.$moment(YYYY_MM_DD).format('YYYYMMDD'));
  }

  get gradeText(){
    const info:GradeTypes|undefined = gradeStore.gradeInfoVO.get(this.member.grade);
    return info ? info.name : "";
  }

  get lastDateString(){
    return this.$moment(this.member.lastDate.value.toString()).format('YYYY-MM-DD')
  }

  get dPlusString(){
    return `${this.member.dPlus}일이 지났습니다`
  }

  get dMinusString(){
    return `${this.member.dMinus}일이 남았습니다`
  }

  endAt:string = this.$moment(new Date()).format('YYYY-MM');
  startAt:string = this.$moment(new Date()).add(-4, 'months').format('YYYY-MM');
  dateRange:DateRange = {
    startAt: this.$moment(new Date()).add(-4, 'months').format('YYYYMM'),
    endAt: this.$moment(new Date()).format('YYYYMM'),
  }

  //날짜가 바뀌면 reset해주어야 하는 info
  tickCount:number = 0;
  rangeLabels:string[] = [];
  rangeEventsVO:Map<string,object[]> = new Map();

  //날짜가 바뀌거나 멤버키가 바뀌면 rest해주어야 하는 VO
  joinedEventsVO:Map<string,object[]> = new Map();
  familiarMembersVO:Map<string,any> = new Map();
  familiarPlacesVO:Map<string,number> = new Map();
  familiarContentsVO:Map<string,number> = new Map();

  viewStartAt:boolean = false;
  viewEndAt:boolean = false;

  @Watch('startAt')
  @Watch('endAt')
  setDateRange(){
    this.dateRange = {
      startAt: parseInt(`${this.$moment(this.startAt).format('YYYYMM')}01`),
      endAt: parseInt(`${this.$moment(this.endAt).format('YYYYMM')}31`),
    };
    eventStore.getEventsRange(this.dateRange);
  }

  @Watch('events')
  setDashboardData(){
    if(this.member.key){
      menuStore.setProgress(true);
      this.resetChartCommonInfo();
      this.resetPrivateVO();

      this.setChartCommonInfo();
      this.setPrivateVO();

      for(let key of this.charts.keys()){
        this.updateChart(key);
      }
      menuStore.setProgress(false);
    }
  }

  @Watch('params.key')
  async getNewMember(){
    this.resetPrivateVO();
    const msg = await memberStore.getMemberByKey(this.params ? this.params.key : '')
    if(msg.snackColor === 'success'){
      this.setPrivateVO();
      for(let key of this.charts.keys()){
        this.updateChart(key);
      }
    }
  }

  resetChartCommonInfo(){
    this.tickCount = 0;
    this.rangeLabels = [];
    this.rangeEventsVO = new Map();
  }

  resetPrivateVO(){
    this.joinedEventsVO = new Map();
    this.familiarMembersVO = new Map();
    this.familiarPlacesVO = new Map();
    this.familiarContentsVO = new Map();
  }

  setChartCommonInfo(){
    this.tickCount = this.$moment(this.endAt).diff(this.startAt, 'months');
    for(let i=0; i<=this.tickCount; i++){
      const YYYY_MM = this.$moment(this.startAt).add(i, 'months').format('YYYY.MM');
      this.rangeLabels.push(YYYY_MM);
    }
    this.events.forEach((event:EventTypes)=>{
      const key = event.key;
      const YYYYMMDD = event.date.toString();
      const YYYY_MM = `${YYYYMMDD.slice(0,4)}.${YYYYMMDD.slice(4,6)}`;
      const YYYY_MM_DD = `${YYYY_MM}.${YYYYMMDD.slice(6,8)}`;
      const eventDates = this.rangeEventsVO.get(YYYY_MM);
      const eventInfo = {key, date:YYYY_MM_DD};

      if(Array.isArray(eventDates)){//모든 이벤트를 월별로 나눠 map에 담는다. key:이벤트년월 value:이벤트날짜들
        eventDates.push(eventInfo);
      } else {
        this.rangeEventsVO.set(YYYY_MM, [eventInfo]);
      } 
    })
  }
  
  setPrivateVO(){
    const myKey = this.member.key;
    this.member.participation.forEach(participation=>{
      const joinedEvent = this.events.find(event=> event.key === participation.key);

      if(joinedEvent){
        const key = joinedEvent.key;
        const YYYYMMDD = joinedEvent.date.toString();
        const YYYY_MM = `${YYYYMMDD.slice(0,4)}.${YYYYMMDD.slice(4,6)}`;
        const YYYY_MM_DD = `${YYYY_MM}.${YYYYMMDD.slice(6,8)}`;
        const eventInfo = {key, date:YYYY_MM_DD};

        const joinedEventDates = this.joinedEventsVO.get(YYYY_MM);
        if(joinedEventDates){//참여한 이벤트를 월별로 나눠 map에 담는다. key:이벤트년월 value:이벤트날짜들
          joinedEventDates.push(eventInfo);
        } else {
          this.joinedEventsVO.set(YYYY_MM, [eventInfo]);
        }

        joinedEvent.contentKeys.forEach(contentKey=>{
          const count = this.familiarContentsVO.get(contentKey);
          this.familiarContentsVO.set(contentKey, (count || 0) + 1);
        })

        joinedEvent.memberKeys.forEach(memberKey=>{
          if(myKey !== memberKey){//본인제외
            const memberVO = this.familiarMembersVO.get(memberKey);
            const memberObj = this.members.find((member:MemberTypes)=> member.key === memberKey);

            this.familiarMembersVO.set(memberKey, {
              count : memberVO ? (memberVO.count) + 1 : 1,
              name : memberObj ? memberObj.name : '탈퇴한회원',
            });
          }
        })

        joinedEvent.placeKeys.forEach(placeKey=>{
          const count = this.familiarPlacesVO.get(placeKey);
          this.familiarPlacesVO.set(placeKey, (count || 0) + 1);
        })
      }
    })
  }

  charts:Map<string, any> = new Map([
    ["partiChart", {chart:null, option: {
      animate: false,
      updateSyncedCharts: true,
      plotOptions: {
          bar: {
              horizontal: true,
          }
      },
      chart: {
        type: 'bar',
      },
      series: [],
      xaxis: {categories:[]}
    }}],
    ["familiarMembersChart", {chart:null, option: {
      animate: false,
      updateSyncedCharts: true,
      plotOptions: {
          bar: {
              horizontal: true,
          }
      },
      chart: {
        type: 'bar',
      },
      series: [],
      xaxis: {categories:[]},
    }}],
  ]);

  async created(){
    menuStore.setProgress(true);
    if(!this.currentUser){
      dialogStore.showSnackbar({
        snackColor : 'error',
        snackText : '로그인이 필요합니다'
      });
      this.$router.back();
    }
    this.setDateRange();
    Promise.all([
      contentStore.getContents(), 
      placeStore.getPlaces(),
      gradeStore.getGrades(),
      eventStore.getEventsRange(this.dateRange),
      memberStore.getMembersInActive(),
      memberStore.getMemberByKey(this.params ? this.params.key : ''),
    ]).then(async (done)=>{
      // memberStore.setMembersInfoByKeys( this.event.memberKeys );
      this.setDashboardData();
      this.chartReady();
      menuStore.setProgress(false);
    })
    menuStore.setProgress(false);
  }


  updateChart(id:string){
    const chartObj = this.charts.get(id);
    if(chartObj.chart){
      if(id === 'partiChart'){
        const newSeries:any[] = [
          {data:[],name: '참여한 이벤트 횟수'},
          {data:[],name: '월별 열린 이벤트 횟수'},
        ];

        for(let i=0; i<=this.tickCount; i++){
          const joined = this.joinedEventsVO.get(this.rangeLabels[i]);
          const events = this.rangeEventsVO.get(this.rangeLabels[i]);

          newSeries[0].data.push(joined ? joined.length : 0);
          newSeries[1].data.push(events ? events.length : 0);
        }

        chartObj.option.xaxis.categories = this.rangeLabels;
        chartObj.option.series = newSeries;
        chartObj.option.chart.height = this.tickCount*90;

      } else if(id === 'familiarMembersChart'){
        const newSeries:any[] = [
          {data:[],name: '만난 회원'},
        ];

        const newMemberLabels:string[] = []

        for(let [key, value] of this.familiarMembersVO){
          if(value){
            newMemberLabels.push(value.name);
            newSeries[0].data.push(value.count);
          }
        }
        chartObj.option.xaxis.categories = newMemberLabels;
        chartObj.option.series = newSeries;
        chartObj.option.chart.height = newMemberLabels.length*30;

        const self = this;
        chartObj.option.chart.events = {
          click(e:any, context:any, config:any){
            const index = e.target.attributes['j'];
            if(index){
              self.goMemberDetailByName(config.globals.labels[index.value]);
            }
          }
        }
      }
      chartObj.chart.updateOptions(chartObj.option)
    }
  }

  chartReady(){
    for(let [key,value] of this.charts.entries()){
      if(value){
        value.chart = new ApexCharts(
          this.$el.querySelector(`#${key}`),
          value.option
        );
        value.chart.render();
      }
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach((entry:any) => {
        if(entry.isIntersecting){
          this.updateChart(entry.target.id);
          io.unobserve(entry.target);
        }
      });
    });

    Array.from(this.$el.querySelectorAll('.chart')).forEach(chart => {
      io.observe(chart);
    });
  }

  beforeDestroy(){
    memberStore.resetMember();
  }

  @debounce(1000)
  goEventDetail(key:string){
    if(key){
      this.$router.push(`/event/detail/${key}`);
    }
  }

  @debounce(1000)
  goMemberDetailByName(name:string){
    const member = this.members.find((member:MemberTypes)=> member.name === name);
    if(member){
      this.$router.push(`/dashboard/member/detail/${member.key}`);
    }
  }
}


</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
.custom-button {
  margin-top: -10px;
  margin-bottom:10px;
}
.v-subheader {
  height:24px;
  padding-left:10px;
}

.sticky {
  position:sticky;
  background-color:#fff;
  z-index: 10;
  &.title {
    top:56px;
  }
  &.range {
    top:97px;
  }
}
</style>