import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/dashboard/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      redirect: '/dashboard/profile',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard/profile')
  } else {
    next()
  }
})

export default router
