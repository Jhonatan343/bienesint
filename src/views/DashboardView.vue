<template>
  <div class="dashboard-view">
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="dashboard-content">
      
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-container">
          <div class="institute-badge">
            <div class="badge-glow"></div>
            <div class="logo-container">
              <span class="logo-n">N</span>
              <div class="logo-rings">
                <div class="ring ring-1"></div>
                <div class="ring ring-2"></div>
              </div>
            </div>
            <div class="institute-info">
              <h1 class="institute-name">Instituto Nelson Torres</h1>
              <p class="institute-subtitle">Sistema de Gestión de Bienes</p>
            </div>
          </div>
          
          <h2 class="welcome-title">
            <span class="title-gradient">Bienvenido al</span>
            <span class="title-accent">Dashboard</span>
          </h2>
          
          <p class="welcome-description">
            Este sistema permite gestionar y visualizar los bienes de manera eficiente, 
            facilitando la gestión de inventarios, ubicaciones, y responsables. ¡Sigue leyendo para más detalles!
          </p>
        </div>
      </section>

      <!-- App Promotion Section -->
      <section class="app-promotion">
        <div class="app-background">
          <div class="app-pattern"></div>
        </div>
        <div class="app-content">
          <div class="app-visual">
            <div class="phone-mockup">
              <div class="phone-screen">
                <div class="app-interface">
                  <div class="interface-header"></div>
                  <div class="interface-content">
                    <div class="content-bar"></div>
                    <div class="content-bar"></div>
                    <div class="content-circle"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="floating-icons">
              <div class="float-icon icon-1"><i class="bx bxl-android"></i></div>
              <div class="float-icon icon-2"><i class="bx bxl-apple"></i></div>
            </div>
          </div>
          
          <div class="app-info">
            <div class="section-badge badge-mobile">
              <i class="bx bx-mobile-alt"></i>
              <span>Descarga nuestra App</span>
              <div class="badge-shine"></div>
            </div>
            <h3 class="app-title">Aplicación Móvil</h3>
            <p class="app-description">
              Gestiona tus bienes desde cualquier lugar con nuestra aplicación móvil. 
              Disponible en Android y iOS.
            </p>
            
            <div class="platforms-showcase">
              <div class="platform-item android">
                <i class="bx bxl-android"></i>
                <div class="platform-info">
                  <span class="platform-name">Android</span>
                </div>
              </div>
              <div class="platform-item ios">
                <i class="bx bxl-apple"></i>
                <div class="platform-info">
                  <span class="platform-name">iOS</span>
                </div>
              </div>
            </div>
            
            <div class="download-buttons">
              <a href="https://drive.google.com/uc?export=download&id=18xeiXHcdR1MMZUuBJRMyixaHOT9cHEBx" 
                 class="btn btn-download-primary" download>
                <i class="bx bx-download"></i>
                <span>Descargar para Android</span>
                <div class="btn-shine"></div>
              </a>
              <button class="btn btn-download-secondary">
                <i class="bx bx-download"></i>
                <span>Descargar para iOS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Requirements Sections -->
      <div class="requirements-grid">
        
        <!-- Functional Requirements -->
        <section class="requirements-card functional">
          <div class="card-background">
            <div class="bg-pattern"></div>
          </div>
          <div class="card-header">
            <div class="header-icon">
              <i class="bx bx-cog"></i>
            </div>
            <h3 class="card-title">Requerimientos Funcionales</h3>
          </div>
          <div class="card-content">
            <ul class="requirements-list">
              <li class="requirement-item" v-for="(req, index) in functionalRequirements" 
                  :key="index" 
                  :style="{ animationDelay: `${index * 0.1}s` }">
                <div class="req-bullet"></div>
                <span>{{ req }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Non-Functional Requirements -->
        <section class="requirements-card non-functional">
          <div class="card-background">
            <div class="bg-pattern"></div>
          </div>
          <div class="card-header">
            <div class="header-icon">
              <i class="bx bx-shield-check"></i>
            </div>
            <h3 class="card-title">Requerimientos No Funcionales</h3>
          </div>
          <div class="card-content">
            <ul class="requirements-list">
              <li class="requirement-item" v-for="(req, index) in nonFunctionalRequirements" 
                  :key="index" 
                  :style="{ animationDelay: `${index * 0.1}s` }">
                <div class="req-bullet"></div>
                <span>{{ req }}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <!-- Summary Section -->
      <section class="summary-section">
        <div class="summary-background">
          <div class="summary-pattern"></div>
        </div>
        <div class="summary-content">
          <div class="summary-header">
            <div class="header-icon">
              <i class="bx bx-chart-line"></i>
            </div>
            <h3 class="summary-title">Resumen de Funcionalidades Críticas</h3>
          </div>
          <div class="summary-grid">
            <div class="summary-item" v-for="(item, index) in summaryItems" 
                 :key="index" 
                 :style="{ animationDelay: `${index * 0.15}s` }">
              <div class="summary-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="summary-text">
                <span>{{ item.text }}</span>
              </div>
              <div class="summary-arrow">
                <i class="bx bx-right-arrow-alt"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      functionalRequirements: [
        'Gestión de bienes con información detallada: nombre, custodio, ubicación, etc.',
        'Generación de códigos únicos para los bienes, preferiblemente QR.',
        'Subida de fotos asociadas a cada bien.',
        'Registro de ubicaciones y responsables, con posibilidad de generar reportes segmentados.',
        'Generación de reportes en Excel y PDF.',
        'Interacción móvil y web con escaneo de códigos QR.'
      ],
      nonFunctionalRequirements: [
        'Accesibilidad: Plataforma web y app móvil.',
        'Usabilidad: Interfaz intuitiva.',
        'Rendimiento: Manejo de grandes volúmenes de datos.',
        'Seguridad: Control de acceso por roles.',
        'Compatibilidad: Generación de reportes en Excel/PDF.'
      ],
      summaryItems: [
        {
          icon: 'bx bx-layer',
          text: 'Inventarios detallados y clasificación por ubicaciones.'
        },
        {
          icon: 'bx bx-qr',
          text: 'Generación y escaneo de códigos QR.'
        },
        {
          icon: 'bx bx-analysis',
          text: 'Reportes automatizados por áreas y responsables.'
        },
        {
          icon: 'bx bx-wifi-off',
          text: 'Interacción sin conexión en la app móvil.'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Enhanced Color Palette */
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
  --gradient-hero: linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 50%, var(--primary-red) 100%);
  
  --dark-bg: #0D1117;
  --card-bg: #161B22;
  --surface-bg: #21262D;
  --border-color: #30363D;
  --text-primary: #F0F6FC;
  --text-secondary: #8B949E;
  --white: #FFFFFF;
  
  --shadow-glow: 0 0 20px rgba(255, 45, 85, 0.3);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-floating: 0 20px 40px rgba(0, 0, 0, 0.15);
  
  --border-radius: 16px;
  --border-radius-large: 24px;
  --transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Compatible with existing App.vue structure */
.dashboard-view {
  position: relative;
  background: var(--dark-bg);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

/* Animated Background - positioned relative to dashboard only */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 100px;
  height: 100px;
  background: var(--gradient-primary);
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: var(--gradient-secondary);
  top: 60%;
  right: 20%;
  animation-delay: 5s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: var(--gradient-success);
  bottom: 30%;
  left: 30%;
  animation-delay: 10s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  background: var(--gradient-warning);
  top: 10%;
  right: 10%;
  animation-delay: 15s;
}

.shape-5 {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, var(--primary-pink), var(--secondary-purple));
  bottom: 10%;
  right: 40%;
  animation-delay: 7s;
}

/* Main Content Container */
.dashboard-content {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  background: transparent;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 5rem;
}

.welcome-container {
  text-align: center;
}

.institute-badge {
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-large);
  padding: 2rem 3rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
}

.badge-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, var(--primary-red), transparent);
  animation: rotate 4s linear infinite;
  opacity: 0.3;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-n {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--white);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 3;
}

.logo-rings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  opacity: 0.6;
  animation: pulse 3s ease-in-out infinite;
}

.ring-1 {
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  border-color: var(--primary-red);
  animation-delay: 0s;
}

.ring-2 {
  width: 80px;
  height: 80px;
  top: 0;
  left: 0;
  border-color: var(--primary-blue);
  animation-delay: 1.5s;
}

.institute-name {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(45deg, var(--white), var(--secondary-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.institute-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.title-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.title-accent {
  color: var(--white);
  display: block;
}

.welcome-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

/* App Promotion Section */
.app-promotion {
  margin-bottom: 5rem;
  position: relative;
}

.app-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.app-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-blue) 0%, transparent 70%);
  opacity: 0.1;
}

.app-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: center;
  padding: 3rem;
}

.app-visual {
  position: relative;
  width: 250px;
  height: 350px;
}

.phone-mockup {
  width: 180px;
  height: 320px;
  background: linear-gradient(145deg, #2C2C2C, #1A1A1A);
  border-radius: 25px;
  padding: 15px;
  box-shadow: var(--shadow-floating);
  position: relative;
  z-index: 2;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: var(--dark-bg);
  border-radius: 18px;
  overflow: hidden;
  position: relative;
}

.app-interface {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.interface-header {
  height: 30px;
  background: var(--gradient-primary);
  border-radius: 6px;
  margin-bottom: 15px;
}

.interface-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-bar {
  height: 12px;
  background: var(--surface-bg);
  border-radius: 6px;
}

.content-bar:nth-child(1) {
  width: 80%;
}

.content-bar:nth-child(2) {
  width: 60%;
}

.content-circle {
  width: 60px;
  height: 60px;
  background: var(--gradient-secondary);
  border-radius: 50%;
  margin: 15px auto;
}

.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.float-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  background: var(--gradient-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.2rem;
  animation: floatIcon 6s ease-in-out infinite;
}

.icon-1 {
  top: 10%;
  right: 10%;
  animation-delay: 0s;
  background: var(--gradient-success);
}

.icon-2 {
  bottom: 30%;
  left: 10%;
  animation-delay: 3s;
  background: var(--gradient-warning);
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--gradient-primary);
  color: var(--white);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.badge-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

.app-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 1.2rem;
  background: linear-gradient(45deg, var(--white), var(--secondary-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.platforms-showcase {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.platform-item:hover {
  border-color: var(--primary-blue);
  transform: translateY(-3px);
}

.platform-item.android i {
  color: var(--primary-green);
  font-size: 1.8rem;
}

.platform-item.ios i {
  color: var(--text-secondary);
  font-size: 1.8rem;
}

.platform-name {
  font-weight: 600;
  color: var(--white);
}

.download-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  border: none;
  font-size: 0.95rem;
}

.btn-download-primary {
  background: var(--gradient-primary);
  color: var(--white);
  box-shadow: var(--shadow-glow);
}

.btn-download-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 40px rgba(255, 45, 85, 0.6);
}

.btn-download-secondary {
  background: var(--surface-bg);
  color: var(--white);
  border: 2px solid var(--border-color);
}

.btn-download-secondary:hover {
  border-color: var(--primary-blue);
  transform: translateY(-3px);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2s infinite;
}

/* Requirements Grid */
.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2.5rem;
  margin-bottom: 5rem;
}

.requirements-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}

.requirements-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-floating);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  transition: opacity 0.3s ease;
}

.requirements-card:hover .card-background {
  opacity: 0.1;
}

.bg-pattern {
  width: 100%;
  height: 100%;
  background-size: 25px 25px;
  background-image: radial-gradient(circle, var(--white) 1px, transparent 1px);
}

.functional .card-background {
  background: var(--gradient-primary);
}

.non-functional .card-background {
  background: var(--gradient-secondary);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--white);
}

.functional .header-icon {
  background: var(--gradient-primary);
}

.non-functional .header-icon {
  background: var(--gradient-secondary);
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--white);
}

.requirements-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.2rem;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
  animation: slideInLeft 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(-30px);
}

.requirement-item:hover {
  border-color: var(--primary-red);
  transform: translateX(8px);
}

.req-bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.4rem;
}

.functional .req-bullet {
  background: var(--gradient-primary);
}

.non-functional .req-bullet {
  background: var(--gradient-secondary);
}

.requirement-item span {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 1rem;
}

/* Summary Section */
.summary-section {
  position: relative;
}

.summary-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.summary-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-purple) 0%, transparent 70%);
  opacity: 0.1;
}

.summary-content {
  position: relative;
  z-index: 2;
  padding: 3rem;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  justify-content: center;
}

.summary-header .header-icon {
  width: 70px;
  height: 70px;
  background: var(--gradient-warning);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--white);
}

.summary-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--white);
  background: linear-gradient(45deg, var(--white), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.8rem;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
  animation: scaleIn 0.7s ease-out forwards;
  opacity: 0;
  transform: scale(0.95);
}

.summary-item:hover {
  border-color: var(--primary-orange);
  transform: scale(1.02);
  box-shadow: var(--shadow-card);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--white);
  flex-shrink: 0;
}

.summary-item:nth-child(1) .summary-icon {
  background: var(--gradient-primary);
}

.summary-item:nth-child(2) .summary-icon {
  background: var(--gradient-secondary);
}

.summary-item:nth-child(3) .summary-icon {
  background: var(--gradient-success);
}

.summary-item:nth-child(4) .summary-icon {
  background: var(--gradient-warning);
}

.summary-text {
  flex: 1;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
}

.summary-arrow {
  color: var(--primary-orange);
  font-size: 1.3rem;
  opacity: 0.7;
  transition: var(--transition);
}

.summary-item:hover .summary-arrow {
  opacity: 1;
  transform: translateX(6px);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-20px) translateX(10px) rotate(2deg); }
  50% { transform: translateY(0px) translateX(20px) rotate(0deg); }
  75% { transform: translateY(-10px) translateX(10px) rotate(-1deg); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0px); }
  33% { transform: translateY(-15px); }
  66% { transform: translateY(5px); }
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .app-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
  
  .requirements-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 2rem 1.5rem;
  }
  
  .welcome-title {
    font-size: 2.5rem;
  }
  
  .institute-badge {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
  }
  
  .app-content,
  .summary-content {
    padding: 2rem;
  }
  
  .requirements-card {
    padding: 2rem;
  }
  
  .download-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .platforms-showcase {
    justify-content: center;
  }
  
  .requirements-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .summary-title {
    font-size: 1.6rem;
  }
  
  .phone-mockup {
    width: 140px;
    height: 250px;
  }
  
  .floating-icons {
    display: none;
  }
  
  .summary-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .dashboard-content {
    padding: 1.5rem 1rem;
  }
  
  .institute-badge {
    padding: 1.5rem;
  }
}
</style>