<template>
  <div class="user-form-view">
    <!-- Título Principal -->
    <h1 class="form-title">Registro de Usuarios</h1>

    <!-- Tarjeta contenedora del formulario -->
    <div class="card-container">
      <form @submit.prevent="saveUser" class="user-form">
        <div class="form-grid">
          <!-- Nombre de Usuario -->
          <div class="form-group">
            <label for="username" class="form-label">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              v-model="user.username"
              required
              class="input-field"
              placeholder="ej. jdoe123"
            />
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password_hash" class="form-label">Contraseña:</label>
            <input
              type="password"
              id="password_hash"
              v-model="user.password_hash"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <!-- Correo Electrónico -->
          <div class="form-group">
            <label for="email" class="form-label">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              v-model="user.email"
              required
              class="input-field"
              placeholder="usuario@intsuperior.edu.ec"
            />
          </div>

          <!-- Nombre Completo -->
          <div class="form-group">
            <label for="full_name" class="form-label">Nombre Completo:</label>
            <input
              type="text"
              id="full_name"
              v-model="user.full_name"
              required
              class="input-field"
              placeholder="ej. Juan Pérez"
            />
          </div>

          <!-- Rol -->
          <div class="form-group">
            <label for="role" class="form-label">Rol:</label>
            <select
              id="role"
              v-model="user.role"
              required
              class="input-field"
            >
              <option value="" disabled>Seleccione un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Usuario">Usuario</option>
              <option value="Responsable">Responsable</option>
            </select>
          </div>

          <!-- Estado Activo -->
          <div class="form-group">
            <label for="is_active" class="form-label">Estado:</label>
            <select
              id="is_active"
              v-model="user.is_active"
              required
              class="input-field"
            >
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-animated">
            Guardar Usuario
            <div class="btn-shine"></div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserFormView",
  data() {
    return {
      user: {
        username: "",
        password_hash: "",
        email: "",
        full_name: "",
        role: "",
        is_active: "1", // Por defecto activo
      },
    };
  },
  methods: {
    async saveUser() {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
        });
        if (!response.ok) throw new Error("Error al guardar el usuario");
        // Notificación de éxito
        alert("Usuario creado exitosamente");
        this.resetForm();
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al guardar el usuario");
      }
    },
    resetForm() {
      this.user = {
        username: "",
        password_hash: "",
        email: "",
        full_name: "",
        role: "",
        is_active: "1",
      };
    },
  },
};
</script>

<style scoped>
/* ------------------------------------------------------------
   Este componente usa variables definidas en variables.css:
   --institutional-red, --institutional-black, --institutional-white,
   --gradient-primary, --gradient-secondary,
   --dark-bg, --card-bg, --surface-bg, --border-color,
   --text-primary, --text-secondary,
   --shadow-glow, --shadow-card, --shadow-hover,
   --border-radius, --border-radius-large, --transition,
   --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg,
   --font-base, --font-heading, etc.
   ------------------------------------------------------------ */

/* Vista completa de formulario */
.user-form-view {
  background: var(--surface-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-md);
  box-sizing: border-box;
}

/* Título Principal */
.form-title {
  font-family: var(--font-heading, 'Montserrat', sans-serif);
  font-size: 2.4rem;
  font-weight: 900;
  color: var(--institutional-red);
  margin-bottom: var(--spacing-lg);
  position: relative;
  animation: fade-slide-down 0.6s ease-out;
}

.form-title::after {
  content: '';
  display: block;
  width: 140px;
  height: 4px;
  background: var(--gradient-secondary);
  margin: var(--spacing-xs) auto 0;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  animation: expand-underline 0.8s ease-out forwards;
  opacity: 0;
}

/* Tarjeta contenedora */
.card-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 800px;
  animation: fade-in 0.6s ease-out 0.2s forwards;
  opacity: 0;
}

/* Formulario */
.user-form {
  display: flex;
  flex-direction: column;
}

/* Grid de inputs: 2 columnas en desktop, 1 columna en móvil */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: var(--spacing-xs);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Inputs y selects */
.input-field {
  padding: var(--spacing-sm);
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--surface-bg);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: var(--institutional-red);
}

/* Acciones (botón) */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.btn-animated {
  position: relative;
  overflow: hidden;
  gap: var(--spacing-xs);
}

.btn-animated .btn-shine {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.8s ease;
}

.btn-animated:hover .btn-shine {
  left: 100%;
}

/* Clase base para botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
}

/* Botón primario */
.btn-primary {
  background: var(--gradient-primary);
  color: var(--institutional-white);
  box-shadow: var(--shadow-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(237, 28, 36, 0.4);
}

/* ------------------------------------------------------------
   Animaciones y Keyframes
   ------------------------------------------------------------ */
@keyframes expand-underline {
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-slide-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ------------------------------------------------------------
   Responsividad
   ------------------------------------------------------------ */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-title {
    font-size: 2rem;
  }
  .card-container {
    padding: var(--spacing-md);
  }
  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-title {
    font-size: 1.75rem;
  }
  .card-container {
    padding: var(--spacing-sm);
  }
  .btn {
    font-size: 0.9rem;
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
