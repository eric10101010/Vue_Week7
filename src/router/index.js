import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    //前台
    {
      path: '/',
      component: () => import('../view/Front/FrontView.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../view/Front/HomeView.vue'),
        },
        {
          path: 'about',
          name: 'About',
          component: () => import('../view/Front/AboutView.vue'),
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('../view/Front/ProductsView.vue'),
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import('../view/Front/CartView.vue'),
        },
      ],
    },
    //登入頁
    {
      path: '/login',
      component: () => import('../view/LoginView.vue'),
    },
    //後台
    {
      path: '/admin',
      component: () => import('../view/DashBoard/DashBoardView.vue'),
      children: [
        {
          path: 'products',
          component: () => import('../view/DashBoard/ProductsView.vue'),
        },
        {
          path: 'order',
          component: () => import('../view/DashBoard/OrderView.vue'),
        },
        {
          path: 'coupon',
          component: () => import('../view/DashBoard/CouponView.vue'),
        }
      ],
    },
  ]
})

export default router

