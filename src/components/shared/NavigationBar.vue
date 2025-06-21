<template>
  <nav class="navigation-bar">
    <!-- Fondo sutil con degradado y patrón -->
    <div class="nav-background">
      <div class="nav-gradient"></div>
      <div class="nav-pattern"></div>
    </div>

    <!-- Logo: clic lleva a "/inicio" (InicioView) -->
    <div class="logo">
      <router-link to="/inicio">
        <div class="logo-container">
          <div class="logo-glow"></div>
          <img :src="logo" alt="Instituto Nelson Torres" class="logo-image" />
        </div>
      </router-link>
    </div>

    <!-- Menú de navegación -->
    <ul class="nav-list">
      <li><router-link to="/inicio">Inicio</router-link></li>
      <li><router-link to="/contactos">Contactos</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/dashboard">Dashboard</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/assets">Bienes</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/areas">Áreas</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/users">Usuarios</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/reports">Reportes</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/perfil">Perfil</router-link></li>
      <li v-if="isAuthenticated"><a href="#" @click.prevent="logout">Cerrar sesión</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    logo: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isAuthenticated: false
    };
  },
  mounted() {
    this.syncAuth();
  },
  watch: {
    '$route.path'() {
      this.syncAuth();
    }
  },
  created() {
    window.addEventListener('storage', this.syncAuth);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncAuth);
  },
  methods: {
    syncAuth() {
      this.isAuthenticated = !!localStorage.getItem('auth_token');
    },
    logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      this.isAuthenticated = false;
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* ------------------------------------------------------------
   Asume que estas variables globales están en variables.css:
   --institutional-red, --institutional-black, --institutional-white,
   --gradient-primary, --gradient-secondary,
   --dark-bg, --card-bg, --surface-bg, --border-color,
   --text-primary, --text-secondary,
   --shadow-glow, --shadow-card, --shadow-hover,
   --border-radius, --transition,
   --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg,
   --font-base, --font-heading, etc.
   ------------------------------------------------------------ */

.navigation-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;                           /* ocupa TODO el ancho */
  background: var(--card-bg);
  padding: var(--spacing-md) var(--spacing-lg); /* padding arriba/abajo + lados */
  box-shadow: var(--shadow-card);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  overflow: hidden;
}

.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.nav-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Degradado muy tenue */
  background: linear-gradient(
    135deg,
    var(--institutional-red) 0%,
    transparent 25%,
    var(--institutional-black) 75%,
    var(--institutional-red) 100%
  );
  opacity: 0.02;
}

.nav-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 60px 60px;
  background-image: radial-gradient(
    circle,
    rgba(237, 28, 36, 0.03) 1px,
    transparent 1px
  );
  opacity: 0.3;
}

/* ---------------------------------------------
   Logo (clic lleva a "/")
   --------------------------------------------- */
.logo {
  display: flex;
  align-items: center;
}

.logo-container {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logo-glow {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 84px;
  height: 84px;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0;
  transition: var(--transition);
  z-index: -1;
}

.logo-image {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--border-radius);
  transition: var(--transition);
  box-shadow: var(--shadow-card);
}

.logo-container:hover .logo-image {
  transform: scale(1.08);
  box-shadow: var(--shadow-hover);
}

.logo-container:hover .logo-glow {
  opacity: 0.15;
  transform: scale(1.2);
}

/* ---------------------------------------------
   Lista de enlaces
   --------------------------------------------- */
.nav-list {
  list-style: none;
  display: flex;
  gap: var(--spacing-lg);
  margin: 0;
  padding: 0;
}

.nav-list li {
  position: relative;
}

/* Enlaces base */
.nav-list a {
  color: var(--text-primary);
  text-decoration: none;
  font-family: var(--font-base, 'Segoe UI', sans-serif);
  font-size: 1rem;
  font-weight: 600;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 2px solid transparent;
}

/* Efecto “shine” al hover */
.nav-list a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(237, 28, 36, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.nav-list a:hover::before {
  left: 100%;
}

/* Subrayado animado */
.nav-list a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: var(--institutional-red);
  border-radius: 2px;
  transition: var(--transition);
  transform: translateX(-50%);
}

.nav-list a:hover {
  color: var(--institutional-white);
  background: var(--gradient-primary);
  border-color: var(--institutional-red);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.nav-list a:hover::after {
  width: 70%;
}

/* Enlace activo (ruta actual) */
.nav-list a.router-link-exact-active,
.nav-list a.router-link-active {
  color: var(--institutional-white);
  background: var(--gradient-secondary);
  border-color: var(--institutional-black);
  box-shadow: var(--shadow-hover);
}

.nav-list a.router-link-exact-active::after,
.nav-list a.router-link-active::after {
  width: 70%;
  background: var(--institutional-white);
}

/* ---------------------------------------------
   Responsive
   --------------------------------------------- */
@media (max-width: 1200px) {
  .navigation-bar {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  .nav-list {
    gap: var(--spacing-md);
  }
  .nav-list a {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .navigation-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  .logo-container {
    width: 60px;
    height: 60px;
  }
  .logo-image {
    width: 60px;
    height: 60px;
  }
  .logo-glow {
    width: 72px;
    height: 72px;
  }
  .nav-list {
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .nav-list a {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .navigation-bar {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  .logo-container {
    width: 50px;
    height: 50px;
  }
  .logo-image {
    width: 50px;
    height: 50px;
  }
  .logo-glow {
    width: 62px;
    height: 62px;
  }
  .nav-list {
    gap: var(--spacing-xs);
  }
  .nav-list a {
    padding: 4px 8px;
    font-size: 0.85rem;
  }
}

/* ---------------------------------------------
   Animaciones adicionales
   --------------------------------------------- */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
