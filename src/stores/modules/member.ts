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
  
  member:IMemberTypes = {
    key:null,
    // address:'',
    // birth:19951231,
    birth:1995,
    gender:'F',
    grade:4,
    joinDate: parseInt(this.today.format('YYYYMMDD')),
    mail:'',
    outDay:0,
    participation:[],
    firstDate:{key:'', value:0},
    lastDate:{key:'', value:0},
    phone:0,
    dPlus:0,
    dMinus:0,
    status:'',
    name:'',
    mbti:'모릅니다',
    hobbys:[],
    // job:'',
  };
  members:IMemberTypes[] = [];

  @Mutation
  private setMembers(members:IMemberTypes[]){
    this.members = members;
  }

  @Mutation
  private setMember(member:IMemberTypes){
    this.member = member;
  }

  @Action
  public async resetMember(){
    this.setMember({
      key:null,
      birth:1995,
      gender:'F',
      grade:4,
      joinDate: parseInt(this.today.format('YYYYMMDD')),
      mail:'',
      outDay:0,
      participation:[],
      firstDate:{key:'', value:0},
      lastDate:{key:'', value:0},
      phone:0,
      dPlus:0,
      dMinus:0,
      status:'',
      name:'',
      mbti:'모릅니다',
      hobbys:[],
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
  setCountVO(member:IMemberTypes){
    const birthYear = parseInt(moment(member.birth.toString()).format('YYYY'));

    const total = this.ageVO.get('total');
    this.ageVO.set('total', (total || 0) +(1+this.thisYear-birthYear) );

    const genderCount = this.genderCountVO.get(member.gender);
    this.genderCountVO.set(member.gender, (genderCount || 0)+1);

    gradeStore.gradeCountUp(member.grade);
  }

  @Action
  addColumn(member:IMemberTypes){
    const gradeInfo:IGradeTypes|undefined = gradeStore.gradeInfoVO.get(member.grade);
    const dPlus = this.today.diff(member.lastDate.value ? member.lastDate.value.toString() : member.joinDate.toString(), 'days');
    const dMinus = gradeInfo ? gradeInfo.day - dPlus : 0;
    let status = "normal";

    if(member.grade === classGrade.ADMIN){
      status = `green`
    } else if(member.grade === classGrade.MANAGER || member.grade === classGrade.SPECIAL_MEMBER){
      status = `blue`
    } else if(dMinus <= 0) {
      status = `red`;
    } else if(dMinus <= 20){
      status = `yellow`;
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
    this.members.filter(member=> memberKeys.includes(<string>member.key)).forEach((member:IMemberTypes)=>{
      this.setCountVO(member);
    });
  }

  @Action
  public async getMembers():Promise<ISnackbarTypes>{
    await gradeStore.getGrades();
    this.setMembers([]);
    this.initializeCountVO();
    const members:IMemberTypes[] = await memberApi.getMembers();
    members.forEach(member=>{
      this.addColumn(member);
    })
    this.setMembers(members);

    const msg:ISnackbarTypes = {
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
  public async getMembersInActive():Promise<ISnackbarTypes>{
    await gradeStore.getGrades();
    this.setMembers([]);
    this.initializeCountVO();
    const members:IMemberTypes[] = await memberApi.getMembersInActive();
    members.forEach(member=>{
      this.addColumn(member);
    })
    this.setMembers(members);

    const msg:ISnackbarTypes = {
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
  public async updateMember(payload:IMemberTypes):Promise<ISnackbarTypes>{
    const error = await memberApi.updateMember(payload);
    const msg:ISnackbarTypes = {
      snackColor:'error',
      snackText:'members 가져오기 실패'
    }
    if(!error){
      msg.snackColor = 'success';
      msg.snackText = 'members 가져오기 성공';
    }
    return msg
  }

  @Action
  public async deleteMember(key:string):Promise<ISnackbarTypes>{
    console.log('key : ', key);
    const msg:ISnackbarTypes = {
      snackColor:'error',
      snackText:'members 삭제 실패'
    }
    if(key){
      const error = await memberApi.deleteMember(key);
      if(!error){
        msg.snackColor = 'success';
        msg.snackText = 'members 삭제 성공';
      }
    }
    return msg
  }

  @Action
  public async getMemberByKey(key:string):Promise<ISnackbarTypes>{
    const msg:ISnackbarTypes = {
      snackColor:'error',
      snackText:'member 가져오기 실패'
    }
    if(key){
      const member:IMemberTypes = await memberApi.getMemberByKey(key);
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
