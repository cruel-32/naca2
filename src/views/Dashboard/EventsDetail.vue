<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <ProgressComp :propData="loading"></ProgressComp>
        <v-card style="width: 100%;">
          <v-card-title class="pb-0">
            <span class="headline">
              <v-icon color="green">insert_chart</v-icon> {{this.params.YYYYMM}} 통계자료
              <router-link class="caption move-month" :to="{path:`/statistics/meetingsStatsDetail/${viewMonth(-1)}`}" >지난달</router-link>
              <router-link class="caption move-month" :to="{path:`/statistics/meetingsStatsDetail/${viewMonth(1)}`}" >다음달</router-link>
            </span>
          </v-card-title>
          <v-card-text class="pa-0">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 이벤트 목록 ({{dates && dates.length}} 번)</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs12 sm12 md12 v-for="(meeting,index) in dates" :key="index">
                        {{$moment(meeting).format('YYYY.MM.DD')}} -
                        <router-link v-if="meetingsMonth && meetingsMonth[meeting]" :to="{path:`/meeting/${meeting}`}">
                           {{meetingsMonth[meeting].title}}
                        </router-link>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 참석왕</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs6 sm6 md6 v-for="bestMember in bestMembers.slice(0,10)" :key="bestMember.content">
                        <router-link :to="{path:`/statistics/membersParti/${bestMember.member}`}">
                           <span>{{bestMember.name}}</span>
                        </router-link>  
                        <span>: <strong>{{bestMember.count}}</strong>번 </span>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 카테고리 순위</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs6 sm6 md6 v-for="bestCategory in bestCategories" :key="bestCategory.content">
                        <span>{{bestCategory.name}} : <strong>{{bestCategory.count}}</strong>번 </span>
                      </v-flex>
                    </v-layout>

                  </v-flex>
                  <v-flex xs12 sm6 md4 mb-3>
                    <strong class="cus-title">이달의 장소</strong>
                    <v-layout wrap mt-1>
                      <v-flex xs6 sm6 md6 v-for="bestPlace in bestPlaces" :key="bestPlace.content">
                        <span>{{bestPlace.name}} : <strong>{{bestPlace.count}}</strong>번 </span>
                      </v-flex>
                    </v-layout>
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
.v-btn--right {
    right: 26px;
}

.list {
  list-style-type: none;
}
.move-month {display:inline-block; margin:0 3px;}
</style>