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
        <button @click="exportData" class="btn btn-secondary btn-export" title="Exportar datos">
          <div class="btn-content">
            <i class="bx bx-download"></i>
            <span>Exportar</span>
          </div>
        </button>
        <button @click="openModal" class="btn btn-primary btn-modern">
          <div class="btn-content">
            <i class="bx bx-map-pin"></i>
            <span>Nueva Ubicación</span>
          </div>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>

    <!-- NUEVA SECCIÓN: Panel de Estadísticas Detalladas -->
    <div v-if="ubicaciones.length > 0" class="stats-section">
      <h2 class="section-title">
        <i class="bx bx-bar-chart"></i>
        Resumen de Ubicaciones
      </h2>
      <div class="stats-grid">
        <div class="stat-card total-ubicaciones">
          <div class="stat-icon">
            <i class="bx bx-map-pin"></i>
          </div>
          <div class="stat-content">
            <h3>{{ ubicaciones.length }}</h3>
            <p>Total Ubicaciones</p>
          </div>
        </div>
        <div class="stat-card total-sedes">
          <div class="stat-icon">
            <i class="bx bx-buildings"></i>
          </div>
          <div class="stat-content">
            <h3>{{ uniqueSedes.length }}</h3>
            <p>Sedes Activas</p>
          </div>
        </div>
        <div class="stat-card" v-for="(count, sede) in sedeStats" :key="sede">
          <div class="stat-icon sede-icon">
            <i class="bx bx-building"></i>
          </div>
          <div class="stat-content">
            <h3>{{ count }}</h3>
            <p>{{ sede }}</p>
          </div>
        </div>
        <div class="stat-card total-areas">
          <div class="stat-icon">
            <i class="bx bx-category"></i>
          </div>
          <div class="stat-content">
            <h3>{{ uniqueAreas.length }}</h3>
            <p>Áreas Diferentes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando ubicaciones...</p>
    </div>

    <!-- Lista de Ubicaciones en Tabla -->
    <div v-else-if="filteredUbicaciones.length" class="ubicaciones-grid">
      <div class="section-header">
        <h2>
          <i class="bx bx-list-ul"></i>
          Ubicaciones Registradas
        </h2>
        <div class="header-controls">
          <!-- NUEVOS: Controles de búsqueda y filtros -->
          <div class="search-controls">
            <div class="search-box">
              <i class="bx bx-search"></i>
              <input 
                v-model="searchTerm" 
                type="text" 
                placeholder="Buscar ubicaciones..."
                @input="filterUbicaciones"
              >
            </div>
            <select v-model="selectedSede" @change="filterUbicaciones" class="sede-filter">
              <option value="">Todas las sedes</option>
              <option v-for="sede in uniqueSedes" :key="sede" :value="sede">
                {{ sede }}
              </option>
            </select>
            <select v-model="selectedArea" @change="filterUbicaciones" class="area-filter">
              <option value="">Todas las áreas</option>
              <option v-for="area in uniqueAreas" :key="area" :value="area">
                {{ area }}
              </option>
            </select>
          </div>
          <div class="stats-badge">
            {{ filteredUbicaciones.length }} de {{ ubicaciones.length }} ubicaciones
          </div>
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
                <th class="th-qr">
                  <i class="bx bx-qr"></i>
                  QR
                </th>
                <th class="th-actions">
                  <i class="bx bx-cog"></i>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ubicacion in filteredUbicaciones"
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
                <!-- NUEVA: Columna QR -->
                <td class="td-qr">
                  <button
                    @click="generateQR(ubicacion)"
                    class="btn-qr"
                    title="Generar código QR"
                  >
                    <i class="bx bx-qr"></i>
                  </button>
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
    <div v-else-if="!isLoading && ubicaciones.length === 0" class="empty-state">
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

    <!-- Estado de búsqueda sin resultados -->
    <div v-else-if="!isLoading && ubicaciones.length > 0 && filteredUbicaciones.length === 0" class="empty-search-state">
      <div class="empty-icon">
        <i class="bx bx-search-alt"></i>
      </div>
      <h3>No se encontraron ubicaciones</h3>
      <p>Intenta ajustar los filtros de búsqueda</p>
      <button @click="clearFilters" class="btn btn-outline">
        <i class="bx bx-refresh"></i>
        Limpiar Filtros
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

    <!-- NUEVO: Modal de QR -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="qrModalOpen" class="modal-backdrop" @click="closeQRModal">
          <div class="modal-container qr-modal" @click.stop>
            <div class="modal-header">
              <div class="modal-title-wrapper">
                <div class="modal-icon">
                  <i class="bx bx-qr"></i>
                </div>
                <h2>Código QR - {{ selectedUbicacion?.area }}</h2>
              </div>
              <button @click="closeQRModal" class="modal-close">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="modal-body qr-content">
              <div class="qr-display">
                <div ref="qrCode" class="qr-code"></div>
                <div class="qr-info">
                  <h3>{{ selectedUbicacion?.area }} - Aula {{ selectedUbicacion?.numero_aula }}</h3>
                  <p><strong>ID:</strong> {{ selectedUbicacion?.id_ubicacion }}</p>
                  <p><strong>Sede:</strong> {{ selectedUbicacion?.sede }}</p>
                  <p><strong>Descripción:</strong> {{ selectedUbicacion?.descripcion }}</p>
                </div>
              </div>
              <div class="qr-actions">
                <button @click="downloadQR" class="download-qr-btn">
                  <i class="bx bx-download"></i>
                  Descargar QR
                </button>
                <button @click="printQR" class="print-qr-btn">
                  <i class="bx bx-printer"></i>
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { ubicacionesService } from '@/services/api.js'; // ← IMPORTAR EL SERVICIO

export default {
  name: 'UbicacionesView',
  data() {
    return {
      // ✅ DATOS ORIGINALES MANTENIDOS
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

      // ✅ NUEVOS DATOS AGREGADOS
      // Filtros y búsqueda
      searchTerm: '',
      selectedSede: '',
      selectedArea: '',
      filteredUbicaciones: [],
      
      // QR Modal
      qrModalOpen: false,
      selectedUbicacion: null
    };
  },

  computed: {
    // ✅ NUEVAS PROPIEDADES COMPUTADAS AGREGADAS
    uniqueSedes() {
      const sedes = [...new Set(this.ubicaciones.map(u => u.sede))];
      return sedes.filter(sede => sede); // Filtrar valores vacíos
    },
    
    uniqueAreas() {
      const areas = [...new Set(this.ubicaciones.map(u => u.area))];
      return areas.filter(area => area); // Filtrar valores vacíos
    },
    
    sedeStats() {
      const stats = {};
      this.uniqueSedes.forEach(sede => {
        stats[sede] = this.ubicaciones.filter(u => u.sede === sede).length;
      });
      return stats;
    }
  },

  methods: {
    // ✅ MÉTODOS ORIGINALES MANTENIDOS
    async fetchUbicaciones() {
      this.isLoading = true;
      try {
        const res = await ubicacionesService.getAll();
        this.ubicaciones = res.data;
        this.filterUbicaciones(); // ✅ AGREGADO: Aplicar filtros después de cargar
        console.log('✅ Ubicaciones cargadas:', this.ubicaciones.length);
      } catch (err) {
        console.error('❌ Error al cargar ubicaciones:', err);
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
        const res = await ubicacionesService.create(this.ubicacion);
        this.ubicaciones.push(res.data);
        this.filterUbicaciones(); // ✅ AGREGADO: Actualizar filtros
        this.closeModal();
        console.log('✅ Ubicación creada:', res.data);
        this.showNotification('Ubicación registrada correctamente', 'success'); // ✅ AGREGADO: Notificación mejorada
        Swal.fire({
          title: '¡Registrado!',
          text: 'Ubicación registrada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ed1c24'
        });
      } catch (err) {
        console.error('❌ Error al guardar ubicación:', err);
        this.showNotification('Error al guardar la ubicación', 'error'); // ✅ AGREGADO: Notificación mejorada
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
        const res = await ubicacionesService.update(this.editingId, this.ubicacion);
        const idx = this.ubicaciones.findIndex(
          (u) => u.id_ubicacion === this.editingId
        );
        if (idx !== -1) {
          // Actualizar con los datos que devuelve el servidor o mantener los actuales
          this.ubicaciones.splice(idx, 1, { ...this.ubicacion, id_ubicacion: this.editingId });
        }
        this.filterUbicaciones(); // ✅ AGREGADO: Actualizar filtros
        this.closeModal();
        console.log('✅ Ubicación actualizada:', res.data);
        this.showNotification('Ubicación actualizada correctamente', 'success'); // ✅ AGREGADO: Notificación mejorada
        Swal.fire({
          title: '¡Actualizado!',
          text: 'Ubicación actualizada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ed1c24'
        });
      } catch (err) {
        console.error('❌ Error al actualizar ubicación:', err);
        this.showNotification('Error al actualizar la ubicación', 'error'); // ✅ AGREGADO: Notificación mejorada
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
        await ubicacionesService.delete(id);
        this.ubicaciones = this.ubicaciones.filter(
          (u) => u.id_ubicacion !== id
        );
        this.filterUbicaciones(); // ✅ AGREGADO: Actualizar filtros
        console.log('✅ Ubicación eliminada:', id);
        this.showNotification('Ubicación eliminada correctamente', 'success'); // ✅ AGREGADO: Notificación mejorada
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Ubicación eliminada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ed1c24'
        });
      } catch (err) {
        console.error('❌ Error al eliminar ubicación:', err);
        this.showNotification('Error al eliminar la ubicación', 'error'); // ✅ AGREGADO: Notificación mejorada
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la ubicación.',
          icon: 'error',
          confirmButtonColor: '#ed1c24'
        });
      }
    },

    // ✅ NUEVOS MÉTODOS AGREGADOS
    // Filtros y búsqueda
    filterUbicaciones() {
      let filtered = [...this.ubicaciones];
      
      // Filtro por búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(ubicacion => 
          ubicacion.area.toLowerCase().includes(term) ||
          ubicacion.numero_aula.toLowerCase().includes(term) ||
          ubicacion.sede.toLowerCase().includes(term) ||
          ubicacion.descripcion.toLowerCase().includes(term) ||
          ubicacion.id_ubicacion.toString().includes(term)
        );
      }
      
      // Filtro por sede
      if (this.selectedSede) {
        filtered = filtered.filter(ubicacion => ubicacion.sede === this.selectedSede);
      }
      
      // Filtro por área
      if (this.selectedArea) {
        filtered = filtered.filter(ubicacion => ubicacion.area === this.selectedArea);
      }
      
      this.filteredUbicaciones = filtered;
    },

    clearFilters() {
      this.searchTerm = '';
      this.selectedSede = '';
      this.selectedArea = '';
      this.filterUbicaciones();
    },

    // Generación de QR
    generateQR(ubicacion) {
      this.selectedUbicacion = ubicacion;
      this.qrModalOpen = true;
      
      this.$nextTick(() => {
        this.createQRCode(ubicacion);
      });
    },

    createQRCode(ubicacion) {
      // Datos para el QR
      const qrData = {
        id: ubicacion.id_ubicacion,
        area: ubicacion.area,
        numero_aula: ubicacion.numero_aula,
        sede: ubicacion.sede,
        descripcion: ubicacion.descripcion,
        tipo: 'ubicacion',
        url: `${window.location.origin}/ubicacion/${ubicacion.id_ubicacion}`
      };
      
      // Crear QR usando servicio online
      const qrText = JSON.stringify(qrData);
      const qrContainer = this.$refs.qrCode;
      
      if (qrContainer) {
        qrContainer.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
        img.alt = `QR Code for ${ubicacion.area} - ${ubicacion.numero_aula}`;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.borderRadius = '8px';
        
        qrContainer.appendChild(img);
      }
    },

    closeQRModal() {
      this.qrModalOpen = false;
      this.selectedUbicacion = null;
    },

    downloadQR() {
      const qrImg = this.$refs.qrCode.querySelector('img');
      if (qrImg) {
        const link = document.createElement('a');
        link.download = `QR_Ubicacion_${this.selectedUbicacion.id_ubicacion}.png`;
        link.href = qrImg.src;
        link.click();
      }
    },

    printQR() {
      const printContent = `
        <div style="text-align: center; padding: 20px; font-family: Arial;">
          <h2>${this.selectedUbicacion.area} - Aula ${this.selectedUbicacion.numero_aula}</h2>
          <p><strong>ID:</strong> ${this.selectedUbicacion.id_ubicacion}</p>
          <p><strong>Sede:</strong> ${this.selectedUbicacion.sede}</p>
          <p><strong>Descripción:</strong> ${this.selectedUbicacion.descripcion}</p>
          <div style="margin: 20px 0;">
            ${this.$refs.qrCode.innerHTML}
          </div>
          <p style="font-size: 12px; color: #666;">Código QR generado automáticamente</p>
        </div>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>QR - ${this.selectedUbicacion.area}</title></head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    },

    // Exportación de datos
    exportData() {
      try {
        const exportData = {
          ubicaciones: this.ubicaciones,
          estadisticas: {
            total_ubicaciones: this.ubicaciones.length,
            total_sedes: this.uniqueSedes.length,
            sedes: this.sedeStats,
            total_areas: this.uniqueAreas.length,
            areas: this.uniqueAreas
          },
          fecha_exportacion: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ubicaciones_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Datos exportados correctamente', 'success');
      } catch (error) {
        console.error('Error al exportar:', error);
        this.showNotification('Error al exportar los datos', 'error');
      }
    },

    // Sistema de notificaciones
    showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
  },

  created() {
    this.fetchUbicaciones();
    
    // Agregar estilos para animaciones de notificaciones
    if (!document.querySelector('#ubicaciones-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'ubicaciones-notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  },

  // ✅ WATCHER AGREGADO para filtros automáticos
  watch: {
    ubicaciones: {
      handler() {
        this.filterUbicaciones();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
/* ======================================
   ESTILOS ORIGINALES MANTENIDOS + NUEVOS
   ====================================== */

/* ✅ Variables CSS para mantener consistencia */
:root {
  --institutional-red: #ed1c24;
  --institutional-black: #111111;
  --institutional-white: #ffffff;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-light: #9ca3af;
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --border-radius: 8px;
  --border-radius-large: 12px;
  --border-radius-sm: 4px;
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-floating: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 4px 15px rgba(237, 28, 36, 0.3);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --gradient-primary: linear-gradient(135deg, #ed1c24 0%, #b30f1b 100%);
  --gradient-secondary: linear-gradient(135deg, #111111 0%, #2c2c2c 100%);
  --success-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --warning-gradient: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --transition: all 0.3s ease;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --font-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-heading: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --white: #ffffff;
}

/* ✅ LAYOUT PRINCIPAL ORIGINAL */
.ubicaciones-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  font-family: var(--font-base);
  background: var(--institutional-white);
  min-height: 100vh;
}

/* ✅ HEADER SECTION ORIGINAL MEJORADO */
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
  display: flex;
  gap: var(--spacing-md);
}

/* ✅ NUEVA SECCIÓN: ESTADÍSTICAS */
.stats-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-lg) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-color);
}

.section-title i {
  color: var(--institutional-red);
  font-size: 1.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--card-bg);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: var(--transition);
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-floating);
}

.total-ubicaciones:hover {
  border-color: var(--institutional-red);
}

.total-sedes:hover {
  border-color: #3b82f6;
}

.total-areas:hover {
  border-color: #10b981;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--white);
}

.total-ubicaciones .stat-icon {
  background: var(--gradient-primary);
}

.total-sedes .stat-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.total-areas .stat-icon {
  background: var(--success-gradient);
}

.sede-icon {
  background: var(--gradient-secondary);
}

.stat-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.stat-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* ✅ BOTONES MODERNOS ORIGINALES */
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

/* ✅ NUEVO: Botón de exportar */
.btn-export {
  background: var(--success-gradient);
  color: var(--white);
  border: none;
}

.btn-export:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

/* ✅ LOADING STATES ORIGINALES */
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

/* ✅ TABLA DE UBICACIONES MODERNA ORIGINAL MEJORADA */
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
  flex-wrap: wrap;
  gap: var(--spacing-md);
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

/* ✅ NUEVOS: Controles de búsqueda y filtros */
.header-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.search-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 12px;
  color: var(--text-secondary);
  z-index: 1;
}

.search-box input {
  padding: 8px 12px 8px 35px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 200px;
  font-size: var(--font-size-sm);
  transition: var(--transition);
  background: var(--institutional-white);
}

.search-box input:focus {
  outline: none;
  border-color: var(--institutional-red);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.sede-filter,
.area-filter {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--institutional-white);
  font-size: var(--font-size-sm);
  transition: var(--transition);
  min-width: 120px;
}

.sede-filter:focus,
.area-filter:focus {
  outline: none;
  border-color: var(--institutional-red);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.stats-badge {
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 999px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  white-space: nowrap;
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

/* ✅ ENCABEZADOS DE TABLA ORIGINALES */
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

.th-location { width: 20%; }
.th-details { width: 15%; }
.th-sede { width: 15%; }
.th-description { width: 25%; }
.th-qr { width: 8%; text-align: center; } /* ✅ NUEVA COLUMNA QR */
.th-actions { width: 17%; min-width: 160px; }

/* ✅ FILAS DE TABLA ORIGINALES */
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

/* ✅ CELDAS ESPECÍFICAS ORIGINALES */
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

/* ✅ NUEVA: Celda QR */
.td-qr {
  text-align: center;
}

.btn-qr {
  background: #3b82f6;
  color: var(--white);
  border: none;
  padding: 8px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-qr:hover {
  background: #2563eb;
  transform: scale(1.1);
}

/* ✅ BOTONES DE TABLA ORIGINALES */
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

/* ✅ ESTADO VACÍO ORIGINAL */
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

/* ✅ NUEVO: Estado de búsqueda sin resultados */
.empty-search-state {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: 3rem var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-card);
}

.empty-search-state .empty-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  margin: 0 auto var(--spacing-md);
  font-size: 1.5rem;
}

.empty-search-state h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-search-state p {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-lg) 0;
}

/* ✅ MODAL MEJORADO ORIGINAL */
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

/* ✅ NUEVOS ESTILOS: MODAL QR */
.qr-modal {
  max-width: 500px;
}

.qr-content {
  text-align: center;
}

.qr-display {
  margin-bottom: var(--spacing-xl);
}

.qr-code {
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

.qr-info h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.qr-info p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
}

.qr-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.download-qr-btn,
.print-qr-btn {
  padding: 12px 20px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: var(--transition);
}

.download-qr-btn {
  background: #10b981;
  color: var(--white);
}

.download-qr-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.print-qr-btn {
  background: #3b82f6;
  color: var(--white);
}

.print-qr-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* ✅ ANIMACIONES DE TRANSICIÓN ORIGINALES */
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

/* ✅ RESPONSIVE DESIGN ORIGINAL MEJORADO */
@media (max-width: 1024px) {
  .th-description,
  .td-description {
    display: none;
  }
  
  .th-location { width: 25%; }
  .th-details { width: 20%; }
  .th-sede { width: 20%; }
  .th-qr { width: 10%; }
  .th-actions { width: 25%; }
  
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }
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
    justify-content: center;
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
  
  .th-location { width: 50%; }
  .th-qr { width: 15%; }
  .th-actions { width: 35%; }
  
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
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-controls {
    flex-direction: column;
    align-items: stretch;
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
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .header-actions .btn {
    width: 100%;
    justify-content: center;
  }

  /* En móviles, mostrar solo ubicación, QR y acciones */
  .th-qr { width: 20%; }
  .th-location { width: 45%; }
  .th-actions { width: 35%; }
  
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
  
  .btn-qr {
    width: 32px;
    height: 32px;
    padding: 6px;
    font-size: 0.875rem;
  }
}

/* ✅ OPTIMIZACIONES DE RENDIMIENTO ORIGINALES */
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