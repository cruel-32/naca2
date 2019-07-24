<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <ProgressComp :propData="loading"></ProgressComp>
        <v-card style="width: 100%;">
          <v-card-title class="pb-0">
            <span class="headline">
              <v-icon color="green">insert_chart</v-icon> {{this.params.YYYYMM}} 통계자료
              <router-link class="caption move-month" :to="{path:`/statistics/meetingsStatsDetail/${viewMonth(-1)}`}" >지난달</router-link>
              <router-link class="caption move-month" :to="{path:`/statistics/meetingsStatsDetail/${viewMonth(1)}`}" >다음달</router-link>
            </span>
          </v-card-title>
          <v-card-text class="pa-0">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 벙 목록 ({{dates && dates.length}} 번)</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs12 sm12 md12 v-for="(meeting,index) in dates" :key="index">
                        {{$moment(meeting).format('YYYY.MM.DD')}} -
                        <router-link v-if="meetingsMonth && meetingsMonth[meeting]" :to="{path:`/meeting/${meeting}`}">
                           {{meetingsMonth[meeting].title}}
                        </router-link>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 참석왕</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs6 sm6 md6 v-for="bestMember in bestMembers.slice(0,10)" :key="bestMember.content">
                        <router-link :to="{path:`/statistics/membersParti/${bestMember.member}`}">
                           <span>{{bestMember.name}}</span>
                        </router-link>  
                        <span>: <strong>{{bestMember.count}}</strong>번 </span>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 카테고리 순위</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs6 sm6 md6 v-for="bestCategory in bestCategories" :key="bestCategory.content">
                        <span>{{bestCategory.name}} : <strong>{{bestCategory.count}}</strong>번 </span>
                      </v-flex>
                    </v-layout>

                  </v-flex>
                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 장소</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs6 sm6 md6 v-for="bestPlace in bestPlaces" :key="bestPlace.content">
                        <span>{{bestPlace.name}} : <strong>{{bestPlace.count}}</strong>번 </span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { MeetingService } from '../service/MeetingService';
import { MemberService } from '../service/MemberService';
import { PlaceService } from '../service/PlaceService';
import { ContentService } from '../service/ContentService';
import ProgressComp from '../components/ProgressComp.vue';
import axios from 'axios';

@Component({
  components : {
    ProgressComp
  }
})
export default class MeetingsStats extends Vue {
  @Prop() currentUser: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){}

  loading:boolean = false;
  date:any = this.$moment(new Date).format('YYYY-MM-DD');
  dates:any = [];
  meetingsMonth:any = {};

  contents:any = [];
  places:any = [];
  memberList:any = [];

  bestCategories:Array<any> =[];
  bestPlaces:Array<any> =[];
  bestMembers:Array<any> =[];


  @Watch('params.YYYYMM')
  monthChange(){
    const {YYYYMM} = this.params;
    // this.getMeetingsMonth(this.$moment(YYYYMM)['_d']);
    this.getData();
  }

  created(){
    const {YYYYMM} = this.params;
    this.getData();
    // this.getMeetingsMonth(this.$moment(YYYYMM)['_d']);
  }
  reset(){
    this.dates = [];
    this.meetingsMonth = {};
    this.contents = [];
    this.places = [];
    this.memberList = [];
    this.bestCategories =[];
    this.bestPlaces = [];
    this.bestMembers =[];
  }

  viewMonth(month){
    const {YYYYMM} = this.params;
    return this.$moment(YYYYMM).add(month, 'months').format('YYYY-MM')
    // this.$router.push(`/statistics/meetingsStatsDetail/${this.$moment(YYYYMM).add(month, 'months').format('YYYY-MM')}`)
  }

  getData(){
    if(this.currentUser){
      this.reset();
      this.loading = true;

      axios.all([
        this.getMeetingsMonth(),
        this.getContents(),
        this.getPlaces(),
        this.getMembers(),
      ]).then(axios.spread((meetingsMonth, contents, places, members) => { 
        this.loading = false;
        this.meetingsMonth = meetingsMonth['val']();
        this.contents = contents['val']();
        this.places = places['val']();
        this.memberList = members['val']();
        this.dateSet();
      })).catch((error) => {
        this.showSnackbar('error', error);
        this.loading = false;
      })
    } else {
      this.showSnackbar('error','로그인이 필요합니다');
    }
  }

  getMeetingsMonth(){
    // this.reset();
    // this.loading = true;
    const {YYYYMM} = this.params;
    const date:string = this.$moment(this.$moment(YYYYMM)['_d']).format('YYYYMM');
    return MeetingService.getMeetings({
      startAt : `${date}01`,
      endAt : `${date}32`
    })
  }

  getContents(){
    return ContentService.getContents()
  }

  getPlaces(){
    return PlaceService.getPlaces()
  }

  getMembers(){
      return MemberService.getMembers()
  }
  dateSet(){
    this.dates = Object.keys(this.meetingsMonth);
    this.dates.forEach((meetingKey:any)=>{
      const meeting = this.meetingsMonth[meetingKey];

      meeting.contents.forEach(content=>{
        const bestCategory = this.bestCategories.find((item:any)=> item.content === content);
        if(bestCategory){
          bestCategory.count++
        } else {
          this.bestCategories.push({
            content,
            count : 1,
            name : this.contents.find((c:any)=>c.key == content).name
          })
        }
      });

      meeting.members.forEach(member=>{
        const bestMember = this.bestMembers.find((item:any)=> item.member === member);
        if(bestMember){
          bestMember.count++
        } else {
          const m = this.memberList[member];
          if(m){
            this.bestMembers.push({
              member,
              count : 1,
              name : m['name']
            })
          }
        }
      });


      const bestPlace = this.bestPlaces.find((item:any)=> item.place === meeting.place);
      if(bestPlace){
        bestPlace.count++
      } else {
        this.bestPlaces.push({
          place : meeting.place,
          count : 1,
          name : this.places.find((c:any)=>c.key == meeting.place).name
        })
      }
    })
    this.bestCategories.sort((a,b)=> b.count - a.count);
    this.bestMembers.sort((a,b)=> b.count - a.count);
    this.bestPlaces.sort((a,b)=> b.count - a.count);
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

.list {
  list-style-type: none;
}
.move-month {display:inline-block; margin:0 3px;}
</style>