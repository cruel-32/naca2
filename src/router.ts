import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=> import('@/views/Main/Home.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/Events/Events.vue'),
    },
    {
      path: '/event/detail',
      name: 'eventCreate',
      props: route=>({
        query : route.query
      }),
      component: () => import('@/views/Events/EventDetail.vue'),
    },
    {
      path: '/event/detail/:key',
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
      path: '/member/detail',
      name: 'memberCreate',
      props: (route) => ({
        query : route.query
      }),
      component: () => import('@/views/Members/MemberDetail.vue'),
    },
    {
      path: '/member/detail/:key',
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

    // {
    //   path: '/statistics/membersParti',
    //   name: 'membersParti',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/MembersParti.vue'),
    // },
    // {
    //   path: '/statistics/membersParti/:key',
    //   name: 'membersPartiDetail',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/MembersPartiDetail.vue'),
    // },
    // {
    //   path: '/statistics/membersAge',
    //   name: 'membersAge',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/MembersAge.vue'),
    // },
    // {
    //   path: '/statistics/eventssStats',
    //   name: 'eventssStats',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/EventsStats.vue'),
    // },
    // {
    //   path: '/statistics/eventssStatsDetail/:YYYYMM',
    //   name: 'eventssStatsDetail',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/EventsStatsDetail.vue'),
    // },
    // {
    //   path: '/statistics/eventssStatsYear',
    //   name: 'eventssStatsYear',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/EventsStatsYear.vue'),
    // },
  ]
})
