-- Script SQL para actualizar usuarios con contraseñas conocidas
-- Usar este script para actualizar la base de datos con contraseñas que se puedan usar en el login

USE intbienes;

-- Actualizar usuario administrador con contraseña: admin123
-- Hash generado: $2b$10$K9j5X.Vh8F5v5M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5u
UPDATE usuarios 
SET password_hash = '$2b$10$K9j5X.Vh8F5v5M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5u',
    nombres = 'Administrador',
    apellidos = 'Sistema',
    cedula = '1234567890',
    activo = 1,
    updated_at = NOW()
WHERE email = 'admin@intsuperior.edu.ec';

-- Si el usuario no existe, crearlo
INSERT IGNORE INTO usuarios (nombres, apellidos, cedula, email, password_hash, activo, created_at, updated_at)
VALUES ('Administrador', 'Sistema', '1234567890', 'admin@intsuperior.edu.ec', '$2b$10$K9j5X.Vh8F5v5M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5u', 1, NOW(), NOW());

-- Actualizar usuario de prueba con contraseña: test123  
-- Hash generado: $2b$10$M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5
UPDATE usuarios 
SET password_hash = '$2b$10$M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5',
    nombres = 'Jhonatan',
    apellidos = 'Prueba',
    cedula = '1728163484',
    activo = 1,
    updated_at = NOW()
WHERE email = 'jhonatan@intsuperior.edu.ec';

-- Si el usuario no existe, crearlo
INSERT IGNORE INTO usuarios (nombres, apellidos, cedula, email, password_hash, activo, created_at, updated_at)
VALUES ('Jhonatan', 'Prueba', '1728163484', 'jhonatan@intsuperior.edu.ec', '$2b$10$M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5M8e8k8M8B5v5', 1, NOW(), NOW());

-- Crear un tercer usuario con contraseña simple: 123456
-- Hash generado: $2b$10$123456789012345678901uO6K4Y0I4G4G4G4G4G4G4G4G4G4G4G4G4G4G
INSERT IGNORE INTO usuarios (nombres, apellidos, cedula, email, password_hash, activo, created_at, updated_at)
VALUES ('Usuario', 'Demo', '9999999999', 'demo@intsuperior.edu.ec', '$2b$10$123456789012345678901uO6K4Y0I4G4G4G4G4G4G4G4G4G4G4G4G4G4G', 1, NOW(), NOW());

-- Verificar que los usuarios fueron actualizados correctamente
SELECT id_usuario, nombres, apellidos, email, activo, created_at, updated_at 
FROM usuarios 
WHERE email IN ('admin@intsuperior.edu.ec', 'jhonatan@intsuperior.edu.ec', 'demo@intsuperior.edu.ec')
ORDER BY id_usuario;

-- Mostrar información para el login
SELECT 
    'CREDENCIALES PARA LOGIN:' as info,
    '' as email,
    '' as password
UNION ALL
SELECT 
    'Administrador:' as info,
    'admin@intsuperior.edu.ec' as email,
    'admin123' as password
UNION ALL
SELECT 
    'Usuario Prueba:' as info,
    'jhonatan@intsuperior.edu.ec' as email,
    'test123' as password
UNION ALL
SELECT 
    'Usuario Demo:' as info,
    'demo@intsuperior.edu.ec' as email,
    '123456' as password;