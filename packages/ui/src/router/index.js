import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import InitGame from '../views/InitGame.vue'
import Disclaimer from '../views/Disclaimer.vue'
import { useStore } from '@/stores/player'
import { createApp } from 'vue'
import Scan from '../views/Scan.vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'

export const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const loginInfo = store.getToken()
      if (loginInfo && loginInfo.token) {
        console.log(loginInfo, loginInfo.token)
        next({ name: 'main', params: { id: loginInfo.key } })
      } else {
        console.log('init game')
        next('init-game')
      }
    }
  },
  {
    name: 'disclaimer',
    path: '/disclaimer',
    component: Disclaimer
  },
  {
    name: 'main',
    path: '/:id',
    component: Main
  },
  {
    name: 'init-game',
    path: '/init-game',
    component: InitGame
  },
  {
    path: '/scan',
    component: Scan
  },
  {
    name: 'import',
    path: '/import',
    beforeEnter: (to, from, next) => {
      console.log('to', to)
      const { username, token, key } = to.query

      if (!username || !token || !key) {
        next('/')
      } else {
        localStorage.setItem(
          'tokenInfo',
          JSON.stringify({ username, token, key })
        )

        next(`/${key}`)
      }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(to => {
  const playerStore = useStore()

  if (to.meta.requiresAuth && !playerStore.isLoggedIn) return '/login'
})

export default router
