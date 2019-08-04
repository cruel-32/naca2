import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import gradeApi from '@/api/grade'
import { classGrade } from '@/declare/enums/member';

@Module
class GradeStore extends VuexModule {
  grades:GradeTypes[] = [];
  gradeInfoVO:Map<number,GradeTypes> = new Map();
  gradeCountVO:Map<number,number> = new Map();

  @Mutation
  setGrades(grades:GradeTypes[]){
    this.grades = grades;
  }

  @Mutation
  initializeCountVO(){
    this.gradeCountVO = new Map();
    this.gradeCountVO.set(classGrade.ADMIN, 0);
    this.gradeCountVO.set(classGrade.MANAGER, 0);
    this.gradeCountVO.set(classGrade.MEMBER, 0);
    this.gradeCountVO.set(classGrade.NEW_MEMBER, 0);
    this.gradeCountVO.set(classGrade.INTERN_MEMBER, 0);
    this.gradeCountVO.set(classGrade.SPECIAL_MEMBER, 0);
    this.gradeCountVO.set(classGrade.DRPOPPED_MEMBER, 0);
  }

  @Mutation
  gradeCountUp(grade:number){
    const gradeCount = this.gradeCountVO.get(grade);
    this.gradeCountVO.set(grade, (gradeCount || 0)+1);
  }

  @Action
  async getGrades():Promise<SnackbarTypes>{
    const msg:SnackbarTypes = {
      snackColor:'error',
      snackText:'event 가져오기 실패'
    }
    const grades = await gradeApi.getGrades();
    grades.forEach(grade=>{
      if(this.gradeInfoVO.get(grade.grade) === undefined){
        this.gradeInfoVO.set(grade.grade, {
          grade:grade.grade,
          name:grade.name,
          day:grade.day,
          key:grade.key,
        });
      }
    })
    this.setGrades(grades);
    if(grades){
      msg.snackColor = 'success';
      msg.snackText = 'event 가져오기 성공';
    }
    return msg
  }

}

export const gradeStore = new GradeStore({store, name: "gradeStore" })
