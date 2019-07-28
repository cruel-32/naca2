import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import eventApi from "@/api/events";
import API_UTILS from '@/api/API_UTILS';

@Module
class EventStore extends VuexModule {
  event:EventTypes = {
    date:0,
    title:'테스트',
    placeKeys:['wervwtbwrtbetrh'],
    contentKeys:['qqqweerrtyyy'],
    memberKeys:['-LOvteMzU211Morqz6pJ'],
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
  public async getEventByUid(uid:string){//{ state, commit, rootState }
    const event:EventTypes = await eventApi.getEventByUid(uid);
    this.setEvent(event);
  }

  @Action
  public async getEvents(){//{ state, commit, rootState }
    const events:EventTypes[] = await eventApi.getEvents();
    this.setEvents(events);
  }

  @Action
  public async getEventsRange(payload:DateRange){//{ state, commit, rootState }
    const events:EventTypes[] = await eventApi.getEventsRange(payload);
    this.setEvents(events)
  }

  @Action
  public async resetEvent(){//{ state, commit, rootState }
    this.setEvent({
      date:0,
      title:'테스트',
      placeKeys:['wervwtbwrtbetrh'],
      contentKeys:['qqqweerrtyyy'],
      memberKeys:['-LOvteMzU211Morqz6pJ'],
      // title:'',
      // placeKeys:[],
      // contentKeys:[],
      // memberKeys:[],
    });
  }

  @Action
  public async createEvent(payload:EventTypes){
    const result = await eventApi.createEvent(payload);
    console.log('createEvent result : ', result);
  }

  @Action
  public async updateEvent(payload:any){
    const result = await eventApi.updateEvent(payload.uid, payload.params);
    console.log('createEvent result : ', result);
  }

}

export const eventStore = new EventStore({store, name: "eventStore" })
