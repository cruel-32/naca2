<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <form id="create-meeting-dialog" class="ui form" @submit.prevent="postMember">
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
                        v-model="viewJoinCalander"
                        lazy
                        full-width
                      >
                        <v-text-field
                          slot="activator"
                          v-model="member.joinDate"
                          label="가입일을 입력하세요"
                          readonly
                        ></v-text-field>
                        <v-date-picker
                          v-model="member.joinDate"
                          @input="viewJoinCalander = false"
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
import { accountStore } from "@/stores/modules/account"
import { eventStore } from "@/stores/modules/event";
import { contentStore } from "@/stores/modules/content";
import { placeStore } from "@/stores/modules/place";
import { gradeStore } from "@/stores/modules/grade";
import { memberStore } from "@/stores/modules/member";
import { dialogStore } from "@/stores/modules/dialog";
import { menuStore } from "@/stores/modules/menu";
import { debounce } from "typescript-debounce-decorator";

import colors from 'vuetify/es5/util/colors';
import API_UTILS from '@/utils/API_UTILS'
import events from '../../api/events';
import member from '../../api/member';

@Component
export default class MemberDetail extends Vue {
  //stores
  get contents(){return contentStore.contents}
  get grades(){return gradeStore.grades}
  get gradeInfoVO(){return gradeStore.gradeInfoVO}
  get gradeCountVO(){return gradeStore.gradeCountVO}
  get places(){return placeStore.places}
  get event(){return eventStore.event}
  get member(){return memberStore.member}
  get ageVO(){return memberStore.ageVO}
  get genderVO(){return memberStore.genderVO}
  get currentUser(){return accountStore.currentUser}
  get snackBar(){return dialogStore.snackBar}

  //props
  @Prop() query: any;
  @Prop() params: any;

  viewJoinCalander:boolean = false;

  created(){
    console.log('memberDetail')
    // memberStore.getMemberByKey();
  }

  postMember(){
    console.log('postMember');
  }

}


</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
</style>