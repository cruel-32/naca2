import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'
import contentApi from '@/api/content'

@Module
class ContentStore extends VuexModule {
  contents:IContentTypes[] = [];

  @Mutation
  setContents(contents:IContentTypes[]){
    this.contents=contents;
  }

  @Action
  async getContents():Promise<ISnackbarTypes>{
    const contents:IContentTypes[] = await contentApi.getContents();
    this.setContents(contents);

    const msg:ISnackbarTypes = {
      snackColor:'error',
      snackText:'contents 가져오기 실패'
    }
    if(contents){
      msg.snackColor = 'success';
      msg.snackText = 'contents 가져오기 성공';
    }
    return msg
  }

}

export const contentStore = new ContentStore({store, name: "contentStore" })
