<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <ProgressComp :propData="date == null"></ProgressComp>
        <v-card class="pt-3 pa-3">
          <h1 class="headline">
            <v-icon color="#009688">date_range</v-icon>
            이달의 모임(벙) 목록
          </h1>
          <p class="pt-2 caption">
            *모임을 생성 혹은 수정,삭제하고나 하는 날짜를 클릭하세요<br/>
            *이미 모임이 있는 날은 초록색으로 마킹되어 있습니다<br/>
          </p>
          <v-date-picker
            v-model="date"
            type="month"
            color="green lighten-1"
            header-color="primary"
            @change="changePickMonth"
            locale="ko"
          ></v-date-picker>
          <!-- v-model="dates" -->
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
</style>