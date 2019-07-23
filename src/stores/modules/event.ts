import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

export interface EventTypes {
  uid:string;
  date:number;
  title:string;
  placeKeys:string;
  contentKeys:string[];
  memberKeys:string[];
}

@Module
class EventStore extends VuexModule {
  events:EventTypes[] = [];

  @Mutation
  private addEvent(payload:any){
    console.log('EventStore addEvent payload : ', payload);
  }

  @Action
  public async testEvent(payload:any){//{ state, commit, rootState }
    console.log('EventStore testEvent payload : ', payload);
  }
}

export const eventStore = new EventStore({store, name: "eventStore" })
