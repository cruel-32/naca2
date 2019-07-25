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
</script>

<style scoped lang="scss">
.v-card {
  box-shadow:none;
}
</style>