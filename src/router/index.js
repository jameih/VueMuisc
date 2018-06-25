import Vue from 'vue'
import Router from 'vue-router'
import rank from '@/components/rank/rank'
import recommend from '@/components/recommend/recommend'
import search from '@/components/search/search'
import singer from '@/components/singer/singer'
import singerDetail from '@/components/singer-detail/singer-detail'
import playListDetail from '@/components/playlist-detail/playlist-detail'
import rankDetail from '@/components/rank-detail/rank-detail'
import nofound from '@/components/nofound/nofound.vue'
import user from '@/components/user/user.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
      children:[
        {
          path:':id',
          component:rankDetail
        }
      ]
    }, {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: playListDetail
        }
      ]
    }, {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path:'/user',
      name:'user',
      component:user
    },
    {
      path:'*',
      name:'NoFound',
      component:nofound
    }
  ]
})
