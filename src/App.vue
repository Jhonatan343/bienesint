<template>
  <div id="app">
    <!-- Barra de navegación siempre visible -->
    <NavigationBar :logo="logo" />
    <div class="content-container" :class="{ 'no-padding': $route.path === '/login' }">
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
  position: relative;
  z-index: 1;
}
.content-container.no-padding {
  padding: 0;
  max-width: 100vw;
}

/* Corrige el z-index de la barra de navegación para que esté por encima del login */
.navigation-bar {
  z-index: 1002 !important;
  position: relative;
}

/* Corrige el z-index del login para que no tape la barra */
.login-page {
  z-index: 1 !important;
  position: relative !important;
}
</style>

