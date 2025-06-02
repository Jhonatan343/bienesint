<template>
  <div class="ubicaciones-container">
    <!-- Header con gradiente -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <i class="bx bx-map"></i>
          </div>
          <h1>Gestión de Ubicaciones</h1>
        </div>
        <p class="subtitle">Administra y organiza las ubicaciones institucionales</p>
      </div>
      <div class="header-actions">
        <button @click="openModal" class="btn btn-primary btn-modern">
          <div class="btn-content">
            <i class="bx bx-map-pin"></i>
            <span>Nueva Ubicación</span>
          </div>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando ubicaciones...</p>
    </div>

    <!-- Lista de Ubicaciones en Tabla -->
    <div v-else-if="ubicaciones.length" class="ubicaciones-grid">
      <div class="section-header">
        <h2>
          <i class="bx bx-list-ul"></i>
          Ubicaciones Registradas
        </h2>
        <div class="stats-badge">
          {{ ubicaciones.length }} {{ ubicaciones.length === 1 ? 'ubicación' : 'ubicaciones' }}
        </div>
      </div>
      
      <div class="table-container">
        <div class="table-wrapper">
          <table class="ubicaciones-table">
            <thead>
              <tr>
                <th class="th-location">
                  <i class="bx bx-buildings"></i>
                  Ubicación
                </th>
                <th class="th-details">
                  <i class="bx bx-detail"></i>
                  Detalles
                </th>
                <th class="th-sede">
                  <i class="bx bx-home"></i>
                  Sede
                </th>
                <th class="th-description">
                  <i class="bx bx-note"></i>
                  Descripción
                </th>
                <th class="th-actions">
                  <i class="bx bx-cog"></i>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ubicacion in ubicaciones"
                :key="ubicacion.id_ubicacion"
                class="table-row"
              >
                <td class="td-location">
                  <div class="location-cell">
                    <div class="location-icon">
                      <i class="bx bx-map-pin"></i>
                    </div>
                    <div class="location-details">
                      <div class="location-area">{{ ubicacion.area }}</div>
                      <div class="location-id">ID: {{ ubicacion.id_ubicacion }}</div>
                    </div>
                  </div>
                </td>
                <td class="td-details">
                  <div class="details-info">
                    <div class="detail-item">
                      <i class="bx bx-door-open"></i>
                      <span>Aula {{ ubicacion.numero_aula }}</span>
                    </div>
                  </div>
                </td>
                <td class="td-sede">
                  <div class="sede-info">
                    <i class="bx bx-building"></i>
                    <span>{{ ubicacion.sede }}</span>
                  </div>
                </td>
                <td class="td-description">
                  <div class="description-info">
                    <i class="bx bx-note"></i>
                    <span>{{ ubicacion.descripcion }}</span>
                  </div>
                </td>
                <td class="td-actions">
                  <div class="action-buttons">
                    <button
                      @click="editUbicacion(ubicacion)"
                      class="btn-table btn-edit"
                      title="Editar ubicación"
                    >
                      <i class="bx bx-pencil"></i>
                      <span>Editar</span>
                    </button>
                    <button
                      @click="confirmDeleteUbicacion(ubicacion.id_ubicacion)"
                      class="btn-table btn-delete"
                      title="Eliminar ubicación"
                    >
                      <i class="bx bx-trash"></i>
                      <span>Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Estado vacío mejorado -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="bx bx-map-alt"></i>
      </div>
      <h3>No hay ubicaciones registradas</h3>
      <p>Comienza registrando la primera ubicación del sistema</p>
      <button @click="openModal" class="btn btn-outline">
        <i class="bx bx-map-pin"></i>
        Registrar Primera Ubicación
      </button>
    </div>

    <!-- Modal mejorado -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-container">
            <div class="modal-header">
              <div class="modal-title-wrapper">
                <div class="modal-icon">
                  <i class="bx" :class="isEditing ? 'bx-edit' : 'bx-map-pin'"></i>
                </div>
                <h2>{{ isEditing ? 'Editar Ubicación' : 'Nueva Ubicación' }}</h2>
              </div>
              <button class="modal-close" @click="closeModal">
                <i class="bx bx-x"></i>
              </button>
            </div>

            <form @submit.prevent="saveOrUpdateUbicacion" class="modal-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="area">
                    <i class="bx bx-buildings"></i>
                    Área
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="area"
                      v-model="ubicacion.area"
                      placeholder="Ej. Laboratorios, Aulas, Biblioteca"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="numero_aula">
                    <i class="bx bx-door-open"></i>
                    Número de Aula
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="numero_aula"
                      v-model="ubicacion.numero_aula"
                      placeholder="Ej. A-101, B-205, Lab-1"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group form-group-full">
                  <label for="sede">
                    <i class="bx bx-building"></i>
                    Sede
                  </label>
                  <div class="input-wrapper">
                    <select
                      id="sede"
                      v-model="ubicacion.sede"
                      required
                      :disabled="isSaving"
                    >
                      <option value="">Seleccionar sede...</option>
                      <option value="Sede Principal">Sede Principal</option>
                      <option value="Escuela Municipal">Escuela Municipal</option>
                    </select>
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group form-group-full">
                  <label for="descripcion">
                    <i class="bx bx-note"></i>
                    Descripción
                  </label>
                  <div class="input-wrapper">
                    <textarea
                      id="descripcion"
                      v-model="ubicacion.descripcion"
                      placeholder="Descripción detallada de la ubicación..."
                      rows="3"
                      required
                      :disabled="isSaving"
                    ></textarea>
                    <div class="input-focus-line"></div>
                  </div>
                </div>
              </div>

              <div class="modal-actions">
                <button 
                  type="button" 
                  @click="closeModal" 
                  class="btn btn-secondary"
                  :disabled="isSaving"
                >
                  <i class="bx bx-x"></i>
                  <span>Cancelar</span>
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary btn-modern"
                  :disabled="isSaving"
                >
                  <div class="btn-content">
                    <i v-if="!isSaving" class="bx" :class="isEditing ? 'bx-check' : 'bx-plus'"></i>
                    <div v-else class="btn-spinner"></div>
                    <span>{{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}</span>
                  </div>
                  <div class="btn-glow"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'UbicacionesView',
  data() {
    return {
      isModalOpen: false,
      isEditing: false,
      isLoading: false,
      isSaving: false,
      editingId: null,
      ubicacion: {
        area: '',
        numero_aula: '',
        sede: '',
        descripcion: '',
      },
      ubicaciones: [],
    };
  },
  methods: {
    async fetchUbicaciones() {
      this.isLoading = true;
      try {
        const res = await fetch('http://localhost:3000/api/ubicaciones');
        if (!res.ok) throw new Error('Error al cargar ubicaciones');
        const data = await res.json();
        this.ubicaciones = data;
      } catch (err) {
        console.error('Error al cargar ubicaciones:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las ubicaciones.',
          icon: 'error',
          confirmButtonColor: '#ed1c24'
        });
      } finally {
        this.isLoading = false;
      }
    },
    openModal() {
      this.resetForm();
      this.isEditing = false;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    resetForm() {
      this.ubicacion = {
        area: '',
        numero_aula: '',
        sede: '',
        descripcion: '',
      };
      this.editingId = null;
      this.isEditing = false;
      this.isSaving = false;
    },
    editUbicacion(record) {
      this.ubicacion = { ...record };
      this.editingId = record.id_ubicacion;
      this.isEditing = true;
      this.isModalOpen = true;
    },
    async saveOrUpdateUbicacion() {
      if (this.isEditing) {
        await this.updateUbicacion();
      } else {
        await this.saveUbicacion();
      }
    },
    async saveUbicacion() {
      this.isSaving = true;
      try {
        const res = await fetch('http://localhost:3000/api/ubicaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.ubicacion),
        });
        if (!res.ok) throw new Error('Error al guardar');
        const nuevo = await res.json();
        this.ubicaciones.push(nuevo);
        this.closeModal();
        Swal.fire({
          title: '¡Registrado!',
          text: 'Ubicación registrada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ed1c24'
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar la ubicación.',
          icon: 'error',
          confirmButtonColor: '#ed1c24'
        });
      } finally {
        this.isSaving = false;
      }
    },
    async updateUbicacion() {
      this.isSaving = true;
      try {
        const res = await fetch(
          `http://localhost:3000/api/ubicaciones/${this.editingId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.ubicacion),
          }
        );
        if (!res.ok) throw new Error('Error al actualizar');
        const updated = await res.json();
        const idx = this.ubicaciones.findIndex(
          (u) => u.id_ubicacion === this.editingId
        );
        if (idx !== -1) this.ubicaciones.splice(idx, 1, updated);
        this.closeModal();
        Swal.fire({
          title: '¡Actualizado!',
          text: 'Ubicación actualizada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ed1c24'
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la ubicación.',
          icon: 'error',
          confirmButtonColor: '#ed1c24'
        });
      } finally {
        this.isSaving = false;
      }
    },
    async confirmDeleteUbicacion(id) {
      const result = await Swal.fire({
        title: '¿Eliminar ubicación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ed1c24',
        cancelButtonColor: '#111111',
        reverseButtons: true
      });
      if (result.isConfirmed) {
        this.deleteUbicacion(id);
      }
    },
    async deleteUbicacion(id) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/ubicaciones/${id}`,
          { method: 'DELETE' }
        );
        if (!res.ok) throw new Error('Error al eliminar');
        this.ubicaciones = this.ubicaciones.filter(
          (u) => u.id_ubicacion !== id
        );
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Ubicación eliminada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ed1c24'
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la ubicación.',
          icon: 'error',
          confirmButtonColor: '#ed1c24'
        });
      }
    },
  },
  created() {
    this.fetchUbicaciones();
  },
};
</script>

<style scoped>
/* ======================================
   Layout principal
   ====================================== */
.ubicaciones-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  font-family: var(--font-base);
  background: var(--institutional-white);
  min-height: 100vh;
}

/* ======================================
   Header Section
   ====================================== */
.header-section {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.header-content {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.5rem;
}

.header-section h1 {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
}

.header-actions {
  flex-shrink: 0;
}

/* ======================================
   Botones modernos
   ====================================== */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  outline: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-modern {
  background: var(--gradient-primary);
  color: var(--white);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.btn-modern:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-floating);
}

.btn-modern:active {
  transform: translateY(0);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-modern:hover .btn-glow {
  transform: translateX(100%);
}

.btn-secondary {
  background: var(--institutional-white);
  color: var(--institutional-red);
  border: 2px solid var(--institutional-red);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--institutional-red);
  color: var(--institutional-white);
  transform: translateY(-1px);
}

.btn-secondary i {
  margin-right: var(--spacing-xs);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--gradient-primary);
  color: var(--white);
  border-color: transparent;
}

/* ======================================
   Loading States
   ====================================== */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem var(--spacing-xl);
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--institutional-red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid var(--white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ======================================
   Tabla de Ubicaciones Moderna
   ====================================== */
.ubicaciones-grid {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--border-color);
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.stats-badge {
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 999px;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.table-container {
  background: var(--institutional-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.table-wrapper {
  overflow-x: auto;
}

.ubicaciones-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--institutional-white);
}

/* ======================================
   Encabezados de Tabla
   ====================================== */
.ubicaciones-table thead {
  background: var(--gradient-primary);
}

.ubicaciones-table th {
  padding: var(--spacing-lg) var(--spacing-md);
  text-align: left;
  font-family: var(--font-heading);
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  white-space: nowrap;
}

.ubicaciones-table th i {
  margin-right: var(--spacing-xs);
  font-size: 1rem;
}

.th-location { width: 25%; }
.th-details { width: 15%; }
.th-sede { width: 20%; }
.th-description { width: 25%; }
.th-actions { width: 15%; min-width: 160px; }

/* ======================================
   Filas de Tabla
   ====================================== */
.ubicaciones-table tbody tr {
  transition: var(--transition);
  border-bottom: 1px solid var(--border-color);
}

.ubicaciones-table tbody tr:hover {
  background: rgba(237, 28, 36, 0.05);
  transform: scale(1.002);
}

.ubicaciones-table tbody tr:nth-child(even) {
  background: rgba(249, 249, 249, 0.5);
}

.ubicaciones-table tbody tr:nth-child(even):hover {
  background: rgba(237, 28, 36, 0.05);
}

.ubicaciones-table td {
  padding: var(--spacing-lg) var(--spacing-md);
  vertical-align: top;
  border: none;
}

/* ======================================
   Celdas Específicas
   ====================================== */
.location-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.location-icon {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.location-details {
  min-width: 0;
  flex: 1;
}

.location-area {
  font-family: var(--font-heading);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  line-height: 1.3;
}

.location-id {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  font-weight: 500;
}

.details-info,
.sede-info,
.description-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.details-info i,
.sede-info i,
.description-info i {
  color: var(--institutional-red);
  font-size: 1rem;
  width: 16px;
  flex-shrink: 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.detail-item i {
  color: var(--institutional-red);
  font-size: 1rem;
  width: 16px;
  flex-shrink: 0;
}

.description-info span {
  line-height: 1.4;
  word-break: break-word;
}

/* ======================================
   Botones de Tabla
   ====================================== */
.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.btn-table {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 70px;
  justify-content: center;
}

.btn-table:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-table:active {
  transform: translateY(0);
}

.btn-edit {
  background: var(--success-gradient);
  color: var(--white);
}

.btn-edit:hover {
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.btn-delete {
  background: var(--warning-gradient);
  color: var(--white);
}

.btn-delete:hover {
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

.btn-table i {
  font-size: 1rem;
}

.btn-table span {
  font-weight: 600;
}

/* ======================================
   Estado Vacío
   ====================================== */
.empty-state {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: 4rem var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-card);
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: 2rem;
  color: var(--white);
}

.empty-state h3 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* ======================================
   Modal Mejorado
   ====================================== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-xl);
}

.modal-container {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: var(--institutional-white);
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.modal-title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.modal-icon {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.25rem;
}

.modal-header h2 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.modal-close:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.modal-form {
  padding: var(--spacing-xl);
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input,
.input-wrapper select,
.input-wrapper textarea {
  width: 100%;
  padding: var(--spacing-md) 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  background: var(--institutional-white);
  color: var(--text-primary);
  transition: var(--transition);
  outline: none;
  font-family: var(--font-base);
}

.input-wrapper textarea {
  resize: vertical;
  min-height: 80px;
}

.input-wrapper input:focus,
.input-wrapper select:focus,
.input-wrapper textarea:focus {
  border-color: var(--institutional-red);
  background: var(--institutional-white);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.input-wrapper input:disabled,
.input-wrapper select:disabled,
.input-wrapper textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-focus-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-wrapper input:focus + .input-focus-line,
.input-wrapper select:focus + .input-focus-line,
.input-wrapper textarea:focus + .input-focus-line {
  transform: scaleX(1);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background: var(--card-bg);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.modal-actions .btn {
  min-width: 120px;
  height: 48px;
  font-size: var(--font-size-base);
  font-weight: 600;
  position: relative;
  z-index: 11;
}

/* ======================================
   Animaciones de Transición
   ====================================== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: var(--transition);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(-50px);
}

/* ======================================
   Responsive Design
   ====================================== */
@media (max-width: 1024px) {
  .th-description,
  .td-description {
    display: none;
  }
  
  .th-location { width: 30%; }
  .th-details { width: 20%; }
  .th-sede { width: 30%; }
  .th-actions { width: 20%; }
}

@media (max-width: 768px) {
  .ubicaciones-container {
    padding: var(--spacing-md);
  }
  
  .header-section {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
    padding: var(--spacing-xl);
  }
  
  .header-content {
    order: 1;
  }
  
  .header-actions {
    order: 2;
  }
  
  .modal-backdrop {
    padding: var(--spacing-md);
  }
  
  .modal-form {
    padding: var(--spacing-lg);
  }
  
  .modal-header {
    padding: var(--spacing-lg);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .modal-actions {
    flex-direction: column-reverse;
    gap: var(--spacing-sm);
  }
  
  .modal-actions .btn {
    width: 100%;
    justify-content: center;
    min-width: auto;
  }

  /* Tabla responsive - ocultar más columnas */
  .th-details,
  .td-details,
  .th-sede,
  .td-sede {
    display: none;
  }
  
  .th-location { width: 60%; }
  .th-actions { width: 40%; }
  
  .ubicaciones-table th,
  .ubicaciones-table td {
    padding: var(--spacing-md) var(--spacing-sm);
  }
  
  .location-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .location-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: var(--spacing-xs);
    width: 100%;
  }
  
  .btn-table {
    width: 100%;
    min-width: auto;
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .header-section h1 {
    font-size: 1.5rem;
  }
  
  .title-wrapper {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  /* En móviles, mostrar solo ubicación y acciones */
  .ubicaciones-table th,
  .ubicaciones-table td {
    padding: var(--spacing-sm);
  }
  
  .location-area {
    font-size: var(--font-size-sm);
  }
  
  .location-id {
    font-size: 0.75rem;
  }
  
  .btn-table {
    font-size: 0.75rem;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .btn-table span {
    display: none;
  }
  
  .btn-table {
    min-width: 32px;
    width: auto;
  }
  
  .action-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

/* ======================================
   Optimizaciones de rendimiento
   ====================================== */
.table-row,
.btn,
.modal-container {
  will-change: transform;
}

/* Reducir motion para usuarios con preferencias de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>