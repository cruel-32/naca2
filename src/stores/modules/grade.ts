import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import gradeApi from '@/api/grade'

@Module
class GradeStore extends VuexModule {
  grades:GradeTypes[] = [];

  @Mutation
  setGrades(grades:GradeTypes[]){
    this.grades=grades;
  }

  @Action
  async getGrades(){
    const grades = await gradeApi.getGrades();
    this.setGrades(grades);
  }

}

export const gradeStore = new GradeStore({store, name: "gradeStore" })
