<template>
  <v-card>
    
    <v-card-title>
      <h1 class="headline"><v-icon color="green">people</v-icon> 회원목록</h1>
      <p class="caption" style="margin:0 0 0 10px !important;">
        <span>평균연령 : {{average}}세, </span>
        <span>남자:{{gender.male}}명 여자: {{gender.female}}명</span>
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
      :items="members"
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
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { accountStore } from "@/stores/modules/account"
import { memberStore } from "@/stores/modules/member";
import { dialogStore } from "@/stores/modules/dialog"
import { menuStore } from "@/stores/modules/menu"

@Component
export default class Members extends Vue {
  //stores
  get currentUser(){ return accountStore.currentUser }
  get members(){ return memberStore.members }
  get snackBar(){ return dialogStore.snackBar }



  average:number = 0;
  gender:{} = {
    male : 0,
    female : 0,
  }
  search:string = '';

  options:any[] = [{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}, 10,20,];
  headers:any[] = [
    {
      text: '이름',
      align: 'left',
      value: 'name'
    },
    {
      text : '생년월일',
      align: 'left',
      value: 'birth'
    },
    {
      text : '나이',
      align: 'left',
      value: 'age'
    },
    {
      text : '가입일',
      align: 'left',
      value: 'joinDate'
    },
    {
      text : '성별',
      align: 'left',
      value: 'gender',
    },
    {
      text : '사는곳',
      align: 'left',
      value: 'address',
    },
    {
      text : '회원등급',
      align: 'left',
      value: 'grade',
    },
    {
      text : 'D-XX',
      align: 'left',
      value: 'exitDay'
    },
  ];

  goMemberDetail(key:string){
    this.$router.push(`/member/detail/${key}`);
  }
  
}
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