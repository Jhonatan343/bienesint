<template>
  <div class="dashboard-container">
    <!-- Contenido Principal -->
    <main class="main-content">
      <!-- Alerta de mantenimiento -->
      <div class="alert-banner" v-if="bienesData.bienesMantenimiento > 0">
        <i class="fas fa-exclamation-triangle"></i>
        <span><strong>Mantenimiento programado:</strong> {{ bienesData.bienesMantenimiento }} bienes requieren mantenimiento preventivo esta semana</span>
      </div>

      <!-- Sección de Bienvenida -->
      <section class="welcome-section">
        <div class="welcome-header">
          <div class="welcome-text">
            <h1>Dashboard de Gestión de Bienes</h1>
            <p>Control y seguimiento de activos fijos institucionales</p>
          </div>
          <div class="date-time">
            <div>{{ currentDate }}</div>
            <div>{{ currentTime }}</div>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in statistics" :key="stat.id">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <i :class="stat.icon + ' stat-icon'"></i>
          </div>
        </div>
      </section>

      <!-- Acciones Rápidas -->
      <section class="quick-actions">
        <h2 class="section-title">
          <i class="fas fa-bolt"></i>
          Acciones Rápidas
        </h2>
        <div class="actions-grid">
          <div 
            class="action-card" 
            v-for="action in quickActions" 
            :key="action.id"
            @click="handleQuickAction(action.action)"
          >
            <div class="action-icon">
              <i :class="action.icon"></i>
            </div>
            <div class="action-title">{{ action.title }}</div>
            <div class="action-description">{{ action.description }}</div>
          </div>
        </div>
      </section>

      <!-- Gráficos -->
      <section class="charts-section">
        <div class="chart-container">
          <div class="chart-title">Valor de Bienes por Categoría</div>
          <canvas ref="categoriesChart"></canvas>
        </div>
        <div class="chart-container">
          <div class="chart-title">Estado de Bienes</div>
          <canvas ref="statusChart"></canvas>
        </div>
      </section>

      <!-- Contenido Inferior -->
      <div class="bottom-content">
        <div class="activity-section">
          <h3 class="section-title">
            <i class="fas fa-clock"></i>
            Actividades Recientes
          </h3>
          <div class="activity-list">
            <div 
              class="activity-item" 
              v-for="activity in recentActivities" 
              :key="activity.id"
            >
              <div :class="'activity-icon ' + activity.type">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="system-status">
          <h3 class="section-title">
            <i class="fas fa-cogs"></i>
            Estado de Módulos
          </h3>
          <div 
            class="status-item" 
            v-for="module in systemModules" 
            :key="module.id"
          >
            <div style="display: flex; align-items: center;">
              <span :class="'status-indicator ' + module.status"></span>
              {{ module.name }}
            </div>
            <span>{{ module.statusText }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Componente de Notificación -->
    <transition name="slide-fade">
      <div v-if="notification.show" class="notification-toast" :class="notification.type">
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'DashboardView',
  props: {
    bienesData: {
      type: Object,
      default: () => ({
        totalBienes: 0,
        valorTotal: 0,
        bienesBuenEstado: 0,
        bienesMantenimiento: 0,
        depreciacionMensual: 0,
        ubicaciones: 0
      })
    },
    actividadesRecientes: {
      type: Array,
      default: () => []
    },
    estadoModulos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['quick-action'],
  setup(props, { emit }) {
    const currentDate = ref('');
    const currentTime = ref('');
    
    const notification = reactive({
      show: false,
      message: '',
      type: 'info'
    });

    const statistics = computed(() => [
      {
        id: 1,
        value: props.bienesData.totalBienes?.toLocaleString() || '0',
        label: 'Total de Bienes Registrados',
        icon: 'fas fa-archive'
      },
      {
        id: 2,
        value: props.bienesData.valorTotal ? `$${props.bienesData.valorTotal.toLocaleString()}` : '$0',
        label: 'Valor Total de Activos',
        icon: 'fas fa-dollar-sign'
      },
      {
        id: 3,
        value: props.bienesData.bienesBuenEstado?.toLocaleString() || '0',
        label: 'Bienes en Buen Estado',
        icon: 'fas fa-check-circle'
      },
      {
        id: 4,
        value: props.bienesData.bienesMantenimiento?.toLocaleString() || '0',
        label: 'En Mantenimiento',
        icon: 'fas fa-tools'
      },
      {
        id: 5,
        value: props.bienesData.depreciacionMensual ? `$${props.bienesData.depreciacionMensual.toLocaleString()}` : '$0',
        label: 'Depreciación Mensual',
        icon: 'fas fa-chart-line-down'
      },
      {
        id: 6,
        value: props.bienesData.ubicaciones?.toLocaleString() || '0',
        label: 'Ubicaciones Activas',
        icon: 'fas fa-map-marker-alt'
      }
    ]);

    const quickActions = ref([
      {
        id: 1,
        action: 'registrar',
        title: 'Registrar Bien',
        description: 'Agregar nuevo bien al inventario',
        icon: 'fas fa-plus'
      },
      {
        id: 2,
        action: 'asignar',
        title: 'Asignar Responsable',
        description: 'Asignar bien a un empleado',
        icon: 'fas fa-user-tag'
      },
      {
        id: 3,
        action: 'mantenimiento',
        title: 'Programar Mantenimiento',
        description: 'Agendar mantenimiento preventivo',
        icon: 'fas fa-wrench'
      },
      {
        id: 4,
        action: 'reporte',
        title: 'Generar Reporte',
        description: 'Reportes de inventario y estado',
        icon: 'fas fa-file-alt'
      }
    ]);

    const recentActivities = computed(() => 
      props.actividadesRecientes.length > 0 ? props.actividadesRecientes : [
        {
          id: 1,
          title: 'No hay actividades registradas',
          time: 'Conecta con la base de datos para ver actividades',
          type: 'info',
          icon: 'fas fa-info-circle'
        }
      ]
    );

    const systemModules = computed(() => 
      props.estadoModulos.length > 0 ? props.estadoModulos : [
        {
          id: 1,
          name: 'Módulo de Registro',
          status: 'online',
          statusText: 'Activo'
        },
        {
          id: 2,
          name: 'Gestión de Ubicaciones',
          status: 'online',
          statusText: 'Operativo'
        },
        {
          id: 3,
          name: 'Sistema de Reportes',
          status: 'warning',
          statusText: 'Carga Alta'
        },
        {
          id: 4,
          name: 'Control de Mantenimiento',
          status: 'online',
          statusText: 'Estable'
        },
        {
          id: 5,
          name: 'Base de Datos',
          status: 'online',
          statusText: 'Óptimo'
        }
      ]
    );

    const categoriesChart = ref(null);
    const statusChart = ref(null);

    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      };
      
      currentDate.value = now.toLocaleDateString('es-ES', dateOptions);
      currentTime.value = now.toLocaleTimeString('es-ES', timeOptions);
    };

    const showNotification = (message, type = 'info') => {
      notification.message = message;
      notification.type = type;
      notification.show = true;
      
      setTimeout(() => {
        notification.show = false;
      }, 4000);
    };

    const handleQuickAction = (action) => {
      emit('quick-action', action);
      
      switch(action) {
        case 'registrar':
          showNotification('Abriendo formulario de registro de bienes...', 'info');
          break;
        case 'asignar':
          showNotification('Cargando módulo de asignación de responsables...', 'info');
          break;
        case 'mantenimiento':
          showNotification('Accediendo al programador de mantenimiento...', 'warning');
          break;
        case 'reporte':
          showNotification('Generando reporte de inventario de bienes...', 'success');
          break;
        default:
          showNotification('Módulo en desarrollo', 'error');
      }
    };

    const initializeCharts = () => {
      if (typeof Chart !== 'undefined') {
        const categoriesData = props.bienesData.categorias || [850000, 320000, 680000, 456000, 150000];
        const statusData = props.bienesData.estadosBienes || [789, 35, 15, 8];
        
        const categoriesCtx = categoriesChart.value.getContext('2d');
        new Chart(categoriesCtx, {
          type: 'bar',
          data: {
            labels: ['Equipos de Cómputo', 'Mobiliario', 'Vehículos', 'Maquinaria', 'Equipos de Oficina'],
            datasets: [{
              label: 'Valor ($)',
              data: categoriesData,
              backgroundColor: [
                '#EF4444',
                '#f59e0b',
                '#10b981',
                '#3b82f6',
                '#8b5cf6'
              ],
              borderWidth: 0,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f1f5f9'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              },
              x: {
                grid: {
                  color: '#f1f5f9'
                }
              }
            }
          }
        });

        const statusCtx = statusChart.value.getContext('2d');
        new Chart(statusCtx, {
          type: 'doughnut',
          data: {
            labels: ['Buen Estado', 'Requiere Mantenimiento', 'En Reparación', 'Fuera de Servicio'],
            datasets: [{
              data: statusData,
              backgroundColor: [
                '#10b981',
                '#f59e0b',
                '#EF4444',
                '#64748b'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true
                }
              }
            }
          }
        });
      }
    };

    let timeInterval;

    onMounted(() => {
      updateDateTime();
      timeInterval = setInterval(updateDateTime, 1000);
      setTimeout(initializeCharts, 100);
    });

    onUnmounted(() => {
      if (timeInterval) clearInterval(timeInterval);
    });

    return {
      currentDate,
      currentTime,
      notification,
      statistics,
      quickActions,
      recentActivities,
      systemModules,
      categoriesChart,
      statusChart,
      handleQuickAction,
      showNotification
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

.dashboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
  color: #000000;
  line-height: 1.6;
  min-height: 100vh;
}

/* Alerta */
.alert-banner {
  background: linear-gradient(135deg, #fef3cd, #fff3cd);
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-banner i {
  color: #f59e0b;
}

/* Contenido Principal */
.main-content {
  padding: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* Sección de Bienvenida */
.welcome-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.welcome-text h1 {
  font-size: 2rem;
  color: #000000;
  margin-bottom: 0.5rem;
}

.welcome-text p {
  color: #64748b;
  font-size: 1.1rem;
}

.date-time {
  text-align: right;
  color: #64748b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #EF4444;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #64748b;
  font-size: 0.9rem;
}

.stat-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  color: #EF4444;
  opacity: 0.7;
}

/* Acciones Rápidas */
.quick-actions {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #EF4444;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.action-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  border-color: #EF4444;
}

.action-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
  transition: left 0.5s;
}

.action-card:hover::after {
  left: 100%;
}

.action-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #EF4444, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  animation: float 3s ease-in-out infinite;
}

.action-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 0.5rem;
}

.action-description {
  color: #64748b;
  font-size: 0.85rem;
}

/* Gráficos */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-container {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.chart-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1rem;
  text-align: center;
}

/* Contenido Inferior */
.bottom-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.activity-section, .system-status {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
}

.activity-icon.success { background-color: #10b981; }
.activity-icon.warning { background-color: #f59e0b; }
.activity-icon.error { background-color: #EF4444; }
.activity-icon.info { background-color: #3b82f6; }

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.8rem;
  color: #64748b;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.status-item:last-child {
  border-bottom: none;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.status-indicator.online { background-color: #10b981; }
.status-indicator.warning { background-color: #f59e0b; }
.status-indicator.offline { background-color: #EF4444; }

/* Notificaciones */
.notification-toast {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-width: 350px;
  font-size: 0.9rem;
  color: white;
}

.notification-toast.success { background-color: #10b981; }
.notification-toast.error { background-color: #EF4444; }
.notification-toast.warning { background-color: #f59e0b; }
.notification-toast.info { background-color: #3b82f6; }

/* Transiciones */
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

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .welcome-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .bottom-content {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>