import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/About.vue')
  },
  {
    path: '/room',
    name: 'Room',
    component: () => import(/* webpackChunkName: "about" */ '../components/Room.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
