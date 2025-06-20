// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

const API = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    user: JSON.parse(localStorage.getItem('auth_user') || 'null')
  }),
  getters: {
    isLogged: (state) => !!state.token
  },
  actions: {
    async login(email, cedula) {
      const { data } = await axios.post(`${API}/auth/login`, { email, cedula })
      this.token = data.token
      this.user  = data.user
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      // redirige según rol
      if (data.user.role === 'administrator') router.push('/dashboard')
      else router.push('/mis-bienes')
    },
    logout() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      this.token = null
      this.user  = null
      router.push('/login')
    }
  }
})
