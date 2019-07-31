import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import memberApi from '@/api/member'
import {gradeStore} from "./grade";
import moment from 'moment';

@Module
class MemberStore extends VuexModule {
  members:MemberTypes[] = [];
  averAge:number = 0;
  maleCount:number = 0;
  femaleCount:number = 0;

  @Mutation
  private setMembers(members:MemberTypes[]){
    this.members = members;
  }
  
  @Mutation
  private setAverAge(averAge:number){
    this.averAge = averAge;
  }

  @Mutation
  private setMaleCount(maleCount:number){
    this.maleCount = maleCount;
  }

  @Mutation
  private setFemaleCount(femaleCount:number){
    this.femaleCount = femaleCount;
  }

  @Action
  public async getMembersByFilter(memberKeys:any|null){
    await gradeStore.getGrades();
    const members = await memberApi.getMembers(memberKeys);
    const today = moment(new Date());
    const thisYear = parseInt(today.toString().slice(0,4));

    let totalAge = 0;
    let maleCount = 0;
    let femaleCount = 0;

    members.forEach((member:MemberTypes)=>{
      const birthYear = parseInt(moment(member.birth.toString()).format('YYYY'));
        totalAge += (thisYear-birthYear)

      if(member.gender === 'M') {
        maleCount+=1
      } else if(member.gender === 'F'){
        femaleCount+=1
      }

      const values:any = gradeStore.gradeValues.get(member.grade);
      const dPlus = today.diff(member.lastDate ?
        member.lastDate.toString() : member.joinDate.toString(), 'days');
      const dMinus = values.day - dPlus;
      let status = "normal";

      if(dMinus <= 0) {
        status = "red";
      } else if(dMinus <= 20){
        status = "yellow";
      } else if(member.grade === 0){
        status = `green`
      } else if(member.grade === 1 || member.grade === 5){
        status = `blue`
      }

      Object.assign(member,{
        dPlus,
        dMinus,
        status
      })
    });

    this.setAverAge(totalAge/members.length);
    this.setMembers(members);
    this.setMaleCount(maleCount);
    this.setFemaleCount(femaleCount);
  }

  
  
}

export const memberStore = new MemberStore({store, name: "memberStore" })
