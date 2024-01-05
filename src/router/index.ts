import {createRouter, createWebHashHistory} from 'vue-router'
import staticRoutes from './static-routes'

const router = createRouter({
  routes: [
    ...staticRoutes,
  ],
  history: createWebHashHistory(import.meta.env.VITE_APP_BASE),
})

export default router
