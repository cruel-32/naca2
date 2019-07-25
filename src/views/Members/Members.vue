<template>
  <v-card>
    <ProgressComp :propData="loading"></ProgressComp>
    <v-card-title>
      <h1 class="headline"><v-icon color="green">people</v-icon> 회원목록</h1>
      <p class="caption" style="margin:0 0 0 10px !important;">
        <span>평균연령 : {{average}}세, </span>
        <span>남자:{{rate[0]}}명 여자: {{rate[1]}}명</span>
      </p>
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
          <td class="text-xs-left">{{ props.item.gender === 'M' ? '남' : '여' }}</td>
          <td class="text-xs-left">{{ props.item.address }}</td>
          <td class="text-xs-center"
            :class="['text-xs-center',
                      props.item.exitDay < 1 ? 'custom-red' : '',
                      props.item.grade == 0 ? 'custom-green' : '',
                      props.item.grade == 1 ? 'custom-blue' : '',
                      props.item.grade == 5 ? 'custom-blue' : '',
                    ]"
          >{{ parseGradeString(props.item.grade) }}</td>
          <td class="text-xs-left" >
            <span
              :class="['text-xs-center',
                props.item.exitDay <= 10 ? 'custom-red' : '',
                (props.item.exitDay > 10 && props.item.exitDay < 21) ? 'custom-amber' : '',
              ]"
            >{{props.item.exitDay}}일</span>
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