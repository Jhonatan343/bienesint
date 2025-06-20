<template>
  <div class="login-page">
    <!-- Background Design -->
    <div class="background-container">
      <!-- Left Side - Red Section -->
      <div class="left-section">
        <div class="geometric-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
        </div>
        
        <div class="left-content">
          <div class="logo-brand">
            <div class="logo-circle">
              <img src="@/assets/LogoINT.png" alt="Logo INT" class="brand-logo" />
            </div>
            <h1 class="brand-title">
              <span class="title-main">Instituto Tecnológico</span>
              <span class="title-sub">Nelson Torres</span>
            </h1>
            <p class="brand-description">
              Transformando la educación superior a través de la innovación tecnológica y la excelencia académica.
            </p>
          </div>
          
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <span>Gestión Eficiente</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <span>Seguridad Total</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <span>Acceso Multiplataforma</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - White Login Section -->
      <div class="right-section">
        <div class="login-container">
          <div class="login-card" :class="{ 'shake': showError }">
            <!-- Header -->
            <div class="login-header">
              <div class="header-decoration"></div>
              <h2 class="login-title">Bienvenido de nuevo</h2>
              <p class="login-subtitle">Sistema de Gestión de Bienes</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label for="email" class="form-label">
                  <span class="label-icon">✉️</span>
                  Correo Institucional
                </label>
                <div class="input-group">
                  <div class="input-container">
                    <input
                      type="email"
                      id="email"
                      v-model="loginForm.email"
                      placeholder="usuario@intsuperior.edu.ec"
                      required
                      class="form-input"
                      autocomplete="username"
                    />
                  </div>
                  <div class="input-focus-border"></div>
                </div>
              </div>

              <div class="form-group">
                <label for="cedula" class="form-label">
                  <span class="label-icon">🆔</span>
                  Número de Cédula
                </label>
                <div class="input-group">
                  <div class="input-container">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="cedula"
                      v-model="loginForm.cedula"
                      placeholder="1234567890"
                      maxlength="10"
                      required
                      class="form-input password-input"
                      autocomplete="current-password"
                    />
                    <button 
                      type="button" 
                      class="password-toggle"
                      @click="togglePasswordVisibility"
                      :title="showPassword ? 'Ocultar cédula' : 'Mostrar cédula'"
                    >
                      <svg v-if="showPassword" class="eye-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 1l22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <div class="input-focus-border"></div>
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="submit-button" :disabled="isLoading">
                <span v-if="!isLoading" class="button-content">
                  <span class="button-icon">🔐</span>
                  <span class="button-text">Iniciar Sesión</span>
                </span>
                <span v-if="isLoading" class="loading-content">
                  <div class="loading-spinner"></div>
                  <span>Verificando credenciales...</span>
                </span>
                <div class="button-overlay"></div>
              </button>

              <!-- Error Message -->
              <transition name="error-fade">
                <div v-if="errorMessage" class="error-alert">
                  <div class="error-icon">⚠️</div>
                  <div class="error-content">
                    <strong>Error de autenticación</strong>
                    <p>{{ errorMessage }}</p>
                  </div>
                </div>
              </transition>
            </form>

            <!-- Footer -->
            <div class="login-footer">
              <div class="divider-line"></div>
              <div class="footer-content">
                <span class="copyright">© 2025 Instituto Nelson Torres</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth.js';

export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        email: '',
        cedula: ''
      },
      errorMessage: '',
      isLoading: false,
      showError: false,
      showPassword: false
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      this.showError = false;

      // Validaciones básicas
      if (!this.loginForm.email.trim()) {
        this.showErrorMessage('Por favor ingresa tu correo institucional');
        return;
      }

      if (!this.loginForm.email.includes('@intsuperior.edu.ec')) {
        this.showErrorMessage('Por favor usa tu correo institucional (@intsuperior.edu.ec)');
        return;
      }

      if (!this.loginForm.cedula.trim() || this.loginForm.cedula.length < 10) {
        this.showErrorMessage('Por favor ingresa una cédula válida');
        return;
      }

      const userEmail = this.loginForm.email.trim();
      
      try {
        const response = await authService.login({
          email: userEmail,
          cedula: this.loginForm.cedula.trim()
        });
        
        if (response.success) {
          // Guardar datos de autenticación
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('auth_user', JSON.stringify(response.data.user));

          // Redireccionar según el rol
          const role = response.data.user.role;
          if (role === 'administrator') {
            this.$router.push('/dashboard');
          } else {
            this.$router.push('/mis-bienes');
          }
        } else {
          this.showErrorMessage(response.message || 'Credenciales incorrectas. Verifica tu usuario y cédula.');
        }
      } catch (err) {
        console.error('Error de login:', err);
        this.showErrorMessage('Error de conexión con el servidor. Intenta nuevamente.');
      } finally {
        this.isLoading = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    showErrorMessage(message) {
      this.errorMessage = message;
      this.showError = true;
      
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        this.errorMessage = '';
        this.showError = false;
      }, 5000);
    }
  },

  mounted() {
    // Animaciones de entrada
    this.$nextTick(() => {
      const loginCard = this.$el.querySelector('.login-card');
      const leftContent = this.$el.querySelector('.left-content');
      
      if (loginCard) {
        setTimeout(() => {
          loginCard.classList.add('animate-in');
        }, 200);
      }
      
      if (leftContent) {
        setTimeout(() => {
          leftContent.classList.add('animate-in');
        }, 400);
      }
    });
  }
};
</script>

<style scoped>
/* ===== RESET ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===== MAIN CONTAINER ===== */
.login-page {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  overflow: hidden;
  z-index: 9999;
}

.background-container {
  display: flex;
  width: 100%;
  height: 100%;
}

/* ===== LEFT SECTION (RED) ===== */
.left-section {
  flex: 1;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  overflow: hidden;
}

.geometric-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 60px;
  height: 60px;
  bottom: 10%;
  right: 25%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
    opacity: 1;
  }
}

.left-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 500px;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.left-content.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.logo-brand {
  margin-bottom: 3rem;
}

.logo-circle {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
  }
}

.brand-logo {
  width: 70px;
  height: auto;
  filter: brightness(0) invert(1);
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.title-main {
  display: block;
  font-size: 2.5rem;
}

.title-sub {
  display: block;
  font-size: 2rem;
  opacity: 0.9;
}

.brand-description {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  font-weight: 400;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(10px);
}

.feature-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== RIGHT SECTION (WHITE) ===== */
.right-section {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
}

.login-container {
  width: 100%;
  max-width: 450px;
  position: relative;
}

.login-card {
  background: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(220, 38, 38, 0.05);
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.login-card.shake {
  animation: shake 0.6s ease-in-out;
}

@keyframes shake {
  0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
}

/* ===== HEADER ===== */
.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
}

.header-decoration {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  border-radius: 2px;
  margin: 0 auto 1.5rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.login-subtitle {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

/* ===== FORM ===== */
.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1rem;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  width: 100%;
}

.input-container:hover {
  border-color: #dc2626;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
}

.input-container:focus-within {
  border-color: #dc2626;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.form-input {
  flex: 1;
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.password-input {
  padding-right: 3.5rem !important;
}

.input-focus-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-container:focus-within .input-focus-border {
  width: 100%;
}

/* ===== PASSWORD TOGGLE BUTTON ===== */
.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  background: rgba(220, 38, 38, 0.1);
  transform: translateY(-50%) scale(1.1);
}

.password-toggle:active {
  transform: translateY(-50%) scale(0.95);
}

/* ===== EYE ICONS (SVG) ===== */
.eye-icon {
  width: 24px;
  height: 24px;
  color: #374151; /* Gris oscuro visible en blanco y rojo */
  transition: color 0.3s ease;
}

.password-toggle:hover .eye-icon {
  color: #dc2626; /* Rojo al hacer hover */
  transform: scale(1.05);
  animation: eyeBlink 0.5s ease-in-out;
}

@keyframes eyeBlink {
  0%, 100% { 
    opacity: 1;
    transform: scale(1.05);
  }
  50% { 
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* ===== SUBMIT BUTTON ===== */
.submit-button {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
  margin-bottom: 1.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(220, 38, 38, 0.4);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: none;
}

.button-content,
.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
}

.button-icon {
  font-size: 1.1rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.button-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.submit-button:hover .button-overlay {
  left: 100%;
}

/* ===== ERROR ALERT ===== */
.error-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  font-size: 1.2rem;
  margin-top: 0.1rem;
}

.error-content strong {
  display: block;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.error-content p {
  color: #7f1d1d;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
}

.error-fade-enter-active, .error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from, .error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== FOOTER ===== */
.login-footer {
  margin-top: 2rem;
}

.divider-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin-bottom: 1rem;
}

.footer-content {
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.copyright {
  color: #6b7280;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .background-container {
    flex-direction: column;
  }
  
  .left-section {
    flex: none;
    height: 40vh;
    padding: 2rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .title-main,
  .title-sub {
    font-size: 1.8rem;
  }
  
  .features-list {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .right-section {
    flex: none;
    height: 60vh;
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .left-section {
    height: 35vh;
    padding: 1.5rem;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
  
  .title-main,
  .title-sub {
    font-size: 1.5rem;
  }
  
  .brand-description {
    font-size: 1rem;
  }
  
  .logo-circle {
    width: 80px;
    height: 80px;
  }
  
  .brand-logo {
    width: 50px;
  }
  
  .right-section {
    height: 65vh;
    padding: 1.5rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .left-section {
    padding: 1rem;
  }
  
  .features-list {
    display: none;
  }
  
  .right-section {
    padding: 1rem;
  }
  
  .login-card {
    padding: 1.5rem 1rem;
  }
  
  .form-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* ===== HIGH CONTRAST MODE ===== */
@media (prefers-contrast: high) {
  .input-container {
    border-width: 3px;
  }
  
  .submit-button {
    border: 2px solid #000000;
  }
  
  .error-alert {
    border-width: 2px;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .login-page {
    display: none;
  }
}
</style>