import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import memberApi from '@/api/member'
import {gradeStore} from "./grade";
import moment from 'moment';
import { initializeApp } from 'firebase';

@Module
class MemberStore extends VuexModule {
  members:MemberTypes[] = [];

  ageVO:Map<string,number> = new Map();
  genderVO:Map<string,number> = new Map();

  today = moment(new Date());
  thisYear = parseInt(this.today.format('YYYY'));

  @Mutation
  private setMembers(members:MemberTypes[]){
    this.members = members;
  }

  @Action
  initializeVO(){
    this.ageVO.set('total', 0);
    this.genderVO.set('M', 0);
    this.genderVO.set('F', 0);
    gradeStore.gradeCountVO.set(0, 0);
    gradeStore.gradeCountVO.set(1, 0);
    gradeStore.gradeCountVO.set(2, 0);
    gradeStore.gradeCountVO.set(3, 0);
    gradeStore.gradeCountVO.set(4, 0);
    gradeStore.gradeCountVO.set(5, 0);
    gradeStore.gradeCountVO.set(6, 0);
  }

  @Action
  setVO(member:MemberTypes){
    const birthYear = parseInt(moment(member.birth.toString()).format('YYYY'));

    const total = this.ageVO.get('total');
    this.ageVO.set('total', (total || 0) +(1+this.thisYear-birthYear) );

    const genderCount = this.genderVO.get(member.gender);
    this.genderVO.set(member.gender, (genderCount || 0)+1);

    const gradeCount = gradeStore.gradeCountVO.get(member.grade);
    gradeStore.gradeCountVO.set(member.grade, (gradeCount || 0)+1);
  }

  @Action
  parseMember(member:MemberTypes){
    const gradeInfo:any = gradeStore.gradeInfoVO.get(member.grade);
    const dPlus = this.today.diff(member.lastDate ? member.lastDate.toString() : member.joinDate.toString(), 'days');
    const dMinus = gradeInfo.day - dPlus;
    let status = "normal";

    if(member.grade === 0){
      status = `green`
    } else if(member.grade === 1 || member.grade === 5){
      status = `blue`
    } else if(dMinus <= 0) {
      status = "red";
    } else if(dMinus <= 20){
      status = "yellow";
    }

    Object.assign(member,{
      dPlus,
      dMinus,
      status
    })
  }

  @Action
  public async membersFiltering(memberKeys:string[]){
    this.initializeVO();
    this.members.filter(member=> memberKeys.includes(<string>member.key)).forEach((member:MemberTypes)=>{
      this.parseMember(member);
      this.setVO(member);
    });
  }

  @Action
  public async getMembers(){
    await gradeStore.getGrades();
    const members = await memberApi.getMembers();
    this.initializeVO();
    this.setMembers(members);
    this.members.forEach((member:MemberTypes)=>{
      this.parseMember(member);
      this.setVO(member);
    });
  }



}

export const memberStore = new MemberStore({store, name: "memberStore" })
