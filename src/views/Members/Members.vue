<template>
  <v-card>
    
    <v-card-title>
      <h1 class="headline"><v-icon color="green">people</v-icon> 회원목록</h1>
      <p class="caption" style="margin:0 0 0 10px !important;">
        <span>평균연령 : {{ members && ageVO.get('total') > 0? (ageVO.get('total')/ members.length).toFixed(2) : 0}}세, </span>
        <span>남자:{{genderCountVO.get('M')}}명 여자: {{genderCountVO.get('F')}}명</span>
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
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      :search="search"
      :rows-per-page-items="options"
      rows-per-page-text="한 페이지당 목록수"
      class="elevation-1 custom-table"
    >
      <template slot="items" slot-scope="props" >
        <tr @click="goMeberDetail(props.item.key)">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.birth && $moment(props.item.birth.toString()).format('YYYY.MM.DD')}}</td>
          <td class="text-xs-left">{{ props.item.birth && (year - parseInt(props.item.birth.toString().slice(0,4))) }}세</td>
          <td class="text-xs-left">{{ $moment(props.item.joinDate.toString()).format('YYYY.MM.DD') }}</td>
          <td class="text-xs-left">{{ props.item.gender === 'M' ? '남' : '여' }}</td>
          <td class="text-xs-left">{{ props.item.address }}</td>
          <td v-bind:class="['text-xs-left', `status-${props.item.status}`]">
            {{ gradeInfoVO && gradeInfoVO.get(props.item.grade).name }}
          </td>
          <td class="text-xs-center" >
            {{props.item.lastDate ? $moment(props.item.lastDate.toString()).format('YYYY.MM.DD') : "미참석" }}
          </td>
          <td class="text-xs-center" >
            {{props.item.dPlus}}
          </td>
          <td v-bind:class="['text-xs-center', `status-${props.item.status}`]">
            {{
              props.item.status === 'red' ? '강퇴대상' :
                (props.item.status === 'blue' && props.item.grade == 1 ? '운영진' :
                  (props.item.status === 'blue' && props.item.grade == 5 ? '특수회원' :
                    (props.item.status === 'green' ? '모임장' :
                      props.item.dMinus
                    )
                  )
                )
            }}
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
import { gradeStore } from "@/stores/modules/grade"
import { menuStore } from "@/stores/modules/menu"


@Component
export default class Members extends Vue {
  //stores
  get currentUser(){ return accountStore.currentUser }
  get members(){ return memberStore.members }
  get grades(){ return gradeStore.grades }
  get gradeInfoVO(){ return gradeStore.gradeInfoVO }
  get snackBar(){ return dialogStore.snackBar }
  get ageVO(){return memberStore.ageVO}
  get genderCountVO(){return memberStore.genderCountVO}
  
  //local data
  get year(){
    return parseInt(this.today.toString().slice(0,4))+1;
  }
  today:number = parseInt(this.$moment(new Date()).format('YYYYMMDD'));
  search:string = '';

  sortBy:string = '';
  descending:boolean = false;
  
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
      text : '마지막 참석일',
      align: 'center',
      value: 'lastDate'
    },
    {
      text : '마지막참여일+',
      align: 'center',
      value: 'dPlus'
    },
    {
      text : '남은일수',
      align: 'center',
      value: 'dMinus'
    },
  ];

  async created(){
    await memberStore.getMembers();
    await memberStore.setMembersInfoByKeys(this.members.map(member=>member.key||''));
  }

  goMeberDetail(key:string){
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

.status-red { 
  color:red !important
}
.status-yellow { 
  color:#ffa000!important
}
.status-blue { 
  color:#1976d2!important
}
.status-green { 
  color:green !important
}

</style>