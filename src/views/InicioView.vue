<template>
  <div class="dashboard-container">
    <!-- Header Hero Section -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="hero-pattern"></div>
        <div class="floating-elements">
          <div class="float-element element-1"></div>
          <div class="float-element element-2"></div>
          <div class="float-element element-3"></div>
          <div class="float-element element-4"></div>
          <div class="float-element element-5"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <!-- Logo Animado Instituto Nelson Torres -->
        <div class="instituto-logo" data-aos="fade-up" data-aos-delay="100">
          <div class="logo-wrapper">
            <div class="logo-n-container">
              <div class="logo-text-animated">
                <span class="letter letter-i">I</span>
                <span class="letter letter-n">N</span>
                <span class="letter letter-t">T</span>
              </div>
              <div class="logo-pulse"></div>
            </div>
            <div class="logo-text">
              <h1 class="instituto-name">Instituto Nelson Torres</h1>
              <p class="instituto-subtitle">Sistema de Gestión de Bienes</p>
            </div>
          </div>
        </div>

        <!-- Welcome Message -->
        <div class="welcome-message" data-aos="fade-up" data-aos-delay="200">
          <p class="welcome-description">
            Este sistema permite gestionar y visualizar los bienes de manera eficiente, 
            facilitando la gestión de inventarios, ubicaciones y responsables.
          </p>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions" data-aos="fade-up" data-aos-delay="300">
          <div class="action-grid">
            <div v-for="(action, index) in quickActions" :key="index" :class="['action-card', action.class]">
              <div class="action-icon">
                <i :class="action.icon"></i>
              </div>
              <h4>{{ action.title }}</h4>
              <p>{{ action.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- App Promotion Section -->
    <div class="app-section" data-aos="fade-up" data-aos-delay="700">
      <div class="section-header">
        <div class="section-icon">
          <i class="bx bx-mobile-alt"></i>
        </div>
        <h3>Aplicación Móvil</h3>
        <p>Gestiona tus bienes desde cualquier lugar con nuestra aplicación móvil</p>
      </div>

      <div class="app-content">
        <div class="phone-mockup" data-aos="slide-right" data-aos-delay="800">
          <div class="phone-3d">
            <div class="phone-body">
              <div class="phone-frame">
                <div class="phone-screen">
                  <div class="app-header">
                    <div class="app-logo-mini">
                      <span class="mini-i">I</span>
                      <span class="mini-n">N</span>
                      <span class="mini-t">T</span>
                    </div>
                    <div class="app-title">Nelson Torres</div>
                  </div>
                  <div class="app-body">
                    <div class="app-card primary"></div>
                    <div class="app-card secondary"></div>
                    <div class="app-card tertiary"></div>
                    <div class="app-bottom-nav">
                      <div class="nav-item active"></div>
                      <div class="nav-item"></div>
                      <div class="nav-item"></div>
                      <div class="nav-item"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="phone-button"></div>
              <div class="phone-speaker"></div>
            </div>
            <div class="phone-shadow"></div>
          </div>
        </div>

        <div class="app-info" data-aos="slide-left" data-aos-delay="900">
          <div class="platform-badges">
            <div class="platform-badge android">
              <i class="bx bxl-android"></i>
              <span>Android</span>
            </div>
            <div class="platform-badge ios">
              <i class="bx bxl-apple"></i>
              <span>iOS</span>
            </div>
          </div>

          <div class="app-features">
            <div class="feature-highlight">
              <i class="bx bx-wifi-off"></i>
              <span>Modo Offline</span>
            </div>
            <div class="feature-highlight">
              <i class="bx bx-qr-scan"></i>
              <span>Escaneo QR</span>
            </div>
            <div class="feature-highlight">
              <i class="bx bx-sync"></i>
              <span>Sincronización</span>
            </div>
          </div>

          <div class="download-actions">
            <a href="https://drive.google.com/uc?export=download&id=18xeiXHcdR1MMZUuBJRMyixaHOT9cHEBx" 
               class="download-btn primary" download>
              <i class="bx bx-download"></i>
              <span>Descargar Android</span>
              <div class="btn-ripple"></div>
            </a>
            <button class="download-btn secondary">
              <i class="bx bx-time"></i>
              <span>Próximamente iOS</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="features-section">
      <div class="section-title" data-aos="fade-up">
        <h3>Funcionalidades del Sistema</h3>
        <p>Descubre todas las herramientas disponibles para la gestión de bienes</p>
      </div>

      <div class="features-grid">
        <!-- Requerimientos Funcionales -->
        <div class="feature-card functional" data-aos="fade-up" data-aos-delay="100">
          <div class="card-header">
            <div class="card-icon functional-icon">
              <i class="bx bx-cog"></i>
            </div>
            <h4>Requerimientos Funcionales</h4>
          </div>
          <div class="card-body">
            <div class="feature-list">
              <div class="feature-item" v-for="(req, index) in functionalRequirements" :key="index" :data-aos-delay="200 + (index * 50)" data-aos="slide-right">
                <i :class="req.icon" class="feature-icon"></i>
                <span>{{ req.text }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Requerimientos No Funcionales -->
        <div class="feature-card non-functional" data-aos="fade-up" data-aos-delay="200">
          <div class="card-header">
            <div class="card-icon non-functional-icon">
              <i class="bx bx-shield-check"></i>
            </div>
            <h4>Requerimientos No Funcionales</h4>
          </div>
          <div class="card-body">
            <div class="feature-list">
              <div class="feature-item" v-for="(req, index) in nonFunctionalRequirements" :key="index" :data-aos-delay="300 + (index * 50)" data-aos="slide-left">
                <i :class="req.icon" class="feature-icon"></i>
                <span>{{ req.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div class="summary-section" data-aos="fade-up" data-aos-delay="400">
      <div class="summary-header">
        <div class="summary-icon">
          <i class="bx bx-trophy"></i>
        </div>
        <h3>Funcionalidades Críticas</h3>
        <p>Herramientas esenciales para la gestión eficiente de bienes</p>
      </div>

      <div class="summary-grid">
        <div class="summary-card" 
             v-for="(item, index) in summaryItems" 
             :key="index"
             :class="`summary-card-${index + 1}`"
             :data-aos-delay="500 + (index * 100)"
             data-aos="zoom-in">
          <div class="summary-card-icon">
            <i :class="item.icon"></i>
          </div>
          <div class="summary-card-content">
            <h5>{{ item.title }}</h5>
            <p>{{ item.description }}</p>
          </div>
          <div class="summary-card-arrow">
            <i class="bx bx-right-arrow-alt"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Technology Stack -->
    <div class="tech-section" data-aos="fade-up" data-aos-delay="600">
      <div class="tech-header">
        <h3>Tecnologías Utilizadas</h3>
        <p>Stack tecnológico moderno y confiable</p>
      </div>
      
      <div class="tech-grid">
        <div class="tech-item" data-aos="flip-up" data-aos-delay="700">
          <div class="tech-icon vue">
            <i class="bx bxl-vuejs"></i>
          </div>
          <span>Vue.js</span>
        </div>
        <div class="tech-item" data-aos="flip-up" data-aos-delay="750">
          <div class="tech-icon node">
            <i class="bx bxl-nodejs"></i>
          </div>
          <span>Node.js</span>
        </div>
        <div class="tech-item" data-aos="flip-up" data-aos-delay="800">
          <div class="tech-icon mysql">
            <i class="bx bx-data"></i>
          </div>
          <span>MySQL</span>
        </div>
        <div class="tech-item" data-aos="flip-up" data-aos-delay="850">
          <div class="tech-icon android">
            <i class="bx bxl-android"></i>
          </div>
          <span>Android</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InicioView',
  data() {
    return {
      functionalRequirements: [
        { icon: 'bx bx-package', text: 'Gestión de bienes con información detallada' },
        { icon: 'bx bx-qr', text: 'Generación de códigos únicos QR' },
        { icon: 'bx bx-upload', text: 'Subida de fotos asociadas a cada bien' },
        { icon: 'bx bx-map', text: 'Registro de ubicaciones y responsables' },
        { icon: 'bx bx-file', text: 'Generación de reportes en Excel y PDF' },
        { icon: 'bx bx-mobile-alt', text: 'Interacción móvil con escaneo QR' }
      ],
      nonFunctionalRequirements: [
        { icon: 'bx bx-globe', text: 'Plataforma web y app móvil' },
        { icon: 'bx bx-desktop', text: 'Interfaz intuitiva y responsiva' },
        { icon: 'bx bx-data', text: 'Manejo de grandes volúmenes de datos' },
        { icon: 'bx bx-lock', text: 'Control de acceso por roles' },
        { icon: 'bx bx-file-find', text: 'Compatibilidad con reportes Excel/PDF' },
        { icon: 'bx bx-bar-chart-alt-2', text: 'Reportes Automatizados' }
      ],
      summaryItems: [
        {
          icon: 'bx bx-layer',
          title: 'Inventarios Detallados',
          description: 'Clasificación por ubicaciones y categorías'
        },
        {
          icon: 'bx bx-qr',
          title: 'Códigos QR',
          description: 'Generación y escaneo automático'
        },
        {
          icon: 'bx bx-bar-chart-alt-2',
          title: 'Reportes Automatizados',
          description: 'Por áreas y responsables'
        },
        {
          icon: 'bx bx-wifi-off',
          title: 'Modo Offline',
          description: 'Funcionalidad sin conexión móvil'
        }
      ],
      quickActions: [
        { icon: 'bx bx-package', title: 'Gestionar Bienes', description: 'Administra el inventario completo', class: 'card-bienes' },
        { icon: 'bx bx-user', title: 'Usuarios', description: 'Control de acceso y roles', class: 'card-usuarios' },
        { icon: 'bx bx-bar-chart-alt-2', title: 'Reportes', description: 'Análisis y estadísticas', class: 'card-reportes' },
        { icon: 'bx bx-qr', title: 'Códigos QR', description: 'Generación automática', class: 'card-qr' }
      ]
    };
  },
  mounted() {
    // Inicializar AOS (Animate On Scroll)
    this.initAOS();
  },
  methods: {
    initAOS() {
      // Simular inicialización de AOS
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, (index * 100) + 100);
      });
    }
  }
};
</script>

<style scoped>
/* ======================================
   Layout Principal
   ====================================== */
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: var(--font-base);
  overflow-x: hidden;
}

/* ======================================
   Hero Section
   ====================================== */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%);
  padding: 4rem 2rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(17, 17, 17, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(59, 130, 246, 0.04) 0%, transparent 50%);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.float-element {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite linear;
}

.element-1 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  top: 10%;
  left: 80%;
  animation-delay: 0s;
}

.element-2 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1f2937, #111827);
  top: 70%;
  left: 10%;
  animation-delay: 7s;
}

.element-3 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  top: 40%;
  right: 5%;
  animation-delay: 14s;
}

.element-4 {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #10b981, #059669);
  top: 20%;
  left: 20%;
  animation-delay: 10s;
}

.element-5 {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  top: 80%;
  right: 30%;
  animation-delay: 17s;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

/* ======================================
   Logo Instituto Nelson Torres con INT
   ====================================== */
.instituto-logo {
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out 0.2s forwards;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 2rem 3rem;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.logo-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ef4444, #3b82f6, #10b981, #f59e0b);
}

.logo-n-container {
  position: relative;
  width: 100px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text-animated {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 900;
  position: relative;
  z-index: 3;
  display: flex;
  gap: 2px;
}

.letter {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: letterBounce 2s ease-in-out infinite;
  display: inline-block;
}

.letter-i {
  animation-delay: 0s;
}

.letter-n {
  animation-delay: 0.2s;
}

.letter-t {
  animation-delay: 0.4s;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 60px;
  border: 3px solid;
  border-image: linear-gradient(135deg, #ef4444, #3b82f6) 1;
  border-radius: 12px;
  opacity: 0.4;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  text-align: left;
}

.instituto-name {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937, #111827);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.2;
}

.instituto-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

/* ======================================
   Welcome Message
   ====================================== */
.welcome-message {
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out 0.4s forwards;
}

.welcome-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #64748b;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

/* ======================================
   Quick Actions
   ====================================== */
.quick-actions {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out 0.6s forwards;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.action-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.action-card:hover::before {
  opacity: 1;
}

.card-bienes::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.card-usuarios::before {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.card-reportes::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.card-qr::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
}

.card-bienes .action-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.card-usuarios .action-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.card-reportes .action-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.card-qr .action-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.action-card h4 {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.action-card p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* ======================================
   App Section
   ====================================== */
.app-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  margin: 0 2rem 4rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

.app-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ef4444, #3b82f6, #10b981);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin: 0 auto var(--spacing-lg);
  animation: bounce 2s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.section-header h3 {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937, #111827);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.section-header p {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.app-content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

/* ======================================
   Phone Mockup 3D Mejorado
   ====================================== */
.phone-mockup {
  position: relative;
  width: 280px;
  height: 400px;
  perspective: 1000px;
}

.phone-3d {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: phoneFloat 4s ease-in-out infinite;
}

.phone-body {
  position: relative;
  width: 200px;
  height: 360px;
  margin: 0 auto;
  background: linear-gradient(145deg, #1f2937, #111827);
  border-radius: 30px;
  padding: 8px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  transform: rotateY(-5deg) rotateX(5deg);
  position: relative;
  z-index: 2;
}

.phone-frame {
  width: 100%;
  height: 320px;
  background: #000;
  border-radius: 25px;
  padding: 2px;
  position: relative;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 23px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.phone-button {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(145deg, #374151, #1f2937);
  border-radius: 50%;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3);
}

.phone-speaker {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 6px;
  background: linear-gradient(145deg, #374151, #1f2937);
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
}

.phone-shadow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 30px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}

.app-header {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-logo-mini {
  width: 28px;
  height: 20px;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.5rem;
  gap: 1px;
}

.mini-i, .mini-n, .mini-t {
  color: #ef4444;
  font-family: var(--font-heading);
  animation: miniLetterPulse 3s ease-in-out infinite;
}

.mini-i { animation-delay: 0s; }
.mini-n { animation-delay: 0.3s; }
.mini-t { animation-delay: 0.6s; }

.app-title {
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.app-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.app-card {
  height: 35px;
  border-radius: 8px;
  animation: shimmer 2s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.app-card.primary {
  background: linear-gradient(90deg, #fee2e2 25%, rgba(239, 68, 68, 0.1) 50%, #fee2e2 75%);
  background-size: 200% 100%;
}

.app-card.secondary {
  height: 50px;
  background: linear-gradient(90deg, #dbeafe 25%, rgba(59, 130, 246, 0.1) 50%, #dbeafe 75%);
  background-size: 200% 100%;
}

.app-card.tertiary {
  background: linear-gradient(90deg, #d1fae5 25%, rgba(16, 185, 129, 0.1) 50%, #d1fae5 75%);
  background-size: 200% 100%;
}

.app-bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem;
  margin-top: auto;
  border-top: 1px solid #e2e8f0;
}

.nav-item {
  width: 20px;
  height: 3px;
  background: #cbd5e1;
  border-radius: 2px;
}

.nav-item.active {
  background: #ef4444;
}

/* ======================================
   App Info Mejorado
   ====================================== */
.platform-badges {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.platform-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.platform-badge:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.platform-badge.android i {
  color: #10b981;
  font-size: 1.5rem;
}

.platform-badge.ios i {
  color: #1f2937;
  font-size: 1.5rem;
}

.platform-badge span {
  font-weight: 600;
  color: #1f2937;
}

.app-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.feature-highlight {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: #f1f5f9;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.feature-highlight i {
  color: #3b82f6;
  font-size: 1.2rem;
}

.feature-highlight span {
  color: #1f2937;
  font-weight: 500;
  font-size: 0.9rem;
}

.download-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.download-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-size: var(--font-size-base);
}

.download-btn.primary {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
}

.download-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(239, 68, 68, 0.4);
}

.download-btn.secondary {
  background: white;
  color: #1f2937;
  border: 2px solid #e2e8f0;
}

.download-btn.secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

.btn-ripple {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: ripple 2s infinite;
}

/* ======================================
   Features Section Modernizada
   ====================================== */
.features-section {
  padding: 0 2rem 4rem;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title h3 {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937, #111827);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.section-title p {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: var(--spacing-xl);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card.functional::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.feature-card.non-functional::before {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.functional-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.non-functional-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.card-header h4 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInLeft 0.6s ease-out forwards;
  border-left: 3px solid transparent;
}

.feature-item:nth-child(1) { animation-delay: 0.1s; }
.feature-item:nth-child(2) { animation-delay: 0.2s; }
.feature-item:nth-child(3) { animation-delay: 0.3s; }
.feature-item:nth-child(4) { animation-delay: 0.4s; }
.feature-item:nth-child(5) { animation-delay: 0.5s; }
.feature-item:nth-child(6) { animation-delay: 0.6s; }

.feature-item:hover {
  background: white;
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.functional .feature-item:hover {
  border-left-color: #ef4444;
}

.non-functional .feature-item:hover {
  border-left-color: #3b82f6;
}

.feature-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.functional-bullet {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.non-functional-bullet {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.feature-item span {
  color: #374151;
  line-height: 1.6;
  font-size: var(--font-size-base);
}

/* ======================================
   Summary Section Modernizada
   ====================================== */
.summary-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  margin: 0 2rem 4rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

.summary-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #10b981, #8b5cf6);
}

.summary-header {
  text-align: center;
  margin-bottom: 3rem;
}

.summary-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin: 0 auto var(--spacing-lg);
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
}

.summary-header h3 {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937, #111827);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.summary-header p {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1000px;
  margin: 0 auto;
}

.summary-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: var(--spacing-lg);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.95);
  animation: zoomIn 0.6s ease-out forwards;
}

.summary-card:nth-child(1) { animation-delay: 0.1s; }
.summary-card:nth-child(2) { animation-delay: 0.2s; }
.summary-card:nth-child(3) { animation-delay: 0.3s; }
.summary-card:nth-child(4) { animation-delay: 0.4s; }

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.summary-card:hover::before {
  opacity: 1;
}

.summary-card-1::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.summary-card-2::before {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.summary-card-3::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.summary-card-4::before {
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
}

.summary-card-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.summary-card-1 .summary-card-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.summary-card-2 .summary-card-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.summary-card-3 .summary-card-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.summary-card-4 .summary-card-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.summary-card-content h5 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 var(--spacing-sm) 0;
}

.summary-card-content p {
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  font-size: var(--font-size-sm);
}

.summary-card-arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-size: 1.25rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.summary-card-1:hover .summary-card-arrow {
  opacity: 1;
  color: #ef4444;
  transform: translateX(5px);
}

.summary-card-2:hover .summary-card-arrow {
  opacity: 1;
  color: #3b82f6;
  transform: translateX(5px);
}

.summary-card-3:hover .summary-card-arrow {
  opacity: 1;
  color: #10b981;
  transform: translateX(5px);
}

.summary-card-4:hover .summary-card-arrow {
  opacity: 1;
  color: #8b5cf6;
  transform: translateX(5px);
}

/* ======================================
   Technology Section (Nueva)
   ====================================== */
.tech-section {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  margin: 0 2rem 4rem;
  position: relative;
  overflow: hidden;
}

.tech-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ef4444);
}

.tech-header {
  text-align: center;
  margin-bottom: 3rem;
}

.tech-header h3 {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-sm);
}

.tech-header p {
  font-size: 1.1rem;
  color: #9ca3af;
  max-width: 600px;
  margin: 0 auto;
}

.tech-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  opacity: 0;
  transform: rotateY(90deg);
  animation: flipUp 0.6s ease-out forwards;
}

.tech-item:nth-child(1) { animation-delay: 0.1s; }
.tech-item:nth-child(2) { animation-delay: 0.2s; }
.tech-item:nth-child(3) { animation-delay: 0.3s; }
.tech-item:nth-child(4) { animation-delay: 0.4s; }

.tech-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.tech-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.tech-icon.vue {
  background: linear-gradient(135deg, #4fc08d, #42b883);
}

.tech-icon.node {
  background: linear-gradient(135deg, #68a063, #5d9658);
}

.tech-icon.mysql {
  background: linear-gradient(135deg, #00758f, #005f73);
}

.tech-icon.android {
  background: linear-gradient(135deg, #3ddc84, #32d74b);
}

.tech-item span {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

/* ======================================
   Animaciones Mejoradas
   ====================================== */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoomIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes flipUp {
  to {
    opacity: 1;
    transform: rotateY(0deg);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(2deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-1deg); }
}

@keyframes letterBounce {
  0%, 100% { 
    transform: translateY(0px);
    filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5));
  }
  50% { 
    transform: translateY(-8px);
    filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.8));
  }
}

@keyframes miniLetterPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes phoneFloat {
  0%, 100% { 
    transform: rotateY(-5deg) rotateX(5deg) translateY(0px);
  }
  50% { 
    transform: rotateY(-5deg) rotateX(5deg) translateY(-10px);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes ripple {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ======================================
   Clases AOS (Animate On Scroll)
   ====================================== */
[data-aos] {
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

[data-aos].aos-animate {
  opacity: 1;
}

[data-aos="fade-up"] {
  transform: translateY(30px);
}

[data-aos="fade-up"].aos-animate {
  transform: translateY(0);
}

[data-aos="slide-right"] {
  transform: translateX(-30px);
}

[data-aos="slide-right"].aos-animate {
  transform: translateX(0);
}

[data-aos="slide-left"] {
  transform: translateX(30px);
}

[data-aos="slide-left"].aos-animate {
  transform: translateX(0);
}

[data-aos="zoom-in"] {
  transform: scale(0.9);
}

[data-aos="zoom-in"].aos-animate {
  transform: scale(1);
}

[data-aos="flip-up"] {
  transform: rotateY(90deg);
}

[data-aos="flip-up"].aos-animate {
  transform: rotateY(0deg);
}

/* ======================================
   Responsive Design Mejorado
   ====================================== */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .app-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .action-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }
  
  .logo-wrapper {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
    padding: var(--spacing-xl);
  }
  
  .instituto-name {
    font-size: 2rem;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .phone-mockup {
    width: 220px;
    height: 320px;
  }
  
  .phone-body {
    width: 160px;
    height: 280px;
  }
  
  .action-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .tech-grid {
    gap: 1rem;
  }
  
  .tech-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .instituto-name {
    font-size: 1.5rem;
  }
  
  .logo-text-animated {
    font-size: 1.5rem;
  }
  
  .logo-n-container {
    width: 80px;
    height: 60px;
  }
  
  .feature-card {
    padding: var(--spacing-lg);
  }
  
  .summary-card {
    text-align: center;
  }
  
  .app-section, .summary-section, .tech-section {
    margin: 0 1rem 2rem;
    padding: 2rem 1rem;
  }
  
  .action-card {
    padding: 1rem;
  }
}

/* Forzar visibilidad y tamaño de los iconos Boxicons */
.bx, .bxl, .bxs {
  font-family: 'boxicons' !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
  font-size: 1.5em;
  color: inherit;
}

/* Ajuste para los iconos en tarjetas y listas */
.feature-icon, .summary-card-icon i, .action-icon i, .platform-badge i, .feature-highlight i, .tech-icon i {
  font-size: 1.5em !important;
  color: inherit !important;
  display: inline-block;
}
</style>