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

          <div class="download-actions">
            <a href="https://drive.google.com/uc?export=download&id=18xeiXHcdR1MMZUuBJRMyixaHOT9cHEBx" 
               class="download-btn primary" download>
              <i class="bx bx-download"></i>
              <span>Descargar Android</span>
              <div class="btn-ripple"></div>
            </a>
            <button class="download-btn secondary">
              <i class="bx bx-download"></i>
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
            <div class="card-icon">
              <i class="bx bx-cog"></i>
            </div>
            <h4>Requerimientos Funcionales</h4>
          </div>
          <div class="card-body">
            <div class="feature-list">
              <div class="feature-item" v-for="(req, index) in functionalRequirements" 
                   :key="index" 
                   :data-aos-delay="200 + (index * 50)"
                   data-aos="slide-right">
                <div class="feature-bullet"></div>
                <span>{{ req }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Requerimientos No Funcionales -->
        <div class="feature-card non-functional" data-aos="fade-up" data-aos-delay="200">
          <div class="card-header">
            <div class="card-icon secondary">
              <i class="bx bx-shield-check"></i>
            </div>
            <h4>Requerimientos No Funcionales</h4>
          </div>
          <div class="card-body">
            <div class="feature-list">
              <div class="feature-item" v-for="(req, index) in nonFunctionalRequirements" 
                   :key="index"
                   :data-aos-delay="300 + (index * 50)"
                   data-aos="slide-left">
                <div class="feature-bullet secondary"></div>
                <span>{{ req }}</span>
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
          <i class="bx bx-chart-line"></i>
        </div>
        <h3>Funcionalidades Críticas</h3>
        <p>Herramientas esenciales para la gestión eficiente de bienes</p>
      </div>

      <div class="summary-grid">
        <div class="summary-card" 
             v-for="(item, index) in summaryItems" 
             :key="index"
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
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      functionalRequirements: [
        'Gestión de bienes con información detallada',
        'Generación de códigos únicos QR',
        'Subida de fotos asociadas a cada bien',
        'Registro de ubicaciones y responsables',
        'Generación de reportes en Excel y PDF',
        'Interacción móvil con escaneo QR'
      ],
      nonFunctionalRequirements: [
        'Plataforma web y app móvil',
        'Interfaz intuitiva y responsiva',
        'Manejo de grandes volúmenes de datos',
        'Control de acceso por roles',
        'Compatibilidad con reportes Excel/PDF'
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
          icon: 'bx bx-chart-bar',
          title: 'Reportes Automatizados',
          description: 'Por áreas y responsables'
        },
        {
          icon: 'bx bx-wifi-off',
          title: 'Modo Offline',
          description: 'Funcionalidad sin conexión móvil'
        }
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
  background: var(--institutional-white);
  font-family: var(--font-base);
  overflow-x: hidden;
}

/* ======================================
   Hero Section
   ====================================== */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, var(--institutional-white) 0%, #f8f9fa 100%);
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
    radial-gradient(circle at 25% 25%, rgba(237, 28, 36, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(17, 17, 17, 0.03) 0%, transparent 50%);
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
  background: var(--institutional-red);
  top: 10%;
  left: 80%;
  animation-delay: 0s;
}

.element-2 {
  width: 60px;
  height: 60px;
  background: var(--institutional-black);
  top: 70%;
  left: 10%;
  animation-delay: 7s;
}

.element-3 {
  width: 80px;
  height: 80px;
  background: var(--institutional-red);
  top: 40%;
  right: 5%;
  animation-delay: 14s;
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
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out 0.2s forwards;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  background: var(--institutional-white);
  padding: 2rem 3rem;
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
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
  background: var(--gradient-primary);
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
  color: var(--institutional-red);
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
  border: 3px solid var(--institutional-red);
  border-radius: var(--border-radius);
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
  color: var(--institutional-black);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.2;
}

.instituto-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

/* ======================================
   Welcome Message
   ====================================== */
.welcome-message {
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out 0.4s forwards;
}

.welcome-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

/* ======================================
   App Section
   ====================================== */
.app-section {
  background: var(--institutional-white);
  border-radius: var(--border-radius-large);
  padding: 3rem 2rem;
  margin: 0 2rem 4rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
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
  background: var(--gradient-primary);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--institutional-white);
  font-size: 2rem;
  margin: 0 auto var(--spacing-lg);
  animation: bounce 2s ease-in-out infinite;
}

.section-header h3 {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--institutional-black);
  margin-bottom: var(--spacing-sm);
}

.section-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
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
   Phone Mockup 3D
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
  background: linear-gradient(145deg, #2c2c2c, #1a1a1a);
  border-radius: 30px;
  padding: 8px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
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
  background: var(--institutional-white);
  border-radius: 23px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

.phone-button {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(145deg, #333, #111);
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
  background: linear-gradient(145deg, #333, #111);
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
  background: var(--gradient-primary);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-logo-mini {
  width: 28px;
  height: 20px;
  background: var(--institutional-white);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.5rem;
  gap: 1px;
}

.mini-i, .mini-n, .mini-t {
  color: var(--institutional-red);
  font-family: var(--font-heading);
  animation: miniLetterPulse 3s ease-in-out infinite;
}

.mini-i { animation-delay: 0s; }
.mini-n { animation-delay: 0.3s; }
.mini-t { animation-delay: 0.6s; }

.app-title {
  color: var(--institutional-white);
  font-weight: 600;
  font-size: 0.8rem;
}

.app-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.app-card {
  height: 35px;
  border-radius: 8px;
  animation: shimmer 2s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.app-card.primary {
  background: linear-gradient(90deg, #f5f5f5 25%, rgba(237, 28, 36, 0.1) 50%, #f5f5f5 75%);
  background-size: 200% 100%;
}

.app-card.secondary {
  height: 50px;
  background: linear-gradient(90deg, #f5f5f5 25%, rgba(17, 17, 17, 0.1) 50%, #f5f5f5 75%);
  background-size: 200% 100%;
}

.app-card.tertiary {
  background: linear-gradient(90deg, #f5f5f5 25%, rgba(16, 185, 129, 0.1) 50%, #f5f5f5 75%);
  background-size: 200% 100%;
}

/* ======================================
   App Info
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
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--institutional-white);
  transition: var(--transition);
}

.platform-badge:hover {
  border-color: var(--institutional-red);
  transform: translateY(-2px);
}

.platform-badge.android i {
  color: #34c759;
  font-size: 1.5rem;
}

.platform-badge.ios i {
  color: var(--institutional-black);
  font-size: 1.5rem;
}

.platform-badge span {
  font-weight: 600;
  color: var(--institutional-black);
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
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  font-size: var(--font-size-base);
}

.download-btn.primary {
  background: var(--gradient-primary);
  color: var(--institutional-white);
  box-shadow: var(--shadow-glow);
}

.download-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 30px rgba(237, 28, 36, 0.4);
}

.download-btn.secondary {
  background: var(--institutional-white);
  color: var(--institutional-black);
  border: 2px solid var(--border-color);
}

.download-btn.secondary:hover {
  border-color: var(--institutional-red);
  color: var(--institutional-red);
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
   Features Section
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
  color: var(--institutional-black);
  margin-bottom: var(--spacing-sm);
}

.section-title p {
  font-size: 1.1rem;
  color: var(--text-secondary);
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
  background: var(--institutional-white);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-xl);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-floating);
}

.feature-card.functional:hover {
  border-color: var(--institutional-red);
}

.feature-card.non-functional:hover {
  border-color: var(--institutional-black);
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
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--institutional-white);
  font-size: 1.5rem;
}

.card-icon.secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.card-header h4 {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--institutional-black);
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
  background: #f8f9fa;
  border-radius: var(--border-radius);
  transition: var(--transition);
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInLeft 0.6s ease-out forwards;
}

.feature-item:nth-child(1) { animation-delay: 0.1s; }
.feature-item:nth-child(2) { animation-delay: 0.2s; }
.feature-item:nth-child(3) { animation-delay: 0.3s; }
.feature-item:nth-child(4) { animation-delay: 0.4s; }
.feature-item:nth-child(5) { animation-delay: 0.5s; }
.feature-item:nth-child(6) { animation-delay: 0.6s; }

.feature-item:hover {
  background: rgba(237, 28, 36, 0.05);
  transform: translateX(5px);
}

.feature-bullet {
  width: 8px;
  height: 8px;
  background: var(--institutional-red);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.feature-bullet.secondary {
  background: var(--institutional-black);
}

.feature-item span {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: var(--font-size-base);
}

/* ======================================
   Summary Section
   ====================================== */
.summary-section {
  background: var(--institutional-white);
  border-radius: var(--border-radius-large);
  padding: 3rem 2rem;
  margin: 0 2rem 4rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-color);
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
  background: var(--gradient-primary);
}

.summary-header {
  text-align: center;
  margin-bottom: 3rem;
}

.summary-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--institutional-white);
  font-size: 2rem;
  margin: 0 auto var(--spacing-lg);
  animation: pulse 2s ease-in-out infinite;
}

.summary-header h3 {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--institutional-black);
  margin-bottom: var(--spacing-sm);
}

.summary-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
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
  background: #f8f9fa;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: var(--spacing-lg);
  transition: var(--transition);
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

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-floating);
  border-color: var(--institutional-red);
  background: var(--institutional-white);
}

.summary-card-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--institutional-white);
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
}

.summary-card:nth-child(1) .summary-card-icon {
  background: var(--institutional-red);
}

.summary-card:nth-child(2) .summary-card-icon {
  background: #6b7280;
}

.summary-card:nth-child(3) .summary-card-icon {
  background: #10b981;
}

.summary-card:nth-child(4) .summary-card-icon {
  background: #f59e0b;
}

.summary-card-content h5 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--institutional-black);
  margin: 0 0 var(--spacing-sm) 0;
}

.summary-card-content p {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  font-size: var(--font-size-sm);
}

.summary-card-arrow {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  color: var(--institutional-red);
  font-size: 1.25rem;
  opacity: 0;
  transition: var(--transition);
}

.summary-card:hover .summary-card-arrow {
  opacity: 1;
  transform: translateX(5px);
}

/* ======================================
   Animaciones
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

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(2deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-1deg); }
}

@keyframes letterBounce {
  0%, 100% { 
    transform: translateY(0px);
    text-shadow: 0 0 5px var(--institutional-red);
  }
  50% { 
    transform: translateY(-8px);
    text-shadow: 0 0 15px var(--institutional-red), 0 0 25px var(--institutional-red);
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

/* ======================================
   Responsive Design
   ====================================== */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .app-content {
    grid-template-columns: 1fr;
    text-align: center;
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
}
</style>