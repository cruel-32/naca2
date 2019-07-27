import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import placeApi from '@/api/place'

@Module
class PlaceStore extends VuexModule {
  places:PlaceTypes[] = [];

  @Mutation
  setPlaces(places:PlaceTypes[]){
    this.places=places;
  }

  @Action
  async getPlaces(){
    const places = await placeApi.getPlaces();
    this.setPlaces(places);
  }

}

export const placeStore = new PlaceStore({store, name: "placeStore" })
