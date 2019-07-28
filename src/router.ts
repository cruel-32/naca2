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
      component: ()=> import('./views/Main/Home.vue'),
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
      component: () => import('./views/Events/EventDetail.vue'),
    },
    {
      path: '/event/detail/:uid',
      name: 'eventUpdate',
      component: () => import('./views/Events/EventDetail.vue'),
    },
    // {
    //   path: '/members',
    //   name: 'members',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/Members.vue'),
    // },
    // {
    //   path: '/member',
    //   name: 'memberCreate',
    //   props: (route) => ({
    //     params : route.params,
    //     query : route.query
    //   }),
    //   component: () => import('./views/MemberCreate.vue'),
    // },
    // {
    //   path: '/member/:key',
    //   name: 'memberUpdate',
    //   props: (route) => ({
    //     params : route.params,
    //     query : route.query
    //   }),
    //   component: () => import('./views/MemberCreate.vue'),
    // },
    // {
    //   path: '/statistics',
    //   name: 'statistics',
    //   props: (route) => ({
    //     params : route.params,
    //     query: route.query
    //   }),
    //   component: () => import('./views/Statistics.vue'),
    // },
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
