import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index',
      name: 'home',
      component: ()=> import('@/views/Main/Home.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/Events/Events.vue'),
    },
    {
      path: '/events/detail',
      name: 'eventCreate',
      props: route=>({
        query : route.query
      }),
      component: () => import('@/views/Events/EventDetail.vue'),
    },
    {
      path: '/events/detail/:key',
      name: 'eventUpdate',
      props: route=>({
        params : route.params
      }),
      component: () => import('@/views/Events/EventDetail.vue'),
    },
    {
      path: '/members',
      name: 'members',
      props: (route) => ({
        query: route.query
      }),
      component: () => import('@/views/Members/Members.vue'),
    },
    {
      path: '/members/detail',
      name: 'memberCreate',
      props: (route) => ({
        query : route.query
      }),
      component: () => import('@/views/Members/MemberDetail.vue'),
    },
    {
      path: '/members/detail/:key',
      name: 'memberUpdate',
      props: (route) => ({
        params : route.params,
      }),
      component: () => import('@/views/Members/MemberDetail.vue'),
    },
    
    {
      path: '/dashboard',
      name: 'dashboard',
      props: (route) => ({
        params : route.params,
        query: route.query
      }),
      component: () => import('@/views/Dashboard/Dashboard.vue'),
    },

    {
      path: '/dashboard/members',
      name: 'dashboard-members',
      props: (route) => ({
        params : route.params,
        query: route.query
      }),
      component: () => import('@/views/Dashboard/DashboardMembers.vue'),
    },

    {
      path: '/dashboard/members/detail/:key',
      name: 'membersPartiDetail',
      props: (route) => ({
        params : route.params,
      }),
      component: () => import('@/views/Dashboard/DashboardMemberDetail.vue'),
    },
    {
      path: '/dashboard/memberAll',
      name: 'memberAll',
      props: (route) => ({
        query: route.query
      }),
      component: () => import('@/views/Dashboard/DashboardMemberAll.vue'),
    },

    {
      path: '/dashboard/eventAll',
      name: 'eventAll',
      props: (route) => ({
        query: route.query
      }),
      component: () => import('@/views/Dashboard/DashboardEventAll.vue'),
    },
  ]
})
