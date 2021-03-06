<template>
  <div class="event_detail_container">
    <form id="create-event-dialog" class="ui form" @submit.prevent="updateEvent">
      <v-card>
        <v-card-title class="pb-0">
          <strong class="headline">
            {{isNew ? "이벤트 생성" : "이벤트 수정"}}
          </strong>
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
                      v-model="selectedEventDate"
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
                  v-model="event.placeKeys"
                  :items="places"
                  label="장소"
                  data-vv-name="place"
                  item-value="key"
                  item-text="name"
                  chips
                  deletable-chips
                  :error-messages="errors.collect('place')"
                  multiple
                  dense
                  v-validate="'required|min:1'"
                ></v-select>
              </v-flex>

              <v-flex xs12>
                <v-select
                  v-validate="'required|min:1'"
                  :error-messages="errors.collect('contents')"
                  v-model="event.contentKeys"
                  :items="contents"
                  label="컨텐츠"
                  data-vv-name="contents"
                  item-value="key"
                  item-text="name"
                  chips
                  deletable-chips
                  multiple
                  dense
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
                  data-vv-name="members"
                  item-value="key"
                  item-text="name"
                  chips
                  deletable-chips
                  multiple
                  dense
                  :messages="[`필수입력값이 아니므로 이벤트 생성 후 입력가능. ${event.memberKeys ? event.memberKeys.length : 0}명 선택`]"
                >
                  <v-list-tile
                    slot="prepend-item"
                    @click="toggleSelectAllMembers"
                  >
                    <v-list-tile-action>
                      <v-icon :color="event.memberKeys && event.memberKeys.length > 0 ? 'indigo darken-4' : ''">{{membersCheckboxIcon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>
                      {{event.memberKeys && event.memberKeys.length == members.length ? 'Deselect All' : 'Select All'}}
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
                  <span class="title">이 날의 이벤트정보</span>
                </v-card-title>
                <v-container grid-list-md>
                  <v-layout wrap>

                    <v-flex xs12 sm12 md12>
                      <span>평균나이 : {{event.memberKeys && ageVO.get('total') > 0? (ageVO.get('total')/ event.memberKeys.length).toFixed(2) : 0}} 살 </span>
                    </v-flex>

                    <v-flex xs6 sm3 md2>
                      <span>운영진 : {{gradeCountVO.get(0) + gradeCountVO.get(1)}}명</span>
                    </v-flex>

                    <v-flex xs6 sm3 md2>
                      <span>일반회원 : {{gradeCountVO.get(2)}}명</span>
                    </v-flex>

                    <v-flex xs6 sm3 md2>
                      <span>신입회원 :{{gradeCountVO.get(3)}}명</span>
                    </v-flex>

                    <v-flex xs6 sm3 md2>
                      <span>특수회원 : {{gradeCountVO.get(5)}}명</span>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <span>준회원 : {{gradeCountVO.get(4)}}명</span>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <span>남자:{{genderCountVO.get('M')}}명 여자: {{genderCountVO.get('F')}}명</span>
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
                이 이벤트를 삭제하면 복구할 수 없습니다.
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
                  @click="deleteEvent()"
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
  </div>
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

import API_UTILS from '@/utils/API_UTILS'

@Component
export default class EventDetail extends Vue {
  //stores
  get contents(){return contentStore.contents}
  get grades(){return gradeStore.grades}
  get gradeInfoVO(){return gradeStore.gradeInfoVO}
  get gradeCountVO(){return gradeStore.gradeCountVO}
  get places(){return placeStore.places}
  get event(){return eventStore.event}
  get members(){return memberStore.members}
  get ageVO(){return memberStore.ageVO}
  get genderCountVO(){return memberStore.genderCountVO}
  get currentUser(){return accountStore.currentUser}
  get snackBar(){return dialogStore.snackBar}

  //props
  @Prop() query: any;
  @Prop() params: any;

  //local data
  // eventDate:string = '';
  // selectedEventDate:string = '';
  showEventDate:boolean = false;
  isNew:boolean = true;
  viewConfirmDelete:boolean = false;

  //computed
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

  get selectedEventDate(){
    return this.$moment(this.event.date.toString()).format('YYYY-MM-DD')
  }

  set selectedEventDate(YYYY_MM_DD:string){
    this.event.date = parseInt(this.$moment(YYYY_MM_DD).format('YYYYMMDD'));
  }

  @Watch('event.memberKeys') setCountVO(memberKeys:string[]){
    console.log('setCountVO : ', memberKeys);
    memberStore.setMembersInfoByKeys(memberKeys);
  }

  async created(){
    menuStore.setProgress(true);
    if(this.params && this.params.key){
      this.isNew = false;
    }
    if(this.query && this.query.date){
      this.event.date = parseInt(this.query.date.split('-').join(''));
    }

    Promise.all([
      contentStore.getContents(), 
      placeStore.getPlaces(),
      memberStore.getMembersInActive(),
      eventStore.getEventByKey(this.params ? this.params.key : '')
    ]).then(async (done)=>{
      memberStore.setMembersInfoByKeys( this.event.memberKeys );
      menuStore.setProgress(false);
    })
  }

  beforeDestroy(){
    eventStore.resetEvent();
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
        this.event.memberKeys =  this.members.map(member=>member.key || '');
      }
    })
  }

  @debounce(1000)
  updateEvent(e:any){
    menuStore.setProgress(true);
    this.$validator.validateAll().then(async (result:any) => {
      if(result){
        if(this.currentUser){
          const result = await eventStore.updateEvent(this.event);
          if(result.key){
            dialogStore.showSnackbar({snackColor:'success',snackText:'등록되었습니다'});
            this.$router.push({
              name: 'events',
            });
          } else {
            dialogStore.showSnackbar({snackColor:'error',snackText:'실패했습니다'});
          }
          
        } else {
          dialogStore.showSnackbar({snackColor:'error',snackText:'권한이 없습니다'});
        }
      }
    });
    menuStore.setProgress(false);
  }

  @debounce(1000)
  async deleteEvent(){
    menuStore.setProgress(true);
    if(this.event.key){
      const result:ISnackbarTypes = await eventStore.deleteEvent(this.event.key);
      dialogStore.showSnackbar(result);
    } else {
      dialogStore.showSnackbar({
        snackColor : 'error',
        snackText : '삭제실패했습니다'
      });
    }
    this.viewConfirmDelete = false;
    this.$router.push({
      name : 'events'
    });
    menuStore.setProgress(false);
  }

}
</script>

<style scoped lang="scss">
.event_detail_container {
  display:flex;
  height:100%;
  align-items:center;
}
.v-card {
  box-shadow:none;
}
</style>