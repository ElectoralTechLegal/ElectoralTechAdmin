import Vue from 'vue'
import VueRouter from 'vue-router'
import logIn from '@/views/authentication/LogIn'

Vue.use(VueRouter)

const dashBoardRoutes = [
  {
    path: 'home',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
    meta: { requiresAuth: true }
  },
  {
    path: 'blog',
    name: 'blog',
    component: () => import(/* webpackChunkName: "Blog" */ '@/views/Blog'),
    meta: { requiresAuth: true }
  },
  {
    path: 'elearning',
    name: 'elearning',
    component: () => import(/* webpackChunkName: "Blog" */ '@/views/Learning'),
    meta: { requiresAuth: true }
  },
  {
    path: 'servicios',
    name: 'servicios',
    component: () => import(/* webpackChunkName: "Servicios" */ '@/views/Servicios'),
    meta: { requiresAuth: true }
  },
  {
    path: 'accesoMarket',
    name: 'accesoMarket',
    component: () => import(/* webpackChunkName: "ContactoMarket" */ '@/views/ContactoMarket'),
    meta: { requiresAuth: true }
  },
  {
    path: '/electoralSearch',
    name: 'electoralSearch',
    component: () => import(/* webpackChunkName: "ElectoralSearch" */ '@/views/ElectoralSearch'),
    meta: { requiresAuth: true }
  },
  {
    path: '/facturacion',
    name: 'facturacion',
    component: () => import(/* webpackChunkName: "ElectoralSearch" */ '@/views/Facturacion'),
    meta: { requiresAuth: true }
  },
  {
    path: '/fidelizacion',
    name: 'fidelizacion',
    component: () => import(/* webpackChunkName: "ElectoralSearch" */ '@/views/Fidelizacion'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documentos',
    name: 'documentos',
    component: () => import(/* webpackChunkName: "ElectoralSearch" */ '@/views/Documentos'),
    meta: { requiresAuth: true }
  }
]

const routes = [
  {
    path: '/',
    name: 'logIn',
    component: logIn,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'dash',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "Dash" */ '@/components/dashboard/dashboard'),
    children: dashBoardRoutes
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const userLog = JSON.parse(sessionStorage.getItem('user'))
  // console.log({to, from, userLog, next})
  
  if(to.meta.requiresAuth && !userLog){
    next({ name: 'logIn' })
  } else {
    next()
  }
})

export default router
