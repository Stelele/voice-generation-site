import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { importIcons } from './helpers/icons'

importIcons()

const app = createApp(App)

app
  .use(router)
  .use(createPinia())
  .mount('#app')
