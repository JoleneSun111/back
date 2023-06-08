import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/store"

Vue.use(VueRouter)

const routes = [
/*  {
    path: '/',
    name: 'Manage',
    component: () =>import('../views/Manage'),
    children:[
        { path: 'user',
      name: 'User',
      component: () =>import('../views/User')
    },
      { path: 'home',
        name: 'Home',
        component: () =>import('../views/Home')
      },
      {
        path: 'file',
        name:'File',
        component: () => import('../views/File')
      },
      {
        path: 'role',
        name:'Role',
        component: () => import('../views/Role')
      },
      {
        path: 'menu',
        name:'Menu',
        component: () => import('../views/Menu')
      },
      {
        path: 'person',
        name:'Person',
        component: () => import('../views/Person')
      }

    ]
  },*/
  {
    path: '/login' ,
    name: 'Login',
    component: () =>import('../views/Login')
  },
  {
    path: '/regis' ,
    name: ' Register',
    component: () =>import('../views/Register')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 提供一个重置路由的方法
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}
// 路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称，为了在Header组件中去使用
  store.commit("setPath")  // 触发store的数据更新
  next()  // 放行路由
})

export default router

//动态拼接路由
export const setRoutes = () => {
  const storeMenus = localStorage.getItem("menus");
  if(storeMenus){
   const currentRouteNames = router.getRoutes().map(v=> v.name);
   if(!currentRouteNames.includes('Manage')){
     // 拼装动态路由
     const manageRoute = {
       path:'/',
       name:'Manage',
       component:() => import('../views/Manage.vue'),
       redirect: "/home",
       children:[
         {
           path: 'person',
           name:'Person',
           component: () => import('../views/Person')
         }

       ]}
     const menus = JSON.parse(storeMenus);
     alert(menus)
     console.log(menus)
     menus.forEach(item => {
       if(item.path){
         let itemMenu = {path:item.path.replace("/",""),name:item.name, component:() => import('../views/'+item.pagePath +'.vue')}
        manageRoute.children.push(itemMenu)
       }else if(item.children.length){
         item.children.forEach(item => {
           if(item.path){
             let itemMenu = {path:item.path.replace("/",""),name:item.name, component:() => import('../views/'+item.pagePath +'.vue')}
             manageRoute.children.push(itemMenu)}
         })
       }
         })


     router.addRoute(manageRoute)
   }


  }

}

//刷新页面,路由重置
setRoutes()
