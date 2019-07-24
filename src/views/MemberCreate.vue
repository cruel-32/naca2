<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <ProgressComp :propData="loading"></ProgressComp>
        <form id="create-meeting-dialog" class="ui form" @submit.prevent="putMember">
          <v-card>
            <v-card-title class="pb-0">
              <span class="headline">
                <v-icon color="green">people</v-icon> {{params.key ? "회원정보 수정": "신입 회원정보 입력"}}
              </span>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-menu
                        :close-on-content-click="false"
                        v-model="viewJoinDate"
                        lazy
                        full-width
                      >
                        <v-text-field
                          slot="activator"
                          v-model="joinDate"
                          label="가입일을 입력하세요"
                          readonly
                        ></v-text-field>
                        <v-date-picker
                          v-model="joinDate"
                          @input="viewJoinDate = false"
                          full-width
                          locale="ko"
                          ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <!-- :nudge-right="40" -->
                      <v-menu
                        ref="birthMenu"
                        :close-on-content-click="false"
                        v-model="viewBirth"
                        lazy
                        full-width
                      >   
                        <v-text-field
                          slot="activator"
                          v-model="birth"
                          label="생년월일을 입력하세요"
                          v-validate="'required'"
                          :error-messages="errors.collect('date')"
                          readonly
                          data-vv-name="birth"
                        ></v-text-field>
                        <v-date-picker
                          ref="picker"
                          v-model="birth"
                          max="1995-12-31"
                          min="1985-01-01"
                          full-width
                          locale="ko"
                          @change="saveBirth"
                        ></v-date-picker>
                        <!-- new Date().toISOString().substr(0, 10) -->
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
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="grade"
                        label="등급"
                        readonly
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4 v-if="this.params.key">
                      <v-text-field
                        v-model="lastDay"
                        label="최근 참여 벙 날짜"
                        readonly
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4 v-if="this.params.key && !member.outDay">
                      <v-text-field
                        v-model="exitDay"
                        label="강퇴까지 남은 일수 (D-XX)"
                        readonly
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4 v-if="this.params.key && member.outDay">
                      <v-text-field
                        v-model="outDay"
                        label="탈퇴날짜"
                        readonly
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-radio-group v-model="member.gender" color='success' :row="true">
                        <v-radio
                          v-for="gender in genderList"
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
                  v-if="params.key"
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
                  {{!params.key ? 'Create' : 'Update'}}
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
import { MemberService } from '../service/MemberService';
import { Member }  from '../model/member.model';
import ProgressComp from '../components/ProgressComp.vue';
import { debounce } from "typescript-debounce-decorator";
import {exitDay} from '../helper/memberExitDay.js'

@Component({
  components : {
    ProgressComp
  }
})
export default class MemberCreate extends Vue {
  @Prop() currentUser: any;
  @Prop() windowSize: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){}

  @Watch('currentUser')
    changeCurrentUser() {
  }
  @Watch('viewBirth')
  setYear(val:any) {
    val && this.$nextTick(() => (this.$refs.picker['activePicker'] = 'YEAR'))
  }
  genderList:Array<string> = ['F','M'];
  joinDate:any = this.$moment(new Date).format('YYYY-MM-DD');
  birth:any = this.$moment(new Date).format('YYYY-MM-DD');
  outDay:any = null;
  grade:any = "신입(미참석)";
  loading:boolean = false;
  exitDay:any = '';
  viewConfirmUpdate:boolean = false;
  viewConfirmDelete:boolean = false;
  viewJoinDate:boolean = false;
  viewBirth:boolean = false;
  lastDay:string = '';
  member:Member = new Member(
    '',
    parseInt(this.$moment(new Date).format('YYYYMMDD')),
    this.query.joinDate || parseInt(this.$moment(new Date).format('YYYYMMDD')),
    ''
  );;
  memberOrigin:Member;

  created(){
    // this.getPlaces();
    // this.getContents();
    if(this.params.key){
      if(this.currentUser){
        this.getMember()
      } else {
        this.showSnackbar('error','로그인이 필요합니다');
      }
    }
  }
  setMemberInfo(memberInfo:any){
    this.member = new Member(
      memberInfo.address,
      memberInfo.birth,
      memberInfo.joinDate,
      memberInfo.name,
      memberInfo.job,
      memberInfo.mail,
      memberInfo.grade,
      memberInfo.participation,
      memberInfo.phone,
      memberInfo.outDay,
      memberInfo.gender,
    );
    this.memberOrigin = new Member(
      memberInfo.address,
      memberInfo.birth,
      memberInfo.joinDate,
      memberInfo.name,
      memberInfo.job,
      memberInfo.mail,
      memberInfo.grade,
      memberInfo.participation,
      memberInfo.phone,
      memberInfo.outDay,
      memberInfo.gender
    )
    this.birth = this.$moment(memberInfo.birth.toString()).format('YYYY-MM-DD');
    this.joinDate = this.$moment(memberInfo.joinDate.toString()).format('YYYY-MM-DD');
    if(memberInfo.outDay){this.outDay = this.$moment(memberInfo.outDay.toString()).format('YYYY-MM-DD')}
  }
  getMember(){
    this.loading = true;
    MemberService.getMember(this.params.key).then((snapShot:any)=>{
      this.loading = false;
      let member = snapShot.val();
      this.setMemberInfo(member)
      
      let memberPart = member.participation;
      if(memberPart){
        let memberPartArr = Object.keys(memberPart);
        if(memberPartArr.length){
          this.lastDay = this.$moment(
            memberPartArr.sort((a:any,b:any)=>{
              return b-a;
            })[0].toString()
          ).format('YYYY-MM-DD');
        } else {
          this.lastDay = this.$moment(member.joinDate.toString())
        }
      }

      switch(member.grade){
        case 0 : 
          this.grade = '모임장';
          break;
        case 1 : 
          this.grade = '운영진';
          break;
        case 2 : 
          this.grade = '일반회원';
          this.exitDay = `${exitDay['2'] - this.$moment(new Date).diff(this.lastDay || this.$moment(member.joinDate.toString()).format('YYYYMMDD'), 'days')}일`;
          break;
        case 3 : 
          this.grade = '신입(1~3회 참석)';
          this.exitDay = `${exitDay['3'] - this.$moment(new Date).diff(this.lastDay || this.$moment(member.joinDate.toString()).format('YYYYMMDD'), 'days')}일`;
          break;
        case 4 : 
          this.grade = '신입(미참석)';
          this.exitDay = `${exitDay['4'] - this.$moment(new Date).diff(this.lastDay || this.$moment(member.joinDate.toString()).format('YYYYMMDD'), 'days')}일`;
          break;
        case 5 : 
          this.grade = '특수회원';
          break;
        case 6 : 
          this.grade = '강퇴 혹은 탈퇴 회원';
          break;
        default : 
          this.grade = '신입(미참석)';
          break;
      }
    },(err:any)=>{
        this.showSnackbar('error','회원정보를 가져오지 못했습니다');
    });
  }
  @debounce(1000)
  putMember(){
    this.$validator.validateAll().then((result:any) => {
      if(result){
        if(this.currentUser){
          this.loading = true;
          if(this.params.key){
            MemberService.updateMember(this.params.key, Object.assign(this.member,{
              'birth' : parseInt(this.$moment(this.birth).format('YYYYMMDD')),
              'joinDate' :  parseInt(this.$moment(this.joinDate).format('YYYYMMDD'))
            })).then((res:any)=>{
              this.loading = false;
              if(res){
                this.showSnackbar('success','회원정보를 입력했습니다');
                this.$router.go(-1);
              }
            }).catch((err:any)=>{
              this.loading = false;
              this.showSnackbar('error','권한이 없습니다.');
            });
          } else {
            MemberService.createMember(Object.assign(this.member,{
              'birth' : parseInt(this.$moment(this.birth).format('YYYYMMDD')),
              'joinDate' :  parseInt(this.$moment(this.joinDate).format('YYYYMMDD'))
            })).then((res:any)=>{
              this.loading = false;
              if(res){
                this.showSnackbar('success','회원정보를 입력했습니다');
                this.$router.go(-1);
              }
            }).catch((err:any)=>{
              this.loading = false;
              this.showSnackbar('error','권한이 없습니다.');
            });
          }
          
        } else {
          this.showSnackbar('error','권한이 없습니다.');
        }
      }
    });
  }
  @debounce(1000)
  deleteMember(){
    if(this.currentUser){
      //20190526
      //-Lfe2zIBxdSMuFDvZxde
      this.loading = true;
      MemberService.updateMember(this.params.key, Object.assign(this.memberOrigin,{
        "grade" : 6,
        "outDay" : parseInt(this.$moment(new Date()).format('YYYYMMDD'))
      })).then((res:any)=>{
        this.loading = false;
        if(res){
          this.showSnackbar('success','회원정보를 삭제했습니다');
          this.$router.go(-1);
        }
      }).catch((err:any)=>{
        this.loading = false;
        this.showSnackbar('error','권한이 없습니다.');
      });
    } else {
      this.showSnackbar('error','권한이 없습니다.');
    }
  }
  saveBirth(param:any){
    this.$refs.birthMenu['save'](this.birth);
  }
}
</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
</style>