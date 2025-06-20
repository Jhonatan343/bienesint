// services/auth.js
// Servicio de autenticación para el sistema de gestión de bienes

// Base de datos simulada de usuarios
const USERS_DB = [
  // Administrador Principal (Credenciales Reales)
  {
    id: 1,
    email: 'jhonatan.bano@intsuperior.edu.ec',
    cedula: '1728163484',
    role: 'administrator',
    name: 'Jhonatan Baño',
    department: 'Sistemas',
    status: 'active'
  },
  // Administradores de prueba
  {
    id: 2,
    email: 'admin@intsuperior.edu.ec',
    cedula: '1234567890',
    role: 'administrator',
    name: 'Administrador de Prueba',
    department: 'Sistemas',
    status: 'active'
  },
  
  // Empleados/Docentes
  {
    id: 3,
    email: 'docente1@intsuperior.edu.ec',
    cedula: '1122334455',
    role: 'employee',
    name: 'Prof. María González',
    department: 'Ingeniería',
    status: 'active'
  },
  {
    id: 4,
    email: 'docente2@intsuperior.edu.ec',
    cedula: '2233445566',
    role: 'employee',
    name: 'Dr. Carlos Pérez',
    department: 'Ciencias',
    status: 'active'
  },
  {
    id: 5,
    email: 'secretaria@intsuperior.edu.ec',
    cedula: '3344556677',
    role: 'employee',
    name: 'Ana Rodríguez',
    department: 'Administración',
    status: 'active'
  },
  {
    id: 6,
    email: 'mantenimiento@intsuperior.edu.ec',
    cedula: '4455667788',
    role: 'employee',
    name: 'José Martínez',
    department: 'Mantenimiento',
    status: 'active'
  }
];

// Simulación de delay de red
const simulateNetworkDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Función para generar token JWT simulado
const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  }));
  const signature = btoa(`${header}.${payload}.signature`);
  
  return `${header}.${payload}.${signature}`;
};

// Función para validar formato de cédula ecuatoriana
const validateCedula = (cedula) => {
  if (!cedula || cedula.length !== 10) return false;
  
  // Algoritmo de validación de cédula ecuatoriana básico
  const digits = cedula.split('').map(Number);
  const region = parseInt(cedula.substring(0, 2));
  
  // Validar región (01-24)
  if (region < 1 || region > 24) return false;
  
  // Algoritmo módulo 10 para los primeros 9 dígitos
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = digits[i];
    if (i % 2 === 0) { // Posiciones pares (0, 2, 4, 6, 8)
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  const expectedDigit = (10 - (sum % 10)) % 10;
  return expectedDigit === digits[9];
};

// Validar formato de email institucional
const validateInstitutionalEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@intsuperior\.edu\.ec$/;
  return emailRegex.test(email);
};

// Servicio de autenticación
export const authService = {
  // Método de login
  async login(credentials) {
    console.log('🔐 Intentando login con:', { 
      email: credentials.email, 
      cedula: credentials.cedula?.substring(0, 3) + '****' 
    });

    try {
      // Simular delay de red
      await simulateNetworkDelay(800);

      // Validaciones de entrada
      if (!credentials.email || !credentials.cedula) {
        return {
          success: false,
          message: 'Email y cédula son requeridos'
        };
      }

      // Validar formato de email institucional
      if (!validateInstitutionalEmail(credentials.email)) {
        return {
          success: false,
          message: 'Debe usar su correo institucional (@intsuperior.edu.ec)'
        };
      }

      // Validar formato de cédula
      if (!validateCedula(credentials.cedula)) {
        return {
          success: false,
          message: 'Formato de cédula inválido'
        };
      }

      // Buscar usuario en la base de datos
      const user = USERS_DB.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.cedula === credentials.cedula &&
        u.status === 'active'
      );

      if (!user) {
        console.log('❌ Usuario no encontrado o credenciales incorrectas');
        return {
          success: false,
          message: 'Credenciales incorrectas. Verifique su email y cédula.'
        };
      }

      // Generar token de autenticación
      const token = generateToken(user);

      // Datos del usuario sin información sensible
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        status: user.status
      };

      console.log('✅ Login exitoso para:', user.name);

      return {
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          user: userResponse
        }
      };

    } catch (error) {
      console.error('💥 Error en el servicio de autenticación:', error);
      return {
        success: false,
        message: 'Error interno del servidor. Intente nuevamente.'
      };
    }
  },

  // Método para validar token
  async validateToken(token) {
    try {
      if (!token) return { valid: false };

      // Decodificar payload del token
      const parts = token.split('.');
      if (parts.length !== 3) return { valid: false };

      const payload = JSON.parse(atob(parts[1]));
      
      // Verificar expiración
      if (payload.exp < Date.now()) {
        return { valid: false, message: 'Token expirado' };
      }

      // Buscar usuario
      const user = USERS_DB.find(u => u.id === payload.id);
      if (!user || user.status !== 'active') {
        return { valid: false, message: 'Usuario inválido' };
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department
        }
      };

    } catch (error) {
      console.error('Error validando token:', error);
      return { valid: false };
    }
  },

  // Método de logout
  async logout() {
    try {
      // Limpiar datos locales
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      console.log('🚪 Logout exitoso');
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false };
    }
  },

  // Obtener usuario actual desde localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('auth_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  // Verificar si está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Verificar rol de administrador
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'administrator';
  },

  // Obtener todos los usuarios (solo para admins)
  async getUsers() {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'administrator') {
      return { success: false, message: 'No autorizado' };
    }

    await simulateNetworkDelay(300);

    return {
      success: true,
      data: USERS_DB.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        status: user.status
      }))
    };
  }
};

// Función auxiliar para debug
export const getTestCredentials = () => {
  return {
    adminReal: {
      email: 'jhonatan.bano@intsuperior.edu.ec',
      cedula: '1728163484'
    },
    admin: {
      email: 'admin@intsuperior.edu.ec',
      cedula: '1234567890'
    },
    employee: {
      email: 'docente1@intsuperior.edu.ec',
      cedula: '1122334455'
    }
  };
};

// Para desarrollo: mostrar credenciales en consola
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Credenciales de prueba disponibles:');
  console.table([
    { Rol: 'Admin Real', Email: 'jhonatan.bano@intsuperior.edu.ec', Cédula: '1728163484' },
    { Rol: 'Admin Prueba', Email: 'admin@intsuperior.edu.ec', Cédula: '1234567890' },
    { Rol: 'Empleado', Email: 'docente1@intsuperior.edu.ec', Cédula: '1122334455' },
    { Rol: 'Empleado', Email: 'docente2@intsuperior.edu.ec', Cédula: '2233445566' }
  ]);
}

export default authService;