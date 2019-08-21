<template>
  <div class="member_detail_dash_container">
    <v-layout wrap>
      <v-flex xs12 sm12 md12 class="sticky title">
        <h1 class="headline">
          <v-icon color="green">insert_chart</v-icon>
          <strong @click="$router.push(`/members/detail/${member.key}`)">{{member.name}}</strong>님의 통계
        </h1>
      </v-flex>

      <v-flex xs6 sm6 md6 class="sticky range">
        <v-menu
          v-model="viewStartAt"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          :full-width="true"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="startAt"
              :readonly="true"
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
          :full-width="true"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="endAt"
              :readonly="true"
              label="통계 범위 선택 (to)"
              persistent-hint
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endAt" type="month" no-title @input="viewEndAt = false"></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs12 sm6 md6>
        <apexchart type="bar" :options="eventsOptions"  :height="eventsHeight" :series="eventsSeries"></apexchart>
      </v-flex>

      <v-flex xs12 sm6 md6>
        <apexchart type="bar" :options="membersOptions"  :height="membersHeight" :series="membersSeries"></apexchart>
      </v-flex>

      <v-flex xs12 sm6 md6>
        <apexchart type="bar" :options="contentsOptions"  :height="contentsHeight" :series="contentsSeries"></apexchart>
      </v-flex>

      <v-flex xs12 sm6 md6>
        <apexchart type="bar" :options="placesOptions"  :height="placesHeight" :series="placesSeries"></apexchart>
      </v-flex>

    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { eventStore } from "@/stores/modules/event";
import { contentStore } from "@/stores/modules/content";
import { placeStore } from "@/stores/modules/place";
import { memberStore } from "@/stores/modules/member";
import { menuStore } from "@/stores/modules/menu";
import { debounce } from "typescript-debounce-decorator";
import apexchart from 'vue-apexcharts'
import { dialogStore } from '@/stores/modules/dialog';

@Component({
  components : {
    apexchart
  }
})
export default class DashboardMemberDetail extends Vue {
   //props
  @Prop() params: any;

  //stores
  get member(){return memberStore.member}
  get events(){return eventStore.events}
  get members(){return memberStore.members}
  get places(){return placeStore.places}
  get contents(){return contentStore.contents}


  endAt:string = this.$moment(new Date()).format('YYYY-MM');
  startAt:string = this.$moment(new Date()).add(-4, 'months').format('YYYY-MM');

  dateRange:IDateRange = {
    startAt: this.$moment(new Date()).add(-4, 'months').format('YYYYMM'),
    endAt: this.$moment(new Date()).format('YYYYMM'),
  }

  //날짜가 바뀌면 reset해주어야 하는 info
  rangeEventsVO:Map<string,object[]> = new Map();
  rangeContentsVO:Map<string,number> = new Map();
  rangePlacesVO:Map<string,number> = new Map();

  //날짜가 바뀌거나 멤버키가 바뀌면 rest해주어야 하는 VO
  personalEventsVO:Map<string,object[]> = new Map();
  personalMembersVO:Map<string,number> = new Map();
  personalPlacesVO:Map<string,number> = new Map();
  personalContentsVO:Map<string,number> = new Map();

  viewStartAt:boolean = false;
  viewEndAt:boolean = false;

  eventsSeries:number[] = [];
  eventsHeight:number|string = 'auto';
  eventsOptions:any = {}
  
  membersSeries:number[] = [];
  membersHeight:number|string = 'auto';
  membersOptions:any  = {}

  contentsSeries:number[] = [];
  contentsHeight:number|string = 'auto';
  contentsOptions:any  = {};

  placesSeries:number[] = [];
  placesHeight:number|string = 'auto';
  placesOptions:any  = {}

  @Watch('startAt')
  @Watch('endAt')
  async setDateRange(){
    menuStore.setProgress(true);

    const startAtDate = this.$moment(this.startAt);
    const endAtDate = this.$moment(this.endAt);
    const diff:number = endAtDate.diff(startAtDate, 'months');

    if(diff < 0){
      dialogStore.showSnackbar({
        "snackColor" : "error",
        "snackText" : "날짜범위를 다시 설정하세요"
      });
      menuStore.setProgress(false);
      return
    }

    this.dateRange = {
      startAt: parseInt(`${this.$moment(this.startAt).format('YYYYMM')}01`),
      endAt: parseInt(`${this.$moment(this.endAt).format('YYYYMM')}31`),
    };

    this.resetChartCommonInfo();
    this.resetPersonalVO();
    await eventStore.getEventsRange(this.dateRange);
    this.setDashboardData();
    menuStore.setProgress(false);
  }

  setDashboardData(){
    if(this.member.key){
      this.setChartCommonInfo();
      this.setPersonalVO();

      this.updateEventsChart();
      this.updateMembersChart();
      this.updateContentsChart();
      this.updatePlacesChart();
    }
  }

  @Watch('params.key')
  async getNewMember(){
    menuStore.setProgress(true);
    this.resetPersonalVO();
    const msg = await memberStore.getMemberByKey(this.params ? this.params.key : '')
    if(msg.snackColor === 'success'){
      this.setPersonalVO();

      this.updateEventsChart();
      this.updateMembersChart();
      this.updateContentsChart();
      this.updatePlacesChart();

      menuStore.setProgress(false);
    }
  }

  resetChartCommonInfo(){
    this.rangeEventsVO = new Map();
    this.rangeContentsVO = new Map();
    this.rangePlacesVO = new Map();
  }

  resetPersonalVO(){
    this.personalEventsVO = new Map();
    this.personalMembersVO = new Map();
    this.personalPlacesVO = new Map();
    this.personalContentsVO = new Map();
  }

  setChartCommonInfo(){
    this.events.forEach((event:IEventTypes)=>{
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

      event.contentKeys.forEach(contentKey=>{
        const count = this.rangeContentsVO.get(contentKey);
        this.rangeContentsVO.set(contentKey, (count || 0) + 1);
      })

      event.placeKeys.forEach(placeKey=>{
        const count = this.rangePlacesVO.get(placeKey);
        this.rangePlacesVO.set(placeKey, (count || 0) + 1);
      })
      
    })
  }
  
  setPersonalVO(){
    const myKey = this.member.key;
    if(this.member.participation){
    
      this.member.participation.forEach((participation:IKeyAndValue<IEventTypes['key']>)=>{
        const joinedEvent = this.events.find(event=> event.key === participation.key);

        if(joinedEvent){
          const key = joinedEvent.key;
          const YYYYMMDD = joinedEvent.date.toString();
          const YYYY_MM = `${YYYYMMDD.slice(0,4)}.${YYYYMMDD.slice(4,6)}`;
          const YYYY_MM_DD = `${YYYY_MM}.${YYYYMMDD.slice(6,8)}`;
          const eventInfo = {key, date:YYYY_MM_DD};
          const joinedEventDates = this.personalEventsVO.get(YYYY_MM);

          if(joinedEventDates){//참여한 이벤트를 월별로 나눠 map에 담는다. key:이벤트년월 value:이벤트날짜들
            joinedEventDates.push(eventInfo);
          } else {
            this.personalEventsVO.set(YYYY_MM, [eventInfo]);
          }

          joinedEvent.memberKeys.forEach(memberKey=>{
            if(myKey !== memberKey){//본인제외
              const count = this.personalMembersVO.get(memberKey);
              this.personalMembersVO.set(memberKey, (count || 0 ) + 1);
            }
          })

          joinedEvent.contentKeys.forEach(contentKey=>{
            const count = this.personalContentsVO.get(contentKey);
            this.personalContentsVO.set(contentKey, (count || 0) + 1);
          })

          joinedEvent.placeKeys.forEach(placeKey=>{
            const count = this.personalPlacesVO.get(placeKey);
            this.personalPlacesVO.set(placeKey, (count || 0) + 1);
          })
        }
      })
    }
  }

  async created(){
    menuStore.setProgress(true);
    this.setDateRange();
    Promise.all([
      contentStore.getContents(), 
      placeStore.getPlaces(),
      memberStore.getMembersInActive(),
      memberStore.getMemberByKey(this.params ? this.params.key : ''),
    ]).then(async (done)=>{
      // memberStore.setMembersInfoByKeys( this.event.memberKeys );
      this.setDashboardData();
      menuStore.setProgress(false);
    })
  }

  updateEventsChart(){
    const newSeries:any[] = [
      {data:[],name: '참여한 이벤트 횟수'},
      {data:[],name: '열린 이벤트 횟수'},
    ];
    const categories = [];

    for(let [key, value] of this.rangeEventsVO.entries()){
      const joined = this.personalEventsVO.get(key);

      categories.push(key);
      newSeries[0].data.push(joined ? joined.length : 0);
      newSeries[1].data.push(value.length);
    }

    this.eventsSeries = newSeries;
    this.eventsOptions = {
      title: {
        text: '월별 참여 횟수'
      },
      legend: {
        position: 'top'
      },
      plotOptions: {
        bar: {
            horizontal: true,
        }
      },
      xaxis: {categories}
    }
    this.eventsHeight = (this.rangeEventsVO.size *60)+120;
  }

  updateMembersChart(){
    const newSeries:any[] = [
      {data:[],name: '만난 회원'},
    ];

    const categories:string[] = []

    if(this.personalMembersVO.size > 0){
      for(let [key, value] of this.personalMembersVO){
        const member = this.members.find((member:IMemberTypes)=>member.key === key);
        categories.push(member ? member!.name : '탈퇴한 회원');
        newSeries[0].data.push(value);
      }
    } else {
      categories.push('참여기록없음');
      newSeries[0].data.push(0);
    }

    this.membersSeries = newSeries;
    this.membersOptions = {
      title: {
        text: '만난 회원 목록'
      },
      legend: {
        position: 'top'
      },
      plotOptions: {
          bar: {
              horizontal: true,
          }
      },
      xaxis: {categories},
      chart : {
        events : {
          dataPointSelection: this.goMemberDetailByName,
        }
      }
    }

    this.membersHeight = (categories.length*30)+120;
  }

  updateContentsChart(){
    const newSeries:any[] = [
      {data:[],name: '참여한 컨텐츠 횟수'},
      {data:[],name: '열린 컨텐츠 횟수'},
    ];
    
    const newContentLabels:string[] = [];

    for(let [key, value] of this.rangeContentsVO.entries()){
      const content = this.contents.find((content:IContentTypes) => content.key === key);
      const contentCount = this.personalContentsVO.get(key);

      newContentLabels.push(content!.name);
      newSeries[0].data.push(contentCount || 0);
      newSeries[1].data.push(value || 0);
    }

    this.contentsSeries =  newSeries;
    //contentsOptions 옵션을 통째로 바꾸지 않으면 라벨 순서가 이상한 apexchart 자체 버그가 있음 ㅡㅡ
    this.contentsOptions = {
      title: {text: '선호 컨텐츠'},
      legend: {position: 'top'},
      plotOptions: {bar: {horizontal: true}},
      xaxis: {categories:newContentLabels}
    }
    this.contentsHeight = (this.rangeContentsVO.size*60)+130;
  }

  updatePlacesChart(){
    const newSeries:any[] = [
      {data:[],name: '참여한 장소 횟수'},
      {data:[],name: '열린 장소 횟수'},
    ];
    
    const newPlaceLabels:string[] = []

    for(let [key, value] of this.rangePlacesVO.entries()){
      const place = this.places.find((place:IPlaceTypes) => place.key === key);
      const placeCount = this.personalPlacesVO.get(key);

      newPlaceLabels.push(place!.name);
      newSeries[0].data.push(placeCount || 0);
      newSeries[1].data.push(value || 0);
    }

    this.placesSeries = newSeries;
    //placesOptions 옵션을 통째로 바꾸지 않으면 라벨 순서가 이상한 apexchart 자체 버그가 있음 ㅡㅡ
    this.placesOptions = {
      title: {text: '선호 지역'},
      legend: {position: 'top'},
      plotOptions: {bar: {horizontal: true}},
      xaxis: {categories:newPlaceLabels}
    }
    this.placesHeight = (this.rangePlacesVO.size*60)+130;
  }

  beforeDestroy(){
    memberStore.resetMember();
  }

  @debounce(1000)
  goEventDetail(key:string){
    if(key){
      this.$router.push(`/events/detail/${key}`);
    }
  }

  @debounce(1000)
  goMemberDetailByName(e:any, chartContext:any, config:any){
    const name = chartContext.w.globals.labels[e.target.getAttribute('j')];
    const member = this.members.find((member:IMemberTypes)=> member.name === name);
    if(member){
      this.$router.push(`/dashboard/members/detail/${member.key}`);
    }
  }
}


</script>

<style scoped lang="scss">
.member_detail_dash_container {
  padding:1.5rem;
  display:flex;
  height:100%;
  align-items:center;
}
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
  background-color:#fafafa;
  z-index: 20;
  &.title {
    top:0px;
    padding-top:1rem;
  }
  &.range {
    top:40px;
  }
}
</style>