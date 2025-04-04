import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/reader',
      name: 'ReaderTemplate',
      component: () => import('@/views/reader/ReaderTemplate.vue'),
      children: [
        {
          path: '',
          name: 'TextReader',
          component: () => import('@/views/reader/TextReaderView.vue')
        }
      ]
    }
  ],
})

export default router
