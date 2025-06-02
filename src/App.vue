<template>
  <div id="app">
    <!-- Barra de navegación ocupa todo el ancho -->
    <NavigationBar :logo="logo" />

    <!-- Contenedor centrado para las vistas -->
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavigationBar from './components/shared/NavigationBar.vue';
import logo from '@/assets/imagen.png'; // Asegúrate de que esta ruta exista

export default {
  name: 'App',
  components: {
    NavigationBar
  },
  data() {
    return {
      logo
    };
  }
};
</script>

<style>
/* Estilos globales */
#app {
  font-family: var(--font-base, 'Avenir', Helvetica, Arial, sans-serif);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-primary);
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background: var(--dark-bg);
  box-sizing: border-box;
}

/* Contenedor para centrar el contenido de cada vista */
.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  box-sizing: border-box;
}
</style>

