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
      </div>
      <div class="assets-list-container">
        <AssetList />
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
                <h2>Registrar Nuevo Bien</h2>
              </div>
              <button @click="closeModal" class="modal-close">
                <i class="bx bx-x"></i>
              </button>
            </div>
            <div class="modal-body">
              <AssetForm @close="closeModal" />
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
              <CategoriaAsset @close="closeCategoriesModal" />
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
              <PeriodosAcademicos @close="closePeriodsModal" />
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
// Importación de los componentes
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
      isCategoriesModalOpen: false,
      isModalOpen: false,
      isPeriodsModalOpen: false,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    openCategoriesModal() {
      this.isCategoriesModalOpen = true;
    },
    closeCategoriesModal() {
      this.isCategoriesModalOpen = false;
    },
    openPeriodsModal() {
      this.isPeriodsModalOpen = true;
    },
    closePeriodsModal() {
      this.isPeriodsModalOpen = false;
    },
  },
};
</script>

<style scoped>
/* ======================================
   Layout principal
   ====================================== */
.assets-container {
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
  color: var(--white);
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

/* ======================================
   Action Cards Section
   ====================================== */
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

/* ======================================
   Action Cards
   ====================================== */
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

/* ======================================
   Card Content
   ====================================== */
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
  color: var(--white);
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
  color: var(--white);
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow);
}

.secondary-button {
  background: var(--gradient-secondary);
  color: var(--white);
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
  color: var(--white);
  transform: translateY(-1px);
}

.card-button i {
  font-size: 1.25rem;
  transition: var(--transition);
}

.card-button:hover i {
  transform: translateX(4px);
}

/* ======================================
   Assets List Section
   ====================================== */
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
  color: var(--white);
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
  color: var(--white);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  background: var(--institutional-white);
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

/* ======================================
   Responsive Design
   ====================================== */
@media (max-width: 1024px) {
  .action-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
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
}

/* ======================================
   Optimizaciones de rendimiento
   ====================================== */
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