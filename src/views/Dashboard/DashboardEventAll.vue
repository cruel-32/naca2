<template>
  <div class="event_all_container">
    <v-layout wrap>
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
        <apexchart type="donut" :options="contentsOptions"  :height="contentsHeight" :series="contentsSeries"></apexchart>
      </v-flex>

      <v-flex xs12 sm6 md6>
        <apexchart type="donut" :options="placesOptions"  :height="placesHeight" :series="placesSeries"></apexchart>
      </v-flex>

      <v-flex xs12 sm12 md12>
        <v-data-table
          :headers="headers"
          :items="events"
          :search="search"
          :rows-per-page-items="options"
          rows-per-page-text="한 페이지당 목록수"
          class="elevation-1 custom-table"
        >
          <template slot="items" slot-scope="props" >
            <tr @click="goEventDetail(props.item.key)">
              <td class="text-xs-left">{{ $moment(props.item.date.toString()).format('YYYY.MM.DD') }}</td>
              <td class="text-xs-left">{{ props.item.title }}</td>
              <td class="text-xs-center">{{ props.item.memberKeys.length }}명</td>
            </tr>
          </template>
        </v-data-table>
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

  headers:any[] = [
    {text: '날짜', value: 'date', sort:true},
    {text: '제목', value: 'title', sort:true},
    {text: '인원수', value: 'memberKeys', sort:true},
  ];
  search:string = '';
  options:any[] = [{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}, 10,20,];

  endAt:string = this.$moment(new Date()).format('YYYY-MM');
  startAt:string = this.$moment(new Date()).add(-6, 'months').format('YYYY-MM');
  dateRange:IDateRange = {
    startAt: this.$moment(new Date()).add(-6, 'months').format('YYYYMM'),
    endAt: this.$moment(new Date()).format('YYYYMM'),
  }

  //날짜가 바뀌면 reset해주어야 하는 info
  rangeLabels:string[] = [];
  rangeEventsVO:Map<string,object[]> = new Map();
  rangeContentsVO:Map<string,number> = new Map();
  rangePlacesVO:Map<string,number> = new Map();

  viewStartAt:boolean = false;
  viewEndAt:boolean = false;

  eventsSeries:any[] = [];
  eventsHeight:any = 'auto';
  eventsOptions:any = {}
  
  contentsSeries:any[] = [];
  contentsHeight:any = 'auto';
  contentsOptions:any  = {}

  placesSeries:any[] = [];
  placesHeight:any = 'auto';
  placesOptions:any  = {};

  @Watch('startAt')
  @Watch('endAt')
  setDateRange(){
      menuStore.setProgress(true);
    this.dateRange = {
      startAt: parseInt(`${this.$moment(this.startAt).format('YYYYMM')}01`),
      endAt: parseInt(`${this.$moment(this.endAt).format('YYYYMM')}31`),
    };
    eventStore.getEventsRange(this.dateRange);
    menuStore.setProgress(false);
  }

  @Watch('events')
  setDashboardData(){
    this.resetChartCommonInfo();

    this.setChartCommonInfo();

    this.updateEventsChart();
    this.updateContentsChart();
    this.updatePlacesChart();
  }

  resetChartCommonInfo(){
    this.rangeLabels = [];
    this.rangeEventsVO = new Map();
    this.rangeContentsVO = new Map();
    this.rangePlacesVO = new Map();
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

    for(let [key, value] of this.rangeEventsVO.entries()){
      this.rangeLabels.push(key);
      newSeries[0].data.push(value.length);
    }

    this.eventsSeries = newSeries;
    this.eventsOptions = {
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
      xaxis: {categories:this.rangeLabels}
    }
    this.eventsHeight = (this.rangeEventsVO.size*30)+120;
  }

  updateContentsChart(){
    const newSeries:any[] = [];
    const newContentLabels:string[] = [];

    for(let [key, value] of this.rangeContentsVO.entries()){
      const content = this.contents.find((content:IContentTypes)=>content.key === key);
      console.log('content : ', content)
      if(content){
        newContentLabels.push(content!.name);
        newSeries.push(value);
      }
    }

    this.contentsOptions = {
      title: {
        text: '컨텐츠 비율'
      },
      labels : newContentLabels,
      legend: {
        position: 'top'
      },
    }

    this.contentsSeries =  newSeries;
    this.contentsHeight = 400
  }

  updatePlacesChart(){
    const newSeries:any[] = [];
    
    const newPlaceLabels:string[] = []

    for(let [key, value] of this.rangePlacesVO.entries()){
      const place = this.places.find((place:IPlaceTypes)=>place.key === key);
      if(place){
        newPlaceLabels.push(place!.name);
        newSeries.push(value);
      }
    }

    this.placesOptions = {
      title: {
        text: '지역 비율'
      },
      labels: newPlaceLabels,
      legend: {
        position: 'top'
      },
    }
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
.custom-table {
  th,td {
    padding: 0 10px !important;
  }
}

.event_all_container {
  padding:1.5rem;
  display:flex;
  height:100%;
  align-items:flex-start;
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