import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/orders/new',
      name: 'new-order',
      component: () => import('../views/NewOrderView.vue'),
    },
    {
      path: '/my-orders',
      name: 'my-orders',
      component: () => import('../views/MyOrdersView.vue'),
    },
    {
      path: '/orders/shared/:orderId',
      name: 'shared-order',
      component: () => import('../views/SharedOrderView.vue'),
    },
  ],
})

export default router
