import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import ('components/login/login.vue')
const Home = () => import ('components/home/home.vue')
const Publish = () => import ('components/publish/publish.vue')
const Answer = () => import ('components/answer/answer.vue')
const Summary = () => import ('components/summary/summary.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
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
