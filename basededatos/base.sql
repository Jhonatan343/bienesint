-- Base de datos mejorada para gestión de bienes institucionales
CREATE DATABASE IF NOT EXISTS `intbienes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `intbienes`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLA: usuarios
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
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_cedula` (`cedula`),
  UNIQUE KEY `uk_correo` (`correo_institucional`),
  KEY `idx_nombres_apellidos` (`nombres`, `apellidos`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLA: bienes (CORREGIDA - removida redundancia)
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`),
  UNIQUE KEY `uk_codigo_institucional` (`codigo_institucional`),
  KEY `idx_codigo_senescyt` (`codigo_senescyt`),
  KEY `idx_estado` (`estado`),
  KEY `idx_clase_bien` (`clase_de_bien`),
  KEY `idx_marca_modelo` (`marca`, `modelo`),
  CONSTRAINT `chk_valor_positivo` CHECK (`valor` >= 0),
  CONSTRAINT `chk_vida_util` CHECK (`vida_util_anos` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- TABLAS DE RELACIÓN (Many-to-Many)
-- =============================================

-- Relación bien-categoria
DROP TABLE IF EXISTS `bien_categoria`;
CREATE TABLE `bien_categoria` (
  `id_bien` int NOT NULL,
  `id_categoria` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`,`id_categoria`),
  KEY `fk_bien_categoria_categoria` (`id_categoria`),
  CONSTRAINT `fk_bien_categoria_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE,
  CONSTRAINT `fk_bien_categoria_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Relación bien-periodo académico
DROP TABLE IF EXISTS `bien_periodo_academico`;
CREATE TABLE `bien_periodo_academico` (
  `id_bien` int NOT NULL,
  `id_periodo` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`,`id_periodo`),
  KEY `fk_bien_periodo_periodo` (`id_periodo`),
  CONSTRAINT `fk_bien_periodo_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE,
  CONSTRAINT `fk_bien_periodo_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodos_academicos` (`id_periodo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Relación bien-ubicación
DROP TABLE IF EXISTS `bien_ubicacion`;
CREATE TABLE `bien_ubicacion` (
  `id_bien` int NOT NULL,
  `id_ubicacion` int NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`,`id_ubicacion`),
  KEY `fk_bien_ubicacion_ubicacion` (`id_ubicacion`),
  CONSTRAINT `fk_bien_ubicacion_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE,
  CONSTRAINT `fk_bien_ubicacion_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicaciones` (`id_ubicacion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Relación bien-usuario (custodio)
DROP TABLE IF EXISTS `bien_usuario`;
CREATE TABLE `bien_usuario` (
  `id_bien` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_devolucion` timestamp NULL,
  `activo` tinyint(1) DEFAULT '1',
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bien`,`id_usuario`),
  KEY `fk_bien_usuario_usuario` (`id_usuario`),
  KEY `idx_activo` (`activo`),
  CONSTRAINT `fk_bien_usuario_bien` FOREIGN KEY (`id_bien`) REFERENCES `bienes` (`id_bien`) ON DELETE CASCADE,
  CONSTRAINT `fk_bien_usuario_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- DATOS DE EJEMPLO (CORREGIDOS)
-- =============================================

-- Insertar períodos académicos
INSERT INTO `periodos_academicos` (`id_periodo`, `nombre_periodo`, `fecha_inicio`, `fecha_fin`, `activo`) VALUES 
(1, 'SEMESTRE 2025-1', '2025-02-01', '2025-07-31', 1);

-- Insertar categorías
INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`, `descripcion`) VALUES 
(1, 'LAPTOPS', 'Computadoras portátiles'),
(2, 'EQUIPOS DE COMPUTO', 'Equipos de escritorio y periféricos'),
(3, 'MOBILIARIO', 'Muebles y enseres');

-- Insertar ubicaciones
INSERT INTO `ubicaciones` (`id_ubicacion`, `area`, `numero_aula`, `piso`, `sede`, `descripcion`) VALUES 
(1, 'LABORATORIO DE SISTEMAS', 'LAB-01', '2', 'Sede Principal', 'Laboratorio principal de computación'),
(2, 'BIBLIOTECA', 'BIB-01', '1', 'Sede Principal', 'Área de consulta'),
(3, 'AULA DE CLASES', '18', '1', 'Sede Principal', 'Aula estándar');

-- Insertar usuarios
INSERT INTO `usuarios` (`id_usuario`, `nombres`, `apellidos`, `telefono`, `correo_institucional`, `cedula`, `carrera`) VALUES 
(1, 'MATHEW', 'CARRILLO CARRASCAL', '0992600415', 'mathew.carrillo@intsuperior.edu.ec', '1316946951', 'INGENIERÍA DE SOFTWARE'),
(2, 'FERNANDO ENRIQUE', 'IMBAQUINGO', '0984608321', 'fernando.imbaquingo@intsuperior.edu.ec', '1754083739', 'INGENIERÍA DE SOFTWARE');

-- Insertar bienes
INSERT INTO `bienes` (`id_bien`, `codigo_institucional`, `codigo_senescyt`, `clase_de_bien`, `modelo`, `serie`, `marca`, `estado`, `observaciones`, `nro_acta_entrega_recepcion`, `nro_acta_constatacion_fisica`, `valor`, `codigo_anterior`, `fecha_adquisicion`) VALUES 
(1, 'COMP-001', 'SEN-001', 'EQUIPO DE COMPUTACION', 'INSPIRON 15', 'ABC123456', 'DELL', 'Activo', 'Laptop para uso académico', 'ACTA-001', 'CONST-001', 1200.00, NULL, '2025-01-15'),
(2, 'COMP-002', 'SEN-002', 'EQUIPO DE COMPUTACION', 'THINKPAD E14', 'DEF789012', 'LENOVO', 'Activo', 'Laptop para docencia', 'ACTA-002', 'CONST-002', 980.00, NULL, '2025-01-20');

-- Insertar relaciones
INSERT INTO `bien_categoria` (`id_bien`, `id_categoria`) VALUES 
(1, 1), (1, 2),
(2, 1), (2, 2);

INSERT INTO `bien_periodo_academico` (`id_bien`, `id_periodo`) VALUES 
(1, 1), (2, 1);

INSERT INTO `bien_ubicacion` (`id_bien`, `id_ubicacion`) VALUES 
(1, 1), (2, 3);

INSERT INTO `bien_usuario` (`id_bien`, `id_usuario`) VALUES 
(1, 1), (2, 2);

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS CORREGIDOS
-- =============================================

-- Procedimiento para obtener detalles completos de un bien
DROP PROCEDURE IF EXISTS `getAssetDetails`;
DELIMITER ;;
CREATE PROCEDURE `getAssetDetails`(IN p_id_bien INT)
BEGIN
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
        ub.sede
        
    FROM bienes b
    LEFT JOIN bien_periodo_academico bpa ON b.id_bien = bpa.id_bien
    LEFT JOIN periodos_academicos pa ON bpa.id_periodo = pa.id_periodo AND pa.activo = 1
    LEFT JOIN bien_usuario bu ON b.id_bien = bu.id_bien AND bu.activo = 1
    LEFT JOIN usuarios u ON bu.id_usuario = u.id_usuario AND u.activo = 1
    LEFT JOIN bien_categoria bc ON b.id_bien = bc.id_bien
    LEFT JOIN categorias c ON bc.id_categoria = c.id_categoria AND c.activo = 1
    LEFT JOIN bien_ubicacion bui ON b.id_bien = bui.id_bien
    LEFT JOIN ubicaciones ub ON bui.id_ubicacion = ub.id_ubicacion AND ub.activo = 1
    WHERE b.id_bien = p_id_bien
    GROUP BY b.id_bien;
END ;;
DELIMITER ;

-- Procedimiento mejorado para guardar un bien
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
    IN p_usuarios JSON
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
            INSERT INTO bien_ubicacion (id_bien, id_ubicacion) 
            VALUES (new_id_bien, item_id);
            SET i = i + 1;
        END WHILE;
    END IF;

    -- Insertar usuarios custodios
    IF p_usuarios IS NOT NULL AND JSON_VALID(p_usuarios) THEN
        SET json_length = JSON_LENGTH(p_usuarios);
        SET i = 0;
        WHILE i < json_length DO
            SET item_id = JSON_UNQUOTE(JSON_EXTRACT(p_usuarios, CONCAT('$[', i, ']')));
            INSERT INTO bien_usuario (id_bien, id_usuario) 
            VALUES (new_id_bien, item_id);
            SET i = i + 1;
        END WHILE;
    END IF;

    COMMIT;
    
    -- Retornar el ID del bien creado
    SELECT new_id_bien AS id_bien_creado;

END ;;
DELIMITER ;

-- Procedimiento para buscar bienes
DROP PROCEDURE IF EXISTS `buscar_bienes`;
DELIMITER ;;
CREATE PROCEDURE `buscar_bienes`(
    IN p_termino_busqueda VARCHAR(255),
    IN p_estado VARCHAR(50),
    IN p_categoria INT,
    IN p_ubicacion INT,
    IN p_periodo INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        b.id_bien,
        b.codigo_institucional,
        b.clase_de_bien,
        b.marca,
        b.modelo,
        b.estado,
        b.valor,
        COALESCE(CONCAT(u.nombres, ' ', u.apellidos), 'No asignado') AS custodio,
        COALESCE(ub.area, 'No asignada') AS ubicacion,
        b.created_at
    FROM bienes b
    LEFT JOIN bien_usuario bu ON b.id_bien = bu.id_bien AND bu.activo = 1
    LEFT JOIN usuarios u ON bu.id_usuario = u.id_usuario
    LEFT JOIN bien_ubicacion bub ON b.id_bien = bub.id_bien
    LEFT JOIN ubicaciones ub ON bub.id_ubicacion = ub.id_ubicacion
    LEFT JOIN bien_categoria bc ON b.id_bien = bc.id_bien
    LEFT JOIN bien_periodo_academico bpa ON b.id_bien = bpa.id_bien
    WHERE 
        (p_termino_busqueda IS NULL OR 
         b.codigo_institucional LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.clase_de_bien LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.marca LIKE CONCAT('%', p_termino_busqueda, '%') OR
         b.modelo LIKE CONCAT('%', p_termino_busqueda, '%'))
    AND (p_estado IS NULL OR b.estado = p_estado)
    AND (p_categoria IS NULL OR bc.id_categoria = p_categoria)
    AND (p_ubicacion IS NULL OR bub.id_ubicacion = p_ubicacion)
    AND (p_periodo IS NULL OR bpa.id_periodo = p_periodo)
    GROUP BY b.id_bien
    ORDER BY b.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END ;;
DELIMITER ;

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para resumen de bienes
DROP VIEW IF EXISTS `v_resumen_bienes`;
CREATE VIEW `v_resumen_bienes` AS
SELECT 
    b.id_bien,
    b.codigo_institucional,
    b.clase_de_bien,
    b.marca,
    b.modelo,
    b.estado,
    b.valor,
    COALESCE(CONCAT(u.nombres, ' ', u.apellidos), 'No asignado') AS custodio_actual,
    COALESCE(ub.area, 'No asignada') AS ubicacion_actual,
    GROUP_CONCAT(DISTINCT c.nombre_categoria SEPARATOR ', ') AS categorias,
    pa.nombre_periodo,
    b.created_at
FROM bienes b
LEFT JOIN bien_usuario bu ON b.id_bien = bu.id_bien AND bu.activo = 1
LEFT JOIN usuarios u ON bu.id_usuario = u.id_usuario AND u.activo = 1
LEFT JOIN bien_ubicacion buu ON b.id_bien = buu.id_bien
LEFT JOIN ubicaciones ub ON buu.id_ubicacion = ub.id_ubicacion AND ub.activo = 1
LEFT JOIN bien_categoria bc ON b.id_bien = bc.id_bien
LEFT JOIN categorias c ON bc.id_categoria = c.id_categoria AND c.activo = 1
LEFT JOIN bien_periodo_academico bpa ON b.id_bien = bpa.id_bien
LEFT JOIN periodos_academicos pa ON bpa.id_periodo = pa.id_periodo AND pa.activo = 1
GROUP BY b.id_bien;

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