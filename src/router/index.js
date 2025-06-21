// router/index.js - Router actualizado con sistema de autenticación
import { createRouter, createWebHistory } from 'vue-router';

<<<<<<< HEAD
import LoginView from '../views/LoginView.vue';
=======
// ✅ Importar vistas existentes (mantener tu estructura)
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
import DashboardView from '../views/DashboardView.vue';
import AssetsView from '../views/AssetsView.vue';
import AreasView from '../views/AreasView.vue';
import UsersView from '../views/UsersView.vue';
import ReportsView from '../views/ReportsView.vue';
import PeriodosAcademicosView from '../views/PeriodosAcademicosView.vue';
<<<<<<< HEAD
import RecuperarPasswordView from '../views/RecuperarPasswordView.vue';
import ContactosView from '../views/ContactosView.vue';
import PerfilView from '../views/PerfilView.vue';
import BienesView from '../views/BienesView.vue';
import InicioView from '../views/InicioView.vue';
=======

// ✅ NUEVO: Importar vista de Login
import LoginView from '../views/LoginView.vue';

// ✅ NUEVO: Importar vistas para usuarios normales
const MisBienesView = () => import('../views/MisBienesView.vue');
const PerfilView = () => import('../views/PerfilView.vue');

// ✅ NUEVO: Importar store de autenticación
import { useAuthStore } from '@/stores/auth.js';
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e

const routes = [
  // ✅ NUEVA RUTA: Login (página principal para no autenticados)
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Iniciar Sesión - Instituto Nelson Torres',
      requiresAuth: false,
      hideForAuth: true // Ocultar si ya está autenticado
    }
  },

  // ✅ ACTUALIZADA: Redirección inteligente según autenticación
  {
    path: '/',
<<<<<<< HEAD
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/recuperar-password',
    name: 'RecuperarPassword',
    component: RecuperarPasswordView,
  },
  {
    path: '/contactos',
    name: 'Contactos',
    component: ContactosView,
  },
=======
    redirect: () => {
      // Verificar si hay token de autenticación
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      return token ? '/dashboard' : '/login';
    }
  },

  // ✅ ACTUALIZADA: Dashboard (ahora protegido)
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
<<<<<<< HEAD
    meta: { requiresAuth: true },
=======
    meta: {
      title: 'Panel de Control',
      requiresAuth: true,
      roles: ['administrator', 'user']
    }
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  },

  // ✅ ACTUALIZADA: Assets (solo administradores)
  {
    path: '/assets',
    name: 'Assets',
    component: AssetsView,
<<<<<<< HEAD
    meta: { requiresAuth: true },
=======
    meta: {
      title: 'Gestión de Bienes',
      requiresAuth: true,
      roles: ['administrator']
    }
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  },

  // ✅ ACTUALIZADA: Areas (solo administradores)
  {
    path: '/areas',
    name: 'Areas',
    component: AreasView,
<<<<<<< HEAD
    meta: { requiresAuth: true },
=======
    meta: {
      title: 'Gestión de Áreas',
      requiresAuth: true,
      roles: ['administrator']
    }
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  },

  // ✅ ACTUALIZADA: Users (solo administradores)
  {
    path: '/users',
    name: 'Users',
    component: UsersView,
<<<<<<< HEAD
    meta: { requiresAuth: true },
=======
    meta: {
      title: 'Gestión de Usuarios',
      requiresAuth: true,
      roles: ['administrator']
    }
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  },

  // ✅ ACTUALIZADA: Reports (solo administradores)
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
<<<<<<< HEAD
    meta: { requiresAuth: true },
=======
    meta: {
      title: 'Reportes y Estadísticas',
      requiresAuth: true,
      roles: ['administrator']
    }
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  },

  // ✅ ACTUALIZADA: Períodos Académicos (solo administradores)
  {
    path: '/periodos-academicos',
    name: 'PeriodosAcademicos',
    component: PeriodosAcademicosView,
<<<<<<< HEAD
    meta: { requiresAuth: true },
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView,
    meta: { requiresAuth: true },
  },
  {
    path: '/mis-bienes',
    name: 'Bienes',
    component: BienesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/inicio',
    name: 'Inicio',
    component: InicioView
=======
    meta: {
      title: 'Períodos Académicos',
      requiresAuth: true,
      roles: ['administrator']
    }
>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
  },

  // ✅ NUEVAS RUTAS: Para usuarios normales
  {
    path: '/mis-bienes',
    name: 'MisBienes',
    component: MisBienesView,
    meta: {
      title: 'Mis Bienes Asignados',
      requiresAuth: true,
      roles: ['user']
    }
  },

  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView,
    meta: {
      title: 'Mi Perfil',
      requiresAuth: true,
      roles: ['administrator', 'user']
    }
  },

  // ✅ NUEVA RUTA: Cerrar sesión
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: async (to, from, next) => {
      // Limpiar datos de autenticación
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      
      console.log('🚪 Sesión cerrada');
      next('/login');
    }
  },

  // ✅ NUEVA RUTA: Página no encontrada
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

<<<<<<< HEAD
// Navigation guard para proteger rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth_token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/recuperar-password') && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

=======
// ✅ FUNCIÓN AUXILIAR: Verificar autenticación
function isAuthenticated() {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  const user = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
  
  return !!(token && user);
}

// ✅ FUNCIÓN AUXILIAR: Obtener rol del usuario
function getUserRole() {
  try {
    const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
  } catch (error) {
    console.error('Error al obtener rol del usuario:', error);
  }
  return null;
}

// ✅ GUARD DE NAVEGACIÓN GLOBAL - Protección de rutas
router.beforeEach(async (to, from, next) => {
  // Actualizar título de la página
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Sistema de Bienes - Instituto Nelson Torres';
  }

  console.log(`🧭 Navegando a: ${to.name}`);

  // ✅ Si la ruta no requiere autenticación
  if (!to.meta.requiresAuth) {
    // Si está autenticado y va al login, redirigir según rol
    if (to.name === 'Login' && isAuthenticated()) {
      const userRole = getUserRole();
      console.log('📝 Usuario ya autenticado, redirigiendo...');
      
      if (userRole === 'administrator') {
        return next('/dashboard');
      } else {
        return next('/mis-bienes');
      }
    }
    return next();
  }

  // ✅ Verificar si está autenticado
  if (!isAuthenticated()) {
    console.log('🔒 Acceso denegado, redirigiendo a login');
    return next('/login');
  }

  // ✅ Verificar roles si están especificados
  if (to.meta.roles) {
    const userRole = getUserRole();
    
    if (!userRole || !to.meta.roles.includes(userRole)) {
      console.log(`❌ Sin permisos. Rol: ${userRole}, Requerido: ${to.meta.roles}`);
      
      // Redirigir según el rol del usuario
      if (userRole === 'user') {
        return next('/mis-bienes');
      } else if (userRole === 'administrator') {
        return next('/dashboard');
      } else {
        return next('/login');
      }
    }
  }

  // ✅ Usuario autenticado y con permisos correctos
  console.log('✅ Acceso autorizado');
  next();
});

// ✅ Guard después de navegación
router.afterEach((to, from) => {
  console.log(`✅ Navegación completada: ${from.name || 'inicio'} → ${to.name}`);
  
  // Logging para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('📍 Ruta actual:', {
      name: to.name,
      path: to.path,
      requiresAuth: to.meta.requiresAuth,
      roles: to.meta.roles
    });
  }
});

// ✅ FUNCIONES AUXILIARES EXPORTADAS

// Verificar si el usuario puede acceder a una ruta específica
export function canUserAccess(routeName) {
  if (!isAuthenticated()) return false;
  
  const route = routes.find(r => r.name === routeName);
  if (!route) return false;
  if (!route.meta?.requiresAuth) return true;
  
  if (route.meta?.roles) {
    const userRole = getUserRole();
    return route.meta.roles.includes(userRole);
  }
  
  return true;
}

// Obtener menú de navegación según el rol del usuario
export function getNavigationMenu() {
  const userRole = getUserRole();
  
  if (!isAuthenticated()) return [];
  
  const baseMenu = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
      title: 'Panel de Control',
      show: true
    }
  ];

  if (userRole === 'administrator') {
    return [
      ...baseMenu,
      {
        name: 'Assets',
        path: '/assets',
        icon: '📦',
        title: 'Gestión de Bienes',
        show: true
      },
      {
        name: 'Users',
        path: '/users',
        icon: '👥',
        title: 'Usuarios',
        show: true
      },
      {
        name: 'Areas',
        path: '/areas',
        icon: '🏢',
        title: 'Áreas',
        show: true
      },
      {
        name: 'PeriodosAcademicos',
        path: '/periodos-academicos',
        icon: '📅',
        title: 'Períodos Académicos',
        show: true
      },
      {
        name: 'Reports',
        path: '/reports',
        icon: '📈',
        title: 'Reportes',
        show: true
      },
      {
        name: 'Perfil',
        path: '/perfil',
        icon: '👤',
        title: 'Mi Perfil',
        show: true
      }
    ];
  } else if (userRole === 'user') {
    return [
      ...baseMenu,
      {
        name: 'MisBienes',
        path: '/mis-bienes',
        icon: '📋',
        title: 'Mis Bienes',
        show: true
      },
      {
        name: 'Perfil',
        path: '/perfil',
        icon: '👤',
        title: 'Mi Perfil',
        show: true
      }
    ];
  }
  
  return baseMenu;
}

// Obtener información del usuario actual
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
}

// Verificar si es administrador
export function isAdmin() {
  return getUserRole() === 'administrator';
}

// Verificar si es usuario normal
export function isUser() {
  return getUserRole() === 'user';
}

>>>>>>> b3adc8835ea2620deb568d9442a71eff9b6a443e
export default router;

/*
🔐 CREDENCIALES DE PRUEBA:

👤 USUARIO NORMAL (Jhonatan):
   - Usuario: jhonatan.bano
   - Email: jhonatan.bano@intsuperior.edu.ec
   - Cédula: 1728163484
   - Password: user123
   - Acceso: /mis-bienes, /perfil, /dashboard

👑 ADMINISTRADOR:
   - Usuario: admin
   - Email: admin@intsuperior.edu.ec
   - Cédula: 9999999999
   - Password: admin123
   - Acceso: Todas las rutas

🧭 RUTAS PROTEGIDAS:
   ✅ /login - Público (redirige si está autenticado)
   🔒 /dashboard - Requiere autenticación
   🔒 /assets - Solo administradores
   🔒 /users - Solo administradores
   🔒 /areas - Solo administradores
   🔒 /periodos-academicos - Solo administradores
   🔒 /reports - Solo administradores
   🔒 /mis-bienes - Solo usuarios normales
   🔒 /perfil - Ambos roles
*/
