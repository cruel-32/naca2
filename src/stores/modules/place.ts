import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import placeApi from '@/api/place'

@Module
class PlaceStore extends VuexModule {
  places:IPlaceTypes[] = [];

  @Mutation
  setPlaces(places:IPlaceTypes[]){
    this.places=places;
  }

  @Action
  async getPlaces():Promise<ISnackbarTypes>{
    const places:IPlaceTypes[] = await placeApi.getPlaces();
    this.setPlaces(places);

    const msg:ISnackbarTypes = {
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
