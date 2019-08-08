<template>
  <v-layout column align-center>
    <v-container grid-list-md>
      <v-layout wrap pt-3>
      
        <v-flex xs12 sm12 md12 >
          <h1 class="headline">
            <v-icon color="green">insert_chart</v-icon> 전체 회원 통계
          </h1>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <apexchart type="donut" :options="genderOptions"  :height="genderHeight" :series="genderSeries"></apexchart>
        </v-flex>

        <v-flex xs12 sm6 md6>
          <apexchart type="bar" :options="ageOptions"  :height="ageHeight" :series="ageSeries"></apexchart>
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

  today:any = this.$moment(new Date());

  //날짜가 바뀌면 reset해주어야 하는 info
  genderVO:Map<string,number> = new Map();
  ageVO:Map<string,number> = new Map();

  genderSeries:any[] = [];
  genderHeight:any = 'auto';
  genderOptions:any  = {
    title: {
      text: '전체 남녀 성비'
    },
    legend: {
      position: 'top'
    },
  }

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

  setDashboardData(){
    menuStore.setProgress(true);
    this.setChartCommonInfo();
    this.updateGenderChart();
    this.updateAgeChart();

    menuStore.setProgress(false);
  }

  resetChartCommonInfo(){
    this.genderVO = new Map();
  }

  setChartCommonInfo(){
    this.members.forEach((member:MemberTypes)=>{
      const gender = this.genderVO.get(member.gender);
      const genderAge = this.ageVO.get(member.gender);
      const age:number = this.today.diff(this.$moment(member.birth.toString()), 'years')+1;

      this.genderVO.set(member.gender, (gender || 0) + 1);
      this.ageVO.set(member.gender, (genderAge ||0 ) + age);
    })
  }
  
  async created(){
    menuStore.setProgress(true);
    Promise.all([
      contentStore.getContents(), 
      placeStore.getPlaces(),
      memberStore.getMembersInActive(),
      memberStore.getMemberByKey(this.params ? this.params.key : ''),
    ]).then(async (done)=>{
      console.log('done : ', done);
      // memberStore.setMembersInfoByKeys( this.event.memberKeys );
      this.setDashboardData();
      menuStore.setProgress(false);
    })
  }

  updateGenderChart(){
    const newSeries:any[] = [];
    const newGenderLabels:string[] = [];

    for(let [key,value] of this.genderVO){
      newSeries.push(value)
      newGenderLabels.push(key === 'F' ? "여자" : "남자");
    }

    console.log('newGenderLabels : ', newGenderLabels);

    this.genderSeries = newSeries;
    this.genderOptions.labels = newGenderLabels;
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
</style>