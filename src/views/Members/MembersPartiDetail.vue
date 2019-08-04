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
                    <strong class="cus-title">처음 이벤트 참여일</strong>
                    <router-link v-if="firstMeeting" :to="{path:firstMeeting.link}">{{firstMeeting.date}} {{firstMeeting.name}}</router-link>
                    <div v-else>
                      <span>참여한 이벤트가 없습니다.</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">최근 이벤트 참여일</strong>
                    <router-link v-if="lastMeeting" :to="{path:lastMeeting.link}">{{lastMeeting.date}} {{lastMeeting.name}}</router-link>
                    <div v-else>
                      <span>참여한 이벤트가 없습니다.</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <strong class="cus-title">이벤트 참여 횟수</strong>
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
                    <strong class="cus-title">참여한 모든 이벤트 보기</strong>
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