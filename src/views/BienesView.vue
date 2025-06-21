<template>
  <div class="bienes-container">
    <h2>Mis Bienes</h2>
    <div v-if="bienes.length === 0">No tienes bienes asignados.</div>
    <table v-else class="bienes-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bien in bienes" :key="bien.id">
          <td>{{ bien.nombre }}</td>
          <td>{{ bien.categoria }}</td>
          <td>{{ bien.estado }}</td>
          <td>{{ bien.valor }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'BienesView',
  setup() {
    const store = useStore();
    // Simulación: filtra bienes por usuario logueado
    const bienes = computed(() => {
      const all = store.state.asset.bienes || [];
      const user = store.state.user.currentUser;
      if (!user) return [];
      if (user.role === 'Administrador') return all;
      return all.filter(b => b.responsableId === user.id);
    });
    return { bienes };
  }
};
</script>

<style scoped>
.bienes-container { max-width: 800px; margin: 2rem auto; background: #fff; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 8px #eee; }
.bienes-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
.bienes-table th, .bienes-table td { border: 1px solid #eee; padding: 0.5rem; text-align: left; }
</style>
