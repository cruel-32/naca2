import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import contentApi from '@/api/content'

@Module
class ContentStore extends VuexModule {
  contents:ContentTypes[] = [];

  @Mutation
  setContents(contents:ContentTypes[]){
    this.contents=contents;
  }

  @Action
  async getContents(){
    const {contents} = await contentApi.getContents();
    this.setContents(contents);
  }

}

export const contentStore = new ContentStore({store, name: "contentStore" })
