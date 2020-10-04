import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main.vue'
import fourOhFour from '../components/404Page.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/room',
    name: 'Room',
    component: () => import(/* webpackChunkName: "room" */ '../components/Room.vue')
  },
  {
    path: '*',
    name: '404',
    component: fourOhFour
  }
]

const router = new VueRouter({
  routes
})

export default router
