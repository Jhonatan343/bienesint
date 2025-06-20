<template>
  <div class="mis-bienes-container">
    <!-- Header de la página -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <i class="fas fa-user-tag"></i>
          Mis Bienes Asignados
        </h1>
        <p class="page-subtitle">Gestiona y consulta los bienes bajo tu responsabilidad</p>
      </div>
      <div class="header-right">
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalBienes }}</span>
            <span class="stat-label">Total Bienes</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${{ valorTotalFormatted }}</span>
            <span class="stat-label">Valor Total</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas y notificaciones -->
    <div class="alerts-section" v-if="alertas.length > 0">
      <div 
        class="alert-item" 
        v-for="alerta in alertas" 
        :key="alerta.id"
        :class="alerta.tipo"
      >
        <i :class="alerta.icono"></i>
        <span>{{ alerta.mensaje }}</span>
        <button class="alert-close" @click="cerrarAlerta(alerta.id)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Barra de herramientas -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- Buscador principal -->
        <div class="search-container">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Buscar por código, nombre, descripción..." 
            v-model="busqueda"
            @input="filtrarBienes"
            class="search-input"
          >
          <button 
            v-if="busqueda" 
            class="clear-search" 
            @click="limpiarBusqueda"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Filtros -->
        <div class="filters-container">
          <select v-model="filtroCategoria" @change="filtrarBienes" class="filter-select">
            <option value="">Todas las categorías</option>
            <option v-for="categoria in categorias" :key="categoria" :value="categoria">
              {{ categoria }}
            </option>
          </select>

          <select v-model="filtroEstado" @change="filtrarBienes" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>

          <select v-model="filtroUbicacion" @change="filtrarBienes" class="filter-select">
            <option value="">Todas las ubicaciones</option>
            <option v-for="ubicacion in ubicaciones" :key="ubicacion" :value="ubicacion">
              {{ ubicacion }}
            </option>
          </select>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- Toggle vista -->
        <div class="view-toggle">
          <button 
            :class="['toggle-btn', { active: vistaActual === 'tabla' }]"
            @click="cambiarVista('tabla')"
          >
            <i class="fas fa-table"></i>
          </button>
          <button 
            :class="['toggle-btn', { active: vistaActual === 'tarjetas' }]"
            @click="cambiarVista('tarjetas')"
          >
            <i class="fas fa-th-large"></i>
          </button>
        </div>

        <!-- Acciones -->
        <div class="action-buttons">
          <button class="btn btn-outline" @click="exportarPDF">
            <i class="fas fa-file-pdf"></i>
            Exportar PDF
          </button>
          <button class="btn btn-outline" @click="exportarExcel">
            <i class="fas fa-file-excel"></i>
            Exportar Excel
          </button>
          <button class="btn btn-primary" @click="abrirReportarIncidencia">
            <i class="fas fa-exclamation-triangle"></i>
            Reportar Incidencia
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon excelente">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ estadisticas.excelente }}</span>
          <span class="stat-label">Excelente Estado</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bueno">
          <i class="fas fa-thumbs-up"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ estadisticas.bueno }}</span>
          <span class="stat-label">Buen Estado</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon regular">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ estadisticas.regular }}</span>
          <span class="stat-label">Estado Regular</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon mantenimiento">
          <i class="fas fa-tools"></i>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ estadisticas.mantenimiento }}</span>
          <span class="stat-label">En Mantenimiento</span>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="content-area">
      <!-- Vista de tabla -->
      <div v-if="vistaActual === 'tabla'" class="table-container">
        <div class="table-header">
          <span class="results-count">
            Mostrando {{ bienesFiltrados.length }} de {{ totalBienes }} bienes
          </span>
          <div class="table-controls">
            <select v-model="itemsPorPagina" @change="cambiarPaginacion" class="pagination-select">
              <option value="10">10 por página</option>
              <option value="25">25 por página</option>
              <option value="50">50 por página</option>
              <option value="100">100 por página</option>
            </select>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="bienes-table">
            <thead>
              <tr>
                <th @click="ordenarPor('codigo')" class="sortable">
                  Código
                  <i :class="getSortIcon('codigo')"></i>
                </th>
                <th @click="ordenarPor('nombre')" class="sortable">
                  Nombre
                  <i :class="getSortIcon('nombre')"></i>
                </th>
                <th>Categoría</th>
                <th>Ubicación</th>
                <th @click="ordenarPor('estado')" class="sortable">
                  Estado
                  <i :class="getSortIcon('estado')"></i>
                </th>
                <th @click="ordenarPor('valor')" class="sortable">
                  Valor
                  <i :class="getSortIcon('valor')"></i>
                </th>
                <th @click="ordenarPor('fechaAsignacion')" class="sortable">
                  Fecha Asignación
                  <i :class="getSortIcon('fechaAsignacion')"></i>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="bien in bienesPaginados" 
                :key="bien.id"
                class="table-row"
                @click="verDetalleBien(bien)"
              >
                <td class="codigo-cell">
                  <span class="codigo">{{ bien.codigo }}</span>
                  <button 
                    class="qr-btn" 
                    @click.stop="mostrarQR(bien)"
                    title="Ver código QR"
                  >
                    <i class="fas fa-qrcode"></i>
                  </button>
                </td>
                <td>
                  <div class="bien-info">
                    <span class="bien-nombre">{{ bien.nombre }}</span>
                    <span class="bien-marca">{{ bien.marca }} {{ bien.modelo }}</span>
                  </div>
                </td>
                <td>
                  <span class="categoria-badge">{{ bien.categoria }}</span>
                </td>
                <td>{{ bien.ubicacion }}</td>
                <td>
                  <span :class="['estado-badge', bien.estado.toLowerCase().replace(' ', '-')]">
                    {{ bien.estado }}
                  </span>
                </td>
                <td class="valor-cell">${{ bien.valor.toLocaleString() }}</td>
                <td>{{ formatearFecha(bien.fechaAsignacion) }}</td>
                <td class="actions-cell">
                  <div class="action-buttons-cell">
                    <button 
                      class="action-btn primary" 
                      @click.stop="verDetalleBien(bien)"
                      title="Ver detalles"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      class="action-btn warning" 
                      @click.stop="solicitarMantenimiento(bien)"
                      title="Solicitar mantenimiento"
                    >
                      <i class="fas fa-wrench"></i>
                    </button>
                    <button 
                      class="action-btn danger" 
                      @click.stop="reportarProblema(bien)"
                      title="Reportar problema"
                    >
                      <i class="fas fa-exclamation-triangle"></i>
                    </button>
                    <div class="dropdown">
                      <button class="action-btn secondary dropdown-toggle" @click.stop="toggleDropdown(bien.id)">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <div v-if="dropdownAbierto === bien.id" class="dropdown-menu">
                        <a @click.stop="imprimirEtiqueta(bien)" class="dropdown-item">
                          <i class="fas fa-print"></i>
                          Imprimir Etiqueta
                        </a>
                        <a @click.stop="solicitarTraslado(bien)" class="dropdown-item">
                          <i class="fas fa-exchange-alt"></i>
                          Solicitar Traslado
                        </a>
                        <a @click.stop="verHistorial(bien)" class="dropdown-item">
                          <i class="fas fa-history"></i>
                          Ver Historial
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="pagination">
          <button 
            :disabled="paginaActual === 1" 
            @click="irAPagina(paginaActual - 1)"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button
            v-for="pagina in paginasVisibles"
            :key="pagina"
            :class="['pagination-btn', { active: pagina === paginaActual }]"
            @click="irAPagina(pagina)"
          >
            {{ pagina }}
          </button>
          
          <button 
            :disabled="paginaActual === totalPaginas" 
            @click="irAPagina(paginaActual + 1)"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Vista de tarjetas -->
      <div v-else class="cards-container">
        <div class="cards-grid">
          <div 
            v-for="bien in bienesPaginados" 
            :key="bien.id"
            class="bien-card"
            @click="verDetalleBien(bien)"
          >
            <div class="card-header">
              <span :class="['estado-badge', bien.estado.toLowerCase().replace(' ', '-')]">
                {{ bien.estado }}
              </span>
              <div class="card-actions">
                <button class="card-action-btn" @click.stop="mostrarQR(bien)">
                  <i class="fas fa-qrcode"></i>
                </button>
                <button class="card-action-btn" @click.stop="toggleDropdown(bien.id)">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            
            <div class="card-body">
              <h3 class="card-title">{{ bien.nombre }}</h3>
              <p class="card-subtitle">{{ bien.marca }} {{ bien.modelo }}</p>
              
              <div class="card-details">
                <div class="detail-item">
                  <i class="fas fa-barcode"></i>
                  <span>{{ bien.codigo }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-tag"></i>
                  <span>{{ bien.categoria }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ bien.ubicacion }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-dollar-sign"></i>
                  <span>${{ bien.valor.toLocaleString() }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <small>Asignado: {{ formatearFecha(bien.fechaAsignacion) }}</small>
              <div class="card-footer-actions">
                <button class="footer-btn" @click.stop="solicitarMantenimiento(bien)">
                  <i class="fas fa-wrench"></i>
                </button>
                <button class="footer-btn" @click.stop="reportarProblema(bien)">
                  <i class="fas fa-exclamation-triangle"></i>
                </button>
              </div>
            </div>

            <!-- Dropdown menu para tarjetas -->
            <div v-if="dropdownAbierto === bien.id" class="card-dropdown-menu">
              <a @click.stop="imprimirEtiqueta(bien)" class="dropdown-item">
                <i class="fas fa-print"></i>
                Imprimir Etiqueta
              </a>
              <a @click.stop="solicitarTraslado(bien)" class="dropdown-item">
                <i class="fas fa-exchange-alt"></i>
                Solicitar Traslado
              </a>
              <a @click.stop="verHistorial(bien)" class="dropdown-item">
                <i class="fas fa-history"></i>
                Ver Historial
              </a>
            </div>
          </div>
        </div>

        <!-- Paginación para tarjetas -->
        <div v-if="totalPaginas > 1" class="pagination">
          <button 
            :disabled="paginaActual === 1" 
            @click="irAPagina(paginaActual - 1)"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button
            v-for="pagina in paginasVisibles"
            :key="pagina"
            :class="['pagination-btn', { active: pagina === paginaActual }]"
            @click="irAPagina(pagina)"
          >
            {{ pagina }}
          </button>
          
          <button 
            :disabled="paginaActual === totalPaginas" 
            @click="irAPagina(paginaActual + 1)"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalle del bien -->
    <div v-if="modalDetalle" class="modal-overlay" @click="cerrarModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalle del Bien</h3>
          <button class="modal-close" @click="cerrarModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Contenido del modal se llenará dinámicamente -->
          <div v-if="bienSeleccionado">
            <div class="detail-grid">
              <div class="detail-section">
                <h4>Información General</h4>
                <div class="detail-row">
                  <span class="label">Código:</span>
                  <span class="value">{{ bienSeleccionado.codigo }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Nombre:</span>
                  <span class="value">{{ bienSeleccionado.nombre }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Marca:</span>
                  <span class="value">{{ bienSeleccionado.marca }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Modelo:</span>
                  <span class="value">{{ bienSeleccionado.modelo }}</span>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>Estado y Ubicación</h4>
                <div class="detail-row">
                  <span class="label">Estado:</span>
                  <span :class="['value', 'estado-badge', bienSeleccionado.estado.toLowerCase().replace(' ', '-')]">
                    {{ bienSeleccionado.estado }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">Ubicación:</span>
                  <span class="value">{{ bienSeleccionado.ubicacion }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Valor:</span>
                  <span class="value">${{ bienSeleccionado.valor.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="cerrarModal">Cerrar</button>
          <button class="btn btn-primary" @click="imprimirDetalle">
            <i class="fas fa-print"></i>
            Imprimir
          </button>
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
import { ref, computed, onMounted, reactive } from 'vue';

export default {
  name: 'MisBienesView',
  props: {
    usuario: {
      type: Object,
      required: true
    },
    bienes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['solicitar-mantenimiento', 'reportar-problema', 'solicitar-traslado'],
  setup(props, { emit }) {
    // Estado reactivo
    const busqueda = ref('');
    const filtroCategoria = ref('');
    const filtroEstado = ref('');
    const filtroUbicacion = ref('');
    const vistaActual = ref('tabla');
    const paginaActual = ref(1);
    const itemsPorPagina = ref(10);
    const ordenActual = ref({ campo: 'nombre', direccion: 'asc' });
    const dropdownAbierto = ref(null);
    const modalDetalle = ref(false);
    const bienSeleccionado = ref(null);

    // Toast de notificaciones
    const toast = reactive({
      show: false,
      message: '',
      type: 'info',
      icon: 'fas fa-info-circle'
    });

    // Alertas
    const alertas = ref([
      {
        id: 1,
        tipo: 'warning',
        icono: 'fas fa-exclamation-triangle',
        mensaje: '3 bienes requieren mantenimiento preventivo este mes'
      },
      {
        id: 2,
        tipo: 'info',
        icono: 'fas fa-info-circle',
        mensaje: 'Recuerda verificar el estado de tus bienes mensualmente'
      }
    ]);

    // Datos de ejemplo (en producción vendrían de props o API)
    const bienesData = ref([
      {
        id: 1,
        codigo: 'BN-2024-001',
        nombre: 'Laptop Dell Latitude 7420',
        marca: 'Dell',
        modelo: 'Latitude 7420',
        categoria: 'Equipos de Cómputo',
        ubicacion: 'Oficina Principal - Piso 2',
        estado: 'Excelente',
        valor: 1200,
        fechaAsignacion: '2024-01-15',
        descripcion: 'Laptop empresarial con Windows 11 Pro'
      },
      {
        id: 2,
        codigo: 'BN-2024-002',
        nombre: 'Monitor Samsung 27"',
        marca: 'Samsung',
        modelo: 'F27T450FQN',
        categoria: 'Equipos de Cómputo',
        ubicacion: 'Oficina Principal - Piso 2',
        estado: 'Bueno',
        valor: 350,
        fechaAsignacion: '2024-01-15',
        descripcion: 'Monitor LED Full HD'
      },
      {
        id: 3,
        codigo: 'BN-2023-045',
        nombre: 'Silla Ejecutiva',
        marca: 'Herman Miller',
        modelo: 'Aeron',
        categoria: 'Mobiliario',
        ubicacion: 'Oficina Principal - Piso 2',
        estado: 'Bueno',
        valor: 800,
        fechaAsignacion: '2023-08-10',
        descripcion: 'Silla ergonómica con soporte lumbar'
      },
      {
        id: 4,
        codigo: 'BN-2023-067',
        nombre: 'Impresora HP LaserJet',
        marca: 'HP',
        modelo: 'LaserJet Pro M404n',
        categoria: 'Equipos de Oficina',
        ubicacion: 'Oficina Principal - Piso 2',
        estado: 'Regular',
        valor: 250,
        fechaAsignacion: '2023-09-20',
        descripcion: 'Impresora láser monocromática'
      },
      {
        id: 5,
        codigo: 'BN-2024-023',
        nombre: 'Teléfono IP',
        marca: 'Cisco',
        modelo: 'SPA504G',
        categoria: 'Equipos de Comunicación',
        ubicacion: 'Oficina Principal - Piso 2',
        estado: 'En Mantenimiento',
        valor: 180,
        fechaAsignacion: '2024-02-28',
        descripcion: 'Teléfono IP con 4 líneas'
      }
    ]);

    // Computed properties
    const totalBienes = computed(() => bienesData.value.length);
    
    const valorTotalFormatted = computed(() => {
      const total = bienesData.value.reduce((sum, bien) => sum + bien.valor, 0);
      return total.toLocaleString();
    });

    const categorias = computed(() => {
      return [...new Set(bienesData.value.map(bien => bien.categoria))];
    });

    const ubicaciones = computed(() => {
      return [...new Set(bienesData.value.map(bien => bien.ubicacion))];
    });

    const estadisticas = computed(() => {
      const stats = { excelente: 0, bueno: 0, regular: 0, mantenimiento: 0 };
      bienesData.value.forEach(bien => {
        switch (bien.estado.toLowerCase()) {
          case 'excelente':
            stats.excelente++;
            break;
          case 'bueno':
            stats.bueno++;
            break;
          case 'regular':
            stats.regular++;
            break;
          case 'en mantenimiento':
            stats.mantenimiento++;
            break;
        }
      });
      return stats;
    });

    const bienesFiltrados = computed(() => {
      let resultado = [...bienesData.value];

      // Filtro por búsqueda
      if (busqueda.value) {
        const termino = busqueda.value.toLowerCase();
        resultado = resultado.filter(bien => 
          bien.codigo.toLowerCase().includes(termino) ||
          bien.nombre.toLowerCase().includes(termino) ||
          bien.marca.toLowerCase().includes(termino) ||
          bien.modelo.toLowerCase().includes(termino) ||
          bien.descripcion.toLowerCase().includes(termino)
        );
      }

      // Filtro por categoría
      if (filtroCategoria.value) {
        resultado = resultado.filter(bien => bien.categoria === filtroCategoria.value);
      }

      // Filtro por estado
      if (filtroEstado.value) {
        resultado = resultado.filter(bien => bien.estado === filtroEstado.value);
      }

      // Filtro por ubicación
      if (filtroUbicacion.value) {
        resultado = resultado.filter(bien => bien.ubicacion === filtroUbicacion.value);
      }

      // Ordenamiento
      resultado.sort((a, b) => {
        const { campo, direccion } = ordenActual.value;
        let valorA = a[campo];
        let valorB = b[campo];

        if (typeof valorA === 'string') {
          valorA = valorA.toLowerCase();
          valorB = valorB.toLowerCase();
        }

        if (direccion === 'asc') {
          return valorA > valorB ? 1 : -1;
        } else {
          return valorA < valorB ? 1 : -1;
        }
      });

      return resultado;
    });

    const totalPaginas = computed(() => {
      return Math.ceil(bienesFiltrados.value.length / itemsPorPagina.value);
    });

    const bienesPaginados = computed(() => {
      const inicio = (paginaActual.value - 1) * itemsPorPagina.value;
      const fin = inicio + itemsPorPagina.value;
      return bienesFiltrados.value.slice(inicio, fin);
    });

    const paginasVisibles = computed(() => {
      const total = totalPaginas.value;
      const actual = paginaActual.value;
      const visible = [];

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          visible.push(i);
        }
      } else {
        visible.push(1);
        if (actual > 4) visible.push('...');
        
        const inicio = Math.max(2, actual - 2);
        const fin = Math.min(total - 1, actual + 2);
        
        for (let i = inicio; i <= fin; i++) {
          visible.push(i);
        }
        
        if (actual < total - 3) visible.push('...');
        visible.push(total);
      }

      return visible;
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

    const filtrarBienes = () => {
      paginaActual.value = 1; // Resetear a primera página al filtrar
    };

    const limpiarBusqueda = () => {
      busqueda.value = '';
      filtrarBienes();
    };

    const cambiarVista = (vista) => {
      vistaActual.value = vista;
    };

    const cambiarPaginacion = () => {
      paginaActual.value = 1;
    };

    const irAPagina = (pagina) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
      }
    };

    const ordenarPor = (campo) => {
      if (ordenActual.value.campo === campo) {
        ordenActual.value.direccion = ordenActual.value.direccion === 'asc' ? 'desc' : 'asc';
      } else {
        ordenActual.value = { campo, direccion: 'asc' };
      }
    };

    const getSortIcon = (campo) => {
      if (ordenActual.value.campo !== campo) {
        return 'fas fa-sort text-muted';
      }
      return ordenActual.value.direccion === 'asc' 
        ? 'fas fa-sort-up text-primary' 
        : 'fas fa-sort-down text-primary';
    };

    const toggleDropdown = (id) => {
      dropdownAbierto.value = dropdownAbierto.value === id ? null : id;
    };

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES');
    };

    const verDetalleBien = (bien) => {
      bienSeleccionado.value = bien;
      modalDetalle.value = true;
      dropdownAbierto.value = null;
    };

    const cerrarModal = () => {
      modalDetalle.value = false;
      bienSeleccionado.value = null;
    };

    const cerrarAlerta = (id) => {
      alertas.value = alertas.value.filter(alerta => alerta.id !== id);
    };

    const solicitarMantenimiento = (bien) => {
      emit('solicitar-mantenimiento', bien);
      mostrarToast(`Solicitud de mantenimiento enviada para ${bien.nombre}`, 'success');
      dropdownAbierto.value = null;
    };

    const reportarProblema = (bien) => {
      emit('reportar-problema', bien);
      mostrarToast(`Problema reportado para ${bien.nombre}`, 'warning');
      dropdownAbierto.value = null;
    };

    const solicitarTraslado = (bien) => {
      emit('solicitar-traslado', bien);
      mostrarToast(`Solicitud de traslado enviada para ${bien.nombre}`, 'info');
      dropdownAbierto.value = null;
    };

    const mostrarQR = (bien) => {
      mostrarToast(`Código QR mostrado para ${bien.codigo}`, 'info');
      dropdownAbierto.value = null;
    };

    const imprimirEtiqueta = (bien) => {
      mostrarToast(`Imprimiendo etiqueta para ${bien.codigo}`, 'success');
      dropdownAbierto.value = null;
    };

    const verHistorial = (bien) => {
      mostrarToast(`Cargando historial de ${bien.nombre}`, 'info');
      dropdownAbierto.value = null;
    };

    const exportarPDF = () => {
      mostrarToast('Exportando lista de bienes a PDF...', 'info');
    };

    const exportarExcel = () => {
      mostrarToast('Exportando lista de bienes a Excel...', 'info');
    };

    const abrirReportarIncidencia = () => {
      mostrarToast('Abriendo formulario de incidencias...', 'info');
    };

    const imprimirDetalle = () => {
      mostrarToast('Imprimiendo detalle del bien...', 'success');
    };

    // Lifecycle
    onMounted(() => {
      // Cerrar dropdown al hacer clic fuera
      document.addEventListener('click', () => {
        dropdownAbierto.value = null;
      });
    });

    return {
      // Estado
      busqueda,
      filtroCategoria,
      filtroEstado,
      filtroUbicacion,
      vistaActual,
      paginaActual,
      itemsPorPagina,
      ordenActual,
      dropdownAbierto,
      modalDetalle,
      bienSeleccionado,
      toast,
      alertas,
      
      // Computed
      totalBienes,
      valorTotalFormatted,
      categorias,
      ubicaciones,
      estadisticas,
      bienesFiltrados,
      totalPaginas,
      bienesPaginados,
      paginasVisibles,
      
      // Métodos
      filtrarBienes,
      limpiarBusqueda,
      cambiarVista,
      cambiarPaginacion,
      irAPagina,
      ordenarPor,
      getSortIcon,
      toggleDropdown,
      formatearFecha,
      verDetalleBien,
      cerrarModal,
      cerrarAlerta,
      solicitarMantenimiento,
      reportarProblema,
      solicitarTraslado,
      mostrarQR,
      imprimirEtiqueta,
      verHistorial,
      exportarPDF,
      exportarExcel,
      abrirReportarIncidencia,
      imprimirDetalle,
      mostrarToast
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

.mis-bienes-container {
  padding: 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  color: #EF4444;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #EF4444;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Alertas */
.alerts-section {
  margin-bottom: 1.5rem;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-item.warning {
  background-color: #fef3cd;
  border-color: #f59e0b;
  color: #92400e;
}

.alert-item.info {
  background-color: #dbeafe;
  border-color: #3b82f6;
  color: #1e40af;
}

.alert-item i {
  margin-right: 0.75rem;
}

.alert-close {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-container i {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 300px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.clear-search:hover {
  background-color: #f3f4f6;
}

.filters-container {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  min-width: 140px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  padding: 0.5rem 0.75rem;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.toggle-btn:hover {
  background-color: #f3f4f6;
}

.toggle-btn.active {
  background-color: #EF4444;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-outline {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

.btn-primary {
  background: #EF4444;
  border: 1px solid #EF4444;
  color: white;
}

.btn-primary:hover {
  background: #dc2626;
}

/* Estadísticas rápidas */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.excelente { background: #10b981; }
.stat-icon.bueno { background: #3b82f6; }
.stat-icon.regular { background: #f59e0b; }
.stat-icon.mantenimiento { background: #ef4444; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Contenido principal */
.content-area {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* Tabla */
.table-container {
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.results-count {
  color: #6b7280;
  font-size: 0.875rem;
}

.pagination-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.bienes-table {
  width: 100%;
  border-collapse: collapse;
}

.bienes-table th {
  background-color: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.bienes-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.bienes-table th.sortable:hover {
  background-color: #f3f4f6;
}

.bienes-table th i {
  margin-left: 0.5rem;
  font-size: 0.75rem;
}

.bienes-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f9fafb;
}

.codigo-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.codigo {
  font-family: monospace;
  font-weight: 600;
  color: #1f2937;
}

.qr-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.qr-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.bien-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bien-nombre {
  font-weight: 600;
  color: #1f2937;
}

.bien-marca {
  font-size: 0.875rem;
  color: #6b7280;
}

.categoria-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e5e7eb;
  color: #374151;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.estado-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.estado-badge.excelente {
  background-color: #d1fae5;
  color: #065f46;
}

.estado-badge.bueno {
  background-color: #dbeafe;
  color: #1e40af;
}

.estado-badge.regular {
  background-color: #fef3cd;
  color: #92400e;
}

.estado-badge.malo {
  background-color: #fee2e2;
  color: #991b1b;
}

.estado-badge.en-mantenimiento {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.valor-cell {
  font-weight: 600;
  color: #059669;
}

.actions-cell {
  width: 200px;
}

.action-buttons-cell {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  position: relative;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.action-btn.primary {
  background-color: #dbeafe;
  color: #2563eb;
}

.action-btn.primary:hover {
  background-color: #bfdbfe;
}

.action-btn.warning {
  background-color: #fef3cd;
  color: #d97706;
}

.action-btn.warning:hover {
  background-color: #fde68a;
}

.action-btn.danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-btn.danger:hover {
  background-color: #fecaca;
}

.action-btn.secondary {
  background-color: #f3f4f6;
  color: #6b7280;
}

.action-btn.secondary:hover {
  background-color: #e5e7eb;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 160px;
  padding: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dropdown-item i {
  width: 16px;
  color: #6b7280;
}

/* Vista de tarjetas */
.cards-container {
  padding: 1.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.bien-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}

.bien-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9fafb;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
}

.card-action-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.card-action-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  color: #6b7280;
  margin-bottom: 1rem;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.detail-item i {
  width: 16px;
  color: #6b7280;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.card-footer small {
  color: #6b7280;
  font-size: 0.75rem;
}

.card-footer-actions {
  display: flex;
  gap: 0.25rem;
}

.footer-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.footer-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.card-dropdown-menu {
  position: absolute;
  top: 60px;
  right: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 160px;
  padding: 0.5rem 0;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f9fafb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background-color: #EF4444;
  border-color: #EF4444;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.detail-grid {
  display: grid;
  gap: 2rem;
}

.detail-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 500;
  color: #6b7280;
}

.detail-row .value {
  font-weight: 600;
  color: #1f2937;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
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

/* Responsive */
@media (max-width: 768px) {
  .mis-bienes-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
  }

  .toolbar-right {
    justify-content: space-between;
  }

  .search-input {
    width: 100%;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .table-wrapper {
    font-size: 0.875rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>