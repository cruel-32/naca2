<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <form id="create-event-dialog" class="ui form" @submit.prevent="postEvent">
          <v-card>
            <v-card-title class="pb-0">
              <span class="headline">
                {{isNew ? "이벤트 생성" : "이벤트 수정"}}
              </span>
            </v-card-title>
          
            <v-card-text class="pa-0">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-menu
                      v-model="showEventDate"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="eventDate"
                          label="Date (read only text field)"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="selectedEventDate" no-title @input="showEventDate = false"></v-date-picker>
                    </v-menu>
                 </v-flex>

                  <!-- <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="eventDate"
                      label="이벤트 날짜"
                      required
                      readonly
                      disabled
                    ></v-text-field>
                  </v-flex> -->
                  
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-validate="'required|min:1|max:20'"
                      v-model="event.title"
                      :counter="20"
                      label="타이틀"
                      data-vv-name="title"
                      :error-messages="errors.collect('title')"
                      clearable
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-select
                      v-validate="'required|min:1'"
                      v-model="event.placeKeys"
                      :items="places"
                      item-value="key"
                      item-text="name"
                      :error-messages="errors.collect('place')"
                      label="장소"
                      data-vv-name="place"
                      multiple
                    ></v-select>
                  </v-flex>

                  <v-flex xs12>
                    <v-select
                      v-model="event.contentKeys"
                      v-validate="'required|min:1'"
                      :error-messages="errors.collect('contents')"
                      :items="contents"
                      item-value="key"
                      item-text="name"
                      label="컨텐츠"
                      data-vv-name="contents"
                      deletable-chips
                      multiple
                    >
                      <v-list-tile
                        slot="prepend-item"
                        
                        @click="toggleSelectAllContents"
                      >
                        <v-list-tile-action>
                          <v-icon :color="event.contentKeys && event.contentKeys.length > 0 ? 'indigo darken-4' : ''">{{contentsCheckboxIcon}}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>
                          {{event.contentKeys && event.contentKeys.length === contents.length ? 'Deselect All' : 'Select All'}}
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-divider
                        slot="prepend-item"
                        class="mt-2"
                      ></v-divider>
                      <v-divider
                        slot="append-item"
                        class="mb-2"
                      ></v-divider>
                    </v-select>
                  </v-flex>

                  <v-flex xs12>
                    <v-select
                      v-model="event.memberKeys"
                      :items="members"
                      label="참여자"
                      data-vv-name="member"
                      item-value="uid"
                      item-text="name"
                      chips
                      deletable-chips
                      multiple
                      dense
                      :messages="[`필수입력값이 아니므로 모임 생성 후 입력가능. ${event.memberKeys ? event.memberKeys.length : 0}명 선택`]"
                    >
                      <v-list-tile
                        slot="prepend-item"
                        
                        @click="toggleSelectAllMembers"
                      >
                        <v-list-tile-action>
                          <v-icon :color="event.members && event.members.length > 0 ? 'indigo darken-4' : ''">1{{membersCheckboxIcon}}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title>
                          {{event.members && event.members.length == memberList.length ? 'Deselect All' : 'Select All'}}
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-divider
                        slot="prepend-item"
                        class="mt-2"
                      ></v-divider>
                      <v-divider
                        slot="append-item"
                        class="mb-2"
                      ></v-divider>
                    </v-select>
                  </v-flex>

                  <v-card>
                    <v-card-title class="pb-0">
                      <span class="title">이 날의 모임정보</span>
                    </v-card-title>
                    <v-container grid-list-md>
                      <v-layout wrap>

                        <v-flex xs12 sm12 md12>
                          <span>평균나이 : {{joinedMemberInfo.totalAge && event.memberKeys ? (joinedMemberInfo.totalAge/event.memberKeys.length).toFixed(2) : 0}} 살 </span>
                        </v-flex>

                        <v-flex xs6 sm3 md2>
                          <span>운영진 : {{joinedMemberInfo.adminCount}}명</span>
                        </v-flex>

                        <v-flex xs6 sm3 md2>
                          <span>일반회원 : {{joinedMemberInfo.normalCount}}명</span>
                        </v-flex>

                        <v-flex xs6 sm3 md2>
                          <span>신입회원 :{{joinedMemberInfo.newbieCount}}명</span>
                        </v-flex>

                        <v-flex xs6 sm3 md2>
                          <span>특수멤버 : {{joinedMemberInfo.specialCount}}명</span>
                        </v-flex>

                        <v-flex xs12 sm12 md12>
                          <span>신입회원(미참여) : {{joinedMemberInfo.pnewbieCount}}명</span>
                        </v-flex>

                        <v-flex xs12 sm12 md12>
                          <span>남자:{{joinedMemberInfo.maleCount}}명 여자: {{joinedMemberInfo.femaleCount}}명</span>
                        </v-flex>

                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="error"
                v-if="!isNew"
                @click="viewConfirmDelete = true"
                depressed
                outline
              >
                Delete
              </v-btn>
              <v-dialog
                v-model="viewConfirmDelete"
              >
                <v-card>
                  <v-card-title class="headline">정말 지우시겠습니까?</v-card-title>
                  <v-card-text>
                    이 모임을 삭제하면 복구할 수 없습니다.
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      right
                      @click="viewConfirmDelete = false"
                      outline
                      depressed
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      right
                      color="red darken-1"
                      @click="deleteMeeting()"
                      outline
                      depressed
                    >
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                type="submit"
                outline
                depressed
              >
                {{isNew ? 'Create' : 'Update'}}
              </v-btn>
            </v-card-actions>

          </v-card>
        </form>
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
import { debounce } from "typescript-debounce-decorator";

import colors from 'vuetify/es5/util/colors';
import API_UTILS from '@/api/API_UTILS'
import events from '../../api/events';

interface joinedMembers {
  totalAge:number;
  adminCount:number;
  normalCount:number;
  specialCount:number;
  newbieCount:number;
  pnewbieCount:number;
  maleCount:number;
  femaleCount:number;
}

@Component
export default class EventDetail extends Vue {
  @Prop() query: any;

  //stores
  get contents(){return contentStore.contents}
  get grades(){return gradeStore.grades}
  get places(){return placeStore.places}
  get event(){return eventStore.event}
  get members(){return memberStore.members}
  get currentUser(){return accountStore.currentUser}

  get someContents (){return this.event.contentKeys && this.event.contentKeys.length > 0 && !this.allContents}
  get allContents (){return this.event.contentKeys && this.event.contentKeys.length === this.contents.length}
  get allMembers (){return this.event.memberKeys && this.event.memberKeys.length === this.members.length}
  get someMembers (){return this.event.memberKeys && this.event.memberKeys.length > 0 && !this.allMembers}
  get contentsCheckboxIcon (){
    if (this.allContents) return 'check_box'
    if (this.someContents) return 'indeterminate_check_box'
    return 'check_box_outline_blank'
  }
  get membersCheckboxIcon () {
    if (this.allMembers) return 'check_box'
    if (this.someMembers) return 'indeterminate_check_box'
    return 'check_box_outline_blank'
  }

  //local data
  @Watch('selectedEventDate') setEventDate(date:string){
    this.eventDate = date;
  }

  eventDate:string = '';
  selectedEventDate:string = '';
  showEventDate:boolean = false;
  isNew:boolean = false;
  viewConfirmDelete:boolean = false;
  joinedMemberInfo:joinedMembers = {
    totalAge : 0,
    adminCount : 0,
    normalCount : 0,
    specialCount : 0,
    newbieCount : 0,
    pnewbieCount : 0,
    maleCount : 0,
    femaleCount : 0,
  };


  @Watch('event.memberKeys')
  getJoinedMemberInfo(){
    const today:number = parseInt(this.$moment(new Date()).format("YYYY"));
    const joinedMembersInfo:joinedMembers = {
      totalAge : 0,
      adminCount : 0,
      normalCount : 0,
      specialCount : 0,
      newbieCount : 0,
      pnewbieCount : 0,
      maleCount : 0,
      femaleCount : 0,
    };

    if(Array.isArray(this.event.memberKeys)){
      this.joinedMemberInfo = this.event.memberKeys.reduce((newJoinedMembersInfo:joinedMembers, memberKey:string):joinedMembers=>{
        const member:MemberTypes|undefined = this.members.find((member:MemberTypes)=>member.uid === memberKey);
        if(member){
          //이 날 참석한 회원들의 등급을 분류해서 카운팅하기
          if(member.grade === 0 || member.grade === 1){
            newJoinedMembersInfo.adminCount+=1
          } else if(member.grade === 5){
            newJoinedMembersInfo.specialCount+=1
          } else {
            const joinCount = (member.eventsKeys.length - 1);
            if(joinCount >= 4){
              newJoinedMembersInfo.normalCount+=1
            } else if(joinCount >= 1){
              newJoinedMembersInfo.newbieCount+=1
            } else if(joinCount === 0){
              newJoinedMembersInfo.pnewbieCount+=1
            }
          }

          //나이 총합 구하기
          joinedMembersInfo.totalAge += (1+today - parseInt(member.birth.toString().slice(0,4)));

          //성별 구하기
          member.gender === 'M' ? newJoinedMembersInfo.maleCount+=1 : newJoinedMembersInfo.femaleCount+=1;
        }
        return newJoinedMembersInfo
      } ,joinedMembersInfo);
    }
  }
  
  async created(){
    if(!this.contents.length) contentStore.getContents();
    if(!this.places.length) placeStore.getPlaces();
    if(!this.grades.length) gradeStore.getGrades();
    if(!this.members.length) memberStore.getMembers();
    if(this.$route.name === 'eventCreate'){
      this.reset();
      this.selectedEventDate = this.query.date;
      this.isNew = true;
    } else {
      const {uid} = this.$route.params;
        await eventStore.getEventByUid(uid),
        this.getJoinedMemberInfo();
        this.selectedEventDate = this.event.date && this.$moment(this.event.date.toString()).format('YYYY-MM-DD')
    }
  }

  toggleSelectAllContents () {
    this.$nextTick(() => {
      if(this.allContents) {
        this.event.contentKeys = [];
      } else {
        this.event.contentKeys = this.contents.map(content=>content.key);
      }
    })
  }

  toggleSelectAllMembers () {
    this.$nextTick(() => {
      if(this.allMembers) {
        this.event.memberKeys = []
      } else {
        this.event.memberKeys =  this.members.map(member=>member.uid);
      }
    })
  }

  postEvent(e:any){
    console.log('e : ', e);
    console.log('this.isNew : ', this.isNew);
  }

  reset(){
    console.log('reset');
    eventStore.resetEvent();
  }

  @debounce(1000)
  deleteMeeting(e:any){
    console.log('deleteMeeting e : ', e);
  }
}
</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
</style>