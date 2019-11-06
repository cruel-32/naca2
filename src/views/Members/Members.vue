<template>
  <div class="members_container">
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
    
      <div class="table" v-scroll>
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
              <td class="text-xs-left">{{ props.item.birth && (year - parseInt(props.item.birth.toString().slice(0,4))) }}세</td>
              <td class="text-xs-left">{{ $moment(props.item.joinDate.toString()).format('YYYY.MM.DD') }}</td>
              <td v-bind:class="['text-xs-center', `status-${props.item.status}`]">
                {{getTextByStatus(props.item)}}
              </td>
              <td class="text-xs-center" >
                {{props.item.lastDate.value ? $moment(props.item.lastDate.value.toString()).format('YYYY.MM.DD') : "미참석" }}
              </td>
              <td class="text-xs-center" >
                {{props.item.dPlus > 0 ? `+${props.item.dPlus}일` : '참여예정'}} {{props.item.grade === 4 ? '(가입일로부터)' : ''}}
              </td>
              <td class="text-xs-left">{{ props.item.gender === 'M' ? '남' : '여' }}</td>
              <td v-bind:class="['text-xs-left', `status-${props.item.status}`]">
                {{ gradeInfoVO && gradeInfoVO.get(props.item.grade).name }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
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
      text : '남은일수',
      align: 'center',
      value: 'dMinus'
    },
    {
      text : '마지막 참석일',
      align: 'center',
      value: 'lastDate'
    },
    {
      text : '마지막 참여일로부터',
      align: 'center',
      value: 'dPlus'
    },
    {
      text : '성별',
      align: 'left',
      value: 'gender',
    },
    {
      text : '회원등급',
      align: 'left',
      value: 'grade',
    },
  ];

  async created(){
    await memberStore.getMembersInActive();
    await memberStore.setMembersInfoByKeys(this.members.map(member=>member.key||''));
  }

  goMeberDetail(key:string){
    this.$router.push(`/members/detail/${key}`);
  }

  getTextByStatus(item:any){
    let text = '';
    if(item.status === 'red'){
      text = '강퇴대상'
    } else if(item.status === 'blue' && item.grade == 1){
      text = '운영진'
    } else if(item.status === 'blue' && item.grade == 5){
      text = '특수회원'
    } else if(item.status === 'green'){
      text = '모임장'
    } else {
      text = item.dMinus + '일'
    }
    return text;
  }
  

}
</script>

<style lang="scss">

.v-card {
  width:100%;
}

.members_container {
  display:flex;
  width:100%;
  height:100%;
  align-items:center;
  > div {
    flex: 1 1 auto;
  }
}

.custom-table {
  th,td {
    padding: 0 10px !important;
  }
}

.table {
  overflow:scroll;
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