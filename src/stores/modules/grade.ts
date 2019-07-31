import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import gradeApi from '@/api/grade'

@Module
class GradeStore extends VuexModule {
  grades:GradeTypes[] = [];
  gradeValues:Map<number,Object> = new Map();

  @Mutation
  setGrades(grades:GradeTypes[]){
    this.grades = grades;
  }

  @Action
  async getGrades(){
    const grades = await gradeApi.getGrades();
    this.setGrades(grades);

    this.grades.forEach(grade=>{
      if(this.gradeValues.get(grade.grade) === undefined){
        this.gradeValues.set(grade.grade, {name:grade.name,day:grade.day});
      }
    })
  }

}

export const gradeStore = new GradeStore({store, name: "gradeStore" })
