<template>
  <nav class="navigation-bar">
    <!-- Background Effects -->
    <div class="nav-background">
      <div class="nav-gradient"></div>
      <div class="nav-pattern"></div>
    </div>

    <div class="logo">
      <router-link to="/">
        <div class="logo-container">
          <div class="logo-glow"></div>
          <img :src="logo" alt="Int Bienes" class="logo-image">
        </div>
      </router-link>
    </div>

    <ul>
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/assets">Bienes</router-link></li>
      <li><router-link to="/areas">Áreas</router-link></li>
      <li><router-link to="/users">Usuarios</router-link></li>
      <li><router-link to="/reports">Reportes</router-link></li>
    </ul>
  </nav>
</template>

<script>
import logo from '@/components/image/logoInt.png';

export default {
  name: "NavigationBar",
  data() {
    return {
      logo, // Ruta al logo
    };
  },
};
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
  
  --gradient-primary: linear-gradient(135deg, var(--primary-red), var(--primary-purple));
  --gradient-secondary: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
  --gradient-success: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
  --gradient-warning: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange));
  
  --white: #FFFFFF;
  --black: #252525;
  --light-gray: #F8F9FA;
  --border-light: #E9ECEF;
  
  --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 20px rgba(0, 0, 0, 0.15);
  
  --border-radius: 8px;
  --transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Barra de navegación estática */
.navigation-bar {
  background: var(--white);
  padding: 20px;
  box-shadow: var(--shadow-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
  width: 100%;
  margin: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--border-light);
}

/* Background Effects */
.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.nav-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-red) 0%, transparent 20%, var(--primary-blue) 80%, var(--primary-purple) 100%);
  opacity: 0.03;
}

.nav-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 60px 60px;
  background-image: radial-gradient(circle, rgba(255, 45, 85, 0.05) 1px, transparent 1px);
  opacity: 0.5;
}

/* Logo */
.logo {
  position: relative;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 90px;
  height: 90px;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0;
  transition: var(--transition);
  z-index: -1;
}

.logo-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  transition: var(--transition);
  box-shadow: var(--shadow-light);
}

.logo:hover .logo-image {
  transform: scale(1.05);
  box-shadow: var(--shadow-hover);
}

.logo:hover .logo-glow {
  opacity: 0.2;
  transform: scale(1.1);
}

/* Menú */
.navigation-bar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navigation-bar li {
  display: inline;
  position: relative;
}

.navigation-bar a {
  color: var(--black);
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: transparent;
  border: 2px solid transparent;
}

.navigation-bar a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 45, 85, 0.1), transparent);
  transition: left 0.5s ease;
}

.navigation-bar a:hover::before {
  left: 100%;
}

.navigation-bar a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
  transition: var(--transition);
  transform: translateX(-50%);
}

.navigation-bar a:hover {
  color: var(--white);
  background: var(--gradient-primary);
  border-color: var(--primary-red);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.navigation-bar a:hover::after {
  width: 80%;
}

.navigation-bar a.router-link-active {
  color: var(--white);
  background: var(--gradient-secondary);
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-hover);
}

.navigation-bar a.router-link-active::after {
  width: 80%;
  background: var(--white);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .navigation-bar {
    padding: 15px 20px;
  }
  
  .navigation-bar ul {
    gap: 15px;
  }
  
  .navigation-bar a {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .navigation-bar {
    padding: 15px;
    flex-direction: column;
    gap: 20px;
  }
  
  .navigation-bar ul {
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .navigation-bar a {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .logo-container {
    width: 60px;
    height: 60px;
  }
  
  .logo-image {
    width: 60px;
    height: 60px;
  }
  
  .logo-glow {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .navigation-bar {
    padding: 12px;
  }
  
  .navigation-bar ul {
    gap: 8px;
  }
  
  .navigation-bar a {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .logo-container {
    width: 50px;
    height: 50px;
  }
  
  .logo-image {
    width: 50px;
    height: 50px;
  }
  
  .logo-glow {
    width: 60px;
    height: 60px;
  }
}
</style>