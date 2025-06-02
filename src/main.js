// src/main.js - Versión simplificada
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'boxicons/css/boxicons.min.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '../src/assets/styles/variables.css'

console.log('🚀 Iniciando aplicación...');
console.log('🔧 VUE_APP_API_URL:', process.env.VUE_APP_API_URL);

createApp(App)
  .use(store)
  .use(router)
  .use(Toast)
  .mount('#app')