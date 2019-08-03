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
  async getPlaces():Promise<SnackbarTypes>{
    const places:PlaceTypes[] = await placeApi.getPlaces();
    this.setPlaces(places);

    const msg:SnackbarTypes = {
      snackColor:'error',
      snackText:'places 가져오기 실패'
    }
    if(places){
      msg.snackColor = 'success';
      msg.snackText = 'places 가져오기 성공';
    }
    return msg
  }

}

export const placeStore = new PlaceStore({store, name: "placeStore" })
