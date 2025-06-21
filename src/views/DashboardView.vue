<template>
  <div class="dashboard-main-container">
    <!-- Tarjetas de resumen -->
    <div class="dashboard-summary">
      <div class="summary-card resumen-bienes">
        <i class="bx bx-package"></i>
        <div>
          <h3>{{ resumen.bienes }}</h3>
          <span>Bienes</span>
        </div>
      </div>
      <div class="summary-card resumen-usuarios">
        <i class="bx bx-user"></i>
        <div>
          <h3>{{ resumen.usuarios }}</h3>
          <span>Usuarios</span>
        </div>
      </div>
      <div class="summary-card resumen-areas">
        <i class="bx bx-building"></i>
        <div>
          <h3>{{ resumen.areas }}</h3>
          <span>Áreas</span>
        </div>
      </div>
      <div class="summary-card resumen-reportes">
        <i class="bx bx-bar-chart"></i>
        <div>
          <h3>{{ resumen.reportes }}</h3>
          <span>Reportes</span>
        </div>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="dashboard-actions">
      <button class="action-btn" @click="goTo('assets')">
        <i class="bx bx-plus-circle"></i> Registrar Bien
      </button>
      <button class="action-btn" @click="goTo('qr')">
        <i class="bx bx-qr"></i> Generar QR
      </button>
      <button class="action-btn" @click="goTo('reports')">
        <i class="bx bx-file"></i> Reportes
      </button>
      <button class="action-btn" @click="goTo('users')">
        <i class="bx bx-user"></i> Usuarios
      </button>
    </div>

    <!-- Gráfico de estado de bienes -->
    <div class="dashboard-chart-section">
      <h4>Estado de los Bienes</h4>
      <canvas id="bienesChart"></canvas>
    </div>

    <!-- Reportes recientes -->
    <div class="dashboard-reports">
      <h4>Reportes recientes</h4>
      <ul>
        <li v-for="(reporte, idx) in reportesRecientes" :key="idx">
          <i class="bx bx-file"></i> {{ reporte.nombre }} <span class="fecha">({{ reporte.fecha }})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      resumen: {
        bienes: 120,
        usuarios: 18,
        areas: 7,
        reportes: 24
      },
      reportesRecientes: [
        { nombre: 'Inventario General', fecha: '2025-06-19' },
        { nombre: 'Bienes por Área', fecha: '2025-06-18' },
        { nombre: 'Bienes dados de baja', fecha: '2025-06-17' }
      ]
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    goTo(section) {
      if (section === 'assets') this.$router.push('/assets');
      if (section === 'qr') this.$router.push('/assets'); // O ruta de QR
      if (section === 'reports') this.$router.push('/reports');
      if (section === 'users') this.$router.push('/users');
    },
    renderChart() {
      if (window.Chart) {
        const ctx = document.getElementById('bienesChart').getContext('2d');
        new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Activos', 'En Mantenimiento', 'Dados de Baja'],
            datasets: [{
              label: 'Cantidad',
              data: [90, 15, 15],
              backgroundColor: ['#10b981', '#f59e42', '#ef4444']
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } }
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.dashboard-main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.dashboard-summary {
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
}
.summary-card {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  font-size: 1.1rem;
}
.summary-card i {
  font-size: 2.2rem;
  color: #ef4444;
}
.resumen-bienes i { color: #10b981; }
.resumen-usuarios i { color: #3b82f6; }
.resumen-areas i { color: #f59e42; }
.resumen-reportes i { color: #8b5cf6; }
.dashboard-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.action-btn {
  background: linear-gradient(135deg, #ef4444, #f59e42);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.2s;
}
.action-btn:hover {
  background: linear-gradient(135deg, #f59e42, #ef4444);
}
.dashboard-chart-section {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 2rem;
}
.dashboard-chart-section h4 {
  margin-bottom: 1rem;
}
.dashboard-reports {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 2rem;
}
.dashboard-reports h4 {
  margin-bottom: 1rem;
}
.dashboard-reports ul {
  list-style: none;
  padding: 0;
}
.dashboard-reports li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
  color: #374151;
}
.dashboard-reports .fecha {
  color: #6b7280;
  font-size: 0.95rem;
}
@media (max-width: 900px) {
  .dashboard-summary {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
