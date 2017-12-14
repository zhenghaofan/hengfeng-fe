import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import ('components/login/login.vue')
const Category = () => import ('components/category/category.vue')
const Publish = () => import ('components/publish/publish.vue')
const Answer = () => import ('components/answer/answer.vue')
const Summary = () => import ('components/summary/summary.vue')

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: '/mobile/', //上线必须配置
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/category',
      component: Category
    },
    {
      path: '/publish',
      name: 'publish',
      component: Publish
    },
    {
      path: '/answer',
      name: 'answer',
      component: Answer
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary
    }
  ]
})
