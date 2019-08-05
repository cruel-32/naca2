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
          <v-subheader id="eventsChart" class="chart_title">월별 참여 횟수</v-subheader>
          <!-- <div id="partiChart" class="chart"></div> -->
          <apexchart type="bar" :options="eventsOptions"  :height="eventsHeight" :series="eventsSeries"></apexchart>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <v-subheader id="membersChart" class="chart_title">만난 회원 목록</v-subheader>
          <!-- <div id="personalMembersChart" class="chart"></div> -->
          <apexchart type="bar" :options="membersOptions"  :height="membersHeight" :series="membersSeries" @click="goMemberDetailByName"></apexchart>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <v-subheader id="contentsChart" class="chart_title">선호하는 컨텐츠</v-subheader>
          <!-- <div id="personalContentsChart" class="chart"></div> -->
          <apexchart type="bar" :options="contentsOptions"  :height="contentsHeight" :series="contentsSeries"></apexchart>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <v-subheader id="placesChart" class="chart_title">선호하는 장소</v-subheader>
          <!-- <div id="personalPlacesChart" class="chart"></div> -->
          <apexchart type="bar" :options="placesOptions"  :height="placesHeight" :series="placesSeries"></apexchart>
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
import apexchart from 'vue-apexcharts'

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
  rangeContentsVO:Map<string,number> = new Map();
  rangePlacesVO:Map<string,number> = new Map();

  //날짜가 바뀌거나 멤버키가 바뀌면 rest해주어야 하는 VO
  personalEventsVO:Map<string,object[]> = new Map();
  personalMembersVO:Map<string,any> = new Map();
  personalPlacesVO:Map<string,number> = new Map();
  personalContentsVO:Map<string,number> = new Map();

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
      this.resetPersonalVO();

      this.setChartCommonInfo();
      this.setPersonalVO();

      this.updateEventsChart();
      this.updateMembersChart();
      this.updateContentsChart();
      this.updatePlacesChart();
      

      menuStore.setProgress(false);
    }
  }

  @Watch('params.key')
  async getNewMember(){
    this.resetPersonalVO();
    const msg = await memberStore.getMemberByKey(this.params ? this.params.key : '')
    if(msg.snackColor === 'success'){
      this.setPersonalVO();

      this.updateEventsChart();
      this.updateMembersChart();
      this.updateContentsChart();
      this.updatePlacesChart();
    }
  }

  resetChartCommonInfo(){
    this.tickCount = 0;
    this.rangeLabels = [];
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

    
      this.member.participation.forEach(participation=>{
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
              const memberVO = this.personalMembersVO.get(memberKey);
              const memberObj = this.members.find((member:MemberTypes)=> member.key === memberKey);

              this.personalMembersVO.set(memberKey, {
                count : memberVO ? (memberVO.count) + 1 : 1,
                name : memberObj ? memberObj.name : '탈퇴한회원',
              });
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


  eventsSeries:any[] = [];
  eventsHeight:any = 'auto';
  eventsOptions:any = {
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    xaxis: {categories:[]}
  }
  
  membersSeries:any[] = [];
  membersHeight:any = 'auto';
  membersOptions:any  = {
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    xaxis: {categories:[]}
  }

  contentsSeries:any[] = [];
  contentsHeight:any = 'auto';
  contentsOptions:any  = {
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    xaxis: {categories:[]}
  }

  placesSeries:any[] = [];
  placesHeight:any = 'auto';
  placesOptions:any  = {
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    xaxis: {categories:[]}
  }

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
      menuStore.setProgress(false);
    })
    menuStore.setProgress(false);
  }

  updateEventsChart(){
    const newSeries:any[] = [
      {data:[],name: '참여한 이벤트 횟수'},
      {data:[],name: '열린 이벤트 횟수'},
    ];

    for(let i=0; i<=this.tickCount; i++){
      const joined = this.personalEventsVO.get(this.rangeLabels[i]);
      const events = this.rangeEventsVO.get(this.rangeLabels[i]);

      newSeries[0].data.push(joined ? joined.length : 0);
      newSeries[1].data.push(events ? events.length : 0);
    }

    this.eventsSeries = newSeries;
    this.eventsOptions.xaxis.categories = this.rangeLabels;
    this.eventsHeight = (this.tickCount*50)+150;
  }

  updateMembersChart(){
    const newSeries:any[] = [
      {data:[],name: '만난 회원'},
    ];

    const newMemberLabels:string[] = []

    if(this.personalMembersVO.size > 0){
      for(let [key, value] of this.personalMembersVO){
        if(value){
          newMemberLabels.push(value.name);
          newSeries[0].data.push(value.count);
        }
      }
    } else {
      newMemberLabels.push('참여기록없음');
      newSeries[0].data.push(0);
    }

    this.membersSeries = newSeries;
    this.membersOptions.xaxis.categories = newMemberLabels;
    this.membersHeight = (newMemberLabels.length*25)+100;
  }

  updateContentsChart(){
    const newSeries:any[] = [
      {data:[],name: '참여한 컨텐츠 횟수'},
      {data:[],name: '열린 컨텐츠 횟수'},
    ];
    
    const newContentLabels:string[] = []

    this.contents.forEach((content:ContentTypes)=>{
      newContentLabels.push(content.name);

      const joined = this.personalContentsVO.get(content.key);
      const events = this.rangeContentsVO.get(content.key);

      newSeries[0].data.push(joined || 0);
      newSeries[1].data.push(events || 0);
    });

    this.contentsSeries =  newSeries;
    this.contentsOptions.xaxis.categories = newContentLabels;
    this.contentsHeight = (this.contents.length*50)+150;
  }

  updatePlacesChart(){
    const newSeries:any[] = [
      {data:[],name: '참여한 장소 횟수'},
      {data:[],name: '열린 장소 횟수'},
    ];

    const newPlaceLabels:string[] = []

    this.places.forEach((place:PlaceTypes)=>{
      newPlaceLabels.push(place.name);

      const joined = this.personalPlacesVO.get(place.key);
      const events = this.rangePlacesVO.get(place.key);

      newSeries[0].data.push(joined || 0);
      newSeries[1].data.push(events || 0);
    });

    this.placesSeries = newSeries;
    this.placesOptions.xaxis.categories = newPlaceLabels;
    this.placesHeight = (this.places.length*50)+150;

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
  goMemberDetailByName(e:any){
    const text = e.target.querySelector('text');
    if(text){
      const member = this.members.find((member:MemberTypes)=> member.name === text.textContent);
      if(member){
        this.$router.push(`/dashboard/member/detail/${member.key}`);
      }
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