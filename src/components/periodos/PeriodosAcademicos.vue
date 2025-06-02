<template>
  <div class="periodos-academicos">
    <!-- Título Principal -->
    <h1 class="page-title">Gestión de Periodos Académicos</h1>

    <!-- Botón para abrir el modal de agregar -->
    <div class="actions-bar">
      <button @click="openModal" class="btn btn-primary">
        <i class="bx bx-plus-circle"></i>
        <span>Agregar Nuevo Periodo</span>
      </button>
    </div>

    <!-- Tabla de periodos -->
    <div class="periodos-list">
      <h2 class="list-title">Periodos Registrados</h2>
      <table class="periodos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in periodos" :key="p.id_periodo" class="table-row">
            <td>{{ p.nombre_periodo }}</td>
            <td>{{ p.fecha_inicio }}</td>
            <td>{{ p.fecha_fin }}</td>
            <td>
              <span
                :class="p.activo ? 'status-active' : 'status-inactive'"
              >
                {{ p.activo ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="editPeriodo(p)" class="btn btn-secondary btn-sm">
                <i class="bx bx-edit-alt"></i>
                Editar
              </button>
              <button @click="deletePeriodo(p.id_periodo)" class="btn btn-danger btn-sm">
                <i class="bx bx-trash"></i>
                Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="!periodos.length">
            <td colspan="5" class="no-data-row">No hay periodos registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Agregar / Editar Periodo -->
    <transition name="fade-in">
      <div
        v-if="isModalOpen"
        class="modal-overlay"
        @click.self="closeModal"
      >
        <div class="modal-content">
          <h3 class="modal-title">
            {{ periodo.id_periodo ? 'Editar Periodo' : 'Agregar Periodo' }}
          </h3>
          <form @submit.prevent="submitForm" class="modal-form">
            <!-- Nombre del Periodo -->
            <div class="form-group">
              <label for="nombre_periodo">Nombre del Periodo</label>
              <input
                id="nombre_periodo"
                v-model="periodo.nombre_periodo"
                type="text"
                placeholder="Ej. SEMESTRE 2025-1"
                required
              />
            </div>

            <!-- Fecha de Inicio -->
            <div class="form-group">
              <label for="fecha_inicio">Fecha de Inicio</label>
              <input
                id="fecha_inicio"
                v-model="periodo.fecha_inicio"
                type="date"
                required
              />
            </div>

            <!-- Fecha de Fin -->
            <div class="form-group">
              <label for="fecha_fin">Fecha de Fin</label>
              <input
                id="fecha_fin"
                v-model="periodo.fecha_fin"
                type="date"
                required
              />
            </div>

            <!-- Activo -->
            <div class="form-group form-group-checkbox">
              <input
                id="activo"
                v-model="periodo.activo"
                type="checkbox"
              />
              <label for="activo">Activo</label>
            </div>

            <!-- Botones de Acción -->
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                {{ periodo.id_periodo ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
          <button class="modal-close-btn" @click="closeModal">
            <i class="bx bx-x"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'PeriodosAcademicosView',
  data() {
    return {
      periodos: [],
      isModalOpen: false,
      periodo: {
        id_periodo: null,
        nombre_periodo: '',
        fecha_inicio: '',
        fecha_fin: '',
        activo: false,
      },
    };
  },
  created() {
    this.fetchPeriodos();
  },
  methods: {
    async fetchPeriodos() {
      try {
        const resp = await axios.get('http://localhost:3000/api/periodos_academicos');
        this.periodos = resp.data;
      } catch (err) {
        console.error('Error al cargar periodos:', err);
        Swal.fire('Error', 'No se pudieron cargar los periodos académicos.', 'error');
      }
    },
    openModal() {
      this.resetForm();
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    resetForm() {
      this.periodo = {
        id_periodo: null,
        nombre_periodo: '',
        fecha_inicio: '',
        fecha_fin: '',
        activo: false,
      };
    },
    formatDate(raw) {
      if (!raw) return '';
      const d = new Date(raw);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },
    editPeriodo(p) {
      // Copiamos el objeto para no mutar el original
      this.periodo = {
        id_periodo: p.id_periodo,
        nombre_periodo: p.nombre_periodo,
        fecha_inicio: this.formatDate(p.fecha_inicio),
        fecha_fin: this.formatDate(p.fecha_fin),
        activo: !!p.activo,
      };
      this.isModalOpen = true;
    },
    async deletePeriodo(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este periodo académico se eliminará definitivamente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/periodos_academicos/${id}`);
          this.periodos = this.periodos.filter(p => p.id_periodo !== id);
          Swal.fire('Eliminado', 'Periodo académico eliminado correctamente.', 'success');
        } catch (err) {
          console.error('Error al eliminar periodo:', err);
          Swal.fire('Error', 'No se pudo eliminar el periodo académico.', 'error');
        }
      }
    },
    async submitForm() {
      try {
        if (this.periodo.id_periodo) {
          // Actualizar
          await axios.put(
            `http://localhost:3000/api/periodos_academicos/${this.periodo.id_periodo}`,
            this.periodo
          );
          // Refrescar lista localmente
          const idx = this.periodos.findIndex(p => p.id_periodo === this.periodo.id_periodo);
          if (idx !== -1) {
            this.periodos.splice(idx, 1, {
              ...this.periodo,
              // Asegurarse de mantener el formato original si tu API regresa algo distinto:
              fecha_inicio: this.periodo.fecha_inicio,
              fecha_fin: this.periodo.fecha_fin,
            });
          }
          Swal.fire('Actualizado', 'Periodo académico actualizado correctamente.', 'success');
        } else {
          // Crear
          const resp = await axios.post(
            'http://localhost:3000/api/periodos_academicos',
            this.periodo
          );
          this.periodos.push(resp.data);
          Swal.fire('Guardado', 'Periodo académico creado correctamente.', 'success');
        }

        this.closeModal();
      } catch (err) {
        console.error('Error al guardar periodo:', err);
        Swal.fire('Error', 'Hubo un problema al guardar el periodo académico.', 'error');
      }
    },
  },
};
</script>

<style scoped>
/* ------------------------------------------------------------
   Variables de color y tipografía
   (Asegúrate de definir estas mismas variables en tu archivo global
    variables.css o main.css para mantener coherencia en toda la app)
   ------------------------------------------------------------ */
:root {
  --primary-red: #ff2d55;
  --primary-blue: #007aff;
  --dark-bg: #f5f5f5;
  --card-bg: #ffffff;
  --surface-bg: #fafafa;
  --border-color: #e0e0e0;
  --text-primary: #333333;
  --text-secondary: #666666;
  --gradient-primary: linear-gradient(135deg, #ff2d55, #af52de);
  --gradient-secondary: linear-gradient(135deg, #007aff, #5ac8fa);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 6px 20px rgba(0, 0, 0, 0.12);
  --border-radius: 8px;
  --border-radius-large: 12px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-heading: 'Montserrat', sans-serif;
}

/* ------------------------------------------------------------
   Estilos Generales de la Página
   ------------------------------------------------------------ */
.periodos-academicos {
  background: var(--dark-bg);
  padding: var(--spacing-lg);
  min-height: 100vh;
  font-family: var(--font-base);
  color: var(--text-primary);
}

.page-title {
  font-family: var(--font-heading);
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  position: relative;
}
.page-title::after {
  content: '';
  display: block;
  width: 120px;
  height: 4px;
  background: var(--gradient-primary);
  margin: var(--spacing-xs) auto 0;
  border-radius: 2px;
  animation: expand-underline 0.8s ease-out forwards;
  transform-origin: left;
  transform: scaleX(0);
  opacity: 0;
}

@keyframes expand-underline {
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

/* ------------------------------------------------------------
   Barra de Acción (Botón Agregar)
   ------------------------------------------------------------ */
.actions-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-md);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  position: relative;
  color: var(--text-secondary);
}

.btn-sm {
  padding: 4px 12px;
  font-size: 0.875rem;
}

.btn-primary {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: var(--shadow-card);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: var(--surface-bg);
  color: var(--primary-red);
  border: 2px solid var(--primary-red);
}
.btn-secondary:hover {
  background: var(--primary-red);
  color: #fff;
  transform: translateY(-2px);
}

.btn-danger {
  background: var(--primary-red);
  color: #fff;
}
.btn-danger:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* ------------------------------------------------------------
   Tabla de Periodos
   ------------------------------------------------------------ */
.periodos-list {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-card);
}

.list-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.periodos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.periodos-table th,
.periodos-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}

.periodos-table th {
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 600;
}

.periodos-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}

.periodos-table tbody tr:hover {
  background: rgba(237, 28, 36, 0.05);
  transition: background 0.2s ease;
}

.status-active {
  color: var(--primary-green, #34c759);
  font-weight: 600;
}

.status-inactive {
  color: var(--text-secondary);
  font-weight: 600;
}

.actions-cell > .btn {
  margin-right: var(--spacing-xs);
}

.no-data-row {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--text-secondary);
  font-style: italic;
}

/* ------------------------------------------------------------
   Modal Overlay y Contenido
   ------------------------------------------------------------ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  width: 90%;
  max-width: 480px;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-hover);
  animation: slide-in-down 0.4s ease-out;
}

@keyframes slide-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Título del modal */
.modal-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  text-align: center;
}

/* Botón para cerrar el modal (✕) */
.modal-close-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: var(--text-secondary);
  cursor: pointer;
}
.modal-close-btn:hover {
  color: var(--primary-red);
}

/* ------------------------------------------------------------
   Formulario dentro del modal
   ------------------------------------------------------------ */
.modal-form {
  margin-top: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-md);
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: var(--spacing-xs);
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="email"],
.form-group input[type="tel"] {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  color: var(--text-primary);
  background: var(--surface-bg);
  transition: border-color 0.2s ease;
}
.form-group input:focus {
  outline: none;
  border-color: var(--primary-blue);
}

/* Checkbox alineado */
.form-group-checkbox {
  flex-direction: row;
  align-items: center;
}
.form-group-checkbox input[type="checkbox"] {
  margin-right: var(--spacing-xs);
}

/* Botones del formulario */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}
.form-actions .btn {
  min-width: 100px;
}

/* ------------------------------------------------------------
   Ajustes Responsivos
   ------------------------------------------------------------ */
@media (max-width: 600px) {
  .form-group {
    flex-direction: column;
  }
  .actions-bar {
    justify-content: center;
  }
  .btn {
    width: 100%;
  }
  .modal-content {
    padding: var(--spacing-md);
  }
}

@media (max-width: 400px) {
  .modal-content {
    padding: var(--spacing-sm);
  }
  .modal-title {
    font-size: 1.3rem;
  }
  .btn {
    font-size: 0.875rem;
  }
}
</style>
