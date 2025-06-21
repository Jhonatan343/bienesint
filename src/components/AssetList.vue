<template>
  <div>
    <h2>Lista de Bienes</h2>
    <ul>
      <li v-for="bien in bienes" :key="bien.id_bien">
        {{ bien.codigo_institucional }} — {{ bien.clase_de_bien }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.js'

export default {
  name: 'AssetList',
  data() {
    return {
      bienes: []
    }
  },
  async created() {
    const auth = useAuthStore()
    const token = auth.token
    try {
      const resp = await axios.get(
        `${process.env.VUE_APP_API_URL || 'http://localhost:3000/api'}/bienes`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      this.bienes = resp.data
    } catch (e) {
      console.error('No pude cargar bienes:', e)
    }
  }
}
</script>
