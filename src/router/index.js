import Vue from 'vue'
import VueRouter from 'vue-router'
// import Store from '../vuex/store'
import VisitorList from '@/pages/visitorList'
import InsertVisitor from '@/pages/insertVisitor'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: '申请列表',
      component: VisitorList,
      meta: {requireAuth: false}
    },
    {
      path: '/InsertVisitor',
      name: '访客邀请',
      component: InsertVisitor,
      meta: {requireAuth: false}
    }
    // {path: '*', redirect: '/home'}
  ]
})
// 导航显示当前路由名称
router.afterEach((to, from, next) => {
  // var ISMobile = deviceInfo()
  // Store.state.activeRoute=to.name;
  // Store.state.isMobile=!ISMobile;
  // document.title = to.name
  // console.log(to.name)
  // Store.commit('ROUTE_CHANGE', {activeRoute: to.name})
})
export default router
