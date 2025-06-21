import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import AssetsView from '../views/AssetsView.vue';
import AreasView from '../views/AreasView.vue';
import UsersView from '../views/UsersView.vue';
import ReportsView from '../views/ReportsView.vue';
import PeriodosAcademicosView from '../views/PeriodosAcademicosView.vue';
import RecuperarPasswordView from '../views/RecuperarPasswordView.vue';
import ContactosView from '../views/ContactosView.vue';
import PerfilView from '../views/PerfilView.vue';
import BienesView from '../views/BienesView.vue';
import InicioView from '../views/InicioView.vue';

const routes = [
  {
    path: '/',
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
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/assets',
    name: 'Assets',
    component: AssetsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/areas',
    name: 'Areas',
    component: AreasView,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/periodos-academicos',
    name: 'PeriodosAcademicos',
    component: PeriodosAcademicosView,
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
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

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

export default router;
