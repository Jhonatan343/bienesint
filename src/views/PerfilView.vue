<template>
  <div class="perfil-container">
    <!-- Header del perfil -->
    <div class="perfil-header">
      <div class="header-background">
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar-container">
              <img 
                v-if="usuario.avatar" 
                :src="usuario.avatar" 
                :alt="usuario.nombre"
                class="avatar-image"
              >
              <div v-else class="avatar-placeholder">
                {{ getInitials(usuario.nombre) }}
              </div>
              <button class="avatar-edit-btn" @click="cambiarAvatar">
                <i class="fas fa-camera"></i>
              </button>
            </div>
          </div>
          
          <div class="user-info">
            <h1 class="user-name">{{ usuario.nombre }}</h1>
            <div class="user-details">
              <span class="user-role" :class="usuario.rol.toLowerCase()">
                <i :class="getRoleIcon(usuario.rol)"></i>
                {{ usuario.rol }}
              </span>
              <span class="user-department">{{ usuario.departamento }}</span>
              <span class="user-status" :class="usuario.estado.toLowerCase()">
                <i class="fas fa-circle"></i>
                {{ usuario.estado }}
              </span>
            </div>
            <div class="user-stats" v-if="isAdmin">
              <div class="stat-item">
                <span class="stat-number">{{ estadisticasAdmin.usuariosGestionados }}</span>
                <span class="stat-label">Usuarios Gestionados</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ estadisticasAdmin.bienesTotales }}</span>
                <span class="stat-label">Bienes Totales</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ estadisticasAdmin.reportesGenerados }}</span>
                <span class="stat-label">Reportes Generados</span>
              </div>
            </div>
            <div class="user-stats" v-else>
              <div class="stat-item">
                <span class="stat-number">{{ estadisticasUsuario.bienesAsignados }}</span>
                <span class="stat-label">Bienes Asignados</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${{ estadisticasUsuario.valorBienes.toLocaleString() }}</span>
                <span class="stat-label">Valor Total</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ estadisticasUsuario.solicitudesPendientes }}</span>
                <span class="stat-label">Solicitudes Pendientes</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <button class="btn btn-outline" @click="exportarPerfil">
              <i class="fas fa-download"></i>
              Exportar Perfil
            </button>
            <button class="btn btn-primary" @click="editarPerfil">
              <i class="fas fa-edit"></i>
              Editar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs de navegación -->
    <div class="tabs-container">
      <div class="tabs-nav">
        <button 
          v-for="tab in availableTabs" 
          :key="tab.id"
          :class="['tab-btn', { active: tabActivo === tab.id }]"
          @click="cambiarTab(tab.id)"
        >
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Contenido de los tabs -->
    <div class="tabs-content">
      <!-- Tab: Información Personal -->
      <div v-if="tabActivo === 'personal'" class="tab-panel">
        <div class="content-grid">
          <div class="info-card">
            <div class="card-header">
              <h3>
                <i class="fas fa-user"></i>
                Información Personal
              </h3>
              <button class="edit-btn" @click="editarInformacionPersonal">
                <i class="fas fa-edit"></i>
              </button>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <label>Nombre Completo</label>
                  <span>{{ usuario.nombre }}</span>
                </div>
                <div class="info-item">
                  <label>Cédula/ID</label>
                  <span>{{ usuario.cedula }}</span>
                </div>
                <div class="info-item">
                  <label>Email</label>
                  <span>{{ usuario.email }}</span>
                </div>
                <div class="info-item">
                  <label>Teléfono</label>
                  <span>{{ usuario.telefono }}</span>
                </div>
                <div class="info-item">
                  <label>Fecha de Nacimiento</label>
                  <span>{{ formatearFecha(usuario.fechaNacimiento) }}</span>
                </div>
                <div class="info-item">
                  <label>Dirección</label>
                  <span>{{ usuario.direccion }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <h3>
                <i class="fas fa-briefcase"></i>
                Información Laboral
              </h3>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <label>Departamento</label>
                  <span>{{ usuario.departamento }}</span>
                </div>
                <div class="info-item">
                  <label>Cargo</label>
                  <span>{{ usuario.cargo }}</span>
                </div>
                <div class="info-item">
                  <label>Fecha de Ingreso</label>
                  <span>{{ formatearFecha(usuario.fechaIngreso) }}</span>
                </div>
                <div class="info-item">
                  <label>Jefe Inmediato</label>
                  <span>{{ usuario.jefeInmediato }}</span>
                </div>
                <div class="info-item">
                  <label>Código de Empleado</label>
                  <span>{{ usuario.codigoEmpleado }}</span>
                </div>
                <div class="info-item">
                  <label>Horario de Trabajo</label>
                  <span>{{ usuario.horarioTrabajo }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Bienes Asignados (Solo usuarios regulares) -->
      <div v-if="tabActivo === 'bienes' && !isAdmin" class="tab-panel">
        <div class="bienes-summary-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-box"></i>
              Mis Bienes Asignados
            </h3>
            <div class="header-actions">
              <button class="btn btn-outline" @click="verTodosBienes">
                Ver Todos
              </button>
              <button class="btn btn-primary" @click="solicitarNuevoBien">
                <i class="fas fa-plus"></i>
                Solicitar Bien
              </button>
            </div>
          </div>
          <div class="card-body">
            <!-- Estadísticas de bienes -->
            <div class="bienes-stats">
              <div class="stat-box excellent">
                <div class="stat-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ estadisticasBienes.excelente }}</span>
                  <span class="stat-label">Excelente</span>
                </div>
              </div>
              <div class="stat-box good">
                <div class="stat-icon">
                  <i class="fas fa-thumbs-up"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ estadisticasBienes.bueno }}</span>
                  <span class="stat-label">Bueno</span>
                </div>
              </div>
              <div class="stat-box regular">
                <div class="stat-icon">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ estadisticasBienes.regular }}</span>
                  <span class="stat-label">Regular</span>
                </div>
              </div>
              <div class="stat-box maintenance">
                <div class="stat-icon">
                  <i class="fas fa-tools"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-number">{{ estadisticasBienes.mantenimiento }}</span>
                  <span class="stat-label">Mantenimiento</span>
                </div>
              </div>
            </div>

            <!-- Lista de bienes recientes -->
            <div class="recent-bienes">
              <h4>Bienes Recientes</h4>
              <div class="bienes-list">
                <div v-for="bien in bienesRecientes" :key="bien.id" class="bien-item">
                  <div class="bien-icon">
                    <i :class="getBienIcon(bien.categoria)"></i>
                  </div>
                  <div class="bien-info">
                    <span class="bien-name">{{ bien.nombre }}</span>
                    <span class="bien-code">{{ bien.codigo }}</span>
                  </div>
                  <div class="bien-status">
                    <span :class="['status-badge', bien.estado.toLowerCase().replace(' ', '-')]">
                      {{ bien.estado }}
                    </span>
                  </div>
                  <div class="bien-actions">
                    <button class="action-btn" @click="verDetalleBien(bien)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" @click="reportarProblema(bien)">
                      <i class="fas fa-exclamation-triangle"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Gestión del Sistema (Solo administradores) -->
      <div v-if="tabActivo === 'gestion' && isAdmin" class="tab-panel">
        <div class="content-grid">
          <div class="info-card">
            <div class="card-header">
              <h3>
                <i class="fas fa-cogs"></i>
                Panel de Administración
              </h3>
            </div>
            <div class="card-body">
              <div class="admin-actions-grid">
                <button class="admin-action-card" @click="gestionarUsuarios">
                  <div class="action-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="action-info">
                    <span class="action-title">Gestionar Usuarios</span>
                    <span class="action-desc">{{ estadisticasAdmin.usuariosGestionados }} usuarios activos</span>
                  </div>
                </button>

                <button class="admin-action-card" @click="gestionarBienes">
                  <div class="action-icon">
                    <i class="fas fa-box"></i>
                  </div>
                  <div class="action-info">
                    <span class="action-title">Gestionar Bienes</span>
                    <span class="action-desc">{{ estadisticasAdmin.bienesTotales }} bienes registrados</span>
                  </div>
                </button>

                <button class="admin-action-card" @click="verReportes">
                  <div class="action-icon">
                    <i class="fas fa-chart-bar"></i>
                  </div>
                  <div class="action-info">
                    <span class="action-title">Reportes y Análisis</span>
                    <span class="action-desc">{{ estadisticasAdmin.reportesGenerados }} reportes generados</span>
                  </div>
                </button>

                <button class="admin-action-card" @click="configurarSistema">
                  <div class="action-icon">
                    <i class="fas fa-sliders-h"></i>
                  </div>
                  <div class="action-info">
                    <span class="action-title">Configuración</span>
                    <span class="action-desc">Ajustes del sistema</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="card-header">
              <h3>
                <i class="fas fa-shield-alt"></i>
                Permisos y Roles
              </h3>
            </div>
            <div class="card-body">
              <div class="permissions-list">
                <div v-for="permiso in permisosAdmin" :key="permiso.id" class="permission-item">
                  <div class="permission-icon">
                    <i :class="permiso.icono" :style="{ color: permiso.activo ? '#10b981' : '#6b7280' }"></i>
                  </div>
                  <div class="permission-info">
                    <span class="permission-name">{{ permiso.nombre }}</span>
                    <span class="permission-desc">{{ permiso.descripcion }}</span>
                  </div>
                  <div class="permission-status">
                    <span :class="['status-indicator', permiso.activo ? 'active' : 'inactive']">
                      {{ permiso.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Actividad y Historial -->
      <div v-if="tabActivo === 'actividad'" class="tab-panel">
        <div class="info-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-history"></i>
              Actividad Reciente
            </h3>
            <div class="header-actions">
              <select v-model="filtroActividad" class="filter-select">
                <option value="todas">Todas las actividades</option>
                <option value="bienes">Gestión de bienes</option>
                <option value="solicitudes">Solicitudes</option>
                <option value="reportes">Reportes</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div class="activity-timeline">
              <div v-for="actividad in actividadesFiltradas" :key="actividad.id" class="timeline-item">
                <div class="timeline-marker" :class="actividad.tipo">
                  <i :class="actividad.icono"></i>
                </div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <span class="timeline-title">{{ actividad.titulo }}</span>
                    <span class="timeline-date">{{ formatearFechaCompleta(actividad.fecha) }}</span>
                  </div>
                  <p class="timeline-description">{{ actividad.descripcion }}</p>
                  <div v-if="actividad.detalles" class="timeline-details">
                    <span v-for="detalle in actividad.detalles" :key="detalle" class="detail-tag">
                      {{ detalle }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Configuración -->
      <div v-if="tabActivo === 'configuracion'" class="tab-panel">
        <div class="content-grid">
          <div class="info-card">
            <div class="card-header">
              <h3>
                <i class="fas fa-user-cog"></i>
                Configuración de Cuenta
              </h3>
            </div>
            <div class="card-body">
              <div class="config-section">
                <h4>Seguridad</h4>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Cambiar Contraseña</span>
                    <span class="config-desc">Última actualización: {{ formatearFecha(usuario.ultimoCambioPassword) }}</span>
                  </div>
                  <button class="btn btn-outline" @click="cambiarPassword">
                    Cambiar
                  </button>
                </div>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Autenticación de Dos Factores</span>
                    <span class="config-desc">Protege tu cuenta con 2FA</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="configuracion.dosFactores">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="config-section">
                <h4>Notificaciones</h4>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Notificaciones por Email</span>
                    <span class="config-desc">Recibir notificaciones importantes</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="configuracion.emailNotificaciones">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Recordatorios de Mantenimiento</span>
                    <span class="config-desc">Alertas sobre bienes que requieren mantenimiento</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="configuracion.recordatoriosMantenimiento">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Resumen Semanal</span>
                    <span class="config-desc">Recibir resumen de actividades semanalmente</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="configuracion.resumenSemanal">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="config-section">
                <h4>Privacidad</h4>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Perfil Público</span>
                    <span class="config-desc">Permitir que otros usuarios vean tu información básica</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="configuracion.perfilPublico">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="config-actions">
                <button class="btn btn-outline" @click="resetearConfiguracion">
                  Restaurar Valores Predeterminados
                </button>
                <button class="btn btn-primary" @click="guardarConfiguracion">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          <!-- Configuración adicional para administradores -->
          <div v-if="isAdmin" class="info-card">
            <div class="card-header">
              <h3>
                <i class="fas fa-tools"></i>
                Configuración del Sistema
              </h3>
            </div>
            <div class="card-body">
              <div class="config-section">
                <h4>Sistema</h4>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Modo Mantenimiento</span>
                    <span class="config-desc">Activar modo mantenimiento del sistema</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="configuracionSistema.modoMantenimiento">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Registro de Auditoría</span>
                    <span class="config-desc">Mantener logs detallados de actividades</span>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="configuracionSistema.registroAuditoria">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="config-section">
                <h4>Respaldos</h4>
                <div class="config-item">
                  <div class="config-info">
                    <span class="config-label">Respaldo Automático</span>
                    <span class="config-desc">Último respaldo: {{ formatearFecha(configuracionSistema.ultimoRespaldo) }}</span>
                  </div>
                  <button class="btn btn-outline" @click="ejecutarRespaldo">
                    Ejecutar Ahora
                  </button>
                </div>
              </div>

              <div class="config-actions">
                <button class="btn btn-danger" @click="exportarDatos">
                  <i class="fas fa-download"></i>
                  Exportar Datos del Sistema
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificaciones -->
    <transition name="slide-fade">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <i :class="toast.icon"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue';

export default {
  name: 'PerfilUsuarioView',
  props: {
    usuario: {
      type: Object,
      required: true
    }
  },
  emits: ['editar-perfil', 'cambiar-avatar', 'cambiar-password'],
  setup(props, { emit }) {
    const tabActivo = ref('personal');
    const filtroActividad = ref('todas');

    // Toast de notificaciones
    const toast = reactive({
      show: false,
      message: '',
      type: 'info',
      icon: 'fas fa-info-circle'
    });

    // Configuración del usuario
    const configuracion = reactive({
      dosFactores: false,
      emailNotificaciones: true,
      recordatoriosMantenimiento: true,
      resumenSemanal: false,
      perfilPublico: true
    });

    // Configuración del sistema (solo admin)
    const configuracionSistema = reactive({
      modoMantenimiento: false,
      registroAuditoria: true,
      ultimoRespaldo: '2024-06-15'
    });

    // Datos de ejemplo - en producción vendrían de props o API
    const estadisticasUsuario = ref({
      bienesAsignados: 8,
      valorBienes: 4250,
      solicitudesPendientes: 2
    });

    const estadisticasAdmin = ref({
      usuariosGestionados: 145,
      bienesTotales: 1247,
      reportesGenerados: 89
    });

    const estadisticasBienes = ref({
      excelente: 5,
      bueno: 2,
      regular: 1,
      mantenimiento: 0
    });

    const bienesRecientes = ref([
      {
        id: 1,
        nombre: 'Laptop Dell Latitude',
        codigo: 'BN-2024-001',
        categoria: 'Equipos de Cómputo',
        estado: 'Excelente'
      },
      {
        id: 2,
        nombre: 'Monitor Samsung 27"',
        codigo: 'BN-2024-002',
        categoria: 'Equipos de Cómputo',
        estado: 'Bueno'
      },
      {
        id: 3,
        nombre: 'Silla Ejecutiva',
        codigo: 'BN-2023-045',
        categoria: 'Mobiliario',
        estado: 'Bueno'
      }
    ]);

    const actividades = ref([
      {
        id: 1,
        tipo: 'success',
        icono: 'fas fa-plus',
        titulo: 'Bien asignado',
        descripcion: 'Se te asignó una nueva laptop Dell Latitude 7420',
        fecha: '2024-06-18T10:30:00',
        detalles: ['BN-2024-001', 'Equipos de Cómputo']
      },
      {
        id: 2,
        tipo: 'warning',
        icono: 'fas fa-wrench',
        titulo: 'Mantenimiento solicitado',
        descripcion: 'Solicitud de mantenimiento para impresora HP LaserJet',
        fecha: '2024-06-17T14:15:00',
        detalles: ['BN-2023-067', 'Mantenimiento Preventivo']
      },
      {
        id: 3,
        tipo: 'info',
        icono: 'fas fa-file-alt',
        titulo: 'Reporte generado',
        descripcion: 'Generaste un reporte de inventario personal',
        fecha: '2024-06-16T09:20:00',
        detalles: ['Reporte PDF', '8 bienes']
      },
      {
        id: 4,
        tipo: 'error',
        icono: 'fas fa-exclamation-triangle',
        titulo: 'Problema reportado',
        descripcion: 'Reportaste un problema con el teléfono IP',
        fecha: '2024-06-15T16:45:00',
        detalles: ['BN-2024-023', 'Problema Técnico']
      }
    ]);

    const permisosAdmin = ref([
      {
        id: 1,
        nombre: 'Gestión de Usuarios',
        descripcion: 'Crear, editar y eliminar usuarios',
        icono: 'fas fa-users',
        activo: true
      },
      {
        id: 2,
        nombre: 'Gestión de Bienes',
        descripcion: 'Administrar inventario completo',
        icono: 'fas fa-box',
        activo: true
      },
      {
        id: 3,
        nombre: 'Reportes Avanzados',
        descripcion: 'Generar reportes del sistema',
        icono: 'fas fa-chart-bar',
        activo: true
      },
      {
        id: 4,
        nombre: 'Configuración Sistema',
        descripcion: 'Modificar configuraciones globales',
        icono: 'fas fa-cogs',
        activo: true
      },
      {
        id: 5,
        nombre: 'Auditoría',
        descripcion: 'Acceso a logs y auditoría',
        icono: 'fas fa-shield-alt',
        activo: false
      }
    ]);

    // Computed properties
    const isAdmin = computed(() => props.usuario.rol === 'Administrador');

    const availableTabs = computed(() => {
      const baseTabs = [
        { id: 'personal', label: 'Información Personal', icon: 'fas fa-user' },
        { id: 'actividad', label: 'Actividad', icon: 'fas fa-history' },
        { id: 'configuracion', label: 'Configuración', icon: 'fas fa-cog' }
      ];

      if (isAdmin.value) {
        baseTabs.splice(1, 0, { id: 'gestion', label: 'Gestión del Sistema', icon: 'fas fa-tools' });
      } else {
        baseTabs.splice(1, 0, { id: 'bienes', label: 'Mis Bienes', icon: 'fas fa-box' });
      }

      return baseTabs;
    });

    const actividadesFiltradas = computed(() => {
      if (filtroActividad.value === 'todas') {
        return actividades.value;
      }
      return actividades.value.filter(actividad => 
        actividad.detalles.some(detalle => 
          detalle.toLowerCase().includes(filtroActividad.value.toLowerCase())
        )
      );
    });

    // Métodos
    const mostrarToast = (message, type = 'info') => {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };

      toast.message = message;
      toast.type = type;
      toast.icon = icons[type];
      toast.show = true;

      setTimeout(() => {
        toast.show = false;
      }, 4000);
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

    const getBienIcon = (categoria) => {
      const icons = {
        'Equipos de Cómputo': 'fas fa-laptop',
        'Mobiliario': 'fas fa-chair',
        'Equipos de Oficina': 'fas fa-print',
        'Vehículos': 'fas fa-car',
        'Maquinaria': 'fas fa-cogs'
      };
      return icons[categoria] || 'fas fa-box';
    };

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES');
    };

    const formatearFechaCompleta = (fecha) => {
      return new Date(fecha).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const cambiarTab = (tab) => {
      tabActivo.value = tab;
    };

    const cambiarAvatar = () => {
      emit('cambiar-avatar');
      mostrarToast('Abriendo selector de avatar...', 'info');
    };

    const editarPerfil = () => {
      emit('editar-perfil');
      mostrarToast('Abriendo editor de perfil...', 'info');
    };

    const exportarPerfil = () => {
      mostrarToast('Exportando información del perfil...', 'success');
    };

    const editarInformacionPersonal = () => {
      mostrarToast('Abriendo editor de información personal...', 'info');
    };

    const cambiarPassword = () => {
      emit('cambiar-password');
      mostrarToast('Abriendo formulario de cambio de contraseña...', 'info');
    };

    const guardarConfiguracion = () => {
      mostrarToast('Configuración guardada exitosamente', 'success');
    };

    const resetearConfiguracion = () => {
      configuracion.dosFactores = false;
      configuracion.emailNotificaciones = true;
      configuracion.recordatoriosMantenimiento = true;
      configuracion.resumenSemanal = false;
      configuracion.perfilPublico = true;
      mostrarToast('Configuración restaurada a valores predeterminados', 'info');
    };

    // Métodos específicos para usuarios regulares
    const verTodosBienes = () => {
      mostrarToast('Navegando a la vista completa de bienes...', 'info');
    };

    const solicitarNuevoBien = () => {
      mostrarToast('Abriendo formulario de solicitud de bien...', 'info');
    };

    const verDetalleBien = (bien) => {
      mostrarToast(`Viendo detalles de ${bien.nombre}`, 'info');
    };

    const reportarProblema = (bien) => {
      mostrarToast(`Reportando problema para ${bien.nombre}`, 'warning');
    };

    // Métodos específicos para administradores
    const gestionarUsuarios = () => {
      mostrarToast('Navegando a gestión de usuarios...', 'info');
    };

    const gestionarBienes = () => {
      mostrarToast('Navegando a gestión de bienes...', 'info');
    };

    const verReportes = () => {
      mostrarToast('Abriendo panel de reportes...', 'info');
    };

    const configurarSistema = () => {
      mostrarToast('Abriendo configuración del sistema...', 'info');
    };

    const ejecutarRespaldo = () => {
      mostrarToast('Ejecutando respaldo del sistema...', 'warning');
    };

    const exportarDatos = () => {
      mostrarToast('Exportando datos del sistema...', 'info');
    };

    return {
      // Estado
      tabActivo,
      filtroActividad,
      toast,
      configuracion,
      configuracionSistema,
      estadisticasUsuario,
      estadisticasAdmin,
      estadisticasBienes,
      bienesRecientes,
      actividades,
      permisosAdmin,

      // Computed
      isAdmin,
      availableTabs,
      actividadesFiltradas,

      // Métodos
      mostrarToast,
      getInitials,
      getRoleIcon,
      getBienIcon,
      formatearFecha,
      formatearFechaCompleta,
      cambiarTab,
      cambiarAvatar,
      editarPerfil,
      exportarPerfil,
      editarInformacionPersonal,
      cambiarPassword,
      guardarConfiguracion,
      resetearConfiguracion,
      verTodosBienes,
      solicitarNuevoBien,
      verDetalleBien,
      reportarProblema,
      gestionarUsuarios,
      gestionarBienes,
      verReportes,
      configurarSistema,
      ejecutarRespaldo,
      exportarDatos
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.perfil-container {
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Header del perfil */
.perfil-header {
  position: relative;
  margin-bottom: 2rem;
}

.header-background {
  background: linear-gradient(135deg, #EF4444 0%, #dc2626 100%);
  color: white;
  overflow: hidden;
  position: relative;
}

.header-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.5;
}

.header-content {
  position: relative;
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.avatar-section {
  position: relative;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.2);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  border: 4px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #EF4444;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.avatar-edit-btn:hover {
  background: white;
  transform: scale(1.1);
}

.user-info {
  flex: 1;
  min-width: 300px;
}

.user-name {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-details {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.user-role {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.user-role.administrador {
  background: rgba(255, 215, 0, 0.3);
}

.user-department {
  font-size: 1.1rem;
  opacity: 0.9;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.user-status.activo i {
  color: #10b981;
  animation: pulse 2s infinite;
}

.user-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-outline {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.btn-primary {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid transparent;
  color: #EF4444;
}

.btn-primary:hover {
  background: white;
  transform: translateY(-1px);
}

.btn-danger {
  background: #ef4444;
  border: 1px solid #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Tabs */
.tabs-container {
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  margin: 0 2rem;
  overflow: hidden;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
  min-width: 180px;
}

.tab-btn:hover {
  background-color: #f9fafb;
  color: #374151;
}

.tab-btn.active {
  background-color: #EF4444;
  color: white;
  border-bottom: 3px solid #dc2626;
}

.tab-btn i {
  font-size: 1.1rem;
}

/* Contenido de tabs */
.tabs-content {
  background: white;
  margin: 0 2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.tab-panel {
  padding: 2rem;
  animation: fadeIn 0.3s ease-in;
}

.content-grid {
  display: grid;
  gap: 2rem;
}

.info-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.card-header h3 i {
  color: #EF4444;
}

.edit-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.edit-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
}

.card-body {
  padding: 1.5rem;
}

/* Información personal */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item span {
  color: #1f2937;
  font-size: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

/* Bienes del usuario */
.bienes-summary-card .header-actions {
  gap: 0.75rem;
}

.bienes-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s;
}

.stat-box:hover {
  transform: translateY(-2px);
}

.stat-box.excellent {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
}

.stat-box.good {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.stat-box.regular {
  background: linear-gradient(135deg, #fef3cd, #fde68a);
}

.stat-box.maintenance {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-box.excellent .stat-icon { background: #10b981; }
.stat-box.good .stat-icon { background: #3b82f6; }
.stat-box.regular .stat-icon { background: #f59e0b; }
.stat-box.maintenance .stat-icon { background: #ef4444; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.recent-bienes {
  margin-top: 2rem;
}

.recent-bienes h4 {
  margin-bottom: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.bienes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bien-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s;
}

.bien-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.bien-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #EF4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bien-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bien-name {
  font-weight: 600;
  color: #1f2937;
}

.bien-code {
  font-size: 0.875rem;
  color: #6b7280;
  font-family: monospace;
}

.bien-status {
  margin-right: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.excelente {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.bueno {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.regular {
  background: #fef3cd;
  color: #92400e;
}

.bien-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #6b7280;
  background: white;
}

.action-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: scale(1.1);
}

/* Panel de administración */
.admin-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.admin-action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.admin-action-card:hover {
  background: white;
  border-color: #EF4444;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #EF4444, #dc2626);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.action-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.action-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.action-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Permisos */
.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.permission-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.permission-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.permission-name {
  font-weight: 600;
  color: #1f2937;
}

.permission-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

.permission-status {
  display: flex;
  align-items: center;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-indicator.active {
  background: #d1fae5;
  color: #065f46;
}

.status-indicator.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

/* Timeline de actividades */
.activity-timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 40px;
  bottom: -1.5rem;
  width: 2px;
  background: #e5e7eb;
}

.timeline-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  position: relative;
  z-index: 1;
}

.timeline-marker.success { background: #10b981; }
.timeline-marker.warning { background: #f59e0b; }
.timeline-marker.info { background: #3b82f6; }
.timeline-marker.error { background: #ef4444; }

.timeline-content {
  flex: 1;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.timeline-title {
  font-weight: 600;
  color: #1f2937;
}

.timeline-date {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
}

.timeline-description {
  color: #4b5563;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.timeline-details {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.detail-tag {
  padding: 0.25rem 0.5rem;
  background: #e5e7eb;
  color: #374151;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Configuración */
.config-section {
  margin-bottom: 2rem;
}

.config-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #EF4444;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.config-item:last-child {
  border-bottom: none;
}

.config-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.config-label {
  font-weight: 600;
  color: #1f2937;
}

.config-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #EF4444;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Toast */
.toast {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 10000;
  max-width: 400px;
}

.toast.success { background-color: #10b981; }
.toast.error { background-color: #ef4444; }
.toast.warning { background-color: #f59e0b; }
.toast.info { background-color: #3b82f6; }

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .admin-actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .perfil-container {
    padding: 0;
  }

  .tabs-container,
  .tabs-content {
    margin: 0 1rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .user-stats {
    justify-content: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .tab-panel {
    padding: 1rem;
  }

  .tabs-nav {
    flex-direction: column;
  }

  .tab-btn {
    min-width: auto;
    flex: none;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .bienes-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-actions-grid {
    grid-template-columns: 1fr;
  }

  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .config-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .config-actions {
    flex-direction: column;
  }
}
</style>