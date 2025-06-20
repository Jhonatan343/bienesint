<template>
  <div class="assets-container">
    <!-- Header con gradiente -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <i class="bx bx-package"></i>
          </div>
          <h1>Gestión de Bienes</h1>
        </div>
        <p class="subtitle">Administra y controla los bienes institucionales del sistema</p>
      </div>
    </div>

    <!-- NUEVA SECCIÓN: Panel de Estadísticas -->
    <div class="stats-section">
      <h2 class="section-title">
        <i class="bx bx-bar-chart"></i>
        Resumen de Inventario
      </h2>
      <div class="stats-grid">
        <div class="stat-card total-bienes">
          <div class="stat-icon">
            <i class="bx bx-package"></i>
          </div>
          <div class="stat-content">
            <h3>{{ totalBienes }}</h3>
            <p>Total de Bienes</p>
          </div>
        </div>
        <div class="stat-card total-valor">
          <div class="stat-icon">
            <i class="bx bx-dollar-circle"></i>
          </div>
          <div class="stat-content">
            <h3>${{ formatNumber(valorTotal) }}</h3>
            <p>Valor Total</p>
          </div>
        </div>
        <div class="stat-card" v-for="(count, category) in categoryTotals" :key="category">
          <div class="stat-icon category-icon">
            <i class="bx bx-cube"></i>
          </div>
          <div class="stat-content">
            <h3>{{ count }}</h3>
            <p>{{ category }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Cards Section -->
    <div class="action-cards-section">
      <h2 class="section-title">
        <i class="bx bx-cog"></i>
        Acciones Disponibles
      </h2>
      
      <div class="action-cards-grid">
        <!-- Tarjeta Registrar Bien -->
        <div class="action-card primary-card" @click="openModal">
          <div class="card-header">
            <div class="card-icon primary-icon">
              <i class="bx bx-plus-circle"></i>
            </div>
            <h3>Registrar Bien</h3>
          </div>
          <div class="card-body">
            <p>Registra nuevos bienes en el inventario institucional</p>
          </div>
          <div class="card-footer">
            <button class="card-button primary-button">
              <span>Comenzar</span>
              <i class="bx bx-right-arrow-alt"></i>
            </button>
          </div>
          <div class="card-overlay"></div>
        </div>

        <!-- Tarjeta Categorías -->
        <div class="action-card secondary-card" @click="openCategoriesModal">
          <div class="card-header">
            <div class="card-icon secondary-icon">
              <i class="bx bx-category"></i>
            </div>
            <h3>Categorías</h3>
          </div>
          <div class="card-body">
            <p>Gestiona las categorías de clasificación de bienes</p>
          </div>
          <div class="card-footer">
            <button class="card-button secondary-button">
              <span>Gestionar</span>
              <i class="bx bx-right-arrow-alt"></i>
            </button>
          </div>
          <div class="card-overlay"></div>
        </div>

        <!-- Tarjeta Periodos Académicos -->
        <div class="action-card tertiary-card" @click="openPeriodsModal">
          <div class="card-header">
            <div class="card-icon tertiary-icon">
              <i class="bx bx-calendar-event"></i>
            </div>
            <h3>Períodos Académicos</h3>
          </div>
          <div class="card-body">
            <p>Administra los períodos académicos del instituto</p>
          </div>
          <div class="card-footer">
            <button class="card-button tertiary-button">
              <span>Configurar</span>
              <i class="bx bx-right-arrow-alt"></i>
            </button>
          </div>
          <div class="card-overlay"></div>
        </div>
      </div>
    </div>

    <!-- Lista de Bienes -->
    <div class="assets-list-section">
      <div class="section-header">
        <h2>
          <i class="bx bx-list-ul"></i>
          Inventario de Bienes
        </h2>
        <!-- NUEVO: Controles de búsqueda y filtros -->
        <div class="table-controls">
          <div class="search-box">
            <i class="bx bx-search"></i>
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Buscar bienes..."
              @input="filterAssets"
            >
          </div>
          <select v-model="selectedCategory" @change="filterAssets" class="category-filter">
            <option value="">Todas las categorías</option>
            <option v-for="category in categoriesList" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      <div class="assets-list-container">
        <!-- NUEVA: Tabla horizontal de bienes -->
        <div class="table-wrapper">
          <table class="assets-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Ubicación</th>
                <th>Valor</th>
                <th>Fecha Registro</th>
                <th>QR</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="asset in filteredAssets" :key="asset.id" class="asset-row">
                <td class="code-cell">
                  <span class="asset-code">{{ asset.codigo }}</span>
                </td>
                <td class="name-cell">
                  <div class="asset-info">
                    <strong>{{ asset.nombre }}</strong>
                    <small v-if="asset.descripcion">{{ asset.descripcion }}</small>
                  </div>
                </td>
                <td>
                  <span class="category-badge" :class="getCategoryClass(asset.categoria)">
                    {{ asset.categoria }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="getStatusClass(asset.estado)">
                    {{ asset.estado }}
                  </span>
                </td>
                <td>{{ asset.ubicacion }}</td>
                <td class="value-cell">${{ formatNumber(asset.valor) }}</td>
                <td>{{ formatDate(asset.fechaRegistro) }}</td>
                <td class="qr-cell">
                  <button @click="generateQR(asset)" class="qr-button" title="Generar QR">
                    <i class="bx bx-qr"></i>
                  </button>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button @click="editAsset(asset)" class="action-btn edit-btn" title="Editar">
                      <i class="bx bx-edit"></i>
                    </button>
                    <button @click="deleteAsset(asset.id)" class="action-btn delete-btn" title="Eliminar">
                      <i class="bx bx-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Estado vacío -->
          <div v-if="filteredAssets.length === 0" class="empty-state">
            <i class="bx bx-package"></i>
            <h3>No hay bienes registrados</h3>
            <p>Comienza agregando tu primer bien al inventario</p>
            <button @click="openModal" class="empty-action-btn">
              <i class="bx bx-plus"></i>
              Registrar Bien
            </button>
          </div>
        </div>
        
        <!-- MANTENER: Componente original AssetList como fallback -->
        <div v-if="false" class="original-asset-list">
          <AssetList @refresh="handleRefresh" />
        </div>
      </div>
    </div>

    <!-- Modal de Bienes -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <div class="modal-title-wrapper">
                <div class="modal-icon">
                  <i class="bx bx-package"></i>
                </div>
                <h2>{{ editingAsset ? 'Editar Bien' : 'Registrar Nuevo Bien' }}</h2>
              </div>
              <button @click="closeModal" class="modal-close">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="modal-body">
              <!-- NUEVO: Formulario de bien integrado -->
              <form @submit.prevent="saveAsset" class="asset-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label for="nombre">Nombre del Bien *</label>
                    <input 
                      v-model="assetForm.nombre" 
                      type="text" 
                      id="nombre" 
                      required
                      placeholder="Ej: Laptop Dell Inspiron"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="categoria">Categoría *</label>
                    <select v-model="assetForm.categoria" id="categoria" required>
                      <option value="">Seleccionar categoría</option>
                      <option v-for="category in categoriesList" :key="category" :value="category">
                        {{ category }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="estado">Estado *</label>
                    <select v-model="assetForm.estado" id="estado" required>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="En Mantenimiento">En Mantenimiento</option>
                      <option value="Dado de Baja">Dado de Baja</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="ubicacion">Ubicación *</label>
                    <input 
                      v-model="assetForm.ubicacion" 
                      type="text" 
                      id="ubicacion" 
                      required
                      placeholder="Ej: Aula 101, Oficina Administrativa"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="valor">Valor ($) *</label>
                    <input 
                      v-model.number="assetForm.valor" 
                      type="number" 
                      id="valor" 
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="proveedor">Proveedor</label>
                    <input 
                      v-model="assetForm.proveedor" 
                      type="text" 
                      id="proveedor"
                      placeholder="Nombre del proveedor"
                    >
                  </div>
                </div>
                
                <div class="form-group full-width">
                  <label for="descripcion">Descripción</label>
                  <textarea 
                    v-model="assetForm.descripcion" 
                    id="descripcion"
                    rows="3"
                    placeholder="Descripción detallada del bien..."
                  ></textarea>
                </div>
                
                <div class="form-actions">
                  <button type="button" @click="closeModal" class="cancel-btn">
                    Cancelar
                  </button>
                  <button type="submit" class="save-btn">
                    <i class="bx bx-save"></i>
                    {{ editingAsset ? 'Actualizar' : 'Guardar' }}
                  </button>
                </div>
              </form>
              
              <!-- MANTENER: Componente original AssetForm como alternativa -->
              <div v-if="false">
                <AssetForm @close="closeModal" @saved="handleAssetSaved" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal para Categorías -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="isCategoriesModalOpen" class="modal-backdrop" @click="closeCategoriesModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <div class="modal-title-wrapper">
                <div class="modal-icon">
                  <i class="bx bx-category"></i>
                </div>
                <h2>Gestión de Categorías</h2>
              </div>
              <button @click="closeCategoriesModal" class="modal-close">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="modal-body">
              <!-- MANTENER: Componente original CategoriaAsset -->
              <CategoriaAsset @close="closeCategoriesModal" @updated="handleCategoriesUpdated" />
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Modal para Periodos Académicos -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="isPeriodsModalOpen" class="modal-backdrop" @click="closePeriodsModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <div class="modal-title-wrapper">
                <div class="modal-icon">
                  <i class="bx bx-calendar-event"></i>
                </div>
                <h2>Períodos Académicos</h2>
              </div>
              <button @click="closePeriodsModal" class="modal-close">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="modal-body">
              <!-- MANTENER: Componente original PeriodosAcademicos -->
              <PeriodosAcademicos @close="closePeriodsModal" @updated="handlePeriodsUpdated" />
            </div>
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
                <h2>Código QR - {{ selectedAsset?.nombre }}</h2>
              </div>
              <button @click="closeQRModal" class="modal-close">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="modal-body qr-content">
              <div class="qr-display">
                <div ref="qrCode" class="qr-code"></div>
                <div class="qr-info">
                  <h3>{{ selectedAsset?.nombre }}</h3>
                  <p><strong>Código:</strong> {{ selectedAsset?.codigo }}</p>
                  <p><strong>Categoría:</strong> {{ selectedAsset?.categoria }}</p>
                  <p><strong>Ubicación:</strong> {{ selectedAsset?.ubicacion }}</p>
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
// ✅ IMPORTACIONES ORIGINALES MANTENIDAS
import AssetList from '../components/assets/AssetList.vue';
import AssetForm from '../components/assets/AssetForm.vue';
import CategoriaAsset from '../components/categoria/CategoriaAsset.vue';
import PeriodosAcademicos from '../components/periodos/PeriodosAcademicos.vue';

export default {
  name: 'AssetsView',
  components: { 
    AssetList, 
    AssetForm, 
    CategoriaAsset,
    PeriodosAcademicos
  },
  data() {
    return {
      // ✅ DATOS ORIGINALES MANTENIDOS
      isCategoriesModalOpen: false,
      isModalOpen: false,
      isPeriodsModalOpen: false,
      refreshKey: 0, // Para forzar refresh de componentes

      // ✅ NUEVOS DATOS AGREGADOS
      // Datos de bienes
      assets: [],
      filteredAssets: [],
      
      // Filtros y búsqueda
      searchTerm: '',
      selectedCategory: '',
      
      // Categorías predefinidas
      categoriesList: [
        'Laptops',
        'PC Escritorio', 
        'Pupitres',
        'Proyectores',
        'Impresoras',
        'Tablets',
        'Monitores',
        'Teclados',
        'Mouse',
        'Escritorios',
        'Sillas'
      ],
      
      // Formulario de bien
      assetForm: {
        nombre: '',
        categoria: '',
        estado: 'Activo',
        ubicacion: '',
        valor: 0,
        proveedor: '',
        descripcion: ''
      },
      
      // Estados de edición
      editingAsset: null,
      
      // QR Modal
      qrModalOpen: false,
      selectedAsset: null
    };
  },

  computed: {
    // ✅ NUEVAS PROPIEDADES COMPUTADAS AGREGADAS
    totalBienes() {
      return this.assets.length;
    },
    
    valorTotal() {
      return this.assets.reduce((sum, asset) => sum + (asset.valor || 0), 0);
    },
    
    categoryTotals() {
      const totals = {};
      this.categoriesList.forEach(category => {
        const count = this.assets.filter(asset => asset.categoria === category).length;
        if (count > 0) {
          totals[category] = count;
        }
      });
      return totals;
    }
  },

  methods: {
    // ✅ MÉTODOS ORIGINALES MANTENIDOS
    openModal() {
      console.log('🔧 Abriendo modal de nuevo bien');
      this.isModalOpen = true;
      this.resetAssetForm(); // ✅ AGREGADO: Reset del formulario
    },
    
    closeModal() {
      console.log('🔧 Cerrando modal de bien');
      this.isModalOpen = false;
      this.editingAsset = null; // ✅ AGREGADO: Reset estado de edición
      this.resetAssetForm(); // ✅ AGREGADO: Reset del formulario
    },

    openCategoriesModal() {
      console.log('🔧 Abriendo modal de categorías');
      this.isCategoriesModalOpen = true;
    },
    
    closeCategoriesModal() {
      console.log('🔧 Cerrando modal de categorías');
      this.isCategoriesModalOpen = false;
    },

    openPeriodsModal() {
      console.log('🔧 Abriendo modal de períodos académicos');
      this.isPeriodsModalOpen = true;
    },
    
    closePeriodsModal() {
      console.log('🔧 Cerrando modal de períodos académicos');
      this.isPeriodsModalOpen = false;
    },

    handleAssetSaved(assetData) {
      console.log('✅ Bien guardado:', assetData);
      this.closeModal();
      this.handleRefresh();
    },

    handleCategoriesUpdated() {
      console.log('✅ Categorías actualizadas');
      this.refreshKey++; // Esto puede usarse para forzar refresh si es necesario
    },

    handlePeriodsUpdated() {
      console.log('✅ Períodos académicos actualizados');
      this.refreshKey++;
    },

    handleRefresh() {
      console.log('🔄 Actualizando lista de bienes');
      // Este método puede ser llamado para refrescar la lista
      // El componente AssetList se encargará de recargar los datos
      this.$nextTick(() => {
        // Forzar rerender del AssetList si es necesario
        this.refreshKey++;
        this.loadAssets(); // ✅ AGREGADO: Cargar bienes
      });
    },

    initializeData() {
      console.log('🚀 Inicializando vista de bienes');
      // Aquí puedes agregar cualquier lógica de inicialización
      // como cargar datos iniciales, configurar listeners, etc.
      this.loadAssets(); // ✅ AGREGADO: Cargar bienes al inicializar
    },

    // ✅ NUEVOS MÉTODOS AGREGADOS
    // Gestión de formulario de bienes
    resetAssetForm() {
      this.assetForm = {
        nombre: '',
        categoria: '',
        estado: 'Activo',
        ubicacion: '',
        valor: 0,
        proveedor: '',
        descripcion: ''
      };
    },

    generateAssetCode() {
      const prefix = 'BN';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `${prefix}${timestamp}${random}`;
    },

    saveAsset() {
      try {
        if (this.editingAsset) {
          // Actualizar bien existente
          const index = this.assets.findIndex(a => a.id === this.editingAsset.id);
          if (index !== -1) {
            this.assets[index] = {
              ...this.assets[index],
              ...this.assetForm,
              fechaActualizacion: new Date().toISOString()
            };
          }
        } else {
          // Crear nuevo bien
          const newAsset = {
            id: Date.now(),
            codigo: this.generateAssetCode(),
            ...this.assetForm,
            fechaRegistro: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
          };
          this.assets.push(newAsset);
        }
        
        this.saveToStorage();
        this.filterAssets();
        this.closeModal();
        this.showNotification(
          this.editingAsset ? 'Bien actualizado correctamente' : 'Bien registrado correctamente'
        );
      } catch (error) {
        console.error('Error al guardar bien:', error);
        this.showNotification('Error al guardar el bien', 'error');
      }
    },

    editAsset(asset) {
      this.editingAsset = asset;
      this.assetForm = { ...asset };
      this.openModal();
    },

    deleteAsset(assetId) {
      if (confirm('¿Estás seguro de que deseas eliminar este bien?')) {
        this.assets = this.assets.filter(a => a.id !== assetId);
        this.saveToStorage();
        this.filterAssets();
        this.showNotification('Bien eliminado correctamente');
      }
    },

    // Filtros y búsqueda
    filterAssets() {
      let filtered = [...this.assets];
      
      // Filtro por búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(asset => 
          asset.nombre.toLowerCase().includes(term) ||
          asset.codigo.toLowerCase().includes(term) ||
          asset.categoria.toLowerCase().includes(term) ||
          asset.ubicacion.toLowerCase().includes(term)
        );
      }
      
      // Filtro por categoría
      if (this.selectedCategory) {
        filtered = filtered.filter(asset => asset.categoria === this.selectedCategory);
      }
      
      this.filteredAssets = filtered;
    },

    // Generación de QR
    generateQR(asset) {
      this.selectedAsset = asset;
      this.qrModalOpen = true;
      
      this.$nextTick(() => {
        this.createQRCode(asset);
      });
    },

    createQRCode(asset) {
      // Datos para el QR
      const qrData = {
        codigo: asset.codigo,
        nombre: asset.nombre,
        categoria: asset.categoria,
        ubicacion: asset.ubicacion,
        estado: asset.estado,
        url: `${window.location.origin}/asset/${asset.id}`
      };
      
      // Crear QR usando servicio online
      const qrText = JSON.stringify(qrData);
      const qrContainer = this.$refs.qrCode;
      
      if (qrContainer) {
        qrContainer.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
        img.alt = `QR Code for ${asset.nombre}`;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.borderRadius = '8px';
        
        qrContainer.appendChild(img);
      }
    },

    closeQRModal() {
      this.qrModalOpen = false;
      this.selectedAsset = null;
    },

    downloadQR() {
      const qrImg = this.$refs.qrCode.querySelector('img');
      if (qrImg) {
        const link = document.createElement('a');
        link.download = `QR_${this.selectedAsset.codigo}.png`;
        link.href = qrImg.src;
        link.click();
      }
    },

    printQR() {
      const printContent = `
        <div style="text-align: center; padding: 20px; font-family: Arial;">
          <h2>${this.selectedAsset.nombre}</h2>
          <p><strong>Código:</strong> ${this.selectedAsset.codigo}</p>
          <p><strong>Categoría:</strong> ${this.selectedAsset.categoria}</p>
          <p><strong>Ubicación:</strong> ${this.selectedAsset.ubicacion}</p>
          <div style="margin: 20px 0;">
            ${this.$refs.qrCode.innerHTML}
          </div>
        </div>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>QR - ${this.selectedAsset.nombre}</title></head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    },

    // Utilidades
    formatNumber(number) {
      return new Intl.NumberFormat('es-CO').format(number || 0);
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('es-CO');
    },
    
    getCategoryClass(category) {
      const classes = {
        'Laptops': 'category-laptop',
        'PC Escritorio': 'category-desktop',
        'Pupitres': 'category-furniture',
        'Proyectores': 'category-projector',
        'Impresoras': 'category-printer',
        'Tablets': 'category-tablet',
        'Monitores': 'category-monitor'
      };
      return classes[category] || 'category-default';
    },
    
    getStatusClass(status) {
      const classes = {
        'Activo': 'status-active',
        'Inactivo': 'status-inactive',
        'En Mantenimiento': 'status-maintenance',
        'Dado de Baja': 'status-retired'
      };
      return classes[status] || 'status-default';
    },

    // Persistencia
    saveToStorage() {
      try {
        localStorage.setItem('institutional_assets', JSON.stringify(this.assets));
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
    },
    
    loadAssets() {
      try {
        const data = localStorage.getItem('institutional_assets');
        if (data) {
          this.assets = JSON.parse(data);
          this.filterAssets();
        } else {
          // Datos de ejemplo iniciales
          this.loadSampleData();
        }
      } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
        this.loadSampleData();
      }
    },

    loadSampleData() {
      this.assets = [
        {
          id: 1,
          codigo: 'BN001',
          nombre: 'Laptop Dell Inspiron 15',
          categoria: 'Laptops',
          estado: 'Activo',
          ubicacion: 'Aula 101',
          valor: 2500000,
          proveedor: 'Dell Colombia',
          descripcion: 'Laptop para uso académico',
          fechaRegistro: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          codigo: 'BN002',
          nombre: 'PC de Escritorio HP',
          categoria: 'PC Escritorio',
          estado: 'Activo',
          ubicacion: 'Laboratorio 1',
          valor: 1800000,
          proveedor: 'HP Colombia',
          descripcion: 'PC para laboratorio de informática',
          fechaRegistro: new Date('2024-01-20').toISOString()
        },
        {
          id: 3,
          codigo: 'BN003',
          nombre: 'Pupitre Escolar Estándar',
          categoria: 'Pupitres',
          estado: 'Activo',
          ubicacion: 'Aula 102',
          valor: 150000,
          proveedor: 'Muebles Escolares SAS',
          descripcion: 'Pupitre individual para estudiantes',
          fechaRegistro: new Date('2024-02-01').toISOString()
        }
      ];
      this.saveToStorage();
      this.filterAssets();
    },

    // Notificaciones
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

  // ✅ LIFECYCLE HOOKS ORIGINALES MANTENIDOS
  mounted() {
    this.initializeData();
    
    // Agregar estilos para animaciones de notificaciones
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
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

  // ✅ PROVIDE ORIGINAL MANTENIDO
  provide() {
    return {
      refreshAssets: this.handleRefresh,
      closeModals: () => {
        this.closeModal();
        this.closeCategoriesModal();
        this.closePeriodsModal();
      }
    };
  }
};
</script>

<style scoped>
/* ======================================
   ESTILOS ORIGINALES MANTENIDOS + NUEVOS AGREGADOS
   ====================================== */

/* ✅ VARIABLES CSS ORIGINALES */
:root {
  --institutional-red: #ed1c24;
  --institutional-black: #111111;
  --institutional-white: #ffffff;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --border-radius: 8px;
  --border-radius-large: 12px;
  --border-radius-sm: 4px;
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-floating: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 4px 15px rgba(237, 28, 36, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --gradient-primary: linear-gradient(135deg, #ed1c24 0%, #b30f1b 100%);
  --gradient-secondary: linear-gradient(135deg, #111111 0%, #2c2c2c 100%);
  --transition: all 0.3s ease;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --font-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-heading: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}

/* ✅ LAYOUT PRINCIPAL ORIGINAL */
.assets-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  font-family: var(--font-base);
  background: var(--institutional-white);
  min-height: 100vh;
}

/* ✅ HEADER SECTION ORIGINAL */
.header-section {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-card);
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
  text-align: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--institutional-white);
  font-size: 2rem;
}

.header-section h1 {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* ✅ NUEVA SECCIÓN: ESTADÍSTICAS */
.stats-section {
  margin-bottom: var(--spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.stat-card.total-bienes:hover {
  border-color: var(--institutional-red);
}

.stat-card.total-valor:hover {
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
  color: var(--institutional-white);
}

.total-bienes .stat-icon {
  background: var(--gradient-primary);
}

.total-valor .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #065f46 100%);
}

.category-icon {
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

/* ✅ ACTION CARDS SECTION ORIGINAL */
.action-cards-section {
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

.action-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

/* ✅ ACTION CARDS ORIGINALES */
.action-card {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-floating);
}

.action-card:hover .card-overlay {
  opacity: 1;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: var(--transition);
  pointer-events: none;
}

.primary-card {
  border-color: var(--institutional-red);
}

.primary-card:hover {
  border-color: var(--institutional-red);
  box-shadow: var(--shadow-glow);
}

.primary-card .card-overlay {
  background: linear-gradient(135deg, rgba(237, 28, 36, 0.05) 0%, rgba(179, 15, 27, 0.05) 100%);
}

.secondary-card {
  border-color: var(--institutional-black);
}

.secondary-card:hover {
  border-color: var(--institutional-black);
  box-shadow: 0 20px 40px rgba(17, 17, 17, 0.1);
}

.secondary-card .card-overlay {
  background: linear-gradient(135deg, rgba(17, 17, 17, 0.05) 0%, rgba(44, 44, 44, 0.05) 100%);
}

.tertiary-card {
  border-color: var(--institutional-red);
}

.tertiary-card:hover {
  border-color: var(--institutional-red);
  box-shadow: var(--shadow-glow);
}

.tertiary-card .card-overlay {
  background: linear-gradient(135deg, rgba(237, 28, 36, 0.03) 0%, rgba(179, 15, 27, 0.03) 100%);
}

/* ✅ CARD CONTENT ORIGINAL */
.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--institutional-white);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.primary-icon {
  background: var(--gradient-primary);
}

.secondary-icon {
  background: var(--gradient-secondary);
}

.tertiary-icon {
  background: var(--gradient-primary);
}

.card-header h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-body {
  flex: 1;
  margin-bottom: var(--spacing-lg);
}

.card-body p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  margin-top: auto;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.primary-button {
  background: var(--gradient-primary);
  color: var(--institutional-white);
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}

.secondary-button {
  background: var(--gradient-secondary);
  color: var(--institutional-white);
}

.secondary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(17, 17, 17, 0.3);
}

.tertiary-button {
  background: var(--institutional-white);
  color: var(--institutional-red);
  border: 2px solid var(--institutional-red);
}

.tertiary-button:hover {
  background: var(--institutional-red);
  color: var(--institutional-white);
  transform: translateY(-1px);
}

.card-button i {
  font-size: 1.25rem;
  transition: var(--transition);
}

.card-button:hover i {
  transform: translateX(4px);
}

/* ✅ ASSETS LIST SECTION ORIGINAL ACTUALIZADA */
.assets-list-section {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-card);
}

.section-header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.section-header h2 i {
  color: var(--institutional-red);
  font-size: 1.75rem;
}

.assets-list-container {
  background: var(--institutional-white);
  border-radius: var(--border-radius);
  overflow: hidden;
}

/* ✅ NUEVOS ESTILOS: CONTROLES DE TABLA */
.table-controls {
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
  padding: 10px 12px 10px 40px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  width: 250px;
  font-size: var(--font-size-base);
  transition: var(--transition);
  background: var(--institutional-white);
}

.search-box input:focus {
  outline: none;
  border-color: var(--institutional-red);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.category-filter {
  padding: 10px 12px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--institutional-white);
  font-size: var(--font-size-base);
  transition: var(--transition);
  min-width: 150px;
}

.category-filter:focus {
  outline: none;
  border-color: var(--institutional-red);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

/* ✅ NUEVOS ESTILOS: TABLA DE BIENES */
.table-wrapper {
  overflow-x: auto;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.assets-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--institutional-white);
  font-size: var(--font-size-base);
}

.assets-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.assets-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.asset-row {
  transition: var(--transition);
}

.asset-row:hover {
  background: #f8fafc;
}

.code-cell {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
  color: var(--institutional-red);
  font-size: 0.875rem;
}

.name-cell .asset-info strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 2px;
  font-weight: 600;
}

.name-cell .asset-info small {
  color: var(--text-secondary);
  font-size: 0.75rem;
  line-height: 1.2;
}

.value-cell {
  font-weight: 600;
  color: #059669;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* ✅ NUEVOS ESTILOS: BADGES */
.category-badge,
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* Badges de categoría */
.category-laptop {
  background: #dbeafe;
  color: #1e40af;
}

.category-desktop {
  background: #fef3c7;
  color: #92400e;
}

.category-furniture {
  background: #d1fae5;
  color: #065f46;
}

.category-projector {
  background: #fce7f3;
  color: #be185d;
}

.category-printer {
  background: #e0e7ff;
  color: #3730a3;
}

.category-tablet {
  background: #f3e8ff;
  color: #7c3aed;
}

.category-monitor {
  background: #ecfdf5;
  color: #047857;
}

.category-default {
  background: #f3f4f6;
  color: var(--text-secondary);
}

/* Badges de estado */
.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-retired {
  background: #f3f4f6;
  color: #374151;
}

/* ✅ NUEVOS ESTILOS: BOTONES DE ACCIÓN */
.qr-cell {
  text-align: center;
}

.qr-button {
  background: #3b82f6;
  color: var(--institutional-white);
  border: none;
  padding: 8px 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: 1rem;
}

.qr-button:hover {
  background: #2563eb;
  transform: scale(1.05);
}

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  padding: 6px 8px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  color: var(--institutional-white);
  font-size: 0.875rem;
}

.edit-btn {
  background: #f59e0b;
}

.edit-btn:hover {
  background: #d97706;
  transform: scale(1.05);
}

.delete-btn {
  background: #ef4444;
}

.delete-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

/* ✅ NUEVOS ESTILOS: ESTADO VACÍO */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.empty-action-btn {
  background: var(--gradient-primary);
  color: var(--institutional-white);
  border: none;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  margin-top: var(--spacing-lg);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: var(--transition);
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
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
  max-width: 1000px;
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
  position: relative;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
}

.modal-title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.modal-icon {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--institutional-white);
  font-size: 1.5rem;
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
  background: var(--institutional-red);
  color: var(--institutional-white);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  background: var(--institutional-white);
}

/* ✅ NUEVOS ESTILOS: FORMULARIO DE BIEN */
.asset-form {
  max-width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background: var(--institutional-white);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--institutional-red);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.cancel-btn {
  padding: 12px 24px;
  border: 2px solid var(--border-color);
  background: var(--institutional-white);
  color: var(--text-secondary);
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.cancel-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: var(--text-primary);
}

.save-btn {
  padding: 12px 24px;
  border: none;
  background: var(--gradient-primary);
  color: var(--institutional-white);
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.save-btn:hover {
  background: linear-gradient(135deg, #d91920 0%, #a60e17 100%);
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
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
  color: var(--institutional-white);
}

.download-qr-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.print-qr-btn {
  background: #3b82f6;
  color: var(--institutional-white);
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

/* ✅ RESPONSIVE DESIGN ORIGINAL */
@media (max-width: 1024px) {
  .action-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .assets-container {
    padding: var(--spacing-md);
  }
  
  .header-section {
    padding: var(--spacing-xl);
  }
  
  .header-section h1 {
    font-size: 2rem;
  }
  
  .title-wrapper {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .icon-wrapper {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }
  
  .action-cards-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .action-card {
    padding: var(--spacing-lg);
    min-height: 180px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .category-filter {
    width: 100%;
  }
  
  .assets-table {
    font-size: 0.875rem;
  }
  
  .assets-table th,
  .assets-table td {
    padding: 8px 12px;
  }
  
  .modal-backdrop {
    padding: var(--spacing-md);
  }
  
  .modal-container {
    max-width: 100%;
  }
  
  .modal-header {
    padding: var(--spacing-lg);
  }
  
  .modal-body {
    padding: var(--spacing-lg);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .header-section h1 {
    font-size: 1.75rem;
  }
  
  .subtitle {
    font-size: var(--font-size-base);
  }
  
  .action-card {
    padding: var(--spacing-md);
    min-height: 160px;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    margin: 0 auto;
  }
  
  .modal-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }
  
  .modal-title-wrapper {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .assets-table {
    font-size: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 2px;
  }
}

/* ✅ OPTIMIZACIONES DE RENDIMIENTO ORIGINALES */
.action-card,
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