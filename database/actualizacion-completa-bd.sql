-- ==================================================
-- SCRIPT COMPLETO DE ACTUALIZACIÓN PARA ECUADOR
-- Sistema de Gestión de Bienes Institucionales
-- ==================================================

-- 1. AGREGAR CAMPO TELEFONO A USUARIOS
ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(15) DEFAULT NULL AFTER email;

-- 2. AGREGAR CAMPO DEPARTAMENTO_ID A USUARIOS
ALTER TABLE usuarios ADD COLUMN departamento_id INT DEFAULT NULL AFTER cedula;

-- 3. CREAR TABLA DE DEPARTAMENTOS/CARRERAS
CREATE TABLE IF NOT EXISTS departamentos (
  id_departamento INT PRIMARY KEY AUTO_INCREMENT,
  nombre_departamento VARCHAR(100) NOT NULL UNIQUE,
  codigo_departamento VARCHAR(10) NOT NULL UNIQUE,
  descripcion TEXT,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. INSERTAR DEPARTAMENTOS/CARRERAS ESPECÍFICAS DE ECUADOR
INSERT INTO departamentos (nombre_departamento, codigo_departamento, descripcion) VALUES
('Diseño Gráfico y Multimedia', 'DGM', 'Carrera de Diseño Gráfico y Multimedia'),
('Administración', 'ADM', 'Carrera de Administración'),
('Desarrollo de Software', 'DS', 'Carrera de Desarrollo de Software');

-- 5. AGREGAR FOREIGN KEY PARA DEPARTAMENTOS
ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_departamento 
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id_departamento);

-- 6. AGREGAR CAMPO QR A BIENES (si no existe)
ALTER TABLE bienes ADD COLUMN codigo_qr VARCHAR(255) DEFAULT NULL AFTER codigo_senescyt;

-- 7. CREAR ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX idx_bienes_qr ON bienes(codigo_qr);
CREATE INDEX idx_usuarios_departamento ON usuarios(departamento_id);
CREATE INDEX idx_usuarios_telefono ON usuarios(telefono);

-- 8. VERIFICAR ESTRUCTURA DE BIENES
-- La tabla bienes ya debe tener estos campos según intbienes.sql:
-- - codigo_institucional (ya existe)
-- - codigo_senescyt (ya existe)
-- - codigo_qr (agregado arriba)

-- 9. CREAR TABLA DE CONFIGURACIÓN DEL SISTEMA
CREATE TABLE IF NOT EXISTS configuracion_sistema (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  descripcion TEXT,
  categoria VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10. INSERTAR CONFIGURACIONES PARA ECUADOR
INSERT INTO configuracion_sistema (clave, valor, descripcion, categoria) VALUES
('timezone', 'America/Guayaquil', 'Zona horaria de Ecuador', 'localizacion'),
('pais', 'Ecuador', 'País de la institución', 'localizacion'),
('moneda', 'USD', 'Moneda oficial', 'localizacion'),
('idioma', 'es-EC', 'Idioma del sistema', 'localizacion'),
('institucion_nombre', 'Instituto Superior Tecnológico', 'Nombre de la institución', 'institucion'),
('formato_cedula', '^[0-9]{10}$', 'Formato de cédula ecuatoriana', 'validacion'),
('formato_telefono', '^(\\+593|0)?[2-9][0-9]{8}$', 'Formato de teléfono ecuatoriano', 'validacion');

-- 11. CREAR TABLA DE AUDITORÍA PARA DEPARTAMENTOS
CREATE TABLE IF NOT EXISTS auditoria_departamentos (
  id_auditoria INT NOT NULL AUTO_INCREMENT,
  id_departamento INT DEFAULT NULL,
  accion ENUM('CREATE','UPDATE','DELETE') NOT NULL,
  usuario_id INT DEFAULT NULL,
  datos_anteriores JSON DEFAULT NULL,
  datos_nuevos JSON DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_auditoria),
  KEY id_departamento (id_departamento),
  KEY usuario_id (usuario_id),
  CONSTRAINT auditoria_departamentos_ibfk_1 FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento) ON DELETE CASCADE,
  CONSTRAINT auditoria_departamentos_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 12. CREAR TABLA DE CÓDIGOS QR
CREATE TABLE IF NOT EXISTS codigos_qr (
  id_qr INT NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(255) NOT NULL UNIQUE,
  id_bien INT NOT NULL,
  url_completa VARCHAR(500),
  fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id_qr),
  KEY id_bien (id_bien),
  CONSTRAINT codigos_qr_ibfk_1 FOREIGN KEY (id_bien) REFERENCES bienes(id_bien) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 13. ACTUALIZAR USUARIOS EXISTENTES CON DEPARTAMENTO POR DEFECTO
UPDATE usuarios SET departamento_id = 1 WHERE departamento_id IS NULL LIMIT 1;
UPDATE usuarios SET departamento_id = 2 WHERE departamento_id IS NULL LIMIT 1;
UPDATE usuarios SET departamento_id = 3 WHERE departamento_id IS NULL;

-- 14. CREAR VISTA PARA USUARIOS CON DEPARTAMENTO
CREATE OR REPLACE VIEW vista_usuarios_completa AS
SELECT 
    u.id_usuario,
    u.nombres,
    u.apellidos,
    u.cedula,
    u.email,
    u.telefono,
    u.activo,
    d.nombre_departamento,
    d.codigo_departamento,
    u.created_at,
    u.updated_at
FROM usuarios u
LEFT JOIN departamentos d ON u.departamento_id = d.id_departamento;

-- 15. CREAR VISTA PARA BIENES CON QR
CREATE OR REPLACE VIEW vista_bienes_completa AS
SELECT 
    b.*,
    c.nombre_categoria,
    u.nombres as nombre_ubicacion,
    resp.nombres as responsable_nombre,
    resp.apellidos as responsable_apellido,
    qr.codigo as codigo_qr_generado,
    qr.fecha_generacion as qr_fecha_generacion
FROM bienes b
LEFT JOIN categorias c ON b.categoria_id = c.id_categoria
LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id_ubicacion
LEFT JOIN usuarios resp ON b.responsable_id = resp.id_usuario
LEFT JOIN codigos_qr qr ON b.id_bien = qr.id_bien AND qr.activo = 1;

-- 16. TRIGGER PARA AUDITORÍA DE USUARIOS
DELIMITER //
CREATE TRIGGER tr_usuarios_audit_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_usuarios (id_usuario, accion, datos_nuevos)
    VALUES (NEW.id_usuario, 'CREATE', JSON_OBJECT(
        'nombres', NEW.nombres,
        'apellidos', NEW.apellidos,
        'cedula', NEW.cedula,
        'email', NEW.email,
        'telefono', NEW.telefono,
        'departamento_id', NEW.departamento_id
    ));
END//
DELIMITER ;

-- 17. ACTUALIZAR TIMEZONE DE LA SESIÓN (opcional)
-- SET time_zone = '-05:00';

-- 18. VERIFICACIONES FINALES
SELECT 'Verificando estructura de usuarios...' as mensaje;
DESCRIBE usuarios;

SELECT 'Verificando departamentos creados...' as mensaje;
SELECT * FROM departamentos;

SELECT 'Verificando configuración del sistema...' as mensaje;
SELECT * FROM configuracion_sistema;

-- MENSAJE FINAL
SELECT '✅ ACTUALIZACIÓN COMPLETA PARA ECUADOR FINALIZADA' as RESULTADO;
SELECT 'Base de datos actualizada con:' as INFO;
SELECT '- Campo telefono en usuarios' as FEATURE_1;
SELECT '- Departamentos/carreras específicas' as FEATURE_2;
SELECT '- Campo codigo_qr en bienes' as FEATURE_3;
SELECT '- Configuración para Ecuador' as FEATURE_4;
SELECT '- Auditoría y vistas mejoradas' as FEATURE_5;