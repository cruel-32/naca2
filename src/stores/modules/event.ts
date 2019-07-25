import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import eventApi from "@/api/events";

@Module
class EventStore extends VuexModule {
  events:EventTypes[] = [];

  @Mutation
  private setEvents(payload:EventTypes[]){
    this.events = payload;
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
}

export const eventStore = new EventStore({store, name: "eventStore" })
