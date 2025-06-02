<template>
  <div class="modern-form">
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <!-- Header Section -->
    <header class="form-header">
      <div class="header-decoration">
        <div class="deco-circle circle-1"></div>
        <div class="deco-circle circle-2"></div>
        <div class="deco-circle circle-3"></div>
      </div>
      <h1 class="form-title">
        <span class="title-gradient">Registro de</span>
        <span class="title-accent">Bien</span>
      </h1>
      <p class="subtitle">Sistema de Gestión de Bienes Institucionales</p>
      <div class="title-underline"></div>
    </header>

    <form @submit.prevent="saveAsset" class="form-container">
      <div class="form-background">
        <div class="form-gradient"></div>
        <div class="form-pattern"></div>
      </div>

      <div class="form-grid">
        <!-- Row 1: Basic Information -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="bx bx-info-circle"></i>
            </div>
            <h3 class="section-title">Información Básica</h3>
          </div>
          
          <div class="section-grid">
            <div class="input-group">
              <label for="clase_de_bien">
                <i class="bx bx-package"></i>
                Nombre del Bien
              </label>
              <div class="input-wrapper">
                <input type="text" id="clase_de_bien" v-model="asset.clase_de_bien" required
                  placeholder="Ej: Equipo de Computación" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="codigo_institucional">
                <i class="bx bx-hash"></i>
                Código Institucional
              </label>
              <div class="input-wrapper">
                <input type="text" id="codigo_institucional" v-model="asset.codigo_institucional" required
                  placeholder="Ej: INST-2024-001" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="codigo_senescyt">
                <i class="bx bx-id-card"></i>
                Código SENESCYT
              </label>
              <div class="input-wrapper">
                <input type="text" id="codigo_senescyt" v-model="asset.codigo_senescyt" 
                  placeholder="Ej: SEN-2024-001" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="codigo_anterior">
                <i class="bx bx-history"></i>
                Código Anterior
              </label>
              <div class="input-wrapper">
                <input type="text" id="codigo_anterior" v-model="asset.codigo_anterior" 
                  placeholder="Ej: ANT-2023-001" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="estado">
                <i class="bx bx-check-circle"></i>
                Estado
              </label>
              <div class="select-wrapper">
                <select id="estado" v-model="asset.estado" required>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="En Reparación">En Reparación</option>
                  <option value="Dado de Baja">Dado de Baja</option>
                </select>
                <div class="select-arrow">
                  <i class="bx bx-chevron-down"></i>
                </div>
                <div class="input-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Technical Details -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="bx bx-cog"></i>
            </div>
            <h3 class="section-title">Detalles Técnicos</h3>
          </div>
          
          <div class="section-grid">
            <div class="input-group">
              <label for="modelo">
                <i class="bx bx-laptop"></i>
                Modelo
              </label>
              <div class="input-wrapper">
                <input type="text" id="modelo" v-model="asset.modelo" placeholder="Ej: ThinkPad X1" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="serie">
                <i class="bx bx-barcode"></i>
                Serie
              </label>
              <div class="input-wrapper">
                <input type="text" id="serie" v-model="asset.serie" placeholder="Ej: XYZ123456" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="marca">
                <i class="bx bx-tag"></i>
                Marca
              </label>
              <div class="input-wrapper">
                <input type="text" id="marca" v-model="asset.marca" placeholder="Ej: Lenovo" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="valor">
                <i class="bx bx-dollar"></i>
                Valor ($)
              </label>
              <div class="input-wrapper">
                <input type="number" id="valor" v-model="asset.valor" step="0.01" required placeholder="0.00" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="categorias">
                <i class="bx bx-category"></i>
                Categoría
              </label>
              <div class="select-wrapper">
                <select id="categorias" v-model="asset.categoria_id" required>
                  <option value="">Seleccione una categoría</option>
                  <option v-for="categoria in categoriasData" :key="categoria.id_categoria" :value="categoria.id_categoria">
                    {{ categoria.nombre_categoria || categoria.nombre }}
                  </option>
                </select>
                <div class="select-arrow">
                  <i class="bx bx-chevron-down"></i>
                </div>
                <div class="input-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 3: Location & Documents -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="bx bx-map"></i>
            </div>
            <h3 class="section-title">Ubicación y Documentos</h3>
          </div>
          
          <div class="section-grid">
            <div class="input-group">
              <label for="ubicacion-area">
                <i class="bx bx-building"></i>
                Área
              </label>
              <div class="select-wrapper">
                <select id="ubicacion-area" v-model="asset.ubicacion.area_id" required>
                  <option value="">Seleccione un área</option>
                  <option v-for="area in areasData" :key="area.id_ubicacion" :value="area.id_ubicacion">
                    {{ area.area || area.nombre_ubicacion }}
                  </option>
                </select>
                <div class="select-arrow">
                  <i class="bx bx-chevron-down"></i>
                </div>
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="numero_aula">
                <i class="bx bx-door-open"></i>
                Número de Aula
              </label>
              <div class="input-wrapper">
                <input type="text" id="numero_aula" v-model="asset.ubicacion.numero_aula" placeholder="Ej: A-101" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="nro_acta_entrega">
                <i class="bx bx-file"></i>
                Nro. Acta Entrega
              </label>
              <div class="input-wrapper">
                <input type="text" id="nro_acta_entrega" v-model="asset.nro_acta_entrega_recepcion"
                  placeholder="Ej: ACT-001-2024" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="nro_acta_constatacion">
                <i class="bx bx-file-check"></i>
                Nro. Acta Constatación
              </label>
              <div class="input-wrapper">
                <input type="text" id="nro_acta_constatacion" v-model="asset.nro_acta_constatacion_fisica"
                  placeholder="Ej: CONS-001-2024" />
                <div class="input-glow"></div>
              </div>
            </div>

            <div class="input-group">
              <label for="periodo_academico_id">
                <i class="bx bx-calendar"></i>
                Período Académico
              </label>
              <div class="select-wrapper">
                <select id="periodo_academico_id" v-model="asset.periodo_academico_id" required>
                  <option value="">Seleccione un período</option>
                  <option v-for="periodo in periodosData" :key="periodo.id_periodo" :value="periodo.id_periodo">
                    {{ periodo.nombre_periodo || periodo.nombre }}
                  </option>
                </select>
                <div class="select-arrow">
                  <i class="bx bx-chevron-down"></i>
                </div>
                <div class="input-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Section -->
        <div class="form-section usuarios-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="bx bx-group"></i>
            </div>
            <h3 class="section-title">Usuarios Asignados</h3>
          </div>

          <!-- Search Container -->
          <div class="search-container">
            <div class="search-wrapper">
              <div class="search-icon">
                <i class="bx bx-search"></i>
              </div>
              <input type="text" v-model="usuarioSearch" @input="searchUsuarios"
                placeholder="Buscar usuario por nombre o cédula..."
                class="search-input" />
              <div v-if="isLoading" class="loading-spinner">
                <div class="spinner-ring"></div>
              </div>
              <div class="search-glow"></div>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="usuarioSearch && filteredUsuarios.length > 0" class="search-results">
            <div v-for="usuario in filteredUsuarios" :key="usuario.id_usuario"
              class="user-item" @click="addUsuario(usuario)">
              <div class="user-info">
                <span class="user-name">{{ usuario.nombres }} {{ usuario.apellidos }}</span>
                <span class="user-cedula">({{ usuario.cedula }})</span>
              </div>
              <button type="button" class="add-user-btn">
                <i class="bx bx-plus"></i>
                Agregar
              </button>
            </div>
          </div>

          <!-- Selected Users -->
          <div class="selected-users" v-if="selectedUsuarios.length > 0">
            <h4 class="selected-title">Usuarios seleccionados:</h4>
            <div class="users-grid">
              <div v-for="usuario in selectedUsuarios" :key="usuario.id_usuario" class="user-tag">
                <div class="user-avatar">
                  <i class="bx bx-user"></i>
                </div>
                <span class="user-tag-name">{{ usuario.nombres }} {{ usuario.apellidos }}</span>
                <button type="button" @click="removeUsuario(usuario)" class="remove-user-btn">
                  <i class="bx bx-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="form-section notes-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="bx bx-note"></i>
            </div>
            <h3 class="section-title">Observaciones</h3>
          </div>
          <div class="input-group">
            <div class="textarea-wrapper">
              <textarea id="observaciones" v-model="asset.observaciones" rows="4"
                placeholder="Ingrese cualquier observación relevante..."></textarea>
              <div class="input-glow"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn btn-secondary">
          <div class="btn-background"></div>
          <i class="bx bx-x"></i>
          <span>Cancelar</span>
          <div class="btn-shine"></div>
        </button>
        <button type="submit" class="btn btn-primary">
          <div class="btn-background"></div>
          <i class="bx bx-save"></i>
          <span>Guardar Bien</span>
          <div class="btn-shine"></div>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asset: {
        clase_de_bien: '',
        codigo_institucional: '',
        codigo_senescyt: '',
        codigo_anterior: '',
        modelo: '',
        serie: '',
        marca: '',
        estado: 'Activo',
        valor: null,
        categoria_id: '',
        ubicacion: {
          sede: 'Sede Principal',
          area_id: '',
          numero_aula: ''
        },
        nro_acta_entrega_recepcion: '',
        nro_acta_constatacion_fisica: '',
        observaciones: '',
        periodo_academico_id: '',
      },
      categoriasData: [],
      areasData: [],
      periodosData: [],
      usuarios: [],
      selectedUsuarios: [],
      usuarioSearch: '',
      isLoading: false
    };
  },
  computed: {
    filteredUsuarios() {
      const search = this.usuarioSearch.toLowerCase();
      return this.usuarios.filter(usuario =>
        usuario.nombres.toLowerCase().includes(search) ||
        usuario.apellidos.toLowerCase().includes(search) ||
        usuario.cedula.includes(search)
      );
    }
  },
  methods: {
    async fetchInitialData() {
      try {
        // Fetch categorías
        const categoriasResponse = await fetch('http://localhost:3000/api/categorias');
        if (!categoriasResponse.ok) throw new Error('Error al obtener categorías');
        const categoriasData = await categoriasResponse.json();
        this.categoriasData = Array.isArray(categoriasData) ? categoriasData : [];
        console.log('Categorías cargadas:', this.categoriasData);

        // Fetch áreas
        const areasResponse = await fetch('http://localhost:3000/api/ubicaciones');
        if (!areasResponse.ok) throw new Error('Error al obtener áreas');
        const areasData = await areasResponse.json();
        this.areasData = Array.isArray(areasData) ? areasData : [];
        console.log('Áreas cargadas:', this.areasData);

        // Fetch períodos académicos
        const periodosResponse = await fetch('http://localhost:3000/api/periodos_academicos');
        if (!periodosResponse.ok) throw new Error('Error al obtener períodos');
        const periodosData = await periodosResponse.json();
        this.periodosData = Array.isArray(periodosData) ? periodosData : [];
        console.log('Períodos cargados:', this.periodosData);

        // Fetch usuarios
        const usuariosResponse = await fetch('http://localhost:3000/api/usuarios');
        if (!usuariosResponse.ok) throw new Error('Error al obtener usuarios');
        const usuariosData = await usuariosResponse.json();
        this.usuarios = Array.isArray(usuariosData) ? usuariosData : [];

      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        alert('Error al cargar los datos del formulario: ' + error.message);
      }
    },
    searchUsuarios() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },
    addUsuario(usuario) {
      if (!this.selectedUsuarios.find(u => u.id_usuario === usuario.id_usuario)) {
        this.selectedUsuarios.push(usuario);
      }
      this.usuarioSearch = '';
    },
    removeUsuario(usuario) {
      this.selectedUsuarios = this.selectedUsuarios.filter(
        u => u.id_usuario !== usuario.id_usuario
      );
    },
    async saveAsset() {
      try {
        const assetData = {
          ...this.asset,
          usuarios: this.selectedUsuarios.map(u => u.id_usuario)
        };

        const response = await fetch('http://localhost:3000/api/bienes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assetData)
        });

        if (response.ok) {
          alert('Bien registrado exitosamente');
          this.resetForm();
        } else {
          const responseData = await response.json();
          throw new Error(responseData.message || 'Error al guardar el bien');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el bien');
      }
    },
    resetForm() {
      this.asset = {
        clase_de_bien: '',
        codigo_institucional: '',
        codigo_senescyt: '',
        codigo_anterior: '',
        modelo: '',
        serie: '',
        marca: '',
        estado: 'Activo',
        valor: null,
        categoria_id: '',
        ubicacion: {
          sede: 'Sede Principal',
          area_id: '',
          numero_aula: ''
        },
        nro_acta_entrega_recepcion: '',
        nro_acta_constatacion_fisica: '',
        observaciones: '',
        periodo_academico_id: '',
      };
      this.selectedUsuarios = [];
      this.usuarioSearch = '';
    }
  },
  created() {
    this.fetchInitialData();
  }
};
</script>

<style scoped>
/* Enhanced Color Palette - LIGHTER VERSION */
:root {
  --primary-red: #FF2D55;
  --secondary-red: #FF6B8A;
  --primary-blue: #007AFF;
  --secondary-blue: #5AC8FA;
  --primary-purple: #AF52DE;
  --secondary-purple: #DA70D6;
  --primary-green: #34C759;
  --secondary-green: #66D4AA;
  --primary-orange: #FF9500;
  --secondary-orange: #FFB84D;
  --primary-pink: #FF2D92;
  
  --gradient-primary: linear-gradient(135deg, var(--primary-red), var(--primary-purple));
  --gradient-secondary: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
  --gradient-success: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
  --gradient-warning: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange));
  
  /* MUCH LIGHTER COLORS */
  --light-bg: #F8FAFC;
  --card-bg: #FFFFFF;
  --surface-bg: #F1F5F9;
  --border-color: #E2E8F0;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --white: #FFFFFF;
  
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-floating: 0 10px 25px rgba(0, 0, 0, 0.15);
  --shadow-glow: 0 0 20px rgba(255, 45, 85, 0.2);
  
  --border-radius: 12px;
  --border-radius-large: 20px;
  --transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Main Container */
.modern-form {
  background: var(--light-bg);
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Animated Background */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 120px;
  height: 120px;
  background: var(--gradient-primary);
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 100px;
  height: 100px;
  background: var(--gradient-secondary);
  top: 70%;
  right: 15%;
  animation-delay: 5s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: var(--gradient-success);
  bottom: 30%;
  left: 60%;
  animation-delay: 10s;
}

.shape-4 {
  width: 90px;
  height: 90px;
  background: var(--gradient-warning);
  top: 40%;
  right: 40%;
  animation-delay: 15s;
}

/* Header Section */
.form-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.header-decoration {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
}

.deco-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  animation: bounce 2s infinite;
}

.circle-1 {
  background: var(--primary-red);
  animation-delay: 0s;
}

.circle-2 {
  background: var(--primary-blue);
  animation-delay: 0.3s;
}

.circle-3 {
  background: var(--primary-green);
  animation-delay: 0.6s;
}

.form-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
  animation: slideInDown 0.8s ease-out;
}

.title-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.title-accent {
  color: var(--text-primary);
  display: block;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.title-underline {
  width: 150px;
  height: 3px;
  background: var(--gradient-secondary);
  margin: 0 auto;
  border-radius: 2px;
  animation: expandWidth 1s ease-out 0.5s forwards;
  transform: scaleX(0);
}

/* Form Container */
.form-container {
  max-width: 1400px;
  margin: 0 auto;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: 3rem;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  animation: slideInUp 0.8s ease-out;
}

.form-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.form-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-red) 0%, transparent 30%, var(--primary-blue) 100%);
  opacity: 0.02;
}

.form-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 40px 40px;
  background-image: radial-gradient(circle, rgba(0, 122, 255, 0.08) 1px, transparent 1px);
  opacity: 0.3;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Form Sections */
.form-section {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  transition: var(--transition);
  animation: slideInLeft 0.6s ease-out;
  opacity: 0;
  animation-fill-mode: forwards;
}

.form-section:nth-child(1) { animation-delay: 0.1s; }
.form-section:nth-child(2) { animation-delay: 0.2s; }
.form-section:nth-child(3) { animation-delay: 0.3s; }
.form-section:nth-child(4) { animation-delay: 0.4s; }
.form-section:nth-child(5) { animation-delay: 0.5s; }

.form-section:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-floating);
  border-color: rgba(0, 122, 255, 0.3);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-icon {
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--white);
  box-shadow: var(--shadow-light);
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Input Groups */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

label i {
  color: var(--primary-blue);
  font-size: 1.1rem;
}

/* Input Wrappers */
.input-wrapper,
.select-wrapper,
.textarea-wrapper {
  position: relative;
}

input,
select,
textarea {
  width: 100%;
  padding: 1rem;
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: var(--transition);
  font-family: inherit;
  position: relative;
  z-index: 1;
}

input::placeholder,
textarea::placeholder {
  color: var(--text-secondary);
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  background: var(--white);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.input-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--border-radius);
  background: var(--gradient-secondary);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

input:focus + .input-glow,
select:focus + .input-glow,
textarea:focus + .input-glow {
  opacity: 0.1;
}

/* Select Styling */
.select-wrapper {
  position: relative;
}

select {
  appearance: none;
  background-image: none;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.2rem;
  pointer-events: none;
  z-index: 2;
  transition: var(--transition);
}

select:focus + .select-arrow {
  color: var(--primary-blue);
}

/* Users Section */
.usuarios-section {
  grid-column: 1 / -1;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-wrapper {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1.2rem;
  z-index: 2;
}

.search-input {
  padding-left: 3rem !important;
}

.loading-spinner {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.spinner-ring {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.search-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--border-radius);
  background: var(--gradient-secondary);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.search-input:focus + .search-glow {
  opacity: 0.1;
}

/* Search Results */
.search-results {
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-card);
  animation: slideInUp 0.3s ease-out;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition);
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background: var(--surface-bg);
  transform: translateX(5px);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.user-cedula {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.add-user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gradient-success);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.add-user-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-light);
}

/* Selected Users */
.selected-users {
  margin-top: 1.5rem;
}

.selected-title {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.users-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.user-tag {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--gradient-secondary);
  color: var(--white);
  padding: 0.8rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideInScale 0.3s ease-out;
}

.user-avatar {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.remove-user-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--white);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: var(--transition);
}

.remove-user-btn:hover {
  background: var(--primary-red);
  transform: scale(1.1);
}

/* Notes Section */
.notes-section {
  grid-column: 1 / -1;
}

textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  margin-top: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  text-decoration: none;
}

.btn-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: var(--transition);
  z-index: -1;
}

.btn:hover .btn-background {
  opacity: 0.2;
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--white);
  box-shadow: var(--shadow-glow);
}

.btn-primary .btn-background {
  background: var(--white);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 25px rgba(255, 45, 85, 0.4);
}

.btn-secondary {
  background: var(--surface-bg);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary .btn-background {
  background: var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--text-secondary);
  transform: translateY(-3px);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.btn:hover .btn-shine {
  left: 100%;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-15px) translateX(8px) rotate(1deg); }
  50% { transform: translateY(0px) translateX(15px) rotate(0deg); }
  75% { transform: translateY(-8px) translateX(8px) rotate(-1deg); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes expandWidth {
  to {
    transform: scaleX(1);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .section-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .form-container {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .modern-form {
    padding: 1rem;
  }
  
  .form-title {
    font-size: 2rem;
  }
  
  .section-grid {
    grid-template-columns: 1fr;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-title {
    font-size: 1.8rem;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .users-grid {
    flex-direction: column;
  }
  
  .user-tag {
    justify-content: space-between;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85); /* más claro y visible */
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #ffffff;
  color: #1e1e1e;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  width: 95%;
  height: 95%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>