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
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { MemberService } from '../service/MemberService';
import ProgressComp from '../components/ProgressComp.vue';
import {exitDay} from '../helper/memberExitDay.js'

@Component({
  components : {
    ProgressComp
  }
})
export default class Management extends Vue {
  @Prop() windowSize: any;
  @Prop() currentUser: any;
  @Prop() query: any;
  @Prop() params: any;
  @Emit('showSnackbar') showSnackbar(color:string,text:string){}

  @Watch('currentUser')
  changedUser(){
    if(this.currentUser && !this.memberList.length){
      this.getMembers();
    }
  }
  today:number = parseInt(this.$moment(new Date()).format('YYYY'));
  average:any = 0;
  rate:Array<number> = [0,0];
  loading:boolean = false;
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
  memberList:any[] = [];

  created(){
    if(this.currentUser){
      this.getMembers();
    }
  }
  getMembers(){
    if(this.currentUser){
      this.loading = true;
      MemberService.getMembers()
      .then((snapShot:any)=>{
        this.loading = false;
        if(snapShot){
          let memberList= snapShot.val();
          this.memberList = Object.keys(memberList).map(memberKey=>{
            return {
              "key" : memberKey,
              "grade" : memberList[memberKey].grade,
              "name" : memberList[memberKey].name || "-",
              "birth" : this.$moment(memberList[memberKey].birth.toString()).format('YYYY.MM.DD') || "-",
              "age" : (1+this.today - parseInt(this.$moment(memberList[memberKey].birth.toString()).format('YYYY'))),
              "joinDate" : this.$moment(memberList[memberKey].joinDate.toString()).format('YYYY.MM.DD') || "-",
              "gender" : memberList[memberKey].gender,
              "address" : memberList[memberKey].address || "-",
              "exitDay" : this.computeExitDay(memberList[memberKey])
            }
          });
          this.memberList.forEach((member:any)=>{
            this.rate[member.gender === 'M'? 0 : 1]++;
            this.average+=member.age;
          });
          this.average = (this.average/this.memberList.length).toFixed(2);
        }
      });
    } else {
      this.showSnackbar('error','로그인이 필요합니다');
    }
  }
  parseGradeString(grade:number){
    if(grade === 0){
      return '모임장';
    } else if(grade === 1){
      return '운영진'
    } else if(grade === 2){
      return '일반회원'
    } else if(grade === 3){
      return '신입회원'
    } else if(grade === 4){
      return '미참석'
    } else if(grade === 5){
      return '특수회원'
    }
  }
  computeExitDay(member:any){
    let ExitDay:any;
    let lastDay:any;
    let grade = member.grade;

    if(grade == 0){
      return 300;
    } else if(grade == 1){
      return 200;
    } else if(grade == 2 || grade == 3 || grade == 4){
      let memberPart = member.participation;
      if(memberPart){
        let memberPartArr = Object.keys(memberPart);
        if(memberPartArr.length){
          lastDay = this.$moment(
            memberPartArr.sort((a:any,b:any)=>{
              return b-a;
            })[0].toString()
          )
        } else {
          lastDay = this.$moment(member.joinDate.toString())
        }
      } else {
        lastDay = this.$moment(member.joinDate.toString())
      }
      ExitDay = (grade == 2 ? exitDay['2'] : (grade == 3 ? exitDay['3'] : exitDay['4']))
        - this.$moment(new Date).diff(lastDay, 'days');
      return ExitDay;
    } else {
      return 100
    }
  }
  meberDetail(memberKey:any){
    this.$router.push(`/member/${memberKey}`);
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