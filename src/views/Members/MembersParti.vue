<template>
  <v-card>
    <ProgressComp :propData="loading"></ProgressComp>
    <v-card-title>
      <h1 class="headline"><v-icon color="green">insert_chart</v-icon> 회원별 참여도 통계</h1>
      <p class="caption" style="margin:0 0 0 10px !important;">*회원 이름을 클릭하세요</p>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="memberList"
      :search="search"
      :rows-per-page-items="options"
      rows-per-page-text="한 페이지당 목록수"
      class="elevation-1 custom-table"
    >
      <template slot="items" slot-scope="props" >
        <tr @click="meberDetail(props.item.key)">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.birth }}</td>
          <td class="text-xs-left">{{ props.item.age }}세</td>
          <td class="text-xs-left">{{ props.item.joinDate }}</td>
          <td class="text-xs-left">{{ props.item.address }}</td>
          <td class="text-xs-left" >
            <span v-if="props.item.exitDay<1" class="custom-red">강퇴대상</span>
            <span v-else-if="props.item.grade == 5" class="custom-blue">특수회원</span>
            <span v-else-if="props.item.grade == 1" class="custom-blue">운영진</span>
            <span v-else-if="props.item.grade == 0" class="custom-green">모임장</span>
            <span v-else-if="props.item.exitDay>=1 && props.item.exitDay<15" class="custom-amber">{{props.item.exitDay}}일</span>
            <span v-else>{{props.item.exitDay}}일</span>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>


<script lang="ts">
</script>

<style lang="scss">
.custom-table {
  th,td {
    padding: 0 10px !important;
  }
}

.custom-red { 
  color:red !important
}
.custom-amber { 
  color:#ffa000!important
}
.custom-blue { 
  color:#1976d2!important
}
.custom-green { 
  color:green !important
}
</style>