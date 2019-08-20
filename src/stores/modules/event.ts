import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import eventApi from "@/api/events";
import moment from 'moment';

// import API_UTILS from '@/utils/API_UTILS';

@Module
class EventStore extends VuexModule {
  event:IEventTypes = {
    key:null,
    date:parseInt(moment(new Date()).format('YYYYMMDD')),
    title:'',
    placeKeys:[],
    contentKeys:[],
    memberKeys:[],
  };
  events:IEventTypes[] = [];

  @Mutation
  private setEvent(event:IEventTypes){
    this.event = event;
  }

  @Mutation
  private setEvents(events:IEventTypes[]){
    this.events = events.reverse();
  }

  @Action
  public async getEventByKey(key:string):Promise<ISnackbarTypes>{
    const msg:ISnackbarTypes = {
      snackColor:'error',
      snackText:'event 가져오기 실패'
    }
    if(key){
      const event:IEventTypes = await eventApi.getEventByKey(key);
      this.setEvent(event);
      if(event){
        msg.snackColor = 'success';
        msg.snackText = 'event 가져오기 성공';
      }
    }
    return msg
  }

  @Action
  public async getEventsRange(payload:IDateRange):Promise<IEventTypes[]>{
    const events:IEventTypes[] = await eventApi.getEventsRange(payload);
    this.setEvents(events)
    return events;
  }

  @Action
  public resetEvent(){
    this.setEvent({
      key:null,
      date:parseInt(moment(new Date()).format('YYYYMMDD')),
      title:'',
      placeKeys:[],
      contentKeys:[],
      memberKeys:[],
    });
  }

  @Action
  public async updateEvent(payload:IEventTypes):Promise<IEventTypes>{
    const result = await eventApi.updateEvent(payload);
    console.log('result : ', result);
    
    return result;
  }

  @Action
  public async deleteEvent(key:string):Promise<ISnackbarTypes>{
    const result:string = await eventApi.deleteEvent(key);
    return {
      key,
      snackColor:result,
      snackText: result === 'success' ? '삭제 성공했습니다' : '삭제 실패했습니다'
    }
  }

}

export const eventStore = new EventStore({store, name: "eventStore" })
