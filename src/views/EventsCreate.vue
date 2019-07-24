<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <ProgressComp :propData="loading"></ProgressComp>
        <form id="create-meeting-dialog" class="ui form" @submit.prevent="putMeeting">
          <v-card>
            <v-card-title class="pb-0">
              <span class="headline">
                {{isNew ? "모임 생성" : "모임 수정"}}
              </span>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="computedDateFormatted"
                        label="모임 날짜"
                        required
                        readonly
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-validate="'required|min:1|max:20'"
                        v-model="meeting.title"
                        :counter="20"
                        :error-messages="errors.collect('title')"
                        label="타이틀"
                        data-vv-name="title"
                        clearable
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-select
                        v-validate="'required'"
                        v-model="meeting.place"
                        :items="placeList"
                        item-value="key"
                        item-text="name"
                        :error-messages="errors.collect('place')"
                        label="장소"
                        data-vv-name="place"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12>
                      <v-select
                        v-model="meeting.contents"
                        v-validate="'required|min:1'"
                        :error-messages="errors.collect('contents')"
                        :items="contentsList"
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
                            <v-icon :color="meeting.contents.length > 0 ? 'indigo darken-4' : ''">{{contentsCheckboxIcon}}</v-icon>
                          </v-list-tile-action>
                          <v-list-tile-title>
                            {{meeting.contents.length == contentsList.length ? 'Deselect All' : 'Select All'}}
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
                        v-model="meeting.members"
                        :items="memberList"
                        label="참여자"
                        data-vv-name="member"
                        item-value="key"
                        item-text="name"
                        chips
                        deletable-chips
                        multiple
                        dense
                        :messages="[`필수입력값이 아니므로 모임 생성 후 입력가능. ${meeting.members.length}명 선택`]"
                      >
                        <v-list-tile
                          slot="prepend-item"
                          
                          @click="toggleSelectAllMembers"
                        >
                          <v-list-tile-action>
                            <v-icon :color="meeting.members.length > 0 ? 'indigo darken-4' : ''">1{{membersCheckboxIcon}}</v-icon>
                          </v-list-tile-action>
                          <v-list-tile-title>
                            {{meeting.members.length == memberList.length ? 'Deselect All' : 'Select All'}}
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
                            <span>평균나이 : {{(joinMembersInfo.ageAverage/meeting.members.length).toFixed(2)}}살</span>
                          </v-flex>

                          <v-flex xs6 sm3 md2>
                            <span>운영진 : {{joinMembersInfo.adminCount}}명</span>
                          </v-flex>

                          <v-flex xs6 sm3 md2>
                            <span>일반회원 : {{joinMembersInfo.normalCount}}명</span>
                          </v-flex>

                          <v-flex xs6 sm3 md2>
                            <span>신입회원 :{{joinMembersInfo.newbieCount}}명</span>
                          </v-flex>

                          <v-flex xs6 sm3 md2>
                            <span>특수멤버 : {{joinMembersInfo.specialCount}}명</span>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <span>신입회원(미참여) : {{joinMembersInfo.perfectNewbieCount}}명</span>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <span>남자:{{rate[0]}}명 여자: {{rate[1]}}명</span>
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
import { MeetingService } from '../service/MeetingService';
import { MemberService } from '../service/MemberService';
import { PlaceService } from '../service/PlaceService';
import { ContentService } from '../service/ContentService';
import { Meeting }  from '../model/meeting.model';
// import { Member }  from '../model/member.model';
import ProgressComp from '../components/ProgressComp.vue';
import { debounce } from "typescript-debounce-decorator";

@Component({
  components : {
    ProgressComp
  }
})
export default class MeetingCreate extends Vue {
  @Prop() currentUser: any;
  @Prop() windowSize: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){
    // console.log('color : ', color);
    // console.log('text : ', text);
  }

  @Watch('meeting.members')
  joinMembersInfoChange(members){
    const today = parseInt(this.$moment(new Date()).format('YYYY'));
    this.joinMembersInfo = members.reduce((obj,member)=>{
      const joinMemberInfo = this.memberListObj[member];
      if(!joinMemberInfo){
        return obj
      }

      this.rate[joinMemberInfo.gender === 'M' ? 0:1]++;
      const age = 1+today - parseInt(this.$moment(joinMemberInfo.birth.toString()).format('YYYY'));
      obj.ageAverage+=age
      if(joinMemberInfo.grade === 0 || joinMemberInfo.grade === 1){
        obj.adminCount+=1
      } else if(joinMemberInfo.grade === 2){
        obj.normalCount+=1
      } else if(joinMemberInfo.grade === 3){
        obj.newbieCount+=1
      } else if(joinMemberInfo.grade === 4){
        obj.perfectNewbieCount+=1
      } else if(joinMemberInfo.grade === 5){
        obj.specialCount+=1
      }
      return obj
    },{
      ageAverage : 0,
      adminCount : 0,
      normalCount : 0,
      newbieCount : 0,
      perfectNewbieCount : 0,
      specialCount : 0,
    });

  }
  @Watch('currentUser')
  changeCurrentUser() {
    if(this.currentUser && !this.memberList.length){
        this.getMembers();
    }
  }
  get computedDateFormatted () {
    return this.$moment(this.params.key.toString()).format('YYYY-MM-DD');
  }
  get allContents () {
    return this.meeting.contents.length === this.contentsList.length
  }
  get someContents () {
    return this.meeting.contents.length > 0 && !this.allContents
  }
  get contentsCheckboxIcon () {
    if (this.allContents) return 'check_box'
    if (this.someContents) return 'indeterminate_check_box'
    return 'check_box_outline_blank'
  }
  get allMembers () {
    return this.meeting.members.length === this.memberList.length
  }
  get someMembers () {
    return this.meeting.members.length > 0 && !this.allMembers
  }
  get membersCheckboxIcon () {
    if (this.allMembers) return 'check_box'
    if (this.someMembers) return 'indeterminate_check_box'
    return 'check_box_outline_blank'
  }

  contentsList:any = []
  placeList:any[] = [];
  meeting:Meeting = new Meeting();
  meetingOrigin:Meeting = new Meeting();
  viewConfirmDelete:boolean = false;
  memberListObj:any[];
  memberList:any[] = [];
  loading:boolean = false;
  isNew:boolean = true;
  rate:Array<number> = [0,0];

  joinMembersInfo:any  = {
    ageAverage : 0,
    adminCount : 0,
    normalCount : 0,
    newbieCount : 0,
    perfectNewbieCount : 0,
    specialCount : 0,
  }


  @Watch('params.key')
  keyChange(){
    if(this.currentUser){
      this.getPlaces();
      this.getContents();
      this.getMembers();
      this.getMeeting();
    }
  }
  created(){
    if(this.currentUser){
      this.getPlaces();
      this.getContents();
      this.getMembers();
      this.getMeeting();
    }
  }
  getPlaces(){
    PlaceService.getPlaces()
    .then((snapShot:any)=>{
      if(snapShot){
        this.placeList = snapShot.val();
      }
    });
  }
  getContents(){
    ContentService.getContents()
    .then((snapShot:any)=>{
      if(snapShot){
        this.contentsList = snapShot.val();
      }
    });
  }
  getMeeting(){
    this.loading = true;
    MeetingService.getMeeting(this.params.key)
    .then((snapShot:any)=>{
      this.loading = false;
      let res = snapShot.val();
      if(res){
        this.meeting = new Meeting(
          res.title,
          res.place,
          res.contents,
          res.members
        );
        this.meetingOrigin = new Meeting(
          res.title,
          res.place,
          res.contents,
          res.members
        );
        this.isNew = false;
      } else {
        this.isNew = true;
      }
    })
  }
  getMembers(){
    MemberService.getMembers()
    .then((snapShot:any)=>{
      if(snapShot){
        let memberList = snapShot.val();
        this.memberListObj = memberList
        this.memberList = Object.keys(memberList).map(memberKey=>{
          return {
            "key" : memberKey,
            "name" : memberList[memberKey].name,
            "grade" : memberList[memberKey].grade,
            "birth" : memberList[memberKey].birth,
          }
        }).sort((a, b)=>{
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
      }
    });
  }
  goMeetings(){
    this.$router.push('/meetings');
  }
  @debounce(1000)
  putMeeting(){
    this.$validator.validateAll().then((result:any) => {
      if(result){
        if(this.currentUser){
          this.loading = true;
          MeetingService.getIdToken(this.currentUser).then(()=>{
            this.meeting.members;
            MeetingService.updateMeeting(this.params.key,this.meeting).then((res:any)=>{
              if(res){
                MemberService.updateMembersParticipation({
                  key : this.params.key,
                  members : this.meeting.members,
                  membersOrigin : this.meetingOrigin.members,
                  method : this.isNew ? 'post' : 'put'
                }).then((res:any)=>{
                  this.loading = false;
                  if(res){
                    this.showSnackbar('success', this.isNew ? '모임을 생성했습니다' : '모임을 수정했습니다');
                    this.goMeetings();
                  } else {
                    this.showSnackbar('error', this.isNew ? '모임을 생성 실패했습니다' : '모임수정을 실패했습니다');
                  }
                })
              } else {
                this.showSnackbar('error', this.isNew ? '모임을 생성 실패했습니다' : '모임수정을 실패했습니다');
              }
            },(err:any)=>{
              this.loading = false;
              // console.error(err);
              this.showSnackbar('error', this.isNew ? '모임을 생성 실패했습니다' : '모임수정을 실패했습니다');
            })
          },(err:any)=>{
            this.loading = false;
            // console.error(err);
            this.showSnackbar('error','권한이 없습니다.');
          });
        } else {
          this.showSnackbar('error','권한이 없습니다.');
        }
      }
    });
  }
  @debounce(1000)
  deleteMeeting(){
    this.viewConfirmDelete = false;
    if(this.currentUser && this.params.key){
      this.loading = true;
      MeetingService.getIdToken(this.currentUser).then((auth:any)=>{
        MeetingService.deleteMeeting(this.params.key,{auth}).then(()=>{
          MemberService.updateMembersParticipation({
            key : this.params.key,
            membersOrigin : this.meetingOrigin.members,
            method : 'delete'
          }).then((res:any)=>{
            this.loading = false;
            if(res){
              this.showSnackbar('success','모임을 삭제했습니다');
              this.goMeetings();
            } else {
              this.showSnackbar('error','모임을 삭제 실패했습니다');
            }
          })
          this.loading = false;
          this.showSnackbar('success','모임을 삭제했습니다');
          this.goMeetings();
        })
        .catch((err:any)=>{
          this.loading = false;
          console.error(err);
          this.showSnackbar('error','모임을 삭제 실패했습니다');
        });
      });
    } else {
      this.showSnackbar('error', '권한이 없습니다.');
    }
  }
  toggleSelectAllContents () {
    this.$nextTick(() => {
      if(this.allContents) {
        this.meeting.contents = []
      } else {
        this.meeting.contents = this.contentsList
      }
    })
  }
  toggleSelectAllMembers () {
    this.$nextTick(() => {
      if(this.allMembers) {
        this.meeting.members = []
      } else {
        this.meeting.members =  this.memberList.map(member=>{
          return member.key
        })//this.memberList
      }
    })
  }
}
</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
</style>