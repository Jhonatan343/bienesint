// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'boxicons/css/boxicons.min.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@/assets/styles/variables.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast, { /* opciones si quieres */ })
app.mount('#app')

console.log('🚀 Iniciando aplicación...')
console.log('🔧 VUE_APP_API_URL:', process.env.VUE_APP_API_URL)
