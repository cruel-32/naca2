import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import memberApi from '@/api/member'
import { gradeStore } from "./grade";
import moment from 'moment';
import { classGrade } from '@/declare/enums/member';

@Module
class MemberStore extends VuexModule {
  ageVO:Map<string,number> = new Map();
  genderCountVO:Map<string,number> = new Map();

  today = moment(new Date());
  thisYear = parseInt(this.today.format('YYYY'));
  
  member:MemberTypes = {
    key:null,
    address:'',
    birth:19951231,
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
      birth:19951231,
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

  @Mutation
  initializeCountVO(){
    this.ageVO = new Map();
    this.genderCountVO = new Map();
    this.ageVO.set('total', 0);
    this.genderCountVO.set('M', 0);
    this.genderCountVO.set('F', 0);
    gradeStore.initializeCountVO();
  }

  @Action
  setCountVO(member:MemberTypes){
    const birthYear = parseInt(moment(member.birth.toString()).format('YYYY'));

    const total = this.ageVO.get('total');
    this.ageVO.set('total', (total || 0) +(1+this.thisYear-birthYear) );

    const genderCount = this.genderCountVO.get(member.gender);
    this.genderCountVO.set(member.gender, (genderCount || 0)+1);

    gradeStore.gradeCountUp(member.grade);
  }

  @Action
  addColumn(member:MemberTypes){
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
  public async setMembersInfoByKeys(memberKeys:string[]){
    this.initializeCountVO();
    this.members.filter(member=> memberKeys.includes(<string>member.key)).forEach((member:MemberTypes)=>{
      this.setCountVO(member);
    });
  }

  @Action
  public async getMembers():Promise<SnackbarTypes>{
    await gradeStore.getGrades();
    this.initializeCountVO();
    const members:MemberTypes[] = await memberApi.getMembers();
    members.forEach(member=>{
      this.addColumn(member);
    })
    this.setMembers(members);
    

    const msg:SnackbarTypes = {
      snackColor:'error',
      snackText:'members 가져오기 실패'
    }
    if(members){
      msg.snackColor = 'success';
      msg.snackText = 'members 가져오기 성공';
    }
    return msg
  }

  @Action
  public async updateEvent(payload:MemberTypes):Promise<MemberTypes>{
    console.log('payload : ', payload);
    // const result = await eventApi.updateEvent(payload);
    return new Promise(()=>{});
  }

  @Action
  public async deleteEvent(key:string):Promise<SnackbarTypes>{
    console.log('key : ', key);
    // const result = await eventApi.updateEvent(payload);
    return new Promise(()=>{});
  }

  @Action
  public async getMemberByKey(key:string):Promise<SnackbarTypes>{
    const msg:SnackbarTypes = {
      snackColor:'error',
      snackText:'member 가져오기 실패'
    }
    if(key){
      const member:MemberTypes = await memberApi.getMemberByKey(key);
      this.addColumn(member);
      this.setMember(member);
      if(member){
        msg.snackColor = 'success';
        msg.snackText = 'member 가져오기 성공';
      }
    }
    return msg
  }


}

export const memberStore = new MemberStore({store, name: "memberStore" })
