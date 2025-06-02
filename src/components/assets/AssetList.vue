<template>
  <div class="asset-list-container">
    <!-- Barra de búsqueda y filtros -->
    <div class="search-controls">
      <div class="search-input-group">
        <i class="bx bx-search"></i>
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar bien..."
          class="search-input"
        />
      </div>
      <button @click="refreshData" class="refresh-btn" :disabled="loading">
        <i class="bx bx-refresh" :class="{ 'spinning': loading }"></i>
        Actualizar
      </button>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando bienes...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <i class="bx bx-error-circle"></i>
      </div>
      <h3>Error al cargar los bienes</h3>
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="refreshData" class="retry-btn">
          <i class="bx bx-refresh"></i>
          Reintentar
        </button>
        <button @click="checkConnection" class="check-btn">
          <i class="bx bx-wifi"></i>
          Verificar Conexión
        </button>
      </div>
    </div>

    <!-- Lista vacía -->
    <div v-else-if="bienes.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="bx bx-package"></i>
      </div>
      <h3>No hay bienes registrados</h3>
      <p>Comienza registrando tu primer bien en el sistema</p>
    </div>

    <!-- Tabla de bienes -->
    <div v-else class="table-container">
      <div class="table-header">
        <h3>{{ bienes.length }} bienes encontrados</h3>
      </div>
      
      <div class="table-wrapper">
        <table class="assets-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Clase de Bien</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Estado</th>
              <th>Valor</th>
              <th>Ubicación</th>
              <th>Custodio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bien in paginatedBienes" :key="bien.id_bien" class="asset-row">
              <td class="codigo-cell">
                <span class="codigo-badge">{{ bien.codigo_institucional }}</span>
              </td>
              <td>{{ bien.clase_de_bien }}</td>
              <td>{{ bien.marca || 'N/A' }}</td>
              <td>{{ bien.modelo || 'N/A' }}</td>
              <td>
                <span class="estado-badge" :class="getEstadoClass(bien.estado)">
                  {{ bien.estado }}
                </span>
              </td>
              <td class="valor-cell">${{ formatCurrency(bien.valor) }}</td>
              <td>{{ bien.ubicacion_completa || 'No asignada' }}</td>
              <td>{{ bien.usuario_custodio || 'No asignado' }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button @click="viewDetails(bien.id_bien)" class="action-btn view-btn" title="Ver detalles">
                    <i class="bx bx-show"></i>
                  </button>
                  <button @click="editBien(bien.id_bien)" class="action-btn edit-btn" title="Editar">
                    <i class="bx bx-edit"></i>
                  </button>
                  <button @click="generateQR(bien.id_bien)" class="action-btn qr-btn" title="Generar QR">
                    <i class="bx bx-qr"></i>
                  </button>
                  <button @click="deleteBien(bien.id_bien)" class="action-btn delete-btn" title="Eliminar">
                    <i class="bx bx-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <i class="bx bx-chevron-left"></i>
        </button>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <i class="bx bx-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { bienesService } from '@/services/api';

export default {
  name: 'AssetList',
  data() {
    return {
      bienes: [],
      loading: false,
      error: null,
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10,
      searchTimeout: null
    };
  },
  computed: {
    filteredBienes() {
      if (!this.searchTerm) return this.bienes;
      
      const term = this.searchTerm.toLowerCase();
      return this.bienes.filter(bien => 
        bien.codigo_institucional?.toLowerCase().includes(term) ||
        bien.clase_de_bien?.toLowerCase().includes(term) ||
        bien.marca?.toLowerCase().includes(term) ||
        bien.modelo?.toLowerCase().includes(term)
      );
    },
    paginatedBienes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBienes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBienes.length / this.itemsPerPage);
    }
  },
  async mounted() {
    await this.loadBienes();
  },
  methods: {
    async loadBienes() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔄 Cargando bienes...');
        const response = await bienesService.getAll();
        this.bienes = response.data || [];
        console.log(`✅ ${this.bienes.length} bienes cargados`);
      } catch (error) {
        console.error('❌ Error al cargar bienes:', error);
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },
    
    handleError(error) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        this.error = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en puerto 3000.';
      } else if (error.response?.status === 404) {
        this.error = 'Endpoint no encontrado. Verifica la configuración de la API.';
      } else if (error.response?.status >= 500) {
        this.error = 'Error del servidor. Verifica la base de datos y los logs del backend.';
      } else {
        this.error = error.response?.data?.error || error.message || 'Error desconocido';
      }
    },
    
    async checkConnection() {
      try {
        console.log('🔍 Verificando conexión...');
        const response = await fetch('http://localhost:3000/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Conexión exitosa:', data);
          alert('✅ Conexión exitosa con el servidor');
          this.refreshData();
        } else {
          alert(`❌ El servidor respondió con error: ${response.status}`);
        }
      } catch (error) {
        alert('❌ No se puede conectar con el servidor en http://localhost:3000');
        console.error('Error de conexión:', error);
      }
    },
    
    async refreshData() {
      await this.loadBienes();
    },
    
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
      }, 300);
    },
    
    getEstadoClass(estado) {
      const estados = {
        'Activo': 'estado-activo',
        'En Reparación': 'estado-reparacion',
        'Dado de Baja': 'estado-baja',
        'En Préstamo': 'estado-prestamo'
      };
      return estados[estado] || 'estado-default';
    },
    
    formatCurrency(value) {
      if (!value) return '0.00';
      return parseFloat(value).toLocaleString('es-EC', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    
    viewDetails(id) {
      console.log('Ver detalles del bien:', id);
    },
    
    editBien(id) {
      console.log('Editar bien:', id);
    },
    
    async generateQR(id) {
      try {
        const response = await bienesService.generateQR(id);
        console.log('QR generado:', response.data);
      } catch (error) {
        console.error('Error al generar QR:', error);
      }
    },
    
    async deleteBien(id) {
      if (confirm('¿Estás seguro de que deseas eliminar este bien?')) {
        try {
          await bienesService.delete(id);
          await this.refreshData();
        } catch (error) {
          console.error('Error al eliminar bien:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.asset-list-container {
  padding: 1.5rem;
}

.search-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.search-input-group {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input-group i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #ed1c24;
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ed1c24 0%, #b30f1b 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(237, 28, 36, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Estados */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.error-state {
  color: #dc2626;
}

.error-icon, .empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.retry-btn, .check-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #ed1c24;
  background: white;
  color: #ed1c24;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover, .check-btn:hover {
  background: #ed1c24;
  color: white;
}

/* Tabla */
.table-container {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.table-header {
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-wrapper {
  overflow-x: auto;
}

.assets-table {
  width: 100%;
  border-collapse: collapse;
}

.assets-table th {
  background: #111827;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}

.assets-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.asset-row:hover {
  background: #f9fafb;
}

.codigo-badge {
  background: linear-gradient(135deg, #ed1c24 0%, #b30f1b 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.estado-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.estado-activo { background: #d4edda; color: #155724; }
.estado-reparacion { background: #fff3cd; color: #856404; }
.estado-baja { background: #f8d7da; color: #721c24; }
.estado-prestamo { background: #d1ecf1; color: #0c5460; }

.valor-cell {
  font-weight: 600;
  color: #059669;
}

.actions-cell {
  padding: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.view-btn { background: #e3f2fd; color: #1976d2; }
.edit-btn { background: #fff3e0; color: #f57c00; }
.qr-btn { background: #f3e5f5; color: #7b1fa2; }
.delete-btn { background: #ffebee; color: #d32f2f; }

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #ed1c24;
  color: #ed1c24;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
  color: #374151;
}

/* Spinner loading */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ed1c24;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input-group {
    max-width: none;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .assets-table {
    font-size: 0.875rem;
  }
  
  .assets-table th,
  .assets-table td {
    padding: 0.5rem;
  }
}
</style>