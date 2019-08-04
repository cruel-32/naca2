grad<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
          <v-card>
            <v-card-title class="pb-0">
              <span class="headline">
                <v-icon color="green">insert_chart</v-icon> {{member.name}}님의 통계
              </span>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-container grid-list-md>
                  <v-layout wrap>

                    <v-flex xs12 sm6 md6>
                      <v-subheader>최근 참여일</v-subheader>
                      <v-btn
                        outline
                        depressed
                        block
                        @click="goEventDetail(recentPartiDate.key)"
                      >
                        {{recentPartiDate.value}}
                      </v-btn>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-subheader>처음 참여일</v-subheader>
                      <v-btn
                        outline
                        depressed
                        block
                        @click="goEventDetail(firstPartiDate.key)"
                      >
                        {{firstPartiDate.value}}
                      </v-btn>
                    </v-flex>

                    <!-- <v-range-slider
                      v-model="range"
                      :max="max"
                      :min="min"
                      hide-details
                      class="align-center"
                    >
                      <template v-slot:prepend>
                        <v-text-field
                          v-model="range[0]"
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                      <template v-slot:append>
                        <v-text-field
                          v-model="range[1]"
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                    </v-range-slider> -->


                    <v-flex xs12 sm6 md6>
                      <v-subheader>최근</v-subheader>
                      <div id="chart"></div>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-card-text>

              <!-- <v-btn
                right
                @click="viewConfirmDelete = false"
                outline
                depressed
              >
                Cancel
              </v-btn> -->

          </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
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

  get recentPartiDate(){
    let recentPartiDate:KeyAndValue<string> = {
      key:'',
      value:'미참여'
    };

    if(this.member.participation && this.member.participation.length > 0){
      const firstEvent = this.events.find((event)=> event.key === this.member.participation[0].key)
      if(firstEvent){
        recentPartiDate = {
          key : firstEvent.key || '',
          value : `${this.$moment(firstEvent.date.toString()).format('YYYY-MM-DD')} - ${firstEvent.title}`,
        }
      }
    }
    return recentPartiDate
  }

  get firstPartiDate(){
    let recentPartiDate:KeyAndValue<string> = {
      key:'',
      value:'미참여'
    };

    if(this.member.participation && this.member.participation.length > 0){
      const firstEvent = this.events.find((event)=> event.key === this.member.participation[this.member.participation.length-1].key)
      if(firstEvent){
        recentPartiDate = {
          key : firstEvent.key || '',
          value : `${this.$moment(firstEvent.date.toString()).format('YYYY-MM-DD')} - ${firstEvent.title}`,
        }
      }
    }
    return recentPartiDate
  }

  //차트 관련
  chart:any;
  options:any = {
    chart: {
      type: 'line'
    },
    series: [{
      name: 'sales',
      data: [30,40,35,50,49,60,70,91,125]
    }],
    xaxis: {
      categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
    }
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
    const dateRange:DateRange = {
      startAt:20181001,
      endAt: parseInt(this.$moment(new Date()).format('YYYYMMDD')),
    }
    Promise.all([
      gradeStore.getGrades(),
      memberStore.getMembersInActive(),
      eventStore.getEventsRange(dateRange),
      memberStore.getMemberByKey(this.params ? this.params.key : ''),
    ]).then(async (done)=>{
      console.log('done : ', done);
      // memberStore.setMembersInfoByKeys( this.event.memberKeys );
      menuStore.setProgress(false);
    })
    menuStore.setProgress(false);
  }

  mounted(){
    console.log('this.$el : ', this.$el);
    this.chart = new ApexCharts(this.$el.querySelector("#chart"), this.options);
    this.chart.render();
  }

  beforeDestroy(){
    memberStore.resetMember();
  }

  goEventDetail(key:string){
    if(key){
      this.$router.push(`/event/detail/${key}`);
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
</style>