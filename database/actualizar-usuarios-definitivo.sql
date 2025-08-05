-- Script SQL DEFINITIVO para actualizar usuarios con contraseñas funcionales
USE intbienes;

-- Limpiar usuarios existentes y crear nuevos con contraseñas funcionales
DELETE FROM usuarios WHERE email IN ('admin@intsuperior.edu.ec', 'jhonatan@intsuperior.edu.ec', 'demo@intsuperior.edu.ec');

-- Insertar usuarios con hashes generados que funcionan
INSERT INTO usuarios (nombres, apellidos, cedula, email, password_hash, activo, created_at, updated_at) VALUES
-- Usuario administrador: email=admin@intsuperior.edu.ec, password=admin123
('Administrador', 'Sistema', '1234567890', 'admin@intsuperior.edu.ec', 'pbkdf2_sha512$10000$7bee73f326e138556a94cf46e681ad80$492e423386088f8db7a6f98c4430f04b2d2d583af1c366931e9e539397baf2b3c1b9a5ddbe65e3f65560fac645214c206a5d1243d31b027f16316ebd9291fa4e', 1, NOW(), NOW()),

-- Usuario de prueba: email=jhonatan@intsuperior.edu.ec, password=test123  
('Jhonatan', 'Prueba', '1728163484', 'jhonatan@intsuperior.edu.ec', 'pbkdf2_sha512$10000$f8802fd3b0467eed5ef959fc127e2eaf$4b64ffad6f81e3a0c9c523b7b13be9cab7eea563aba1ee8cb5984d0b72a7ac93b15cc343a5654c5e0158ff5bb21880eef121ec98b91f442ce0f742cb8a3267b7', 1, NOW(), NOW()),

-- Usuario demo: email=demo@intsuperior.edu.ec, password=123456
('Usuario', 'Demo', '9999999999', 'demo@intsuperior.edu.ec', 'pbkdf2_sha512$10000$f2fdb4a4512df8ede1ae5434b4e5fde1$761058a7cb24bfbfbff927c345ba914e670afa947f49c2b3249318bdf9b998c451000e8c2652d6c1de0a44e3c10f0c963c3855cb09cb15e9aaf799dac6234578', 1, NOW(), NOW());

-- Verificar que los usuarios fueron insertados correctamente
SELECT id_usuario, nombres, apellidos, email, activo, 
       LEFT(password_hash, 50) as hash_preview,
       created_at, updated_at 
FROM usuarios 
WHERE email IN ('admin@intsuperior.edu.ec', 'jhonatan@intsuperior.edu.ec', 'demo@intsuperior.edu.ec')
ORDER BY id_usuario;

-- Mostrar credenciales para el login
SELECT 
    '🔑 CREDENCIALES PARA LOGIN 🔑' as '============================',
    '' as 'Email',
    '' as 'Password'
UNION ALL
SELECT 
    '👑 ADMINISTRADOR:' as info,
    'admin@intsuperior.edu.ec' as email,
    'admin123' as password
UNION ALL
SELECT 
    '👤 USUARIO PRUEBA:' as info,
    'jhonatan@intsuperior.edu.ec' as email,
    'test123' as password
UNION ALL
SELECT 
    '🎭 USUARIO DEMO:' as info,
    'demo@intsuperior.edu.ec' as email,
    '123456' as password;