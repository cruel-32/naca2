<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <ProgressComp :propData="loading"></ProgressComp>
        <v-card style="width: 100%;">
          <v-card-title class="pb-0">
            <span class="headline">
              <v-icon color="green">insert_chart</v-icon> {{member ? member.name : ''}}님의 통계자료
            </span>
          </v-card-title>
          <v-card-text class="pa-0">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">처음 벙 참여일</strong>
                    <router-link v-if="firstMeeting" :to="{path:firstMeeting.link}">{{firstMeeting.date}} {{firstMeeting.name}}</router-link>
                    <div v-else>
                      <span>참여한 벙이 없습니다.</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">최근 벙 참여일</strong>
                    <router-link v-if="lastMeeting" :to="{path:lastMeeting.link}">{{lastMeeting.date}} {{lastMeeting.name}}</router-link>
                    <div v-else>
                      <span>참여한 벙이 없습니다.</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">벙 참여 횟수</strong>
                    <span>{{meetingCount}} 번</span>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">가장 많이 본 사람 5명</strong>
                    <ul class="member-list" v-if="mostMembers.length">
                      <li v-for="mostMember in mostMembers" :key="mostMember.key">
                        <router-link :to="{path:`/statistics/membersParti/${mostMember.key}`}">{{mostMember.name}}</router-link>
                        <span> : {{mostMember.count}}번</span>
                      </li>
                    </ul>
                    <div v-else>
                      <span>만난 사람이 없습니다.</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">가장 적게 본 사람 {{leastCount}} 번</strong>
                    <ul class="member-list" v-if="leastMembers.length">
                      <li v-for="leastMember in leastMembers" :key="leastMember.key">
                        <router-link :to="{path:`/statistics/membersParti/${leastMember.key}`}">{{leastMember.name}}</router-link>
                      </li>
                    </ul>
                    <div v-else>
                      <span>만난 사람이 없습니다.</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">한번도 못 본 사람</strong>
                    <ul class="member-list" v-if="neverSeenMembers.length">
                      <li v-for="neverSeenMember in neverSeenMembers" :key="neverSeenMember.key">
                        <router-link :to="{path:`/statistics/membersParti/${neverSeenMember.key}`}">{{neverSeenMember.name}}</router-link>
                      </li>
                    </ul>
                    <div v-else>
                      <span>만난 사람이 없습니다.</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">참여한 모든 벙 보기</strong>
                    <ul class="member-list w100" v-if="participatedMeetings.length">
                      <li v-for="participatedMeeting in participatedMeetings" :key="participatedMeeting.date">
                        <span>{{participatedMeeting.date}}</span> - <router-link :to="{path:`/meeting/${participatedMeeting.key}`}">{{participatedMeeting.title}}</router-link>
                      </li>
                    </ul>
                    <div v-else>
                      <span>만난 사람이 없습니다.</span>
                    </div>
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
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { MemberService } from '../service/MemberService';
import { MeetingService } from '../service/MeetingService';
import ProgressComp from '../components/ProgressComp.vue';
// import Meeting from './Meetings.vue';

@Component({
  components : {
    ProgressComp
  }
})
export default class MembersParti extends Vue {
  @Prop() windowSize: any;
  @Prop() currentUser: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){
    // console.log('color : ', color);
    // console.log('text : ', text);
  }
  @Watch('currentUser')
  changedUser(){
    if(this.currentUser && !this.member){
      this.getMembersAndMeetings();
    }
  }
  @Watch('$route')
  changeRoute(){
    this.cleanMemberStats();
    this.setMemberStats();
  }
  loading:boolean = false;
  member:any = null;
  membersObj:any = null;
  meetings:any = null;
  firstMeeting:any = null;
  lastMeeting:any = null;
  meetingCount:any = null;
  participatedMeetings:any = [];
  mostMembers: any=[];
  leastMembers:any = [];
  neverSeenMembers:any = [];

  leastCount:number = 0;
  mostCount:number = 0;

  created(){
    if(this.currentUser){
      this.getMembersAndMeetings();
    }
  }
  cleanMemberStats(){
    this.participatedMeetings = [];
    this.mostMembers = [];
    this.leastMembers = [];
    this.neverSeenMembers = [];
  }

  setMemberStats(){
    const memberKeys = Object.keys(this.membersObj);
    const memberKey = memberKeys.find((memberKey:any)=>{
      return memberKey === this.params.key;
    }) || this.params.key;
    const member = this.membersObj[memberKey];
    this.member = member;

    //최근벙
    if(member.participation){
      const participationKeys = Object.keys(member.participation);
      participationKeys.sort((a:any,b:any)=>{
        return b-a;
      });
      if(participationKeys.length){
        this.firstMeeting = {
          link : `/meeting/${participationKeys[participationKeys.length-1]}`,
          date : this.$moment(participationKeys[participationKeys.length-1]).format('YYYY.MM.DD'),
          name : this.meetings[participationKeys[participationKeys.length-1]].title
        }
        this.lastMeeting = {
          link : `/meeting/${participationKeys[0]}`,
          date : this.$moment(participationKeys[0]).format('YYYY.MM.DD'),
          name : this.meetings[participationKeys[0]].title
        }
        this.meetingCount = participationKeys.length;

        const seenMembers = [];
        participationKeys.forEach((participationKey:any)=>{
          if(this.meetings[participationKey]){
            const participatedMeeting = this.meetings[participationKey];
            this.participatedMeetings.push({
              key : participationKey,
              date : this.$moment(participationKey.toString()).format('YYYY.MM.DD'),
              title : participatedMeeting.title
            });
            participatedMeeting.members.forEach((seenMember:any)=>{
              if(seenMember !== this.params.key){
                let seenMemberInfo = seenMembers.find((sm:any)=>{
                  return sm['key'] === seenMember
                });
                if(seenMemberInfo){
                  seenMemberInfo['count']+=1;
                } else {
                  if(this.membersObj[seenMember]){
                    seenMembers.push({
                      count : 1,
                      key : seenMember,
                      name : this.membersObj[seenMember].name
                    })
                  }
                }
              }
            });
          }
        });
        seenMembers.sort((a:any,b:any)=>{
          return a.count - b.count;
        });

        if(seenMembers.length){
          this.leastCount = seenMembers[0].count;
          this.mostCount = seenMembers[seenMembers.length-1].count;
          this.mostMembers = seenMembers.slice(-5,seenMembers.length).reverse();

          if(this.leastCount === this.mostCount){
            this.mostMembers = seenMembers;
            this.leastMembers = seenMembers;
          } else {
            seenMembers.forEach((sm:any)=>{
              if(sm.count === this.leastCount){
                this.leastMembers.push(sm);
              }
            });
          }
          this.neverSeenMembers = memberKeys.reduce((prev:any, memberKey:any)=>{
          
            if(!seenMembers.find((seenMember:any)=>{
              return memberKey === seenMember.key; 
            })){
              if(memberKey !== this.params.key){
                const memberObj = this.membersObj[memberKey];
                prev.push({
                  key : memberKey,
                  name : memberObj.name
                });
              }
            }
            return prev;
          },[]);

        }
      }
    }
    this.loading = false;

  }  

  getMembersAndMeetings(){
    this.loading = true;
    this.cleanMemberStats();
    MemberService.getMembers({}).then((membersSnapShot:any)=>{
      MeetingService.getMeetings({}).then((meetingsSnapShot:any)=>{
        this.membersObj = membersSnapShot.val();
        this.meetings = meetingsSnapShot.val();
        this.setMemberStats();
      }).catch((err:any)=>{
        // console.log("err : ", err);
        this.loading = false;
        this.showSnackbar('error',`모임 정보를 불러올 수 없습니다`);
      })
    }).catch((err:any)=>{
      // console.log("err : ", err);
      this.loading = false;
      this.showSnackbar('error', `회원 정보를 불러올 수 없습니다`);
    });
  }
}
</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
strong.cus-title {
  display:block;
}
.member-list {
  display:flex;
  flex-wrap: wrap;
  padding:0;
  &.w100 {
    li {
      flex-basis:100%;
    }
  }
  li {
    padding:2px;
    list-style: none;
    flex-basis:33%;
  }
}
</style>