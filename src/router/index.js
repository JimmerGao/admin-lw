import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import login from "@/views/login"
import add from "@/views/add"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      meta:{
        title: "首页"
      },
      component: index
    },
    {
      path: '/',
      meta:{
        title: "登录"
      },
      name: 'login',
      component: login
    },
    {
      path: '/add',
      meta:{
        title: "新增"
      },
      name: 'add',
      component: add
    }
  ]
})
