<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Asignación de Roles</h1>
          <button
            @click="showAssignForm = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all ease-in-out duration-300 hover:scale-105 shadow-lg"
          >
            + Asignar Rol
          </button>
        </div>

        <!-- Filtros -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar usuarios..."
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            v-model="selectedRole"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Todos los roles</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.nombre }}
            </option>
          </select>
          <select
            v-model="selectedStatus"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <!-- Lista de Usuarios con Roles -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                >
                  {{ user.nombre.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    {{ user.nombre }} {{ user.apellido }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ user.email }}
                  </p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editUserRoles(user)"
                  class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Roles asignados -->
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Roles asignados:</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="userRole in user.roles"
                  :key="userRole.rol_id"
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full flex items-center space-x-1"
                >
                  <span>{{ getRoleName(userRole.rol_id) }}</span>
                  <button
                    @click="removeRole(user.id, userRole.rol_id)"
                    class="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </span>
              </div>
              <div
                v-if="!user.roles || user.roles.length === 0"
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                Sin roles asignados
              </div>
            </div>

            <!-- Estado del usuario -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                <span
                  :class="getStatusColor(user.estado)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ user.estado }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div class="flex justify-between items-center mt-8">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {{ paginatedData.start }} a {{ paginatedData.end }} de
            {{ totalItems }} usuarios
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Anterior
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Asignación de Roles -->
    <div
      v-if="showAssignForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Asignar Rol</h2>

        <form @submit.prevent="assignRole" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usuario
            </label>
            <select
              v-model="assignForm.usuario_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar usuario</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.nombre }} {{ user.apellido }} ({{ user.email }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol
            </label>
            <select
              v-model="assignForm.rol_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar rol</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.nombre }} - {{ role.descripcion }}
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="closeAssignForm"
              class="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
            >
              Asignar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Edición de Roles -->
    <div
      v-if="showEditForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Editar Roles de {{ editingUser?.nombre }} {{ editingUser?.apellido }}
        </h2>

        <div class="space-y-4">
          <div
            v-for="role in roles"
            :key="role.id"
            class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
          >
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ role.nombre }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ role.descripcion }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="userHasRole(editingUser?.id, role.id)"
                @change="toggleUserRole(editingUser?.id, role.id, $event.target.checked)"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-6">
          <button
            @click="closeEditForm"
            class="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estado reactivo
const users = ref([])
const roles = ref([])
const userRoles = ref([])
const showAssignForm = ref(false)
const showEditForm = ref(false)
const editingUser = ref(null)
const searchTerm = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(9)

// Formulario de asignación
const assignForm = ref({
  usuario_id: '',
  rol_id: '',
})

// Computadas
const filteredUsers = computed(() => {
  const filtered = users.value.filter(user => {
    const matchesSearch =
      !searchTerm.value ||
      user.nombre?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.apellido?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.value.toLowerCase())

    const matchesRole =
      !selectedRole.value || user.roles?.some(ur => ur.rol_id == selectedRole.value)

    const matchesStatus = !selectedStatus.value || user.estado === selectedStatus.value

    return matchesSearch && matchesRole && matchesStatus
  })

  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

const totalItems = computed(() => users.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(start + itemsPerPage.value - 1, totalItems.value)
  return { start, end }
})

// Métodos
const loadUsers = async () => {
  try {
    // Simular datos - reemplazar con API real
    users.value = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        estado: 'activo',
        roles: [{ rol_id: 1, asignado_en: '2024-01-15' }],
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        email: 'maria@example.com',
        estado: 'activo',
        roles: [
          { rol_id: 2, asignado_en: '2024-02-10' },
          { rol_id: 3, asignado_en: '2024-03-05' },
        ],
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos@example.com',
        estado: 'inactivo',
        roles: [],
      },
    ]
  } catch (error) {
    console.error('Error:', error)
  }
}

const loadRoles = async () => {
  try {
    // Simular datos - reemplazar con API real
    roles.value = [
      {
        id: 1,
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema',
      },
      {
        id: 2,
        nombre: 'Usuario',
        descripcion: 'Acceso básico para usuarios estándar',
      },
      {
        id: 3,
        nombre: 'Supervisor',
        descripcion: 'Acceso intermedio con permisos de supervisión',
      },
    ]
  } catch (error) {
    console.error('Error al cargar roles:', error)
  }
}

const assignRole = async () => {
  try {
    const user = users.value.find(u => u.id == assignForm.value.usuario_id)
    if (user) {
      if (!user.roles) user.roles = []

      // Verificar si ya tiene el rol
      const hasRole = user.roles.some(r => r.rol_id == assignForm.value.rol_id)
      if (!hasRole) {
        user.roles.push({
          rol_id: parseInt(assignForm.value.rol_id),
          asignado_en: new Date().toISOString().split('T')[0],
        })
      }
    }
    closeAssignForm()
  } catch (error) {
    console.error('Error al asignar rol:', error)
  }
}

const removeRole = async (userId, rolId) => {
  if (confirm('¿Está seguro de remover este rol?')) {
    const user = users.value.find(u => u.id === userId)
    if (user && user.roles) {
      user.roles = user.roles.filter(r => r.rol_id !== rolId)
    }
  }
}

const editUserRoles = user => {
  editingUser.value = user
  showEditForm.value = true
}

const userHasRole = (userId, rolId) => {
  const user = users.value.find(u => u.id === userId)
  return user?.roles?.some(r => r.rol_id === rolId) || false
}

const toggleUserRole = (userId, rolId, hasRole) => {
  const user = users.value.find(u => u.id === userId)
  if (!user) return

  if (!user.roles) user.roles = []

  if (hasRole) {
    // Asignar rol
    const existingRole = user.roles.find(r => r.rol_id === rolId)
    if (!existingRole) {
      user.roles.push({
        rol_id: rolId,
        asignado_en: new Date().toISOString().split('T')[0],
      })
    }
  } else {
    // Remover rol
    user.roles = user.roles.filter(r => r.rol_id !== rolId)
  }
}

const getRoleName = rolId => {
  const role = roles.value.find(r => r.id === rolId)
  return role?.nombre || 'Desconocido'
}

const getStatusColor = estado => {
  const colors = {
    activo: 'bg-green-100 text-green-800',
    inactivo: 'bg-red-100 text-red-800',
  }
  return colors[estado] || 'bg-gray-100 text-gray-800'
}

const closeAssignForm = () => {
  showAssignForm.value = false
  assignForm.value = {
    usuario_id: '',
    rol_id: '',
  }
}

const closeEditForm = () => {
  showEditForm.value = false
  editingUser.value = null
}

// Ciclo de vida
onMounted(() => {
  loadUsers()
  loadRoles()
})
</script>
