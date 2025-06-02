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
        <button @click="openModal" class="btn btn-primary btn-modern">
          <div class="btn-content">
            <i class="bx bx-user-plus"></i>
            <span>Nuevo Usuario</span>
          </div>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando usuarios...</p>
    </div>

    <!-- Lista de Usuarios con Cards -->
    <div v-else-if="usuarios.length" class="usuarios-grid">
      <div class="section-header">
        <h2>
          <i class="bx bx-list-ul"></i>
          Usuarios Registrados
        </h2>
        <div class="stats-badge">
          {{ usuarios.length }} {{ usuarios.length === 1 ? 'usuario' : 'usuarios' }}
        </div>
      </div>
      
      <div class="cards-container">
        <transition-group name="card-list" tag="div" class="cards-grid">
          <div
            v-for="usuario in usuarios"
            :key="usuario.id_usuario"
            class="usuario-card"
          >
            <div class="card-header">
              <div class="user-avatar">
                <i class="bx bx-user"></i>
              </div>
              <div class="user-info">
                <h3>{{ usuario.nombres }} {{ usuario.apellidos }}</h3>
                <p class="user-id">ID: {{ usuario.id_usuario }}</p>
              </div>
              <div class="card-actions">
                <button
                  @click="editarUsuario(usuario)"
                  class="btn-action btn-edit"
                  title="Editar usuario"
                >
                  <i class="bx bx-pencil"></i>
                </button>
                <button
                  @click="eliminarUsuario(usuario.id_usuario)"
                  class="btn-action btn-delete"
                  title="Eliminar usuario"
                >
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">
                    <i class="bx bx-phone"></i>
                    Teléfono
                  </div>
                  <div class="info-value">{{ usuario.telefono }}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">
                    <i class="bx bx-envelope"></i>
                    Correo
                  </div>
                  <div class="info-value">{{ usuario.correo_institucional }}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">
                    <i class="bx bx-id-card"></i>
                    Cédula
                  </div>
                  <div class="info-value">{{ usuario.cedula }}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">
                    <i class="bx bx-book"></i>
                    Carrera
                  </div>
                  <div class="info-value">{{ usuario.carrera }}</div>
                </div>
              </div>
            </div>
            
            <div class="card-overlay"></div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Estado vacío mejorado -->
    <div v-else class="empty-state">
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
                    <input
                      type="text"
                      id="carrera"
                      v-model="usuario.carrera"
                      placeholder="Ej. Ingeniería de Software"
                      required
                      :disabled="isSaving"
                    />
                    <div class="input-focus-line"></div>
                  </div>
                </div>
              </div>

              <div class="modal-actions">
                <button 
                  type="button" 
                  @click="closeModal" 
                  class="btn btn-ghost"
                  :disabled="isSaving"
                >
                  Cancelar
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
  name: "UsersView",
  data() {
    return {
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
    };
  },
  methods: {
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
        const response = await fetch("http://localhost:3000/api/usuarios");
        if (!response.ok) throw new Error('Error al cargar usuarios');
        const data = await response.json();
        this.usuarios = data;
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        Swal.fire({
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
        let url = "http://localhost:3000/api/usuarios";
        let method = "POST";

        if (this.isEditing) {
          url += `/${this.editingId}`;
          method = "PUT";
        }

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.usuario),
        });

        if (!response.ok) throw new Error("Error al guardar el usuario");
        const data = await response.json();

        if (this.isEditing) {
          const index = this.usuarios.findIndex(
            (u) => u.id_usuario === this.editingId
          );
          if (index !== -1) this.usuarios.splice(index, 1, data);
          Swal.fire({
            title: "¡Actualizado!",
            text: "Usuario actualizado correctamente.",
            icon: "success",
            confirmButtonColor: '#ed1c24'
          });
        } else {
          this.usuarios.push(data);
          Swal.fire({
            title: "¡Registrado!",
            text: "Usuario registrado correctamente.",
            icon: "success",
            confirmButtonColor: '#ed1c24'
          });
        }

        this.closeModal();
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar el usuario.",
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
          const response = await fetch(
            `http://localhost:3000/api/usuarios/${id_usuario}`,
            { method: "DELETE" }
          );

          if (!response.ok) throw new Error('Error al eliminar');

          this.usuarios = this.usuarios.filter(
            (u) => u.id_usuario !== id_usuario
          );

          Swal.fire({
            title: "¡Eliminado!",
            text: "Usuario eliminado correctamente.",
            icon: "success",
            confirmButtonColor: '#ed1c24'
          });
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
          Swal.fire({
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
  },
  created() {
    this.fetchUsuarios();
  },
};
</script>

<style scoped>
/* ======================================
   Layout principal
   ====================================== */
.usuarios-container {
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

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--border-color);
  border-color: var(--text-secondary);
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
   Grid de Usuarios
   ====================================== */
.usuarios-grid {
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

.cards-container {
  position: relative;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-xl);
}

/* ======================================
   Cards de Usuarios
   ====================================== */
.usuario-card {
  position: relative;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
}

.usuario-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-floating);
  border-color: var(--institutional-red);
}

.usuario-card:hover .card-overlay {
  opacity: 1;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(237, 28, 36, 0.05) 0%, rgba(179, 15, 27, 0.05) 100%);
  opacity: 0;
  transition: var(--transition);
  pointer-events: none;
}

.card-header {
  background: var(--surface-bg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
}

.user-avatar {
  width: 56px;
  height: 56px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-info h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-id {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  margin: 0;
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-edit {
  background: var(--success-gradient);
  color: var(--white);
}

.btn-edit:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-glow);
}

.btn-delete {
  background: var(--warning-gradient);
  color: var(--white);
}

.btn-delete:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}

.card-body {
  padding: var(--spacing-lg);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-label i {
  color: var(--institutional-red);
}

.info-value {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  word-break: break-all;
  line-height: 1.4;
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

.input-wrapper input {
  width: 100%;
  padding: var(--spacing-md) 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  background: var(--institutional-white);
  color: var(--text-primary);
  transition: var(--transition);
  outline: none;
}

.input-wrapper input:focus {
  border-color: var(--institutional-red);
  background: var(--institutional-white);
  box-shadow: 0 0 0 3px rgba(237, 28, 36, 0.1);
}

.input-wrapper input:disabled {
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

.input-wrapper input:focus + .input-focus-line {
  transform: scaleX(1);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
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

.card-list-enter-active,
.card-list-leave-active {
  transition: var(--transition);
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.card-list-move {
  transition: transform 0.5s ease;
}

/* ======================================
   Responsive Design
   ====================================== */
@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
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
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .user-info h3 {
    white-space: normal;
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

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .card-actions {
    justify-content: center;
  }
}

/* ======================================
   Optimizaciones de rendimiento
   ====================================== */
.usuario-card,
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