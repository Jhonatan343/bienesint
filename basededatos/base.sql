-- Base de datos mejorada para gestión de bienes institucionales
-- VERSIÓN CORREGIDA Y OPTIMIZADA
CREATE DATABASE IF NOT EXISTS `intbienes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `intbienes`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- =============================================
-- TABLA: periodos_academicos
-- =============================================
DROP TABLE IF EXISTS `periodos_academicos`;
CREATE TABLE `periodos_academicos` (
  `id_periodo` int NOT NULL AUTO_INCREMENT,
  `nombre_periodo` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_periodo`),
  UNIQUE KEY `uk_nombre_periodo` (`nombre_periodo`),
  KEY `idx_activo` (`activo`),
  KEY `idx_fechas` (`fecha_inicio`, `fecha_fin`),
  CONSTRAINT `chk_fechas_periodo` CHECK (`fecha_fin` >= `fecha_inicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLA: categorias
-- =============================================
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion` text,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `uk_nombre_categoria` (`nombre_categoria`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLA: ubicaciones
-- =============================================
DROP TABLE IF EXISTS `ubicaciones`;
CREATE TABLE `ubicaciones` (
  `id_ubicacion` int NOT NULL AUTO_INCREMENT,
  `area` varchar(100) NOT NULL,
  `numero_aula` varchar(20) DEFAULT NULL,
  `piso` varchar(10) DEFAULT NULL,
  `sede` enum('Sede Principal','Escuela Municipal') DEFAULT 'Sede Principal',
  `descripcion` text,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ubicacion`),
  KEY `idx_sede_area` (`sede`, `area`),
  KEY `idx_activo` (`activo`),
  KEY `idx_numero_aula` (`numero_aula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLA: usuarios (CORREGIDA - con campo rol)
-- =============================================
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo_institucional` varchar(100) DEFAULT NULL,
  `cedula` varchar(20) NOT NULL,
  `carrera` varchar(100) DEFAULT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'usuario',
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_cedula` (`cedula`),
  UNIQUE KEY `uk_correo` (`correo_institucional`),
  KEY `idx_nombres_apellidos` (`nombres`, `apellidos`),
  KEY `idx_activo` (`activo`),
  KEY `idx_rol` (`rol`),
  CONSTRAINT `chk_rol_valido` CHECK (`rol` IN ('administrador', 'custodio', 'usuario', 'docente', 'estudiante'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLA: bienes (CORREGIDA - mejoras en validaciones)
-- =============================================
DROP TABLE IF EXISTS `bienes`;
CREATE TABLE `bienes` (
  `id_bien` int NOT NULL AUTO_INCREMENT,
  `codigo_institucional` varchar(50) NOT NULL,
  `codigo_senescyt` varchar(50) DEFAULT NULL,
  `clase_de_bien` varchar(100) NOT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `serie` varchar(100) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `estado` enum('Activo','Inactivo','En Reparación','Dado de Baja') DEFAULT 'Activo',
  `observaciones` text,
  `nro_acta_entrega_recepcion` varchar(50) DEFAULT NULL,
  `nro_acta_constatacion_fisica` varchar(50) DEFAULT NULL,
  `valor` decimal(12,2) DEFAULT '0.00',
  `codigo_anterior` varchar(50) DEFAULT NULL,
  `fecha_adquisicion` date DEFAULT NULL,
  `vida_util_anos` int DEFAULT '5',
  `depreciacion_acumulada` decimal(12,2) DEFAULT '0.00',
  `valor_residual` decimal(12,2) DEFAULT '0.00',
  -- CAMPOS AGREGADOS PARA IMPORTACIÓN DESDE EXCEL
  `bien` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `responsable_institucional` varchar(255) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`),
  UNIQUE KEY `uk_codigo_institucional` (`codigo_institucional`),
  UNIQUE KEY `uk_codigo_senescyt` (`codigo_senescyt`),
  KEY `idx_estado` (`estado`),
  KEY `idx_clase_bien` (`clase_de_bien`),
  KEY `idx_marca_modelo` (`marca`, `modelo`),
  KEY `idx_fecha_adquisicion` (`fecha_adquisicion`),
  KEY `idx_serie` (`serie`),
  CONSTRAINT `chk_valor_positivo` CHECK (`valor` >= 0),
  CONSTRAINT `chk_vida_util` CHECK (`vida_util_anos` > 0),
  CONSTRAINT `chk_depreciacion_positiva` CHECK (`depreciacion_acumulada` >= 0),
  CONSTRAINT `chk_valor_residual_positivo` CHECK (`valor_residual` >= 0)
  -- Constraint de fecha_adquisicion eliminada por incompatibilidad con MySQL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLAS DE RELACIÓN (Many-to-Many) - MEJORADAS
-- =============================================

-- Relación bien-categoria
DROP TABLE IF EXISTS `bien_categoria`;
CREATE TABLE `bien_categoria` (
  `id_bien` int NOT NULL,
  `id_categoria` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`,`id_categoria`),
  KEY `fk_bien_categoria_categoria` (`id_categoria`),
  CONSTRAINT `fk_bien_categoria_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bien_categoria_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Relación bien-periodo académico
DROP TABLE IF EXISTS `bien_periodo_academico`;
CREATE TABLE `bien_periodo_academico` (
  `id_bien` int NOT NULL,
  `id_periodo` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`,`id_periodo`),
  KEY `fk_bien_periodo_periodo` (`id_periodo`),
  CONSTRAINT `fk_bien_periodo_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bien_periodo_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodos_academicos` (`id_periodo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Relación bien-ubicación (MEJORADA - con historial)
DROP TABLE IF EXISTS `bien_ubicacion`;
CREATE TABLE `bien_ubicacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_bien` int NOT NULL,
  `id_ubicacion` int NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_retiro` timestamp NULL,
  `activo` tinyint(1) DEFAULT '1',
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bien_ubicacion_activo` (`id_bien`, `activo`),
  KEY `fk_bien_ubicacion_ubicacion` (`id_ubicacion`),
  KEY `idx_activo` (`activo`),
  CONSTRAINT `fk_bien_ubicacion_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bien_ubicacion_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicaciones` (`id_ubicacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_fecha_retiro_valida` CHECK (`fecha_retiro` IS NULL OR `fecha_retiro` >= `fecha_asignacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Relación bien-usuario (custodio) - MEJORADA
DROP TABLE IF EXISTS `bien_usuario`;
CREATE TABLE `bien_usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_bien` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_devolucion` timestamp NULL,
  `activo` tinyint(1) DEFAULT '1',
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bien_usuario_activo` (`id_bien`, `activo`),
  KEY `fk_bien_usuario_usuario` (`id_usuario`),
  KEY `idx_activo` (`activo`),
  KEY `idx_fecha_asignacion` (`fecha_asignacion`),
  CONSTRAINT `fk_bien_usuario_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bien_usuario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_fecha_devolucion_valida` CHECK (`fecha_devolucion` IS NULL OR `fecha_devolucion` >= `fecha_asignacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLA DE AUDITORÍA (NUEVA)
-- =============================================
DROP TABLE IF EXISTS `auditoria_bienes`;
CREATE TABLE `auditoria_bienes` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_bien` int NOT NULL,
  `accion` enum('CREATE','UPDATE','DELETE','TRANSFER') NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `datos_anteriores` json DEFAULT NULL,
  `datos_nuevos` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`),
  KEY `fk_auditoria_bien` (`id_bien`),
  KEY `fk_auditoria_usuario` (`usuario_id`),
  KEY `idx_accion` (`accion`),
  KEY `idx_fecha` (`created_at`),
  CONSTRAINT `fk_auditoria_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_auditoria_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- DATOS DE EJEMPLO (CORREGIDOS CON ROLES)
-- =============================================

-- Se han eliminado todos los INSERT para dejar la base de datos sin datos iniciales

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS CORREGIDOS Y MEJORADOS
-- =============================================

-- Procedimiento para obtener detalles completos de un bien (MEJORADO)
DROP PROCEDURE IF EXISTS `getAssetDetails`;
DELIMITER ;;
CREATE PROCEDURE `getAssetDetails`(IN p_id_bien INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT 
        b.id_bien,
        b.codigo_institucional,
        b.codigo_senescyt,
        b.clase_de_bien,
        b.modelo,
        b.serie,
        b.marca,
        b.estado,
        b.observaciones,
        b.nro_acta_entrega_recepcion,
        b.nro_acta_constatacion_fisica,
        b.valor,
        b.codigo_anterior,
        b.fecha_adquisicion,
        b.vida_util_anos,
        b.depreciacion_acumulada,
        b.valor_residual,
        b.created_at AS fecha_registro,
        
        -- Período académico
        COALESCE(pa.nombre_periodo, 'No asignado') AS periodo_academico,
        
        -- Usuario custodio activo
        COALESCE(
            CONCAT(u.nombres, ' ', u.apellidos), 
            'No asignado'
        ) AS usuario_custodio,
        u.correo_institucional,
        u.carrera,
        u.rol,
        bu.fecha_asignacion AS fecha_asignacion_usuario,
        
        -- Categorías (concatenadas)
        COALESCE(
            GROUP_CONCAT(DISTINCT c.nombre_categoria SEPARATOR ', '), 
            'No asignada'
        ) AS categorias,
        
        -- Ubicación actual
        COALESCE(
            CONCAT(ub.area, 
                   CASE WHEN ub.numero_aula IS NOT NULL THEN CONCAT(' - Aula ', ub.numero_aula) ELSE '' END,
                   CASE WHEN ub.piso IS NOT NULL THEN CONCAT(' - Piso ', ub.piso) ELSE '' END,
                   ' (', ub.sede, ')'
            ), 
            'No asignada'
        ) AS ubicacion_completa,
        
        ub.area,
        ub.numero_aula,
        ub.piso,
        ub.sede,
        
        -- Cálculos de depreciación
        CASE 
            WHEN b.fecha_adquisicion IS NOT NULL AND b.vida_util_anos > 0 THEN
                ROUND((b.valor / b.vida_util_anos) * 
                      (DATEDIFF(CURDATE(), b.fecha_adquisicion) / 365.25), 2)
            ELSE 0
        END AS depreciacion_calculada,
        
        CASE 
            WHEN b.fecha_adquisicion IS NOT NULL AND b.vida_util_anos > 0 THEN
                GREATEST(0, b.valor - 
                    ROUND((b.valor / b.vida_util_anos) * 
                          (DATEDIFF(CURDATE(), b.fecha_adquisicion) / 365.25), 2))
            ELSE b.valor
        END AS valor_actual_calculado
        
    FROM bienes b
    LEFT JOIN bien_periodo_academico bpa ON b.id_bien = bpa.id_bien
    LEFT JOIN periodos_academicos pa ON bpa.id_periodo = pa.id_periodo AND pa.activo = 1
    LEFT JOIN bien_usuario bu ON b.id_bien = bu.id_bien AND bu.activo = 1
    LEFT JOIN usuarios u ON bu.id_usuario = u.id_usuario AND u.activo = 1
    LEFT JOIN bien_categoria bc ON b.id_bien = bc.id_bien
    LEFT JOIN categorias c ON bc.id_categoria = c.id_categoria AND c.activo = 1
    LEFT JOIN bien_ubicacion bui ON b.id_bien = bui.id_bien AND bui.activo = 1
    LEFT JOIN ubicaciones ub ON bui.id_ubicacion = ub.id_ubicacion AND ub.activo = 1
    WHERE b.id_bien = p_id_bien
    GROUP BY b.id_bien;
END ;;
DELIMITER ;

-- Procedimiento para guardar un bien (MEJORADO con auditoría)
DROP PROCEDURE IF EXISTS `guardar_bien`;
DELIMITER ;;
CREATE PROCEDURE `guardar_bien`(
    IN p_codigo_institucional VARCHAR(50),
    IN p_codigo_senescyt VARCHAR(50),
    IN p_clase_de_bien VARCHAR(100),
    IN p_modelo VARCHAR(100),
    IN p_serie VARCHAR(100),
    IN p_marca VARCHAR(100),
    IN p_estado ENUM('Activo', 'Inactivo', 'En Reparación', 'Dado de Baja'),
    IN p_observaciones TEXT,
    IN p_nro_acta_entrega_recepcion VARCHAR(50),
    IN p_nro_acta_constatacion_fisica VARCHAR(50),
    IN p_valor DECIMAL(12, 2),
    IN p_codigo_anterior VARCHAR(50),
    IN p_fecha_adquisicion DATE,
    IN p_vida_util_anos INT,
    IN p_periodo_academico_id INT,
    IN p_categorias JSON,
    IN p_ubicaciones JSON,
    IN p_usuarios JSON,
    IN p_usuario_registra INT
)
BEGIN
    DECLARE new_id_bien INT;
    DECLARE i INT DEFAULT 0;
    DECLARE json_length INT;
    DECLARE item_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Iniciar transacción
    START TRANSACTION;

    -- Validar que el código institucional no exista
    IF EXISTS (SELECT 1 FROM bienes WHERE codigo_institucional = p_codigo_institucional) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El código institucional ya existe';
    END IF;

    -- Validar que el código SENESCYT no exista (si se proporciona)
    IF p_codigo_senescyt IS NOT NULL AND EXISTS (SELECT 1 FROM bienes WHERE codigo_senescyt = p_codigo_senescyt) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El código SENESCYT ya existe';
    END IF;

    -- Insertar el nuevo bien
    INSERT INTO bienes (
        codigo_institucional, 
        codigo_senescyt, 
        clase_de_bien, 
        modelo, 
        serie, 
        marca, 
        estado, 
        observaciones, 
        nro_acta_entrega_recepcion, 
        nro_acta_constatacion_fisica, 
        valor, 
        codigo_anterior,
        fecha_adquisicion,
        vida_util_anos
    ) VALUES (
        p_codigo_institucional, 
        p_codigo_senescyt, 
        p_clase_de_bien, 
        p_modelo, 
        p_serie, 
        p_marca, 
        p_estado, 
        p_observaciones, 
        p_nro_acta_entrega_recepcion, 
        p_nro_acta_constatacion_fisica, 
        p_valor, 
        p_codigo_anterior,
        p_fecha_adquisicion,
        p_vida_util_anos
    );

    SET new_id_bien = LAST_INSERT_ID();

    -- Insertar relación con período académico
    IF p_periodo_academico_id IS NOT NULL THEN
        INSERT INTO bien_periodo_academico (id_bien, id_periodo) 
        VALUES (new_id_bien, p_periodo_academico_id);
    END IF;

    -- Insertar categorías
    IF p_categorias IS NOT NULL AND JSON_VALID(p_categorias) THEN
        SET json_length = JSON_LENGTH(p_categorias);
        SET i = 0;
        WHILE i < json_length DO
            SET item_id = JSON_UNQUOTE(JSON_EXTRACT(p_categorias, CONCAT('$[', i, ']')));
            INSERT INTO bien_categoria (id_bien, id_categoria) 
            VALUES (new_id_bien, item_id);
            SET i = i + 1;
        END WHILE;
    END IF;

    -- Insertar ubicaciones
    IF p_ubicaciones IS NOT NULL AND JSON_VALID(p_ubicaciones) THEN
        SET json_length = JSON_LENGTH(p_ubicaciones);
        SET i = 0;
        WHILE i < json_length DO
            SET item_id = JSON_UNQUOTE(JSON_EXTRACT(p_ubicaciones, CONCAT('$[', i, ']')));
            INSERT INTO bien_ubicacion (id_bien, id_ubicacion, activo) 
            VALUES (new_id_bien, item_id, 1);
            SET i = i + 1;
        END WHILE;
    END IF;

    -- Insertar usuarios custodios
    IF p_usuarios IS NOT NULL AND JSON_VALID(p_usuarios) THEN
        SET json_length = JSON_LENGTH(p_usuarios);
        SET i = 0;
        WHILE i < json_length DO
            SET item_id = JSON_UNQUOTE(JSON_EXTRACT(p_usuarios, CONCAT('$[', i, ']')));
            INSERT INTO bien_usuario (id_bien, id_usuario, activo) 
            VALUES (new_id_bien, item_id, 1);
            SET i = i + 1;
        END WHILE;
    END IF;

    -- Registrar en auditoría
    INSERT INTO auditoria_bienes (id_bien, accion, usuario_id, datos_nuevos)
    VALUES (new_id_bien, 'CREATE', p_usuario_registra, 
            JSON_OBJECT('codigo_institucional', p_codigo_institucional,
                       'clase_de_bien', p_clase_de_bien,
                       'valor', p_valor));

    COMMIT;
    
    -- Retornar el ID del bien creado
    SELECT new_id_bien AS id_bien_creado;

END ;;
DELIMITER ;

-- Procedimiento para buscar bienes (MEJORADO)
DROP PROCEDURE IF EXISTS `buscar_bienes`;
DELIMITER ;;
CREATE PROCEDURE `buscar_bienes`(
    IN p_termino_busqueda VARCHAR(255),
    IN p_estado VARCHAR(50),
    IN p_categoria INT,
    IN p_ubicacion INT,
    IN p_periodo INT,
    IN p_custodio INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        b.id_bien,
        b.codigo_institucional,
        b.codigo_senescyt,
        b.clase_de_bien,
        b.marca,
        b.modelo,
        b.serie,
        b.estado,
        b.valor,
        COALESCE(CONCAT(u.nombres, ' ', u.apellidos), 'No asignado') AS custodio,
        u.rol AS rol_custodio,
        COALESCE(ub.area, 'No asignada') AS ubicacion,
        COALESCE(pa.nombre_periodo, 'No asignado') AS periodo,
        b.fecha_adquisicion,
        b.created_at,
        -- Conteo total para paginación
        COUNT(*) OVER() AS total_registros
    FROM bienes b
    LEFT JOIN bien_usuario bu ON b.id_bien = bu.id_bien AND bu.activo = 1
    LEFT JOIN usuarios u ON bu.id_usuario = u.id_usuario AND u.activo = 1
    LEFT JOIN bien_ubicacion bub ON b.id_bien = bub.id_bien AND bub.activo = 1
    LEFT JOIN ubicaciones ub ON bub.id_ubicacion = ub.id_ubicacion AND ub.activo = 1
    LEFT JOIN bien_categoria bc ON b.id_bien = bc.id_bien
    LEFT JOIN bien_periodo_academico bpa ON b.id_bien = bpa.id_bien
    LEFT JOIN periodos_academicos pa ON bpa.id_periodo = pa.id_periodo
    WHERE 
        (p_termino_busqueda IS NULL OR p_termino_busqueda = '' OR 
         b.codigo_institucional LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.codigo_senescyt LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.clase_de_bien LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.marca LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.modelo LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.serie LIKE CONCAT('%', p_termino_busqueda, '%'))
    AND (p_estado IS NULL OR p_estado = '' OR b.estado = p_estado)
    AND (p_categoria IS NULL OR bc.id_categoria = p_categoria)
    AND (p_ubicacion IS NULL OR bub.id_ubicacion = p_ubicacion)
    AND (p_periodo IS NULL OR bpa.id_periodo = p_periodo)
    AND (p_custodio IS NULL OR bu.id_usuario = p_custodio)
    GROUP BY b.id_bien
    ORDER BY b.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END ;;
DELIMITER ;

-- Procedimiento para transferir bien (NUEVO)
DROP PROCEDURE IF EXISTS `transferir_bien`;
DELIMITER ;;
CREATE PROCEDURE `transferir_bien`(
    IN p_id_bien INT,
    IN p_nuevo_custodio INT,
    IN p_nueva_ubicacion INT,
    IN p_observaciones TEXT,
    IN p_usuario_autoriza INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Desactivar asignaciones actuales
    UPDATE bien_usuario 
    SET activo = 0, fecha_devolucion = NOW() 
    WHERE id_bien = p_id_bien AND activo = 1;

    UPDATE bien_ubicacion 
    SET activo = 0, fecha_retiro = NOW() 
    WHERE id_bien = p_id_bien AND activo = 1;

    -- Crear nuevas asignaciones
    IF p_nuevo_custodio IS NOT NULL THEN
        INSERT INTO bien_usuario (id_bien, id_usuario, observaciones, activo)
        VALUES (p_id_bien, p_nuevo_custodio, p_observaciones, 1);
    END IF;

    IF p_nueva_ubicacion IS NOT NULL THEN
        INSERT INTO bien_ubicacion (id_bien, id_ubicacion, observaciones, activo)
        VALUES (p_id_bien, p_nueva_ubicacion, p_observaciones, 1);
    END IF;

    -- Registrar en auditoría
    INSERT INTO auditoria_bienes (id_bien, accion, usuario_id, datos_nuevos)
    VALUES (p_id_bien, 'TRANSFER', p_usuario_autoriza,
            JSON_OBJECT('nuevo_custodio', p_nuevo_custodio,
                       'nueva_ubicacion', p_nueva_ubicacion,
                       'observaciones', p_observaciones));

    COMMIT;
END ;;
DELIMITER ;

-- =============================================
-- VISTAS ÚTILES MEJORADAS
-- =============================================

-- Vista para resumen de bienes (MEJORADA)
DROP VIEW IF EXISTS `v_resumen_bienes`;
CREATE VIEW `v_resumen_bienes` AS
SELECT 
    b.id_bien,
    b.codigo_institucional,
    b.codigo_senescyt,
    b.clase_de_bien,
    b.marca,
    b.modelo,
    b.serie,
    b.estado,
    b.valor,
    COALESCE(CONCAT(u.nombres, ' ', u.apellidos), 'No asignado') AS custodio_actual,
    u.rol AS rol_custodio,
    COALESCE(ub.area, 'No asignada') AS ubicacion_actual,
    GROUP_CONCAT(DISTINCT c.nombre_categoria SEPARATOR ', ') AS categorias,
    pa.nombre_periodo,
    b.fecha_adquisicion,
    b.vida_util_anos,
    CASE 
        WHEN b.fecha_adquisicion IS NOT NULL AND b.vida_util_anos > 0 THEN
            ROUND((b.valor / b.vida_util_anos) * 
                  (DATEDIFF(CURDATE(), b.fecha_adquisicion) / 365.25), 2)
        ELSE 0
    END AS depreciacion_calculada,
    CASE 
        WHEN b.fecha_adquisicion IS NOT NULL AND b.vida_util_anos > 0 THEN
            GREATEST(0, b.valor - 
                ROUND((b.valor / b.vida_util_anos) * 
                      (DATEDIFF(CURDATE(), b.fecha_adquisicion) / 365.25), 2))
        ELSE b.valor
    END AS valor_actual,
    b.created_at
FROM bienes b
LEFT JOIN bien_usuario bu ON b.id_bien = bu.id_bien AND bu.activo = 1
LEFT JOIN usuarios u ON bu.id_usuario = u.id_usuario AND u.activo = 1
LEFT JOIN bien_ubicacion buu ON b.id_bien = buu.id_bien AND buu.activo = 1
LEFT JOIN ubicaciones ub ON buu.id_ubicacion = ub.id_ubicacion AND ub.activo = 1
LEFT JOIN bien_categoria bc ON b.id_bien = bc.id_bien
LEFT JOIN categorias c ON bc.id_categoria = c.id_categoria AND c.activo = 1
LEFT JOIN bien_periodo_academico bpa ON b.id_bien = bpa.id_bien
LEFT JOIN periodos_academicos pa ON bpa.id_periodo = pa.id_periodo AND pa.activo = 1
GROUP BY b.id_bien;

-- Vista para estadísticas por estado
DROP VIEW IF EXISTS `v_estadisticas_estado`;
CREATE VIEW `v_estadisticas_estado` AS
SELECT 
    estado,
    COUNT(*) as cantidad,
    SUM(valor) as valor_total,
    AVG(valor) as valor_promedio,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bienes)), 2) as porcentaje
FROM bienes 
GROUP BY estado
ORDER BY cantidad DESC;

-- Vista para bienes próximos a depreciarse completamente
DROP VIEW IF EXISTS `v_bienes_depreciacion_completa`;
CREATE VIEW `v_bienes_depreciacion_completa` AS
SELECT 
    b.id_bien,
    b.codigo_institucional,
    b.clase_de_bien,
    b.marca,
    b.modelo,
    b.valor,
    b.fecha_adquisicion,
    b.vida_util_anos,
    ROUND(DATEDIFF(CURDATE(), b.fecha_adquisicion) / 365.25, 2) as anos_transcurridos,
    ROUND(b.vida_util_anos - (DATEDIFF(CURDATE(), b.fecha_adquisicion) / 365.25), 2) as anos_restantes
FROM bienes b
WHERE b.fecha_adquisicion IS NOT NULL 
AND b.vida_util_anos IS NOT NULL
AND (DATEDIFF(CURDATE(), b.fecha_adquisicion) / 365.25) >= (b.vida_util_anos - 1)
AND b.estado != 'Dado de Baja'
ORDER BY anos_restantes ASC;

-- =============================================
-- TRIGGERS PARA AUDITORÍA (NUEVOS)
-- =============================================

-- Trigger para auditar actualizaciones de bienes
DROP TRIGGER IF EXISTS `trg_bienes_audit_update`;
DELIMITER ;;
CREATE TRIGGER `trg_bienes_audit_update`
    AFTER UPDATE ON `bienes`
    FOR EACH ROW
BEGIN
    INSERT INTO auditoria_bienes (
        id_bien, 
        accion, 
        datos_anteriores, 
        datos_nuevos
    ) VALUES (
        NEW.id_bien,
        'UPDATE',
        JSON_OBJECT(
            'codigo_institucional', OLD.codigo_institucional,
            'estado', OLD.estado,
            'valor', OLD.valor,
            'observaciones', OLD.observaciones
        ),
        JSON_OBJECT(
            'codigo_institucional', NEW.codigo_institucional,
            'estado', NEW.estado,
            'valor', NEW.valor,
            'observaciones', NEW.observaciones
        )
    );
END ;;
DELIMITER ;

-- =============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para mejorar rendimiento en consultas frecuentes
CREATE INDEX idx_bienes_fecha_valor ON bienes(fecha_adquisicion, valor);
CREATE INDEX idx_auditoria_fecha_accion ON auditoria_bienes(created_at, accion);
CREATE INDEX idx_usuarios_rol_activo ON usuarios(rol, activo);

-- =============================================
-- FINALIZACIÓN
-- =============================================

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;