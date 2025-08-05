<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Permisos por Rol</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Gestiona los permisos asignados a cada rol del sistema
            </p>
          </div>
          <button
            @click="showAssignModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Asignar Permisos
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Roles</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.totalRoles }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Permisos</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.totalPermisos }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Asignaciones Activas
                </p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.asignacionesActivas }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Cobertura Promedio
                </p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ stats.coberturaPromedio }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div
        class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 mb-6"
      >
        <div class="p-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar roles o permisos..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
              </div>
            </div>

            <!-- Filter by Role -->
            <div class="sm:w-48">
              <select
                v-model="selectedRolFilter"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="">Todos los roles</option>
                <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
                  {{ rol.nombre_rol }}
                </option>
              </select>
            </div>

            <!-- Refresh Button -->
            <button
              @click="loadData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Role-Permissions Matrix -->
      <div
        class="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Matriz de Roles y Permisos
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestiona los permisos asignados a cada rol. Los cambios se guardan automáticamente.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-10"
                >
                  Rol
                </th>
                <th
                  v-for="permiso in filteredPermisos"
                  :key="permiso.id_permiso"
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-32"
                >
                  <div class="transform -rotate-45 whitespace-nowrap">
                    {{ permiso.nombre_permiso }}
                  </div>
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Total Permisos
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="rol in filteredRoles"
                :key="rol.id_rol"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div
                        class="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center"
                      >
                        <svg
                          class="h-4 w-4 text-red-600 dark:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ rol.nombre_rol }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-32">
                        {{ rol.descripcion || 'Sin descripción' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  v-for="permiso in filteredPermisos"
                  :key="permiso.id_permiso"
                  class="px-4 py-4 text-center"
                >
                  <div class="flex items-center justify-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        :checked="hasPermission(rol.id_rol, permiso.id_permiso)"
                        @change="togglePermission(rol.id_rol, permiso.id_permiso, $event)"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"
                      ></div>
                    </label>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="
                      getRolePermissionCount(rol.id_rol) > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    "
                  >
                    {{ getRolePermissionCount(rol.id_rol) }} / {{ filteredPermisos.length }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredRoles.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No hay roles disponibles
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{
              searchQuery || selectedRolFilter
                ? 'No se encontraron roles con los filtros aplicados.'
                : 'No hay roles definidos en el sistema.'
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Assign Permissions Modal -->
    <div
      v-if="showAssignModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeAssignModal"
    >
      <div
        class="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-2xl bg-white dark:bg-gray-800"
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">
              Asignar Permisos Masivamente
            </h3>
            <button
              @click="closeAssignModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="assignPermissionsBulk">
            <div class="space-y-6">
              <!-- Select Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seleccionar Rol
                </label>
                <select
                  v-model="bulkForm.selectedRole"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                >
                  <option value="">Seleccione un rol...</option>
                  <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
                    {{ rol.nombre_rol }}
                  </option>
                </select>
              </div>

              <!-- Select Permissions -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Seleccionar Permisos
                </label>
                <div
                  class="space-y-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                >
                  <div class="flex items-center">
                    <input
                      id="select-all-permissions"
                      type="checkbox"
                      :checked="bulkForm.selectedPermissions.length === permisos.length"
                      @change="toggleAllPermissions"
                      class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label
                      for="select-all-permissions"
                      class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Seleccionar todos
                    </label>
                  </div>
                  <hr class="border-gray-300 dark:border-gray-600" />
                  <div
                    v-for="permiso in permisos"
                    :key="permiso.id_permiso"
                    class="flex items-center"
                  >
                    <input
                      :id="`permission-${permiso.id_permiso}`"
                      type="checkbox"
                      :value="permiso.id_permiso"
                      v-model="bulkForm.selectedPermissions"
                      class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label
                      :for="`permission-${permiso.id_permiso}`"
                      class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {{ permiso.nombre_permiso }}
                      <span class="text-xs text-gray-500 dark:text-gray-400 block">
                        {{ permiso.descripcion || 'Sin descripción' }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                @click="closeAssignModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="
                  loading || !bulkForm.selectedRole || bulkForm.selectedPermissions.length === 0
                "
                class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {{ loading ? 'Asignando...' : 'Asignar Permisos' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'RolePermissions',
  setup() {
    const toast = useToast()

    // Reactive data
    const roles = ref([])
    const permisos = ref([])
    const rolePermissions = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedRolFilter = ref('')
    const showAssignModal = ref(false)

    const bulkForm = ref({
      selectedRole: '',
      selectedPermissions: [],
    })

    // Computed properties
    const filteredRoles = computed(() => {
      let filtered = roles.value

      if (selectedRolFilter.value) {
        filtered = filtered.filter(rol => rol.id_rol === parseInt(selectedRolFilter.value))
      }

      if (searchQuery.value) {
        filtered = filtered.filter(
          rol =>
            rol.nombre_rol.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (rol.descripcion &&
              rol.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
      }

      return filtered
    })

    const filteredPermisos = computed(() => {
      let filtered = permisos.value

      if (searchQuery.value) {
        filtered = filtered.filter(
          permiso =>
            permiso.nombre_permiso.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (permiso.descripcion &&
              permiso.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()))
        )
      }

      return filtered
    })

    const stats = computed(() => {
      const totalRoles = roles.value.length
      const totalPermisos = permisos.value.length
      const asignacionesActivas = rolePermissions.value.length
      const posiblesAsignaciones = totalRoles * totalPermisos
      const coberturaPromedio =
        posiblesAsignaciones > 0
          ? Math.round((asignacionesActivas / posiblesAsignaciones) * 100)
          : 0

      return {
        totalRoles,
        totalPermisos,
        asignacionesActivas,
        coberturaPromedio,
      }
    })

    // Methods
    const loadData = async () => {
      loading.value = true
      try {
        await Promise.all([loadRoles(), loadPermisos(), loadRolePermissions()])
      } catch (error) {
        toast.error('Error al cargar los datos')
      } finally {
        loading.value = false
      }
    }

    const loadRoles = async () => {
      const response = await fetch('/api/v1/roles')
      if (response.ok) {
        const data = await response.json()
        roles.value = data.data || []
      } else {
        throw new Error('Error al cargar roles')
      }
    }

    const loadPermisos = async () => {
      const response = await fetch('/api/v1/permisos')
      if (response.ok) {
        const data = await response.json()
        permisos.value = data.data || []
      } else {
        throw new Error('Error al cargar permisos')
      }
    }

    const loadRolePermissions = async () => {
      const response = await fetch('/api/v1/rol-permiso')
      if (response.ok) {
        const data = await response.json()
        rolePermissions.value = data.data || []
      } else {
        throw new Error('Error al cargar relaciones rol-permiso')
      }
    }

    const hasPermission = (rolId, permisoId) => {
      return rolePermissions.value.some(rp => rp.id_rol === rolId && rp.id_permiso === permisoId)
    }

    const getRolePermissionCount = rolId => {
      return rolePermissions.value.filter(rp => rp.id_rol === rolId).length
    }

    const togglePermission = async (rolId, permisoId, event) => {
      const isChecked = event.target.checked

      try {
        if (isChecked) {
          // Asignar permiso
          const response = await fetch('/api/v1/rol-permiso', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({
              id_rol: rolId,
              id_permiso: permisoId,
            }),
          })

          if (response.ok) {
            rolePermissions.value.push({ id_rol: rolId, id_permiso: permisoId })
            toast.success('Permiso asignado exitosamente')
          } else {
            throw new Error('Error al asignar permiso')
          }
        } else {
          // Revocar permiso
          const response = await fetch(`/api/v1/rol-permiso/${rolId}/${permisoId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
          })

          if (response.ok) {
            rolePermissions.value = rolePermissions.value.filter(
              rp => !(rp.id_rol === rolId && rp.id_permiso === permisoId)
            )
            toast.success('Permiso revocado exitosamente')
          } else {
            throw new Error('Error al revocar permiso')
          }
        }
      } catch (error) {
        toast.error(isChecked ? 'Error al asignar el permiso' : 'Error al revocar el permiso')
        // Revertir el estado del checkbox
        event.target.checked = !isChecked
      }
    }

    const toggleAllPermissions = event => {
      if (event.target.checked) {
        bulkForm.value.selectedPermissions = permisos.value.map(p => p.id_permiso)
      } else {
        bulkForm.value.selectedPermissions = []
      }
    }

    const assignPermissionsBulk = async () => {
      loading.value = true
      try {
        const requests = bulkForm.value.selectedPermissions
          .map(permisoId => {
            // Solo asignar si no existe ya
            if (!hasPermission(bulkForm.value.selectedRole, permisoId)) {
              return fetch('/api/v1/rol-permiso', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: JSON.stringify({
                  id_rol: bulkForm.value.selectedRole,
                  id_permiso: permisoId,
                }),
              })
            }
            return Promise.resolve()
          })
          .filter(Boolean)

        await Promise.all(requests)

        toast.success('Permisos asignados exitosamente')
        closeAssignModal()
        loadRolePermissions()
      } catch (error) {
        toast.error('Error al asignar permisos masivamente')
      } finally {
        loading.value = false
      }
    }

    const closeAssignModal = () => {
      showAssignModal.value = false
      bulkForm.value = {
        selectedRole: '',
        selectedPermissions: [],
      }
    }

    // Lifecycle
    onMounted(() => {
      loadData()
    })

    return {
      roles,
      permisos,
      rolePermissions,
      loading,
      searchQuery,
      selectedRolFilter,
      showAssignModal,
      bulkForm,
      filteredRoles,
      filteredPermisos,
      stats,
      loadData,
      hasPermission,
      getRolePermissionCount,
      togglePermission,
      toggleAllPermissions,
      assignPermissionsBulk,
      closeAssignModal,
    }
  },
}
</script>
