export const authService = {
  async login({ email, cedula }) {
    // Simulación de autenticación
    if (email === 'admin@intsuperior.edu.ec' && cedula === '1234567890') {
      return {
        success: true,
        data: {
          token: 'admin-token',
          user: {
            id: 1,
            name: 'Administrador',
            email: 'admin@intsuperior.edu.ec',
            role: 'administrador',
            cedula: '1234567890'
          }
        }
      };
    } else if (email === 'carlos.rodriguez@intsuperior.edu.ec' && cedula === '1234567890') {
      return {
        success: true,
        data: {
          token: 'user-token',
          user: {
            id: 3,
            name: 'Carlos Alberto Rodriguez Gomez',
            email: 'carlos.rodriguez@intsuperior.edu.ec',
            role: 'administrador',
            cedula: '1234567890'
          }
        }
      };
    } else if (email === 'maria.lopez@intsuperior.edu.ec' && cedula === '0987654321') {
      return {
        success: true,
        data: {
          token: 'user-token',
          user: {
            id: 4,
            name: 'Maria Fernanda Lopez Santos',
            email: 'maria.lopez@intsuperior.edu.ec',
            role: 'custodio',
            cedula: '0987654321'
          }
        }
      };
    } else {
      return { success: false, message: 'Credenciales incorrectas' };
    }
  },
  async sendRecoveryToken(email) {
    // Simula búsqueda en la base de datos y envío de token (cédula)
    const users = [
      { email: 'admin@intsuperior.edu.ec', cedula: '1234567890' },
      { email: 'carlos.rodriguez@intsuperior.edu.ec', cedula: '1234567890' },
      { email: 'maria.lopez@intsuperior.edu.ec', cedula: '0987654321' }
    ];
    const user = users.find(u => u.email === email);
    if (user) {
      // Enviar token (cédula) al correo (simulado)
      return { success: true, message: 'Token enviado a ' + email, token: user.cedula };
    } else {
      return { success: false, message: 'Correo no encontrado en la base de datos.' };
    }
  },
  async resetPassword({ email, newPassword }) {
    // Simula restablecimiento
    // Aquí podrías guardar la nueva contraseña en la base de datos
    return { success: true, message: 'Contraseña restablecida correctamente.' };
  }
};
