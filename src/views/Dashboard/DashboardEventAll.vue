<template>
  <v-layout column align-center>
    <v-container grid-list-md>
      <v-layout wrap pt-3>
      
        <v-flex xs12 sm12 md12 class="sticky title">
          <h1 class="headline">
            <v-icon color="green">insert_chart</v-icon> 전체 이벤트 통계
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
          <apexchart type="bar" :options="eventsOptions"  :height="eventsHeight" :series="eventsSeries"></apexchart>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <apexchart type="donut" :options="contentsOptions"  :height="contentsHeight" :series="contentsSeries"></apexchart>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <apexchart type="donut" :options="placesOptions"  :height="placesHeight" :series="placesSeries"></apexchart>
        </v-flex>

      </v-layout>
    </v-container>
  </v-layout>
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

  endAt:string = this.$moment(new Date()).format('YYYY-MM');
  startAt:string = this.$moment(new Date()).add(-6, 'months').format('YYYY-MM');
  dateRange:DateRange = {
    startAt: this.$moment(new Date()).add(-6, 'months').format('YYYYMM'),
    endAt: this.$moment(new Date()).format('YYYYMM'),
  }

  //날짜가 바뀌면 reset해주어야 하는 info
  tickCount:number = 0;
  rangeLabels:string[] = [];
  rangeEventsVO:Map<string,object[]> = new Map();
  rangeContentsVO:Map<string,number> = new Map();
  rangePlacesVO:Map<string,number> = new Map();

  viewStartAt:boolean = false;
  viewEndAt:boolean = false;

  eventsSeries:any[] = [];
  eventsHeight:any = 'auto';
  eventsOptions:any = {
    title: {
      text: '월별 이벤트 횟수'
    },
    legend: {
      position: 'top'
    },
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
    title: {
      text: '컨텐츠 비율'
    },
    legend: {
      position: 'top'
    },
    xaxis: {categories:[]}
  }

  placesSeries:any[] = [];
  placesHeight:any = 'auto';
  placesOptions:any  = {
    title: {
      text: '지역 비율'
    },
    legend: {
      position: 'top'
    },
    xaxis: {categories:[]}
  }

  @Watch('startAt')
  @Watch('endAt')
  setDateRange(){
    this.dateRange = {
      startAt: parseInt(`${this.$moment(this.startAt).format('YYYYMM')}01`),
      endAt: parseInt(`${this.$moment(this.endAt).format('YYYYMM')}31`),
    };
    eventStore.getEventsRange(this.dateRange);
  }

  setDashboardData(){
    menuStore.setProgress(true);
    this.resetChartCommonInfo();

    this.setChartCommonInfo();

    this.updateEventsChart();
    this.updateContentsChart();
    this.updatePlacesChart();

    menuStore.setProgress(false);
  }

  resetChartCommonInfo(){
    this.tickCount = 0;
    this.rangeLabels = [];
    this.rangeEventsVO = new Map();
    this.rangeContentsVO = new Map();
    this.rangePlacesVO = new Map();
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
  
  async created(){
    menuStore.setProgress(true);
    this.setDateRange();
    Promise.all([
      contentStore.getContents(), 
      placeStore.getPlaces(),
      eventStore.getEventsRange(this.dateRange),
      memberStore.getMembersInActive(),
      memberStore.getMemberByKey(this.params ? this.params.key : ''),
    ]).then(async (done)=>{
      console.log('done : ', done);
      // memberStore.setMembersInfoByKeys( this.event.memberKeys );
      this.setDashboardData();
      menuStore.setProgress(false);
    })
  }

  updateEventsChart(){
    const newSeries:any[] = [
      {data:[],name: '열린 이벤트 횟수'},
    ];

    for(let i=0; i<=this.tickCount; i++){
      const events = this.rangeEventsVO.get(this.rangeLabels[i]);

      newSeries[0].data.push(events ? events.length : 0);
    }

    this.eventsSeries = newSeries;
    this.eventsOptions.xaxis.categories = this.rangeLabels;
    this.eventsHeight = (this.tickCount*30)+120;
  }

  updateContentsChart(){
    const newSeries:any[] = [];
    const newContentLabels:string[] = [];

    for(let [key, value] of this.rangeContentsVO.entries()){
      const content = this.contents.find((content:ContentTypes)=>content.key === key);
      if(content){
        newContentLabels.push(content!.name);
        newSeries.push(value);
      }
    }

    console.log('newContentLabels : ', newContentLabels);

    this.contentsOptions.labels = newContentLabels;
    this.contentsSeries =  newSeries;
    this.contentsHeight = 400
  }

  updatePlacesChart(){
    const newSeries:any[] = [];
    
    const newPlaceLabels:string[] = []

    for(let [key, value] of this.rangePlacesVO.entries()){
      const place = this.places.find((place:PlaceTypes)=>place.key === key);
      if(place){
        newPlaceLabels.push(place!.name);
        newSeries.push(value);
      }
    }

    console.log('newPlaceLabels : ', newPlaceLabels);

    this.placesOptions.labels = newPlaceLabels;
    this.placesSeries = newSeries;
    this.placesHeight = 400

  }

  @debounce(1000)
  goEventDetail(key:string){
    if(key){
      this.$router.push(`/events/detail/${key}`);
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
  background-color:#fafafa;
  z-index: 20;
  &.title {
    top:0px;
  }
  &.range {
    top:40px;
  }
}
</style>