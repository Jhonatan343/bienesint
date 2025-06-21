<template>
  <div class="navigation-wrapper">
    <!-- Overlay para móvil -->
    <div 
      v-if="isMobile && isOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

<<<<<<< HEAD
    <!-- Logo: clic lleva a "/inicio" (InicioView) -->
    <div class="logo">
      <router-link to="/inicio">
        <div class="logo-container">
          <div class="logo-glow"></div>
          <img :src="logo" alt="Instituto Nelson Torres" class="logo-image" />
=======
    <!-- Menú lateral -->
    <nav :class="['sidebar', { 'collapsed': isCollapsed, 'mobile-open': isMobile && isOpen }]">
      <!-- Header del menú -->
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-box"></i>
          </div>
          <span v-show="!isCollapsed" class="logo-text">Sistema de Bienes</span>
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
        </div>
        
        <!-- Botón colapsar para desktop -->
        <button 
          v-if="!isMobile"
          class="collapse-btn"
          @click="toggleCollapse"
          :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
        >
          <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>

<<<<<<< HEAD
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
=======
        <!-- Botón cerrar para móvil -->
        <button 
          v-if="isMobile"
          class="close-btn"
          @click="closeMobileMenu"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Información del usuario -->
      <div class="user-info">
        <div class="user-avatar">
          <img 
            v-if="usuario.avatar" 
            :src="usuario.avatar" 
            :alt="usuario.nombre"
            class="avatar-img"
          >
          <div v-else class="avatar-placeholder">
            {{ getInitials(usuario.nombre) }}
          </div>
          <div class="status-indicator" :class="usuario.estado.toLowerCase()"></div>
        </div>
        <div v-show="!isCollapsed" class="user-details">
          <span class="user-name">{{ usuario.nombre }}</span>
          <span class="user-role" :class="usuario.rol.toLowerCase()">
            <i :class="getRoleIcon(usuario.rol)"></i>
            {{ usuario.rol }}
          </span>
        </div>
      </div>

      <!-- Navegación principal -->
      <div class="navigation-content">
        <!-- Sección: Principal -->
        <div class="nav-section">
          <div v-show="!isCollapsed" class="section-title">Principal</div>
          
          <router-link 
            v-for="item in menuItemsPrincipal" 
            :key="item.name"
            :to="item.route"
            class="nav-item"
            :class="{ 'active': isActiveRoute(item.route) }"
            @click="handleNavClick"
          >
            <div class="nav-icon">
              <i :class="item.icon"></i>
              <span v-if="item.badge" class="nav-badge" :class="item.badgeType">
                {{ item.badge }}
              </span>
            </div>
            <span v-show="!isCollapsed" class="nav-text">{{ item.label }}</span>
            <div v-if="item.submenu && !isCollapsed" class="nav-arrow">
              <i class="fas fa-chevron-down"></i>
            </div>
          </router-link>
        </div>

        <!-- Sección: Gestión (Solo Administradores) -->
        <div v-if="isAdmin" class="nav-section">
          <div v-show="!isCollapsed" class="section-title">Gestión del Sistema</div>
          
          <router-link 
            v-for="item in menuItemsGestion" 
            :key="item.name"
            :to="item.route"
            class="nav-item"
            :class="{ 'active': isActiveRoute(item.route) }"
            @click="handleNavClick"
          >
            <div class="nav-icon">
              <i :class="item.icon"></i>
              <span v-if="item.badge" class="nav-badge" :class="item.badgeType">
                {{ item.badge }}
              </span>
            </div>
            <span v-show="!isCollapsed" class="nav-text">{{ item.label }}</span>
          </router-link>
        </div>

        <!-- Sección: Reportes -->
        <div class="nav-section">
          <div v-show="!isCollapsed" class="section-title">
            {{ isAdmin ? 'Reportes y Análisis' : 'Mis Reportes' }}
          </div>
          
          <router-link 
            v-for="item in menuItemsReportes" 
            :key="item.name"
            :to="item.route"
            class="nav-item"
            :class="{ 'active': isActiveRoute(item.route) }"
            @click="handleNavClick"
          >
            <div class="nav-icon">
              <i :class="item.icon"></i>
            </div>
            <span v-show="!isCollapsed" class="nav-text">{{ item.label }}</span>
          </router-link>
        </div>

        <!-- Sección: Configuración -->
        <div class="nav-section">
          <div v-show="!isCollapsed" class="section-title">Configuración</div>
          
          <router-link 
            v-for="item in menuItemsConfiguracion" 
            :key="item.name"
            :to="item.route"
            class="nav-item"
            :class="{ 'active': isActiveRoute(item.route) }"
            @click="handleNavClick"
          >
            <div class="nav-icon">
              <i :class="item.icon"></i>
            </div>
            <span v-show="!isCollapsed" class="nav-text">{{ item.label }}</span>
          </router-link>
        </div>
      </div>

      <!-- Footer del menú -->
      <div class="sidebar-footer">
        <!-- Acciones rápidas -->
        <div class="quick-actions">
          <button 
            class="quick-action-btn"
            @click="toggleNotifications"
            :title="isCollapsed ? 'Notificaciones' : ''"
          >
            <i class="fas fa-bell"></i>
            <span v-if="notificaciones > 0" class="notification-count">{{ notificaciones }}</span>
            <span v-show="!isCollapsed" class="action-text">Notificaciones</span>
          </button>

          <button 
            class="quick-action-btn"
            @click="toggleHelp"
            :title="isCollapsed ? 'Ayuda' : ''"
          >
            <i class="fas fa-question-circle"></i>
            <span v-show="!isCollapsed" class="action-text">Ayuda</span>
          </button>
        </div>

        <!-- Cerrar sesión -->
        <button 
          class="logout-btn"
          @click="logout"
          :title="isCollapsed ? 'Cerrar Sesión' : ''"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span v-show="!isCollapsed" class="logout-text">Cerrar Sesión</span>
        </button>

        <!-- Toggle tema oscuro -->
        <button 
          class="theme-toggle"
          @click="toggleTheme"
          :title="isCollapsed ? 'Cambiar Tema' : ''"
        >
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          <span v-show="!isCollapsed" class="theme-text">
            {{ isDarkMode ? 'Modo Claro' : 'Modo Oscuro' }}
          </span>
        </button>
      </div>
    </nav>

    <!-- Botón de menú para móvil -->
    <button 
      v-if="isMobile"
      class="mobile-menu-btn"
      @click="openMobileMenu"
    >
      <i class="fas fa-bars"></i>
    </button>

    <!-- Panel de notificaciones -->
    <transition name="slide-fade">
      <div v-if="showNotifications" class="notifications-panel">
        <div class="panel-header">
          <h3>Notificaciones</h3>
          <button @click="toggleNotifications" class="panel-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="panel-content">
          <div v-if="notificationsList.length === 0" class="no-notifications">
            <i class="fas fa-bell-slash"></i>
            <p>No tienes notificaciones</p>
          </div>
          <div v-else class="notifications-list">
            <div 
              v-for="notification in notificationsList" 
              :key="notification.id"
              class="notification-item"
              :class="notification.type"
            >
              <div class="notification-icon">
                <i :class="notification.icon"></i>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-message">{{ notification.message }}</div>
                <div class="notification-time">{{ formatTime(notification.time) }}</div>
              </div>
              <button @click="dismissNotification(notification.id)" class="notification-dismiss">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'NavigationMenu',
  props: {
    usuario: {
      type: Object,
      required: true
    }
  },
<<<<<<< HEAD
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
=======
  emits: ['logout', 'toggle-theme', 'navigate'],
  setup(props, { emit }) {
    const route = useRoute();
    
    // Estado del menú
    const isCollapsed = ref(false);
    const isMobile = ref(false);
    const isOpen = ref(false);
    const isDarkMode = ref(false);
    const showNotifications = ref(false);
    const notificaciones = ref(3);

    // Notificaciones de ejemplo
    const notificationsList = ref([
      {
        id: 1,
        type: 'warning',
        icon: 'fas fa-exclamation-triangle',
        title: 'Mantenimiento Pendiente',
        message: '5 bienes requieren mantenimiento preventivo',
        time: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
      },
      {
        id: 2,
        type: 'success',
        icon: 'fas fa-check-circle',
        title: 'Solicitud Aprobada',
        message: 'Tu solicitud de nueva laptop ha sido aprobada',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 horas atrás
      },
      {
        id: 3,
        type: 'info',
        icon: 'fas fa-info-circle',
        title: 'Actualización del Sistema',
        message: 'Nueva versión disponible con mejoras de seguridad',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 día atrás
      }
    ]);

    // Computed properties
    const isAdmin = computed(() => props.usuario.rol === 'Administrador');

    // Menú items - Principal (todos los usuarios)
    const menuItemsPrincipal = computed(() => [
      {
        name: 'dashboard',
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        route: '/dashboard',
        badge: null
      },
      {
        name: 'mis-bienes',
        label: 'Mis Bienes',
        icon: 'fas fa-user-tag',
        route: '/mis-bienes',
        badge: '8', // Número de bienes asignados
        badgeType: 'primary'
      },
      {
        name: 'solicitudes',
        label: 'Mis Solicitudes',
        icon: 'fas fa-clipboard-list',
        route: '/solicitudes',
        badge: '2', // Solicitudes pendientes
        badgeType: 'warning'
      },
      {
        name: 'perfil',
        label: 'Mi Perfil',
        icon: 'fas fa-user-circle',
        route: '/perfil',
        badge: null
      }
    ]);

    // Menú items - Gestión (solo administradores)
    const menuItemsGestion = computed(() => [
      {
        name: 'gestion-usuarios',
        label: 'Gestión de Usuarios',
        icon: 'fas fa-users-cog',
        route: '/gestion/usuarios',
        badge: '15', // Usuarios pendientes de aprobación
        badgeType: 'info'
      },
      {
        name: 'gestion-bienes',
        label: 'Gestión de Bienes',
        icon: 'fas fa-boxes',
        route: '/gestion/bienes',
        badge: null
      },
      {
        name: 'asignaciones',
        label: 'Asignaciones',
        icon: 'fas fa-user-friends',
        route: '/gestion/asignaciones',
        badge: null
      },
      {
        name: 'mantenimiento',
        label: 'Mantenimiento',
        icon: 'fas fa-tools',
        route: '/gestion/mantenimiento',
        badge: '7', // Mantenimientos pendientes
        badgeType: 'warning'
      },
      {
        name: 'ubicaciones',
        label: 'Ubicaciones',
        icon: 'fas fa-map-marker-alt',
        route: '/gestion/ubicaciones',
        badge: null
      },
      {
        name: 'categorias',
        label: 'Categorías',
        icon: 'fas fa-tags',
        route: '/gestion/categorias',
        badge: null
      }
    ]);

    // Menú items - Reportes
    const menuItemsReportes = computed(() => {
      const baseReports = [
        {
          name: 'reporte-inventario',
          label: isAdmin.value ? 'Inventario General' : 'Mi Inventario',
          icon: 'fas fa-file-alt',
          route: '/reportes/inventario'
        },
        {
          name: 'reporte-estado',
          label: 'Estado de Bienes',
          icon: 'fas fa-chart-pie',
          route: '/reportes/estado'
        }
      ];

      if (isAdmin.value) {
        baseReports.push(
          {
            name: 'reporte-valoracion',
            label: 'Valoración de Activos',
            icon: 'fas fa-chart-line',
            route: '/reportes/valoracion'
          },
          {
            name: 'reporte-depreciacion',
            label: 'Depreciación',
            icon: 'fas fa-chart-bar',
            route: '/reportes/depreciacion'
          },
          {
            name: 'reporte-auditoria',
            label: 'Auditoría',
            icon: 'fas fa-shield-alt',
            route: '/reportes/auditoria'
          }
        );
      }

      return baseReports;
    });

    // Menú items - Configuración
    const menuItemsConfiguracion = computed(() => {
      const baseConfig = [
        {
          name: 'notificaciones',
          label: 'Notificaciones',
          icon: 'fas fa-bell',
          route: '/configuracion/notificaciones'
        }
      ];

      if (isAdmin.value) {
        baseConfig.unshift(
          {
            name: 'configuracion-sistema',
            label: 'Sistema',
            icon: 'fas fa-cogs',
            route: '/configuracion/sistema'
          },
          {
            name: 'respaldos',
            label: 'Respaldos',
            icon: 'fas fa-database',
            route: '/configuracion/respaldos'
          }
        );
      }

      return baseConfig;
    });

    // Métodos
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
      if (!isMobile.value) {
        isOpen.value = false;
      }
    };

    const getInitials = (nombre) => {
      return nombre
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const getRoleIcon = (rol) => {
      const icons = {
        'Administrador': 'fas fa-crown',
        'Usuario': 'fas fa-user',
        'Supervisor': 'fas fa-user-tie',
        'Gerente': 'fas fa-briefcase'
      };
      return icons[rol] || 'fas fa-user';
    };

    const isActiveRoute = (routePath) => {
      return route.path === routePath || route.path.startsWith(routePath + '/');
    };

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
      localStorage.setItem('sidebar-collapsed', isCollapsed.value.toString());
    };

    const openMobileMenu = () => {
      isOpen.value = true;
    };

    const closeMobileMenu = () => {
      isOpen.value = false;
    };

    const handleNavClick = () => {
      if (isMobile.value) {
        closeMobileMenu();
      }
      emit('navigate');
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const toggleHelp = () => {
      // Implementar sistema de ayuda
      console.log('Abriendo ayuda...');
    };

    const logout = () => {
      emit('logout');
    };

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      emit('toggle-theme', isDarkMode.value);
      localStorage.setItem('dark-mode', isDarkMode.value.toString());
    };

    const formatTime = (time) => {
      const now = new Date();
      const diff = now - time;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 60) {
        return `Hace ${minutes} min`;
      } else if (hours < 24) {
        return `Hace ${hours} h`;
      } else {
        return `Hace ${days} d`;
      }
    };

    const dismissNotification = (id) => {
      const index = notificationsList.value.findIndex(n => n.id === id);
      if (index > -1) {
        notificationsList.value.splice(index, 1);
        notificaciones.value = notificationsList.value.length;
      }
    };

    // Lifecycle
    onMounted(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);

      // Restaurar configuraciones guardadas
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      const savedDarkMode = localStorage.getItem('dark-mode');
      
      if (savedCollapsed !== null) {
        isCollapsed.value = savedCollapsed === 'true';
      }
      
      if (savedDarkMode !== null) {
        isDarkMode.value = savedDarkMode === 'true';
      }

      // Cerrar notificaciones al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (showNotifications.value && !e.target.closest('.notifications-panel') && !e.target.closest('.quick-action-btn')) {
          showNotifications.value = false;
        }
      });
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    return {
      // Estado
      isCollapsed,
      isMobile,
      isOpen,
      isDarkMode,
      showNotifications,
      notificaciones,
      notificationsList,

      // Computed
      isAdmin,
      menuItemsPrincipal,
      menuItemsGestion,
      menuItemsReportes,
      menuItemsConfiguracion,

      // Métodos
      getInitials,
      getRoleIcon,
      isActiveRoute,
      toggleCollapse,
      openMobileMenu,
      closeMobileMenu,
      handleNavClick,
      toggleNotifications,
      toggleHelp,
      logout,
      toggleTheme,
      formatTime,
      dismissNotification
    };
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navigation-wrapper {
  position: relative;
}

/* Overlay móvil */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Sidebar principal */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar.mobile-open {
  transform: translateX(0);
}

/* Header del sidebar */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #EF4444 0%, #dc2626 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.sidebar-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  backdrop-filter: blur(10px);
}

.logo-text {
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.collapse-btn,
.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.collapse-btn:hover,
.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Información del usuario */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #EF4444, #dc2626);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.activo {
  background: #10b981;
  animation: pulse 2s infinite;
}

.status-indicator.inactivo {
  background: #6b7280;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
  truncate: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.user-role {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 12px;
  width: fit-content;
}

.user-role.administrador {
  background: linear-gradient(135deg, #fef3cd, #fde68a);
  color: #92400e;
}

.user-role i {
  font-size: 0.7rem;
}

/* Contenido de navegación */
.navigation-content {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.navigation-content::-webkit-scrollbar {
  width: 6px;
}

.navigation-content::-webkit-scrollbar-track {
  background: transparent;
}

.navigation-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.section-title {
  padding: 0.5rem 1rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0.5rem;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
  transition: left 0.5s;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  background: #f9fafb;
  color: #1f2937;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #EF4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.nav-item.active:hover {
  transform: translateX(0);
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.nav-icon {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.nav-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-badge.primary {
  background: #3b82f6;
}

.nav-badge.warning {
  background: #f59e0b;
}

.nav-badge.info {
  background: #06b6d4;
}

.nav-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-arrow {
  margin-left: auto;
  transition: transform 0.2s;
}

/* Footer del sidebar */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quick-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  font-size: 0.875rem;
  position: relative;
}

.quick-action-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.notification-count {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 0.125rem 0.25rem;
  border-radius: 8px;
  min-width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-text {
  font-size: 0.75rem;
}

.logout-btn,
.theme-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.logout-btn {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  transform: translateY(-1px);
}

.theme-toggle {
  background: #f3f4f6;
  color: #6b7280;
}

.theme-toggle:hover {
  background: #e5e7eb;
  color: #374151;
}

.logout-text,
.theme-text {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Botón menú móvil */
.mobile-menu-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #EF4444, #dc2626);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  z-index: 998;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

/* Panel de notificaciones */
.notifications-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.panel-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.panel-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.panel-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.panel-content {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.no-notifications i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.notifications-list {
  padding: 0.5rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.warning {
  border-left-color: #f59e0b;
}

.notification-item.success {
  border-left-color: #10b981;
}

.notification-item.info {
  border-left-color: #3b82f6;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.notification-item.warning .notification-icon {
  background: #f59e0b;
}

.notification-item.success .notification-icon {
  background: #10b981;
}

.notification-item.info .notification-icon {
  background: #3b82f6;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.notification-message {
  color: #6b7280;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.7rem;
}

.notification-dismiss {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.notification-dismiss:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Animaciones */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .mobile-menu-btn {
    display: flex;
  }

  .notifications-panel {
    right: 10px;
    left: 10px;
    width: auto;
  }
}

@media (min-width: 769px) {
  .mobile-menu-btn {
    display: none;
  }

  .sidebar {
    transform: translateX(0);
  }
}

/* Estados colapsado para móvil */
@media (max-width: 768px) {
  .sidebar.collapsed {
    width: 280px;
  }
}
</style>