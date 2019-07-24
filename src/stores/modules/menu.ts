import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import store from '@/stores'

export interface SideMenuTypes {
  icon:string;
  iconClass:string;
  title:string;
  subtitle:string;
  link:string;
}

@Module
class MenuStore extends VuexModule {
  drawer:boolean = false;
  miniVariant:boolean = false;

  sideMenuItems:SideMenuTypes[] = [
    {icon: 'date_range', iconClass: 'amber lighten-1 white--text', title: '모임관리', subtitle: '모임 생성,삭제 출석관리', link:"events"},
    {icon: 'people', iconClass: 'amber lighten-1 white--text', title: '회원관리', subtitle: '회원 신규,수정,삭제 관리', link:"members"},
    {icon: 'insert_chart', iconClass: 'amber lighten-1 white--text', title: '통계보기', subtitle: '여러가지 통계 보기', link:"statistics"}
  ];

  @Mutation
  setDrawer(drawer:boolean){
    this.drawer = drawer;
  }

  @Action
  setDrawerAction(payload:boolean){
    this.setDrawer(payload);
  }

}

export const menuStore = new MenuStore({store, name: "menuStore" })
