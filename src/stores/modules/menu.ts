import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

@Module
class MenuStore extends VuexModule {
  drawer:boolean = false;
  miniVariant:boolean = false;
  progress:boolean = false;

  sideMenuItems:SideMenuTypes[] = [
    {
      icon: 'date_range', iconClass: 'amber lighten-1 white--text', color:"amber",
      title: '이벤트관리', subtitle: '이벤트 생성,삭제 출석관리', link: "events",
    },
    {
      icon: 'people', iconClass: 'amber lighten-1 white--text', color:"brown",
      title: '회원관리', subtitle: '회원 신규,수정,삭제 관리', link: "members",
    },
    {
      icon: 'insert_chart', iconClass: 'amber lighten-1 white--text', color:"blue-grey",
      title: '통계보기', subtitle: '여러가지 통계 보기', link: "statistics",
    }
  ];

  @Mutation
  setDrawer(drawer:boolean){
    this.drawer = drawer;
  }
  @Mutation
  setProgress(progress:boolean){
    this.progress = progress;
  }

  @Action
  setDrawerAction(payload:boolean){
    this.setDrawer(payload);
  }

  @Action
  setProgressAction(payload:boolean){
    this.setProgress(payload);
  }

}

export const menuStore = new MenuStore({store, name: "menuStore" })
