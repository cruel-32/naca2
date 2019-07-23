import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/stores'

interface Event {
  uid:string;
  date:number;
  title:string;
  placeKeys:string;
  contentKeys:string[];
  memberKeys:string[];
}

@Module({ dynamic: true, store, name: 'EventStore' })
export default class EventStore extends VuexModule {
  events:Event[] = [];

  @Mutation
  private addEvent(payload:any){
    console.log('EventStore addEvent payload : ', payload);
  }

  @Action
  public async testEvent(payload:any){//{ state, commit, rootState }
    console.log('EventStore testEvent payload : ', payload);
  }
}

export const eventStore = getModule(EventStore)
