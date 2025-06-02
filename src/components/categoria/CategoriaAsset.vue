<template>
  <div class="categoria-container">
    <!-- Título de la página -->
    <h1 class="categoria-title">Gestión de Categorías</h1>

    <!-- Botón para abrir el modal -->
    <div class="button-wrapper">
      <button class="btn btn--primary btn--animated" @click="openModal">
        <i class="bx bx-plus"></i>
        <span>Registrar Nueva Categoría</span>
        <div class="btn-shine"></div>
      </button>
    </div>

    <!-- Modal para agregar / editar -->
    <transition name="fade-scale">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <!-- Botón cerrar -->
          <button class="modal-close" @click="closeModal">
            <i class="bx bx-x"></i>
          </button>

          <!-- Título dinámico -->
          <h2 class="modal-title">
            {{ isEditMode ? 'Editar Categoría' : 'Registrar Categoría' }}
          </h2>

          <!-- Formulario -->
          <form @submit.prevent="saveCategoria" class="form-container">
            <div class="form-group">
              <label for="nombre_categoria">Nombre de la Categoría:</label>
              <input
                type="text"
                id="nombre_categoria"
                v-model="categoria.nombre_categoria"
                placeholder="Ej. Mobiliario"
                class="input-field"
                required
              />
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--secondary" @click="closeModal">
                Cancelar
              </button>
              <button type="submit" class="btn btn--primary">
                {{ isEditMode ? 'Actualizar' : 'Guardar' }} Categoría
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Tabla de categorías -->
    <div v-if="categorias.length" class="categorias-list">
      <h2 class="list-title">Categorías Registradas</h2>
      <table class="categorias-table">
        <thead>
          <tr>
            <th>Nombre de la Categoría</th>
            <th class="actions-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categorias" :key="cat.id_categoria" class="table-row">
            <td class="cat-name">{{ cat.nombre_categoria }}</td>
            <td class="actions-cell">
              <button
                class="btn btn--secondary btn--small btn--animated"
                @click="editCategoria(cat)"
              >
                <i class="bx bx-pencil"></i>
                Editar
                <div class="btn-shine"></div>
              </button>
              <button
                class="btn btn--danger btn--small btn--animated"
                @click="deleteCategoria(cat.id_categoria)"
              >
                <i class="bx bx-trash"></i>
                Eliminar
                <div class="btn-shine"></div>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensaje si no hay categorías -->
    <div v-else class="no-categorias">
      <p>No hay categorías registradas.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'CategoriasView',
  data() {
    return {
      isModalOpen: false,
      isEditMode: false,
      categoria: {
        id_categoria: null,
        nombre_categoria: '',
      },
      categorias: [],
    };
  },
  methods: {
    openModal() {
      this.isEditMode = false;
      this.categoria = { id_categoria: null, nombre_categoria: '' };
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    resetForm() {
      this.categoria = { id_categoria: null, nombre_categoria: '' };
      this.isEditMode = false;
    },
    async saveCategoria() {
      try {
        let response;
        if (this.isEditMode) {
          // Actualizar categoría
          response = await fetch(
            `http://localhost:3000/api/categorias/${this.categoria.id_categoria}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.categoria),
            }
          );
        } else {
          // Crear nueva categoría
          response = await fetch('http://localhost:3000/api/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.categoria),
          });
        }

        if (!response.ok) throw new Error('Error al guardar la categoría');
        const updatedCategoria = await response.json();

        if (this.isEditMode) {
          // Reemplazar en la lista
          const idx = this.categorias.findIndex(
            (c) => c.id_categoria === updatedCategoria.id_categoria
          );
          if (idx !== -1) this.categorias.splice(idx, 1, updatedCategoria);
          Swal.fire('¡Éxito!', 'Categoría actualizada correctamente.', 'success');
        } else {
          this.categorias.push(updatedCategoria);
          Swal.fire('¡Éxito!', 'Categoría registrada correctamente.', 'success');
        }

        this.closeModal();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo guardar la categoría.', 'error');
      }
    },
    editCategoria(cat) {
      this.isEditMode = true;
      this.categoria = { ...cat };
      this.isModalOpen = true;
    },
    async deleteCategoria(id_categoria) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--color-danger)',
        cancelButtonColor: 'var(--color-secondary)',
        confirmButtonText: 'Sí, eliminar',
      });
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `http://localhost:3000/api/categorias/${id_categoria}`,
            { method: 'DELETE' }
          );
          if (!res.ok) throw new Error();
          this.categorias = this.categorias.filter(
            (c) => c.id_categoria !== id_categoria
          );
          Swal.fire('¡Eliminado!', 'La categoría fue eliminada.', 'success');
        } catch {
          Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
        }
      }
    },
    async fetchCategorias() {
      try {
        const res = await fetch('http://localhost:3000/api/categorias');
        if (!res.ok) throw new Error();
        this.categorias = await res.json();
      } catch (e) {
        console.error(e);
        Swal.fire('Error', 'No se pudieron cargar las categorías.', 'error');
      }
    },
  },
  created() {
    this.fetchCategorias();
  },
};
</script>

<style scoped>
/* --------------------------------------- */
/* Variables de tema y paleta de colores   */
/* --------------------------------------- */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-danger: #dc3545;
  --color-light: #f8f9fa;
  --color-surface: #ffffff;
  --color-text: #333333;
  --color-muted: #6c757d;
  --border-radius: 8px;
  --transition: 0.3s ease;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* --------------------------------------- */
/* Contenedor principal                    */
/* --------------------------------------- */
.categoria-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--color-text);
}

/* --------------------------------------- */
/* Título de la vista                     */
/* --------------------------------------- */
.categoria-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
}
.categoria-title::after {
  content: '';
  display: block;
  width: 120px;
  height: 3px;
  background: var(--color-primary);
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

/* --------------------------------------- */
/* Wrapper del botón “Registrar”           */
/* --------------------------------------- */
.button-wrapper {
  text-align: right;
  margin-bottom: 1rem;
}

/* --------------------------------------- */
/* Clases genéricas para botones           */
/* --------------------------------------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  transition: var(--transition);
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
}
.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
.btn--secondary {
  background: var(--color-surface);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}
.btn--secondary:hover {
  background: var(--color-primary);
  color: #fff;
  transform: translateY(-2px);
}
.btn--danger {
  background: var(--color-danger);
  color: #fff;
}
.btn--danger:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.btn--small {
  padding: 0.4rem 0.85rem;
  font-size: 0.875rem;
}
/* Efecto “shine” para botones animados */
.btn--animated .btn-shine {
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
  transition: left 0.6s ease;
}
.btn--animated:hover .btn-shine {
  left: 100%;
}

/* --------------------------------------- */
/* Lista de categorías en forma de tabla   */
/* --------------------------------------- */
.categorias-list {
  margin-top: 1.5rem;
}
.list-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}
.categorias-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}
.categorias-table thead tr {
  background: var(--color-primary);
}
.categorias-table th,
.categorias-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-light);
  color: #fff;
  font-size: 0.95rem;
}
.categorias-table th.actions-header {
  text-align: center;
  width: 180px;
}
.categorias-table tbody tr:nth-child(even) {
  background: var(--color-light);
}
.categorias-table tbody tr:hover {
  background: rgba(0, 123, 255, 0.05);
}
.table-row td {
  color: var(--color-text);
}
.cat-name {
  font-weight: 500;
}
.actions-cell {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

/* --------------------------------------- */
/* Mensaje cuando no hay categorías        */
/* --------------------------------------- */
.no-categorias {
  text-align: center;
  margin-top: 2rem;
  color: var(--color-muted);
  font-size: 1rem;
}

/* --------------------------------------- */
/* Estilos para el Modal                   */
/* --------------------------------------- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 450px;
  padding: 2rem;
  box-shadow: var(--shadow-hover);
  position: relative;
  animation: scaleIn 0.4s ease-out;
}

/* Botón “X” para cerrar el modal */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--color-muted);
  cursor: pointer;
  transition: color var(--transition);
}
.modal-close:hover {
  color: var(--color-danger);
}

/* Título interno del modal */
.modal-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

/* Formulario dentro del modal */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.4rem;
}
.input-field {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius);
  background: var(--color-light);
  color: var(--color-text);
  transition: border-color var(--transition);
}
.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  background: #fff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* --------------------------------------- */
/* Animaciones de aparición                */
/* --------------------------------------- */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* --------------------------------------- */
/* Transiciones del <transition>           */
/* --------------------------------------- */
.fade-scale-enter-active {
  animation: fadeIn 0.2s ease-out, scaleIn 0.2s ease-out;
}
.fade-scale-leave-active {
  transition: opacity 0.2s ease-in;
}
.fade-scale-leave-to {
  opacity: 0;
}

/* --------------------------------------- */
/* Responsividad                           */
/* --------------------------------------- */
@media (max-width: 600px) {
  .categoria-container {
    padding: 1rem;
  }
  .modal-content {
    padding: 1.25rem;
  }
  .modal-title {
    font-size: 1.5rem;
  }
  .input-field {
    font-size: 0.95rem;
  }
  .btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
  .categorias-table th,
  .categorias-table td {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
