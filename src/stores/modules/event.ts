import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import eventApi from "@/api/events";
import moment from 'moment';

// import API_UTILS from '@/utils/API_UTILS';

@Module
class EventStore extends VuexModule {
  event:EventTypes = {
    key:null,
    date:parseInt(moment(new Date()).format('YYYYMMDD')),
    title:'',
    placeKeys:[],
    contentKeys:[],
    memberKeys:[],
  };
  events:EventTypes[] = [];

  @Mutation
  private setEvent(event:EventTypes){
    this.event = event;
  }

  @Mutation
  private setEvents(events:EventTypes[]){
    this.events = events;
  }

  @Action
  public async getEventByKey(key:string):Promise<SnackbarTypes>{
    const msg:SnackbarTypes = {
      snackColor:'error',
      snackText:'event 가져오기 실패'
    }
    if(key){
      const event:EventTypes = await eventApi.getEventByKey(key);
      this.setEvent(event);
      if(event){
        msg.snackColor = 'success';
        msg.snackText = 'event 가져오기 성공';
      }
    }
    return msg
  }

  @Action
  public async getEventsRange(payload:DateRange):Promise<EventTypes[]>{
    const events:EventTypes[] = await eventApi.getEventsRange(payload);
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
  public async updateEvent(payload:EventTypes):Promise<EventTypes>{
    const result = await eventApi.updateEvent(payload);
    return result;
  }

  @Action
  public async deleteEvent(key:string):Promise<SnackbarTypes>{
    const result:string = await eventApi.deleteEvent(key);
    return {
      key,
      snackColor:result,
      snackText: result === 'success' ? '삭제 성공했습니다' : '삭제 실패했습니다'
    }
  }

}

export const eventStore = new EventStore({store, name: "eventStore" })
