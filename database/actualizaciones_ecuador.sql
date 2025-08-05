-- Actualizaciones para configurar sistema para Ecuador
-- Agregar campo teléfono a usuarios
ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(15) DEFAULT NULL AFTER email;

-- Crear tabla de departamentos/carreras
CREATE TABLE IF NOT EXISTS departamentos (
  id_departamento INT PRIMARY KEY AUTO_INCREMENT,
  nombre_departamento VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar las carreras específicas de Ecuador
INSERT INTO departamentos (nombre_departamento, descripcion) VALUES
('Diseño Gráfico y Multimedia', 'Carrera de Diseño Gráfico y Multimedia'),
('Administración', 'Carrera de Administración'),
('Desarrollo de Software', 'Carrera de Desarrollo de Software');

-- Agregar campo departamento_id a usuarios
ALTER TABLE usuarios ADD COLUMN departamento_id INT DEFAULT NULL AFTER cedula;
ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_departamento 
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id_departamento);

-- Agregar campo QR a bienes
ALTER TABLE bienes ADD COLUMN codigo_qr VARCHAR(255) DEFAULT NULL AFTER codigo_senescyt;

-- Crear índice para búsquedas por QR
CREATE INDEX idx_bienes_qr ON bienes(codigo_qr);

-- Actualizar zona horaria por defecto (Ecuador UTC-5)
-- Esto se debe configurar en el servidor MySQL/aplicación
-- SET time_zone = '-05:00';