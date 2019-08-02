import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import memberApi from '@/api/member'
import {gradeStore} from "./grade";
import moment from 'moment';
import {classGrade} from '@/declare/enums/member';

@Module
class MemberStore extends VuexModule {
  ageVO:Map<string,number> = new Map();
  genderVO:Map<string,number> = new Map();

  today = moment(new Date());
  thisYear = parseInt(this.today.format('YYYY'));
  
  member:MemberTypes = {
    key:null,
    address:'',
    birth:parseInt(this.today.format('YYYYMMDD')),
    gender:'F',
    grade:4,
    joinDate: parseInt(this.today.format('YYYYMMDD')),
    mail:'',
    outDay:0,
    eventKeys:[],
    participation:[],
    lastDate:0,
    phone:0,
    dPlus:0,
    dMinus:0,
    status:'',
    name:'',
  };
  members:MemberTypes[] = [];

  

  @Mutation
  private setMembers(members:MemberTypes[]){
    this.members = members;
  }

  @Mutation
  private setMember(member:MemberTypes){
    this.member = member;
  }

  @Action
  public async resetEvent(){
    this.setMember({
      key:null,
      address:'',
      birth:parseInt(this.today.format('YYYYMMDD')),
      gender:'F',
      grade:4,
      joinDate: parseInt(this.today.format('YYYYMMDD')),
      mail:'',
      outDay:0,
      eventKeys:[],
      participation:[],
      lastDate:0,
      phone:0,
      dPlus:0,
      dMinus:0,
      status:'',
      name:'',
    });
  }

  @Action
  initializeVO(){
    this.ageVO.set('total', 0);
    this.genderVO.set('M', 0);
    this.genderVO.set('F', 0);
    gradeStore.gradeCountVO.set(classGrade.ADMIN, 0);
    gradeStore.gradeCountVO.set(classGrade.MANAGER, 0);
    gradeStore.gradeCountVO.set(classGrade.MEMBER, 0);
    gradeStore.gradeCountVO.set(classGrade.NEW_MEMBER, 0);
    gradeStore.gradeCountVO.set(classGrade.INTERN_MEMBER, 0);
    gradeStore.gradeCountVO.set(classGrade.SPECIAL_MEMBER, 0);
    gradeStore.gradeCountVO.set(classGrade.DRPOPPED_MEMBER, 0);
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

    if(member.grade === classGrade.ADMIN){
      status = `green`
    } else if(member.grade === classGrade.MANAGER || member.grade === classGrade.SPECIAL_MEMBER){
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
