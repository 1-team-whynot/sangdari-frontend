import { createRouter, createWebHistory } from 'vue-router'

import PaymentPage from '../domains/payment/pages/PaymentPage.vue'
import PaymentSuccessPage from '../domains/payment/pages/PaymentSuccessPage.vue'
import PaymentFailPage from '../domains/payment/pages/PaymentFailPage.vue'
import PaymentCompletePage from '../domains/payment/pages/PaymentCompletePage.vue'

const routes = [
  {
    path: '/',
    redirect: '/payment',
  },
  {
    path: '/payment',
    name: 'Payment',
    component: PaymentPage,
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccessPage,
  },
  {
    path: '/payment/fail',
    name: 'PaymentFail',
    component: PaymentFailPage,
  },
  {
    path: '/payment/complete',
    name: 'PaymentComplete',
    component: PaymentCompletePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router