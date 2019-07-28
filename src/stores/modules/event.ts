import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import eventApi from "@/api/events";

@Module
class EventStore extends VuexModule {
  event:EventTypes = {
    date:0
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
    this.setEvent({});
  }

}

export const eventStore = new EventStore({store, name: "eventStore" })
