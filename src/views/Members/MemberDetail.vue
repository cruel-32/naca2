<template>
  <div class="member_detail_container">
    <form id="create-meeting-dialog" class="ui form" @submit.prevent="updateMember">
      <v-card>
        <v-card-title class="pb-0">
          <h1 class="headline">
            <v-icon color="green">people</v-icon>
            <span v-if="params && params.key"><b @click="$router.push(`/dashboard/members/detail/${member.key}`)">{{member.name}}</b>님의 정보</span>
            <span v-else>신입 회원 정보 입력</span>
          </h1>
        </v-card-title>
        <v-card-text class="pa-0">
            <v-container grid-list-md>
              <v-layout wrap>

                <v-flex xs12 sm6 md4>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="viewJoinCalandar"
                    lazy
                    full-width
                  >
                    <v-text-field
                      slot="activator"
                      v-model="joinDateString"
                      v-validate="'required'"
                      label="가입일을 입력하세요"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="joinDateString"
                      @input="viewJoinCalandar = false"
                      full-width
                      locale="ko"
                      ></v-date-picker>
                  </v-menu>
                </v-flex>

                <v-flex xs12 sm6 md4>
                  <v-menu
                    ref="birthCalandar"
                    :close-on-content-click="false"
                    v-model="viewBirthCalandar"
                    lazy
                    full-width
                  >   
                    <v-text-field
                      slot="activator"
                      v-model="birthString"
                      label="생년월일을 입력하세요"
                      v-validate="'required'"
                      :error-messages="errors.collect('date')"
                      readonly
                      data-vv-name="birth"
                    ></v-text-field>
                    <v-date-picker
                      ref="birthPicker"
                      v-model="birthString"
                      max="1995-12-31"
                      min="1985-01-01"
                      full-width
                      locale="ko"
                      @input="viewBirthCalandar = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>

                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-validate="'required|min:2|max:10'"
                    v-model="member.name"
                    :counter="10"
                    :error-messages="errors.collect('name')"
                    label="이름"
                    data-vv-name="name"
                    clearable
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-validate="'required|min:2|max:20'"
                    v-model="member.address"
                    :counter="20"
                    :error-messages="errors.collect('address')"
                    label="사는곳"
                    data-vv-name="address"
                    clearable
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="member.job"
                    label="직업"
                    data-vv-name="job"
                    clearable
                  ></v-text-field>
                </v-flex>

                <!-- <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="gradeText"
                    label="등급"
                    readonly
                    disabled
                  ></v-text-field>
                </v-flex> -->

                <v-flex xs12 sm6 md4>
                  <v-select
                    v-model="member.grade"
                    :items="grades"
                    label="등급"
                    data-vv-name="grade"
                    item-value="grade"
                    item-text="name"
                    :error-messages="errors.collect('grade')"
                    dense
                    v-validate="'required|min:1'"
                  ></v-select>
                </v-flex>

                <v-flex xs12 sm6 md4 v-if="this.params && this.params.key">
                  <v-text-field
                    v-model="dPlusString"
                    :label="member.participation.length > 0? '마지막 이벤트 참석일로부터 D+XX' : '가입일로부터 D+XX' "
                    readonly
                    disabled
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md4 v-if="this.params && this.params.key">
                  <v-text-field
                    v-model="dMinusString"
                    label="강퇴까지 남은 일수 (D-XX)"
                    readonly
                    disabled
                  ></v-text-field>
                </v-flex>

                <!-- <v-flex xs12 sm6 md4 v-if="this.params && this.params.key && member.outDay">
                  <v-text-field
                    v-model="member.outDay"
                    label="탈퇴날짜"
                    readonly
                    disabled
                  ></v-text-field>
                </v-flex> -->

                <v-flex xs12 sm6 md6 v-if="params && params.key && member.participation.length > 0">
                  <v-subheader>처음 참여 이벤트 날짜</v-subheader>
                  <v-btn v-if="member.participation.length > 0"
                    class="custom-button"
                    color="success"
                    outline
                    depressed
                    block
                    @click="$router.push(`/events/detail/${member.firstDate.key}`)"
                  >{{firstDateString}} 이벤트 보러가기</v-btn>
                </v-flex>

                <v-flex xs12 sm6 md6 v-if="params && params.key && member.participation.length > 0">
                  <v-subheader>최근 참여 이벤트 날짜</v-subheader>
                  <v-btn v-if="member.participation.length > 0"
                    class="custom-button"
                    color="success"
                    outline
                    depressed
                    block
                    @click="$router.push(`/events/detail/${member.lastDate.key}`)"
                  >{{lastDateString}} 이벤트 보러가기</v-btn>
                </v-flex>

                <v-flex xs12 sm6 md4>
                  <v-radio-group v-model="member.gender" color='success' :row="true">
                    <v-radio
                      v-for="gender in genders"
                      :key="gender"
                      :label="`${gender === 'F' ? '여성' : '남성'}`"
                      :value="gender"
                    ></v-radio>
                  </v-radio-group>
                </v-flex>

              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="error"
              v-if="params && params.key"
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
                <v-card-title class="headline">정말 강퇴하시겠습니까?</v-card-title>
                <v-card-text>
                  회원을 강퇴합니다.
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
                    @click="deleteMember()"
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
              {{params && params.key ? 'Update' : 'Create'}}
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
import { classGrade } from '@/declare/enums/member';

import colors from 'vuetify/es5/util/colors';
import API_UTILS from '@/utils/API_UTILS'


interface HTMLInputEleBirthPicker extends HTMLInputElement{
  activePicker:string;
}

@Component
export default class MemberDetail extends Vue {
 
  public $refs!: {
    birthPicker: HTMLInputEleBirthPicker
  }

  //stores
  get contents(){return contentStore.contents}
  get grades(){return gradeStore.grades}
  get gradeInfoVO(){return gradeStore.gradeInfoVO}
  get gradeCountVO(){return gradeStore.gradeCountVO}
  get places(){return placeStore.places}
  get member(){return memberStore.member}
  get currentUser(){return accountStore.currentUser}
  get snackBar(){return dialogStore.snackBar}


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

  get firstDateString(){
    return this.$moment(this.member.firstDate.value.toString()).format('YYYY-MM-DD')
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

  //props
  @Prop() query: any;
  @Prop() params: any;

  @Watch('viewBirthCalandar')
  setActiveBirthPicker(){
    setTimeout(()=>{
      this.$refs.birthPicker.activePicker = 'YEAR';
    })
  }

  isNew:boolean = true;
  viewJoinCalandar:boolean = false;
  viewBirthCalandar:boolean = false;
  viewConfirmDelete:boolean = false;
  genders:Array<string> = ['F','M'];

  async created(){
    menuStore.setProgress(true);
    if(this.params && this.params.key){
      this.isNew = false;
    }
    if(this.query && this.query.date){
      this.member.joinDate = this.query.date;
    }
    Promise.all([
      gradeStore.getGrades(),
      memberStore.getMemberByKey(this.params ? this.params.key : ''),
    ]).then(async (done)=>{
      console.log('done : ', done);
      // memberStore.setMembersInfoByKeys( this.event.memberKeys );
      menuStore.setProgress(false);
    })
    menuStore.setProgress(false);
  }

  beforeDestroy(){
    memberStore.resetMember();
  }

  @debounce(1000)
  async updateMember(){
    menuStore.setProgress(true);
    this.$validator.validateAll().then(async (result:any) => {
      if(result){
        if(this.currentUser){
          const result = await memberStore.updateMember(this.member);
          if(result.snackColor === 'success'){
            dialogStore.showSnackbar({snackColor:'success',snackText:'등록되었습니다'});
            this.$router.push({
              name: 'members',
            });
          } else {
            dialogStore.showSnackbar({snackColor:'error',snackText:'실패했습니다'});
          }
        } else {
          dialogStore.showSnackbar({snackColor:'error',snackText:'권한이 없습니다'});
        }
      }
    })
    menuStore.setProgress(false);
  }

  @debounce(1000)
  async deleteMember(){
    menuStore.setProgress(true);
    if(this.currentUser){
      const result = await memberStore.deleteMember(this.member.key ? this.member.key : '');
      dialogStore.showSnackbar(result);
    } else {
      dialogStore.showSnackbar({snackColor:'error',snackText:'권한이 없습니다'});
    }
    this.viewConfirmDelete = false;
    this.$router.push({
      name : 'members'
    });
    menuStore.setProgress(false);
  }


}


</script>

<style scoped lang="scss">
.member_detail_container {
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
</style>