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
      title: '통계보기', subtitle: '여러가지 통계 보기', link: "dashboard",
    }
  ];

  // { header: '통계목록',icon:'insert_chart'},
   dashboardMenu:any = [
    {
      title: '회원별 참여도 통계',
      subtitle: "회원별 참여날짜 및 기타 통계를 봅니다.",
      link: '/dashboard/members'
    },
    { divider: true},
    {
      title: '회원 나이대 통계',
      subtitle: "평균연령 및 나이대별 회원 분포도 등의 통계를 봅니다.",
      link: '/dashboard/membersAge'
    },
    { divider: true},
    {
      title: '월별 모임 관련 통계',
      subtitle: "월별 모임 관련 통계를 봅니다.",
      link: '/dashboard/eventsMonth'
    },
    { divider: true},
    {
      title: '연별 모임 관련 통계',
      subtitle: "연별 모임 관련 통계를 봅니다.",
      link: '/dashboard/eventsYear'
    },
  ]

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
