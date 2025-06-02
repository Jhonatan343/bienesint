<template>
  <div class="reports-view">

    <!-- ─────────────────────────────────────────────────────────────────
         1) CARDS DE ESTADÍSTICAS
         ───────────────────────────────────────────────────────────────── -->
    <section class="stats-cards">
      <div class="stat-card">
        <h3>Total Bienes</h3>
        <p class="stat-number">{{ stats.total_bienes ?? '...' }}</p>
      </div>
      <div class="stat-card">
        <h3>Bienes Activos</h3>
        <p class="stat-number">{{ stats.bienes_activos ?? '...' }}</p>
      </div>
      <div class="stat-card">
        <h3>En Reparación</h3>
        <p class="stat-number">{{ stats.bienes_reparacion ?? '...' }}</p>
      </div>
      <div class="stat-card">
        <h3>Dado de Baja</h3>
        <p class="stat-number">{{ stats.bienes_baja ?? '...' }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Usuarios</h3>
        <p class="stat-number">{{ stats.total_usuarios ?? '...' }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Ubicaciones</h3>
        <p class="stat-number">{{ stats.total_ubicaciones ?? '...' }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Categorías</h3>
        <p class="stat-number">{{ stats.total_categorias ?? '...' }}</p>
      </div>
      <div class="stat-card">
        <h3>Valor Total Bienes</h3>
        <p class="stat-number">
          {{ stats.valor_total_bienes !== null ? `$ ${stats.valor_total_bienes.toFixed(2)}` : '...' }}
        </p>
      </div>
    </section>

    <!-- ─────────────────────────────────────────────────────────────────
         2) GRÁFICA DE DONA: Distribución de Bienes por Estado
         ───────────────────────────────────────────────────────────────── -->
    <section class="chart-section">
      <h4>Distribución de Bienes por Estado</h4>
      <canvas id="estadoChart" class="chart-canvas"></canvas>
    </section>

    <!-- ─────────────────────────────────────────────────────────────────
         3) BOTÓN “GENERAR REPORTE” + MODAL
         ───────────────────────────────────────────────────────────────── -->
    <section class="report-button-wrapper">
      <button class="btn-generate-report" @click="openModal">
        <i class="bx bx-notepad"></i> Generar Reporte
      </button>
    </section>

    <div v-if="showModal" class="overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Generar Reporte</h2>
          <button class="close-btn" @click="closeModal">
            <i class="bx bx-x"></i>
          </button>
        </div>
        <form @submit.prevent="generateReport" class="modal-form">
          <!-- TIPOS DE REPORTE -->
          <div class="form-section">
            <label class="form-label">Seleccione Tipo(s) de Reporte</label>
            <div class="options-group">
              <div class="form-check select-all">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="selectAll"
                  :checked="allSelected"
                  @change="toggleAll"
                />
                <label class="form-check-label" for="selectAll">
                  <strong>Seleccionar Todos</strong>
                </label>
              </div>
              <div
                class="form-check"
                v-for="option in reportOptions"
                :key="option.value"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="option.value"
                  :value="option.value"
                  v-model="selectedReports"
                />
                <label class="form-check-label" :for="option.value">
                  {{ option.label }}
                </label>
              </div>
            </div>
          </div>

          <!-- RANGO DE FECHAS -->
          <div class="form-section date-section">
            <div class="date-group">
              <label class="form-label" for="startDate">Fecha Inicio</label>
              <input
                type="date"
                id="startDate"
                v-model="startDate"
                class="form-control"
                required
              />
            </div>
            <div class="date-group">
              <label class="form-label" for="endDate">Fecha Fin</label>
              <input
                type="date"
                id="endDate"
                v-model="endDate"
                class="form-control"
                required
              />
            </div>
          </div>

          <!-- BOTONES -->
          <div class="form-actions">
            <button type="submit" class="btn btn-generate">Generar</button>
            <button type="button" class="btn btn-cancel" @click="closeModal">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// ──────────────────────────────────────────────────────────────────────
// Importa Chart.js (asegúrate de haber hecho `npm install chart.js`)
// ──────────────────────────────────────────────────────────────────────
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'ReportsView',

  data() {
    return {
      // ─────────────────────────────────────────────────
      // Modal “Generar Reporte”
      // ─────────────────────────────────────────────────
      showModal: false,
      reportOptions: [
        { value: 'Areas',      label: 'Áreas' },
        { value: 'Inventario', label: 'Inventario' },
        { value: 'Usuarios',   label: 'Usuarios' }
      ],
      selectedReports: [],
      startDate: '',
      endDate: '',

      // ─────────────────────────────────────────────────
      // Estadísticas que trae el backend /api/dashboard/stats
      // ─────────────────────────────────────────────────
      stats: {
        total_bienes: null,
        bienes_activos: null,
        bienes_reparacion: null,
        bienes_baja: null,
        total_usuarios: null,
        total_ubicaciones: null,
        total_categorias: null,
        valor_total_bienes: null
      },

      // Instancia de la gráfica de dona para “Bienes por Estado”
      pieChartInstance: null
    };
  },

  computed: {
    // ─────────────────────────────────────────────────────────
    // Saber si “Seleccionar Todos” está marcado
    // ─────────────────────────────────────────────────────────
    allSelected: {
      get() {
        return this.selectedReports.length === this.reportOptions.length;
      },
      set(val) {
        this.selectedReports = val
          ? this.reportOptions.map(opt => opt.value)
          : [];
      }
    }
  },

  methods: {
    // ─────────────────────────────────────────────────────────
    //  Abrir / Cerrar modal
    // ─────────────────────────────────────────────────────────
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedReports = [];
      this.startDate = '';
      this.endDate = '';
    },
    toggleAll() {
      this.allSelected = !this.allSelected;
    },

    // ─────────────────────────────────────────────────────────
    //  “Generar Reporte” (solo muestra un alert de ejemplo)
    // ─────────────────────────────────────────────────────────
    generateReport() {
      if (
        this.selectedReports.length === 0 ||
        !this.startDate ||
        !this.endDate
      ) {
        window.alert(
          'Por favor seleccione al menos un tipo de reporte y defina un rango de fechas.'
        );
        return;
      }

      window.alert(
        `Generando reporte(s): ${this.selectedReports.join(
          ', '
        )} desde ${this.startDate} hasta ${this.endDate}`
      );
      this.closeModal();
    },

    // ─────────────────────────────────────────────────────────
    //  Llamar a GET /api/dashboard/stats y guardar en `this.stats`
    // ─────────────────────────────────────────────────────────
    async fetchDashboardStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        const data = await res.json();

        // Asignamos cada campo retornado al objeto stats
        this.stats = {
          total_bienes: data.total_bienes,
          bienes_activos: data.bienes_activos,
          bienes_reparacion: data.bienes_reparacion,
          bienes_baja: data.bienes_baja,
          total_usuarios: data.total_usuarios,
          total_ubicaciones: data.total_ubicaciones,
          total_categorias: data.total_categorias,
          valor_total_bienes: data.valor_total_bienes
        };

        // Luego, dibujamos (o redibujamos) la gráfica de dona
        this.renderPieChart();
      } catch (err) {
        console.error('fetchDashboardStats error:', err);
        window.alert('No se pudieron cargar los datos de estadísticas.');
      }
    },

    // ─────────────────────────────────────────────────────────
    //  Gráfica de Dona: “Bienes por Estado”
    //  Usa: stats.bienes_activos, stats.bienes_reparacion, stats.bienes_baja
    // ─────────────────────────────────────────────────────────
    renderPieChart() {
      // Si ya existe, destrúyela primero
      if (this.pieChartInstance) {
        this.pieChartInstance.destroy();
      }

      // Etiquetas y datos
      const labels = ['Activos', 'En Reparación', 'Dado de Baja'];
      const values = [
        this.stats.bienes_activos || 0,
        this.stats.bienes_reparacion || 0,
        this.stats.bienes_baja || 0
      ];

      // Paleta de colores
      const backgroundColors = [
        '#28a745',  // Verde – Activos
        '#ffc107',  // Amarillo – En Reparación
        '#dc3545'   // Rojo – Dado de Baja
      ];

      const ctx = document.getElementById('estadoChart').getContext('2d');
      this.pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors,
              borderColor: ['#ffffff', '#ffffff', '#ffffff'],
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '50%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'var(--text-primary)',
                font: { size: 13 }
              }
            },
            tooltip: {
              backgroundColor: 'var(--card-bg)',
              titleColor: 'var(--text-primary)',
              bodyColor: 'var(--text-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1
            }
          }
        }
      });
    }
  },

  mounted() {
    // Al montar, solicitamos datos al backend
    this.fetchDashboardStats();
  }
};
</script>

<style scoped>
/* ──────────────────────────────────────────────────────────────────────
   Estas clases usan variables definidas en tu `variables.css` global:
     --card-bg, --border-color, --border-radius, --border-radius-large,
     --shadow-card, --shadow-glow, --text-primary, --text-secondary,
     --institutional-red, --surface-bg, --spacing-sm, --spacing-md,
     --spacing-lg, etc.
   Asegúrate de importarlas en main.js:
     import '../src/assets/styles/variables.css';
   ────────────────────────────────────────────────────────────────────── */

/* ─────────── Contenedor Principal ─────────── */
.reports-view {
  background: var(--surface-bg);
  padding: var(--spacing-lg) var(--spacing-md);
  min-height: calc(100vh - 80px);
  font-family: var(--font-base);
}

/* ─────────── Sección de Cards ─────────── */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-md);
  text-align: center;
  box-shadow: var(--shadow-card);
}
.stat-card h3 {
  margin: 0 0 var(--spacing-sm);
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 600;
}
.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--institutional-red);
  margin: 0;
}

/* ─────────── Gráfica de Dona ─────────── */
.chart-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-card);
}
.chart-section h4 {
  margin: 0 0 var(--spacing-md);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--institutional-black);
  text-align: center;
}
.chart-canvas {
  width: 100%;
  height: 300px;
}

/* ─────────── Botón “Generar Reporte” ─────────── */
.report-button-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}
.btn-generate-report {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--gradient-primary);
  color: var(--institutional-white);
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-generate-report:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
.btn-generate-report i {
  font-size: 1.2rem;
}

/* ─────────── OVERLAY DEL MODAL ─────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* ─────────── CONTENEDOR DEL MODAL ─────────── */
.modal-container {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  width: 420px;
  max-width: 90%;
  box-shadow: var(--shadow-card);
  animation: fadeInModal 0.3s ease-out;
}

/* ─────────── HEADER DEL MODAL ─────────── */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}
.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--institutional-black);
  user-select: none;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: var(--institutional-red);
}

/* ─────────── FORMULARIO DEL MODAL ─────────── */
.modal-form {
  padding: var(--spacing-lg);
}
.form-section {
  margin-bottom: var(--spacing-md);
}
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
}
/* Grupo de checkboxes */
.options-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.select-all {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}
.form-check {
  display: flex;
  align-items: center;
}
.form-check-input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--institutional-red);
  cursor: pointer;
}
.form-check-label {
  margin-left: var(--spacing-xs);
  font-size: 0.95rem;
  color: var(--text-primary);
}

/* ─────────── SECCIÓN DE FECHAS ─────────── */
.date-section {
  display: flex;
  gap: var(--spacing-md);
}
.date-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.form-control {
  padding: var(--spacing-sm);
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  transition: border-color 0.3s;
}
.form-control:focus {
  outline: none;
  border-color: var(--institutional-red);
}

/* ─────────── BOTONES DEL MODAL ─────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}
.btn-generate {
  background: var(--gradient-primary);
  color: var(--institutional-white);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
.btn-cancel {
  background: var(--surface-bg);
  color: var(--institutional-black);
  border: 2px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.btn-cancel:hover {
  border-color: var(--institutional-red);
  color: var(--institutional-red);
  transform: translateY(-2px);
}

/* ─────────── ANIMACIONES ─────────── */
@keyframes fadeInModal {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ─────────── RESPONSIVIDAD ─────────── */
@media (max-width: 500px) {
  .date-section {
    flex-direction: column;
  }
}
</style>
