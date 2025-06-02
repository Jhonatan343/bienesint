// src/services/api.js
import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

console.log('🔧 API Service configurado con URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para requests (debugging)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (debugging y manejo de errores)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🚨 Error de red - El servidor no está disponible');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚨 Conexión rechazada - Verifica que el servidor esté corriendo');
    } else if (error.response) {
      console.error(`🚨 HTTP ${error.response.status}: ${error.response.statusText}`);
    }
    
    return Promise.reject(error);
  }
);

// ⭐ Test de conexión - IMPORTANTE: Esta función debe estar exportada
export const testConnection = async () => {
  try {
    console.log('🔍 Probando conexión con el servidor...');
    const response = await apiClient.get('/dashboard/stats');
    console.log('✅ Conexión exitosa:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return { success: false, error: error.message };
  }
};

// Servicios para bienes
export const bienesService = {
  // Obtener todos los bienes
  getAll: async () => {
    try {
      console.log('📦 Obteniendo todos los bienes...');
      const response = await apiClient.get('/bienes');
      console.log(`✅ ${response.data.length} bienes obtenidos`);
      return response;
    } catch (error) {
      console.error('❌ Error al obtener bienes:', error);
      throw error;
    }
  },
  
  // Obtener bien por ID
  getById: (id) => {
    console.log(`📦 Obteniendo bien con ID: ${id}`);
    return apiClient.get(`/bienes/${id}`);
  },
  
  // Crear nuevo bien
  create: (data) => {
    console.log('📦 Creando nuevo bien:', data);
    return apiClient.post('/bienes', data);
  },
  
  // Actualizar bien
  update: (id, data) => {
    console.log(`📦 Actualizando bien ${id}:`, data);
    return apiClient.put(`/bienes/${id}`, data);
  },
  
  // Eliminar bien
  delete: (id) => {
    console.log(`📦 Eliminando bien ${id}`);
    return apiClient.delete(`/bienes/${id}`);
  },
  
  // Buscar bienes
  search: (params) => {
    console.log('📦 Buscando bienes con parámetros:', params);
    return apiClient.get('/bienes/search', { params });
  },
  
  // Generar QR
  generateQR: (id) => {
    console.log(`📦 Generando QR para bien ${id}`);
    return apiClient.get(`/generateQRCode/${id}`);
  }
};

// Otros servicios
export const categoriasService = {
  getAll: () => apiClient.get('/categorias'),
  create: (data) => apiClient.post('/categorias', data),
  update: (id, data) => apiClient.put(`/categorias/${id}`, data),
  delete: (id) => apiClient.delete(`/categorias/${id}`)
};

export const ubicacionesService = {
  getAll: () => apiClient.get('/ubicaciones'),
  create: (data) => apiClient.post('/ubicaciones', data),
  update: (id, data) => apiClient.put(`/ubicaciones/${id}`, data),
  delete: (id) => apiClient.delete(`/ubicaciones/${id}`)
};

export const usuariosService = {
  getAll: () => apiClient.get('/usuarios'),
  create: (data) => apiClient.post('/usuarios', data),
  update: (id, data) => apiClient.put(`/usuarios/${id}`, data),
  delete: (id) => apiClient.delete(`/usuarios/${id}`)
};

export const periodosService = {
  getAll: () => apiClient.get('/periodos_academicos'),
  create: (data) => apiClient.post('/periodos_academicos', data),
  update: (id, data) => apiClient.put(`/periodos_academicos/${id}`, data),
  delete: (id) => apiClient.delete(`/periodos_academicos/${id}`)
};

export default apiClient;