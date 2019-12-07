<template>
  <div class="member_all_container">
    <v-layout wrap>
      <v-flex xs12 sm12 md12 class="sticky title">
        <h1 class="headline">
          <v-icon color="green">insert_chart</v-icon> 전체 회원 통계
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
        <apexchart type="donut" @dataPointSelection="clickHobbys" :options="hobbysOptions"  :height="hobbysHeight" :series="hobbysSeries"></apexchart>
      </v-flex>
    
      <v-flex xs12 sm6 md6>
        <apexchart type="donut" :options="genderOptions"  :height="genderHeight" :series="genderSeries"></apexchart>
      </v-flex>

      <v-flex xs12 sm6 md6>
        <apexchart type="bar" :options="ageOptions"  :height="ageHeight" :series="ageSeries"></apexchart>
      </v-flex>

      <v-flex xs12 sm6 md6 v-for="(charInfo,index) in rangeCountsChartInfo" :key="index">
        <apexchart type="bar" :options="charInfo.options"  :height="charInfo.height" :series="charInfo.series"></apexchart>
      </v-flex>

      <v-dialog v-model="viewHobbyMembers" persistent >
        <v-card>
          <v-card-title class="headline">
            {{selectedHobby}} <span class="text-sm">활동을 좋아하는 멤버입니다.</span>
          </v-card-title>
          <v-card-text class="text-justify text-align-center">
            <v-btn
              v-for="(hobbyMember,index) in hobbyMembers" :key="index"
              right
              @click="$router.push(`/members/detail/${hobbyMember.key}`)"
              depressed
              flat
            >
              {{hobbyMember.name}}
            </v-btn>
            <div>등 {{hobbyMembers.length}}명</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              center
              @click="viewHobbyMembers = false"
              outline
              depressed
            >
              Okay
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>




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

interface IChartOption {
  series:number[];
  options:{
    title:{
      text:string
    },
    legend:{
      position:string;
    },
    plotOptions:{
      bar:{
        horizontal:boolean;
      }
    },
    xaxis:{
      categories:string[];
    }
  }
}

@Component({
  components : {
    apexchart
  }
})
export default class DashboardMemberAll extends Vue {
   //props
  @Prop() params: any;

  //stores
  get events(){return eventStore.events}
  get members(){return memberStore.members}
  get places(){return placeStore.places}
  get contents(){return contentStore.contents}
  
  viewStartAt:boolean = false;
  viewEndAt:boolean = false;

  endAt:string = this.$moment(new Date()).format('YYYY-MM');
  startAt:string = this.$moment(new Date()).add(-2, 'months').format('YYYY-MM');

  dateRange:IDateRange = {
    startAt: this.$moment(new Date()).add(-2, 'months').format('YYYYMM'),
    endAt: this.$moment(new Date()).format('YYYYMM'),
  }

  today:any = this.$moment(new Date());
  viewHobbyMembers:boolean = false;
  hobbyMembers:IMemberTypes[] = [];
  selectedHobby:string = '';

  //날짜가 바뀌면 reset해주어야 하는 info
  hobbysVO:Map<string, {count:number, members:IMemberTypes[]}> = new Map();
  genderVO:Map<string,number> = new Map();
  ageVO:Map<string,number> = new Map();
  rangeCountsVO:Map<string, Map<string, number>> = new Map();
  rangeCountsChartInfo:any[] = [];

  genderSeries:any[] = [];
  genderHeight:any = 'auto';
  genderOptions:any  = {}

  hobbysSeries:any[] = [];
  hobbysHeight:any = 'auto';
  hobbysOptions:any  = {}

  ageSeries:any[] = [];
  ageHeight:any = 'auto';
  ageOptions:any  = {
    title: {
      text: '남녀 평균 나이'
    },
    legend: {
      position: 'top'
    },
    xaxis: {
      categories: ['평균 나이'],
    }
  }

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
    this.resetRangeEvents();
    await eventStore.getEventsRange(this.dateRange);
    this.setRangeEvents();
    this.updateRangeEventChart();
    menuStore.setProgress(false);
  }

  setDashboardData(){
    menuStore.setProgress(true);
    this.setChartCommonInfo();
    this.updateHobbysChart();
    this.updateGenderChart();
    this.updateAgeChart();
    this.updateRangeEventChart();
    menuStore.setProgress(false);
  }

  setChartCommonInfo(){
    this.members.forEach((member:IMemberTypes)=>{
      member.hobbys.forEach(hobby=>{
        const memberHobby = this.hobbysVO.get(hobby);
        this.hobbysVO.set(hobby, {
          count: (memberHobby && memberHobby.count||0)+1,
          members: memberHobby && Array.isArray(memberHobby.members) ? memberHobby.members.concat([member]) : [member]
        });
      })
      const gender = this.genderVO.get(member.gender);
      const genderAge = this.ageVO.get(member.gender);
      const age:number = this.today.diff(this.$moment(member.birth.toString()), 'years')+1;

      this.genderVO.set(member.gender, (gender || 0) + 1);
      this.ageVO.set(member.gender, (genderAge ||0 ) + age);
    })
  }

  resetRangeEvents(){
    this.rangeCountsVO = new Map();
    this.rangeCountsChartInfo = [];
  }

  setRangeEvents(){
    this.events.forEach((event:IEventTypes)=>{
      const key = event.key;
      const YYYYMMDD = event.date.toString();
      const YYYY_MM = `${YYYYMMDD.slice(0,4)}.${YYYYMMDD.slice(4,6)}`;
      const memberKeys = event.memberKeys;
      const eventVO = this.rangeCountsVO.get(YYYY_MM);

      if(!eventVO){
        const newVO = new Map();
        memberKeys.forEach((memberKey:string)=>{
          newVO.set(memberKey,1);
        })
        this.rangeCountsVO.set(YYYY_MM, newVO);
      } else {
        memberKeys.forEach((memberKey:string)=>{
          eventVO.set(memberKey, (eventVO.get(memberKey)||0)+1);
        })
      }
    });
  }

  
  async created(){
    menuStore.setProgress(true);
    Promise.all([
      contentStore.getContents(), 
      placeStore.getPlaces(),
      memberStore.getMembersInActive(),
      memberStore.getMemberByKey(this.params ? this.params.key : ''),
      this.setDateRange(),
    ]).then(async (done)=>{
      console.log('done : ', done);
      // memberStore.setMembersInfoByKeys( this.event.memberKeys );
      this.setDashboardData();
      menuStore.setProgress(false);
    })
  }

  clickHobbys(event:any, chartContext:any, config:any){
    const { target : { parentNode } } = event;
    if(parentNode){
      const { dataPointIndex } = config;
      const seriesName = config.w.globals.seriesNames[dataPointIndex]
      const content:IContentTypes|undefined = this.contents.find((content:IContentTypes)=>content.name === seriesName)

      if(content){
        this.selectedHobby = seriesName;
        const memberHobby = this.hobbysVO.get(content.key);
        this.hobbyMembers = memberHobby ? memberHobby.members : []
        this.viewHobbyMembers = true
      }
    }
  }

  updateHobbysChart(){
    const newSeries:any[] = [];
    const newHobbysLabels:string[] = [];

    for(let [key,value] of this.hobbysVO){
      newSeries.push(value.count)
      const content = this.contents.find((content:IContentTypes)=> content.key === key)
      newHobbysLabels.push(content!.name)
    }

    this.hobbysSeries = newSeries;
    this.hobbysOptions = {
       title: {
        text: '전체 선호활동(취미)'
      },
      legend: {
        position: 'top'
      },
      labels : newHobbysLabels,
      tooltip: {
        y: {
          formatter(value:string) {
            return `
              ${value} 명 (click 하여 자세히 보기)
            `
          }
        }
      }
    };
    this.hobbysHeight = 380

  }

  updateGenderChart(){
    const newSeries:any[] = [];
    const newGenderLabels:string[] = [];

    for(let [key,value] of this.genderVO){
      newSeries.push(value)
      newGenderLabels.push(key === 'F' ? "여자" : "남자");
    }

    this.genderSeries = newSeries;
    this.genderOptions = {
       title: {
        text: '전체 남녀 성비'
      },
      legend: {
        position: 'top'
      },
      labels : newGenderLabels
    };
    this.genderHeight = 380
  }

  updateAgeChart(){
    const newSeries:any[] = [
      {data:[], name: '여자 평균 나이'},
      {data:[], name: '남자 평균 나이'},
    ];

    for(let [gender,value] of this.ageVO){
      const genderTotal = this.genderVO.get(gender);

      if(genderTotal){
        const aver = (value/genderTotal).toFixed(2)
        if(gender === 'M'){
          newSeries[1].data.push(aver);
        } else {
          newSeries[0].data.push(aver);
        }
      }
    }

    this.ageSeries = newSeries;
    this.ageHeight = 380
  }

  updateRangeEventChart(){
    this.rangeCountsChartInfo=[];
    const chartInfo = [];
    for(let [YYYYMM,MAP] of this.rangeCountsVO.entries()){
      const series:any[] = [
        {data:[], name: `${YYYYMM} 참석횟수`},
      ];
      const options = {
        title: {
          text: `${YYYYMM} 참석왕`
        },
        legend: {
          position: 'top'
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        xaxis: {}
      }
      // series[0].data.push(value.values)
      const categories = [];
      const height = (MAP.size*30)+100;
      for(let [key,value] of MAP.entries()){
        const member = this.members.find((member:IMemberTypes)=>member.key === key);
        series[0].data.push(value);
        categories.push(member ? member.name : '탈퇴한 회원');
      }
      options.xaxis = {categories};
      chartInfo.push({
        series,
        options,
        height
      })
    }
    this.rangeCountsChartInfo = chartInfo;
    // console.log('this.rangeCountsChartInfo : ', this.rangeCountsChartInfo);
  }
}


</script>

<style scoped lang="scss">
.member_all_container {
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
.text-sm {
  margin-left:0.5rem
}
.text-align-center {
  text-align: center;
}


</style>