<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
    <!-- Header moderno -->
    <div class="bg-white shadow-lg border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-calendar-alt text-white"></i>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Períodos Académicos
              </h1>
              <p class="text-sm text-slate-500">Gestiona los períodos del año académico</p>
            </div>
          </div>
          <button
            @click="openModal"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <i class="fas fa-plus mr-2"></i>
            Nuevo Período
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-calendar-week text-indigo-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">Total Períodos</p>
              <p class="text-2xl font-bold text-slate-900">{{ periodos.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-play-circle text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">Período Activo</p>
              <p class="text-lg font-bold text-slate-900">{{ periodoActivo || 'Ninguno' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-graduation-cap text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">Año Actual</p>
              <p class="text-2xl font-bold text-slate-900">{{ new Date().getFullYear() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-clock text-orange-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">Próximos</p>
              <p class="text-2xl font-bold text-slate-900">{{ periodosProximos }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-slate-400"></i>
            </div>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar períodos..."
              class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div class="flex items-center space-x-3">
            <select
              v-model="filtroEstado"
              class="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="proximo">Próximo</option>
              <option value="finalizado">Finalizado</option>
            </select>
            
            <select
              v-model="filtroAño"
              class="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Todos los años</option>
              <option v-for="año in añosDisponibles" :key="año" :value="año">{{ año }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de períodos -->
      <div class="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Período
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Año
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="periodo in periodosFiltrados"
                :key="periodo.id_periodo"
                class="hover:bg-slate-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <span class="text-white font-bold text-sm">{{ periodo.numero_periodo }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-slate-900">
                        {{ periodo.nombre_periodo }}
                      </div>
                      <div class="text-sm text-slate-500">
                        Período {{ periodo.numero_periodo }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-slate-900">{{ periodo.año }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-900">{{ formatearFecha(periodo.fecha_inicio) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-900">{{ formatearFecha(periodo.fecha_fin) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getEstadoClasses(periodo.estado)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                    <i :class="getEstadoIcon(periodo.estado)" class="mr-1"></i>
                    {{ periodo.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editarPeriodo(periodo)"
                      class="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition-colors duration-200"
                    >
                      <i class="fas fa-edit mr-1"></i>
                      Editar
                    </button>
                    <button
                      @click="eliminarPeriodo(periodo.id_periodo)"
                      class="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors duration-200"
                    >
                      <i class="fas fa-trash mr-1"></i>
                      Eliminar
                    </button>
                    <button
                      v-if="periodo.estado !== 'activo'"
                      @click="activarPeriodo(periodo.id_periodo)"
                      class="inline-flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded-lg transition-colors duration-200"
                    >
                      <i class="fas fa-play mr-1"></i>
                      Activar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-if="periodosFiltrados.length === 0" class="text-center py-12">
          <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-calendar-times text-slate-400 text-3xl"></i>
          </div>
          <h3 class="text-lg font-medium text-slate-900 mb-2">No hay períodos</h3>
          <p class="text-slate-500 mb-6">No se encontraron períodos académicos con los filtros aplicados.</p>
          <button
            @click="openModal"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <i class="fas fa-plus mr-2"></i>
            Crear primer período
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar período -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div
        @click.stop
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300"
      >
        <div class="p-6">
          <!-- Header del modal -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i class="fas fa-calendar-plus text-white"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  {{ isEditing ? 'Editar Período' : 'Nuevo Período' }}
                </h3>
                <p class="text-sm text-slate-500">
                  {{ isEditing ? 'Modifica los datos del período' : 'Crea un nuevo período académico' }}
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <i class="fas fa-times text-slate-500"></i>
            </button>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="savePeriodo" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Nombre del Período
              </label>
              <input
                v-model="periodo.nombre_periodo"
                type="text"
                required
                placeholder="ej. Primer Semestre, Verano 2024"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Número de Período
              </label>
              <select
                v-model="periodo.numero_periodo"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Seleccionar período</option>
                <option value="1">1 - Primer Período</option>
                <option value="2">2 - Segundo Período</option>
                <option value="3">3 - Tercer Período</option>
                <option value="4">4 - Cuarto Período</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Año
              </label>
              <input
                v-model="periodo.año"
                type="number"
                required
                :min="new Date().getFullYear() - 5"
                :max="new Date().getFullYear() + 5"
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  v-model="periodo.fecha_inicio"
                  type="date"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  v-model="periodo.fecha_fin"
                  type="date"
                  required
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Estado
              </label>
              <select
                v-model="periodo.estado"
                required
                class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Seleccionar estado</option>
                <option value="proximo">Próximo</option>
                <option value="activo">Activo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            <!-- Botones del modal -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else :class="isEditing ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { periodosService } from '@/services/api.js';

export default {
  name: 'PeriodosAcademicosView',
  data() {
    return {
      periodos: [],
      showModal: false,
      isEditing: false,
      editingId: null,
      loading: false,
      searchTerm: '',
      filtroEstado: '',
      filtroAño: '',
      periodo: {
        nombre_periodo: '',
        numero_periodo: '',
        año: new Date().getFullYear(),
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'proximo'
      }
    };
  },
  computed: {
    periodosFiltrados() {
      return this.periodos.filter(periodo => {
        const matchesSearch = periodo.nombre_periodo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            periodo.numero_periodo.toString().includes(this.searchTerm);
        const matchesEstado = !this.filtroEstado || periodo.estado === this.filtroEstado;
        const matchesAño = !this.filtroAño || periodo.año.toString() === this.filtroAño;
        
        return matchesSearch && matchesEstado && matchesAño;
      });
    },
    periodoActivo() {
      const activo = this.periodos.find(p => p.estado === 'activo');
      return activo ? activo.nombre_periodo : null;
    },
    periodosProximos() {
      return this.periodos.filter(p => p.estado === 'proximo').length;
    },
    añosDisponibles() {
      const años = [...new Set(this.periodos.map(p => p.año))];
      return años.sort((a, b) => b - a);
    }
  },
  async mounted() {
    await this.fetchPeriodos();
  },
  methods: {
    async fetchPeriodos() {
      try {
        this.loading = true;
        const response = await periodosService.getAll();
        this.periodos = response.data;
      } catch (error) {
        console.error('Error al obtener períodos:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los períodos académicos'
        });
      } finally {
        this.loading = false;
      }
    },

    openModal() {
      this.showModal = true;
      this.isEditing = false;
      this.editingId = null;
      this.periodo = {
        nombre_periodo: '',
        numero_periodo: '',
        año: new Date().getFullYear(),
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'proximo'
      };
    },

    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.editingId = null;
    },

    editarPeriodo(periodo) {
      this.isEditing = true;
      this.editingId = periodo.id_periodo;
      this.periodo = { ...periodo };
      this.showModal = true;
    },

    async savePeriodo() {
      try {
        this.loading = true;

        // Validar fechas
        if (new Date(this.periodo.fecha_inicio) >= new Date(this.periodo.fecha_fin)) {
          await Swal.fire({
            icon: 'warning',
            title: 'Fechas inválidas',
            text: 'La fecha de inicio debe ser anterior a la fecha de fin'
          });
          return;
        }

        let response;
        if (this.isEditing) {
          response = await periodosService.update(this.editingId, this.periodo);
        } else {
          response = await periodosService.create(this.periodo);
        }

        await this.fetchPeriodos();
        this.closeModal();

        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `Período ${this.isEditing ? 'actualizado' : 'creado'} correctamente`,
          timer: 2000,
          showConfirmButton: false
        });

      } catch (error) {
        console.error('Error al guardar período:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'No se pudo guardar el período'
        });
      } finally {
        this.loading = false;
      }
    },

    async eliminarPeriodo(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          await periodosService.delete(id);
          await this.fetchPeriodos();
          
          await Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El período ha sido eliminado correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error al eliminar período:', error);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el período'
          });
        }
      }
    },

    async activarPeriodo(id) {
      try {
        const periodoData = { estado: 'activo' };
        await periodosService.update(id, periodoData);
        await this.fetchPeriodos();
        
        await Swal.fire({
          icon: 'success',
          title: 'Período activado',
          text: 'El período ha sido activado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al activar período:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo activar el período'
        });
      }
    },

    formatearFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    getEstadoClasses(estado) {
      const classes = {
        'activo': 'bg-green-100 text-green-800',
        'proximo': 'bg-blue-100 text-blue-800',
        'finalizado': 'bg-gray-100 text-gray-800'
      };
      return classes[estado] || 'bg-gray-100 text-gray-800';
    },

    getEstadoIcon(estado) {
      const icons = {
        'activo': 'fas fa-play-circle',
        'proximo': 'fas fa-clock',
        'finalizado': 'fas fa-check-circle'
      };
      return icons[estado] || 'fas fa-question-circle';
    }
  }
};
</script>