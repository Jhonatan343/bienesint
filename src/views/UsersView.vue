<template>
  <div class="usuarios-container">
    <!-- Header con gradiente -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-wrapper">
            <i class="bx bx-group"></i>
          </div>
          <h1>Gestión de Usuarios</h1>
        </div>
        <p class="subtitle">Administra y organiza los usuarios del sistema institucional</p>
      </div>
      <div class="header-actions">
        <button @click="exportData" class="btn btn-export" title="Exportar datos">
          <div class="btn-content">
            <i class="bx bx-download"></i>
            <span>Exportar</span>
          </div>
        </button>
        <button @click="openModal" class="btn btn-primary btn-modern">
          <div class="btn-content">
            <i class="bx bx-user-plus"></i>
            <span>Nuevo Usuario</span>
          </div>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>

    <!-- NUEVA SECCIÓN: Panel de Estadísticas Colorido -->
    <div v-if="usuarios.length > 0" class="stats-section">
      <h2 class="section-title">
        <i class="bx bx-bar-chart-alt-2"></i>
        Dashboard de Usuarios
      </h2>
      <div class="stats-grid">
        <div class="stat-card stat-primary">
          <div class="stat-icon">
            <i class="bx bx-users"></i>
          </div>
          <div class="stat-content">
            <h3>{{ usuarios.length }}</h3>
            <p>Total Usuarios</p>
          </div>
          <div class="stat-trend">
            <i class="bx bx-trending-up"></i>
          </div>
        </div>
        
        <div class="stat-card stat-success">
          <div class="stat-icon">
            <i class="bx bx-code-alt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ getCareerCount('Desarrollo de Software') }}</h3>
            <p>Desarrollo de Software</p>
          </div>
          <div class="stat-trend">
            <i class="bx bx-laptop"></i>
          </div>
        </div>
        
        <div class="stat-card stat-warning">
          <div class="stat-icon">
            <i class="bx bx-briefcase-alt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ getCareerCount('Administración') }}</h3>
            <p>Administración</p>
          </div>
          <div class="stat-trend">
            <i class="bx bx-chart"></i>
          </div>
        </div>
        
        <div class="stat-card stat-info">
          <div class="stat-icon">
            <i class="bx bx-palette"></i>
          </div>
          <div class="stat-content">
            <h3>{{ getCareerCount('Diseño Gráfico y Multimedia') }}</h3>
            <p>Diseño Gráfico y Multimedia</p>
          </div>
          <div class="stat-trend">
            <i class="bx bx-brush"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando usuarios...</p>
    </div>

    <!-- Lista de Usuarios en Tabla -->
    <div v-else-if="filteredUsuarios.length" class="usuarios-grid">
      <div class="section-header">
        <h2>
          <i class="bx bx-list-ul"></i>
          Usuarios Registrados
        </h2>
        <div class="header-controls">
          <!-- NUEVOS: Controles de búsqueda y filtros -->
          <div class="search-controls">
            <div class="search-box">
              <i class="bx bx-search"></i>
              <input 
                v-model="searchTerm" 
                type="text" 
                placeholder="Buscar usuarios..."
                @input="filterUsuarios"
              >
            </div>
            <select v-model="selectedCareer" @change="filterUsuarios" class="career-filter">
              <option value="">Todas las carreras</option>
              <option value="Desarrollo de Software">Desarrollo de Software</option>
              <option value="Administración">Administración</option>
              <option value="Diseño Gráfico y Multimedia">Diseño Gráfico y Multimedia</option>
            </select>
          </div>
          <div class="stats-badge">
            {{ filteredUsuarios.length }} de {{ usuarios.length }} usuarios
          </div>
        </div>
      </div>
      
      <div class="table-container">
        <div class="table-wrapper">
          <table class="usuarios-table">
            <thead>
              <tr>
                <th class="th-user">
                  <i class="bx bx-user"></i>
                  Usuario
                </th>
                <th class="th-contact">
                  <i class="bx bx-phone"></i>
                  Contacto
                </th>
                <th class="th-id">
                  <i class="bx bx-id-card"></i>
                  Identificación
                </th>
                <th class="th-career">
                  <i class="bx bx-book"></i>
                  Carrera
                </th>
                <th class="th-actions">
                  <i class="bx bx-cog"></i>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="usuario in filteredUsuarios"
                :key="usuario.id_usuario"
                class="table-row"
              >
                <td class="td-user">
                  <div class="user-cell">
                    <div class="user-avatar" :class="getAvatarClass(usuario.carrera)">
                      <i class="bx" :class="getCareerIcon(usuario.carrera)"></i>
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{ usuario.nombres }} {{ usuario.apellidos }}</div>
                      <div class="user-id">ID: {{ usuario.id_usuario }}</div>
                    </div>
                  </div>
                </td>
                <td class="td-contact">
                  <div class="contact-info">
                    <div class="contact-item">
                      <i class="bx bx-phone"></i>
                      <span>{{ usuario.telefono }}</span>
                    </div>
                    <div class="contact-item">
                      <i class="bx bx-envelope"></i>
                      <span>{{ usuario.correo_institucional }}</span>
                    </div>
                  </div>
                </td>
                <td class="td-id">
                  <div class="id-info">
                    <i class="bx bx-id-card"></i>
                    <span>{{ usuario.cedula }}</span>
                  </div>
                </td>
                <td class="td-career">
                  <div class="career-badge" :class="getCareerBadgeClass(usuario.carrera)">
                    <i class="bx" :class="getCareerIcon(usuario.carrera)"></i>
                    <span>{{ getCareerShort(usuario.carrera) }}</span>
                  </div>
                </td>
                <td class="td-actions">
                  <div class="action-buttons-horizontal">
                    <button
                      @click="editarUsuario(usuario)"
                      class="btn-action btn-edit-action"
                      title="Editar usuario"
                    >
                      <i class="bx bx-pencil"></i>
                      <span>Editar</span>
                    </button>
                    <button
                      @click="eliminarUsuario(usuario.id_usuario)"
                      class="btn-action btn-delete-action"
                      title="Eliminar usuario"
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
    <div v-else-if="!isLoading && usuarios.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="bx bx-user-x"></i>
      </div>
      <h3>No hay usuarios registrados</h3>
      <p>Comienza registrando el primer usuario del sistema</p>
      <button @click="openModal" class="btn btn-outline">
        <i class="bx bx-user-plus"></i>
        Registrar Primer Usuario
      </button>
    </div>

    <!-- Estado de búsqueda sin resultados -->
    <div v-else-if="!isLoading && usuarios.length > 0 && filteredUsuarios.length === 0" class="empty-search-state">
      <div class="empty-icon">
        <i class="bx bx-search-alt"></i>
      </div>
      <h3>No se encontraron usuarios</h3>
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
                  <i class="bx" :class="isEditing ? 'bx-edit' : 'bx-user-plus'"></i>
                </div>
                <h2>{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
              </div>
              <button class="modal-close" @click="closeModal">
                <i class="bx bx-x"></i>
              </button>
            </div>

            <form @submit.prevent="saveUsuario" class="modal-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="nombres">
                    <i class="bx bx-user"></i>
                    Nombres
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="nombres"
                      v-model="usuario.nombres"
                      placeholder="Ej. Juan Carlos"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="apellidos">
                    <i class="bx bx-user"></i>
                    Apellidos
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="apellidos"
                      v-model="usuario.apellidos"
                      placeholder="Ej. Pérez García"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="telefono">
                    <i class="bx bx-phone"></i>
                    Teléfono
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="tel"
                      id="telefono"
                      v-model="usuario.telefono"
                      placeholder="09XXXXXXXX"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="correo_institucional">
                    <i class="bx bx-envelope"></i>
                    Correo Institucional
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="email"
                      id="correo_institucional"
                      v-model="usuario.correo_institucional"
                      placeholder="usuario@intsuperior.edu.ec"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label for="cedula">
                    <i class="bx bx-id-card"></i>
                    Cédula
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="cedula"
                      v-model="usuario.cedula"
                      placeholder="1234567890"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>

                <div class="form-group form-group-full">
                  <label for="carrera">
                    <i class="bx bx-book"></i>
                    Carrera
                  </label>
                  <div class="input-wrapper">
                    <select
                      id="carrera"
                      v-model="usuario.carrera"
                      required
                      :disabled="isSaving"
                    >
                      <option value="">Seleccionar carrera...</option>
                      <option value="Desarrollo de Software">Desarrollo de Software</option>
                      <option value="Administración">Administración</option>
                      <option value="Diseño Gráfico y Multimedia">Diseño Gráfico y Multimedia</option>
                    </select>
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
import { usuariosService } from '@/services/api.js';

export default {
  name: "UsersView",
  data() {
    return {
      // ✅ DATOS ORIGINALES MANTENIDOS
      isModalOpen: false,
      isEditing: false,
      isLoading: false,
      isSaving: false,
      editingId: null,
      usuario: {
        nombres: "",
        apellidos: "",
        telefono: "",
        correo_institucional: "",
        cedula: "",
        carrera: "",
      },
      usuarios: [],

      // ✅ NUEVOS DATOS AGREGADOS
      // Filtros y búsqueda
      searchTerm: '',
      selectedCareer: '',
      filteredUsuarios: []
    };
  },

  computed: {
    // ✅ NUEVAS PROPIEDADES COMPUTADAS AGREGADAS
    availableCareers() {
      return [
        'Desarrollo de Software',
        'Administración', 
        'Diseño Gráfico y Multimedia'
      ];
    }
  },

  methods: {
    // ✅ MÉTODOS ORIGINALES MANTENIDOS
    openModal() {
      this.resetForm();
      this.isModalOpen = true;
      this.isEditing = false;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    resetForm() {
      this.usuario = {
        nombres: "",
        apellidos: "",
        telefono: "",
        correo_institucional: "",
        cedula: "",
        carrera: "",
      };
      this.editingId = null;
      this.isEditing = false;
      this.isSaving = false;
    },
    async fetchUsuarios() {
      this.isLoading = true;
      try {
        const response = await usuariosService.getAll();
        this.usuarios = response.data;
        this.filterUsuarios(); // ✅ AGREGADO: Aplicar filtros después de cargar
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        await Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los usuarios.",
          icon: "error",
          confirmButtonColor: '#ed1c24'
        });
      } finally {
        this.isLoading = false;
      }
    },
    async saveUsuario() {
      this.isSaving = true;
      try {
        let response;
        
        if (this.isEditing) {
          response = await usuariosService.update(this.editingId, this.usuario);
          
          // Actualizar usuario en la lista
          const index = this.usuarios.findIndex(
            (u) => u.id_usuario === this.editingId
          );
          if (index !== -1) {
            this.usuarios.splice(index, 1, response.data);
          }
          
          this.showNotification('Usuario actualizado correctamente', 'success'); // ✅ AGREGADO: Notificación mejorada
          await Swal.fire({
            title: "¡Actualizado!",
            text: "Usuario actualizado correctamente.",
            icon: "success",
            confirmButtonColor: '#ed1c24',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          response = await usuariosService.create(this.usuario);
          
          // Agregar nuevo usuario a la lista
          this.usuarios.push(response.data);
          
          this.showNotification('Usuario registrado correctamente', 'success'); // ✅ AGREGADO: Notificación mejorada
          await Swal.fire({
            title: "¡Registrado!",
            text: "Usuario registrado correctamente.",
            icon: "success",
            confirmButtonColor: '#ed1c24',
            timer: 2000,
            showConfirmButton: false
          });
        }

        this.filterUsuarios(); // ✅ AGREGADO: Actualizar filtros
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
        this.showNotification('Error al guardar el usuario', 'error'); // ✅ AGREGADO: Notificación mejorada
        await Swal.fire({
          title: "Error",
          text: error.response?.data?.error || "Hubo un problema al guardar el usuario.",
          icon: "error",
          confirmButtonColor: '#ed1c24'
        });
      } finally {
        this.isSaving = false;
      }
    },
    async eliminarUsuario(id_usuario) {
      const result = await Swal.fire({
        title: "¿Eliminar usuario?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#ed1c24',
        cancelButtonColor: '#111111',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        try {
          await usuariosService.delete(id_usuario);

          // Remover usuario de la lista
          this.usuarios = this.usuarios.filter(
            (u) => u.id_usuario !== id_usuario
          );

          this.filterUsuarios(); // ✅ AGREGADO: Actualizar filtros
          this.showNotification('Usuario eliminado correctamente', 'success'); // ✅ AGREGADO: Notificación mejorada
          await Swal.fire({
            title: "¡Eliminado!",
            text: "Usuario eliminado correctamente.",
            icon: "success",
            confirmButtonColor: '#ed1c24',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
          this.showNotification('Error al eliminar el usuario', 'error'); // ✅ AGREGADO: Notificación mejorada
          await Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el usuario.",
            icon: "error",
            confirmButtonColor: '#ed1c24'
          });
        }
      }
    },
    editarUsuario(usuario) {
      this.usuario = { ...usuario };
      this.editingId = usuario.id_usuario;
      this.isEditing = true;
      this.isModalOpen = true;
    },

    // ✅ NUEVOS MÉTODOS AGREGADOS
    // Filtros y búsqueda
    filterUsuarios() {
      let filtered = [...this.usuarios];
      
      // Filtro por búsqueda
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(usuario => 
          usuario.nombres.toLowerCase().includes(term) ||
          usuario.apellidos.toLowerCase().includes(term) ||
          usuario.telefono.includes(term) ||
          usuario.correo_institucional.toLowerCase().includes(term) ||
          usuario.cedula.includes(term) ||
          usuario.carrera.toLowerCase().includes(term) ||
          usuario.id_usuario.toString().includes(term)
        );
      }
      
      // Filtro por carrera
      if (this.selectedCareer) {
        filtered = filtered.filter(usuario => usuario.carrera === this.selectedCareer);
      }
      
      this.filteredUsuarios = filtered;
    },

    clearFilters() {
      this.searchTerm = '';
      this.selectedCareer = '';
      this.filterUsuarios();
    },

    // Estadísticas
    getCareerCount(career) {
      return this.usuarios.filter(u => u.carrera === career).length;
    },

    // Utilidades de presentación
    getCareerIcon(career) {
      const icons = {
        'Desarrollo de Software': 'bx-code-alt',
        'Administración': 'bx-briefcase-alt',
        'Diseño Gráfico y Multimedia': 'bx-palette'
      };
      return icons[career] || 'bx-user';
    },

    getAvatarClass(career) {
      const classes = {
        'Desarrollo de Software': 'avatar-dev',
        'Administración': 'avatar-admin', 
        'Diseño Gráfico y Multimedia': 'avatar-design'
      };
      return classes[career] || 'avatar-default';
    },

    getCareerBadgeClass(career) {
      const classes = {
        'Desarrollo de Software': 'badge-dev',
        'Administración': 'badge-admin',
        'Diseño Gráfico y Multimedia': 'badge-design'
      };
      return classes[career] || 'badge-default';
    },

    getCareerShort(career) {
      const shorts = {
        'Desarrollo de Software': 'Software',
        'Administración': 'Administración',
        'Diseño Gráfico y Multimedia': 'Diseño'
      };
      return shorts[career] || career;
    },

    // Exportación de datos
    exportData() {
      try {
        const exportData = {
          usuarios: this.usuarios,
          estadisticas: {
            total_usuarios: this.usuarios.length,
            por_carrera: {
              'Desarrollo de Software': this.getCareerCount('Desarrollo de Software'),
              'Administración': this.getCareerCount('Administración'),
              'Diseño Gráfico y Multimedia': this.getCareerCount('Diseño Gráfico y Multimedia')
            }
          },
          fecha_exportacion: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `usuarios_${new Date().toISOString().split('T')[0]}.json`;
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

  async created() {
    await this.fetchUsuarios();
    
    // Agregar estilos para animaciones de notificaciones
    if (!document.querySelector('#users-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'users-notification-styles';
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
    usuarios: {
      handler() {
        this.filterUsuarios();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
/* ======================================
   VARIABLES CSS MEJORADAS CON MÁS COLORES
   ====================================== */
:root {
  --institutional-red: #ed1c24;
  --institutional-black: #111111;
  --institutional-white: #ffffff;
  
  /* Nuevos colores modernos */
  --primary-blue: #3b82f6;
  --primary-purple: #8b5cf6;
  --success-green: #10b981;
  --warning-orange: #f59e0b;
  --danger-red: #ef4444;
  --info-cyan: #06b6d4;
  
  /* Colores específicos por carrera */
  --dev-color: #10b981; /* Verde tech */
  --admin-color: #f59e0b; /* Naranja profesional */
  --design-color: #8b5cf6; /* Púrpura creativo */
  
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
  --gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --gradient-info: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  --gradient-purple: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
.usuarios-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  font-family: var(--font-base);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

/* ✅ HEADER SECTION ORIGINAL MEJORADO */
.header-section {
  background: linear-gradient(135deg, var(--card-bg) 0%, #f8fafc 100%);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
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
  box-shadow: var(--shadow-md);
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

/* ✅ NUEVA SECCIÓN: ESTADÍSTICAS COLORIDAS */
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--card-bg);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-floating);
}

.stat-primary::before {
  background: var(--gradient-primary);
}

.stat-success::before {
  background: var(--gradient-success);
}

.stat-warning::before {
  background: var(--gradient-warning);
}

.stat-info::before {
  background: var(--gradient-purple);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: var(--white);
  flex-shrink: 0;
}

.stat-primary .stat-icon {
  background: var(--gradient-primary);
}

.stat-success .stat-icon {
  background: var(--gradient-success);
}

.stat-warning .stat-icon {
  background: var(--gradient-warning);
}

.stat-info .stat-icon {
  background: var(--gradient-purple);
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.stat-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

.stat-trend {
  flex-shrink: 0;
  color: var(--text-light);
  font-size: 1.25rem;
}

/* ✅ BOTONES MODERNOS ORIGINALES MEJORADOS */
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

.btn-export {
  background: var(--gradient-success);
  color: var(--white);
  border: none;
}

.btn-export:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
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

/* ✅ TABLA DE USUARIOS MODERNA ORIGINAL MEJORADA */
.usuarios-grid {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
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

/* ✅ NUEVOS: Controles de búsqueda y filtros mejorados */
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

.career-filter {
  padding: 10px 12px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--institutional-white);
  font-size: var(--font-size-base);
  transition: var(--transition);
  min-width: 180px;
}

.career-filter:focus {
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

.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--institutional-white);
}

/* ✅ ENCABEZADOS DE TABLA ORIGINALES */
.usuarios-table thead {
  background: var(--gradient-primary);
}

.usuarios-table th {
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

.usuarios-table th i {
  margin-right: var(--spacing-xs);
  font-size: 1rem;
}

.th-user { width: 25%; }
.th-contact { width: 25%; }
.th-id { width: 15%; }
.th-career { width: 20%; }
.th-actions { width: 15%; min-width: 180px; }

/* ✅ FILAS DE TABLA ORIGINALES */
.usuarios-table tbody tr {
  transition: var(--transition);
  border-bottom: 1px solid var(--border-color);
}

.usuarios-table tbody tr:hover {
  background: rgba(237, 28, 36, 0.05);
  transform: scale(1.002);
}

.usuarios-table tbody tr:nth-child(even) {
  background: rgba(249, 249, 249, 0.5);
}

.usuarios-table tbody tr:nth-child(even):hover {
  background: rgba(237, 28, 36, 0.05);
}

.usuarios-table td {
  padding: var(--spacing-lg) var(--spacing-md);
  vertical-align: top;
  border: none;
}

/* ✅ CELDAS ESPECÍFICAS ORIGINALES MEJORADAS */
.user-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.avatar-dev {
  background: var(--gradient-success);
}

.avatar-admin {
  background: var(--gradient-warning);
}

.avatar-design {
  background: var(--gradient-purple);
}

.avatar-default {
  background: var(--gradient-primary);
}

.user-details {
  min-width: 0;
  flex: 1;
}

.user-name {
  font-family: var(--font-heading);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  line-height: 1.3;
}

.user-id {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  font-weight: 500;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.contact-item i {
  color: var(--institutional-red);
  font-size: 1rem;
  width: 16px;
  flex-shrink: 0;
}

.contact-item span {
  word-break: break-all;
  line-height: 1.3;
}

.id-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.id-info i {
  color: var(--institutional-red);
  font-size: 1rem;
  width: 16px;
  flex-shrink: 0;
}

/* ✅ NUEVOS: Badges coloridos de carrera */
.career-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.badge-dev {
  background: rgba(16, 185, 129, 0.1);
  color: var(--dev-color);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.badge-admin {
  background: rgba(245, 158, 11, 0.1);
  color: var(--admin-color);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.badge-design {
  background: rgba(139, 92, 246, 0.1);
  color: var(--design-color);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.badge-default {
  background: rgba(107, 114, 128, 0.1);
  color: var(--text-secondary);
  border: 1px solid rgba(107, 114, 128, 0.2);
}

/* ✅ BOTONES DE ACCIÓN HORIZONTALES MEJORADOS */
.action-buttons-horizontal {
  display: flex;
  width: 100%;
  gap: 4px;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
  min-height: 40px;
  box-shadow: var(--shadow-sm);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-action:active {
  transform: translateY(0);
}

.btn-edit-action {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: var(--white);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.btn-edit-action:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-delete-action {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: var(--white);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-delete-action:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-action i {
  font-size: 1rem;
  flex-shrink: 0;
}

.btn-action span {
  font-weight: 600;
  white-space: nowrap;
}

/* ✅ ESTADO VACÍO ORIGINAL */
.empty-state {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  padding: 4rem var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
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
  border: 1px solid var(--border-color);
}

.empty-search-state .empty-icon {
  width: 64px;
  height: 64px;
  background: var(--gradient-warning);
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
  border: 1px solid var(--border-color);
}

.modal-header {
  background: linear-gradient(135deg, var(--institutional-white) 0%, #f8fafc 100%);
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
  box-shadow: var(--shadow-sm);
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
.input-wrapper select {
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

.input-wrapper input:focus,
.input-wrapper select:focus {
  border-color: var(--institutional-red);
  background: var(--institutional-white);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.input-wrapper input:disabled,
.input-wrapper select:disabled {
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
.input-wrapper select:focus + .input-focus-line {
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
  .th-contact,
  .td-contact {
    display: none;
  }
  
  .th-user { width: 35%; }
  .th-id { width: 20%; }
  .th-career { width: 25%; }
  .th-actions { width: 20%; }
  
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .usuarios-container {
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
  .th-id,
  .td-id,
  .th-career,
  .td-career {
    display: none;
  }
  
  .th-user { width: 60%; }
  .th-actions { width: 40%; }
  
  .usuarios-table th,
  .usuarios-table td {
    padding: var(--spacing-md) var(--spacing-sm);
  }
  
  .user-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .action-buttons-horizontal {
    flex-direction: column;
    gap: var(--spacing-xs);
    width: 100%;
  }
  
  .btn-action {
    width: 100%;
    min-width: auto;
    padding: var(--spacing-sm);
    font-size: 0.75rem;
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
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  /* En móviles, mostrar solo usuario y acciones */
  .usuarios-table th,
  .usuarios-table td {
    padding: var(--spacing-sm);
  }
  
  .user-name {
    font-size: var(--font-size-sm);
  }
  
  .user-id {
    font-size: 0.75rem;
  }
  
  .btn-action {
    font-size: 0.75rem;
    padding: var(--spacing-xs) var(--spacing-sm);
    min-height: 36px;
  }
  
  .btn-action span {
    display: none;
  }
  
  .btn-action {
    min-width: 40px;
    width: auto;
  }
  
  .action-buttons-horizontal {
    flex-direction: row;
    justify-content: center;
    gap: 6px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .stat-card {
    padding: var(--spacing-lg);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
  
  .stat-content h3 {
    font-size: 1.5rem;
  }
}

/* ✅ OPTIMIZACIONES DE RENDIMIENTO ORIGINALES */
.table-row,
.btn,
.modal-container,
.stat-card {
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