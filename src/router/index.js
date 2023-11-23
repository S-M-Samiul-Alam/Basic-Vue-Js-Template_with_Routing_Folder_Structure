import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import DashBoardView from '../views/DashBoardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      //component: HomeView
      redirect: "/dashboard",
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardView,
      redirect: "/dashboard/category",
      children: [{ path: 'category', name: 'category', component:() => import('../views/CategoryView.vue')  },
                  { path: 'product', name: 'product', component:() => import('../views/ProductView.vue')  },
                ]
      },
  ]
})

export default router
