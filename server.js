// =============================================
// SERVER.JS - SISTEMA DE GESTIÓN DE BIENES
// Instituto Superior Tecnológico
// =============================================

require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const QRCode = require("qrcode");

const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Puerto del servidor (CORREGIDO: por defecto 3001)
const port = process.env.PORT || 3001;

/* ──────────────── MIDDLEWARE ──────────────── */
// CORS mejorado
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parser de JSON con límite aumentado
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/* ───────────── CONEXIÓN A MYSQL (POOL MEJORADO) ───────────── */
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3309,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "intbienes",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

console.log("🔧 Configuración de base de datos:", {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user
});

const db = mysql.createPool(dbConfig);

// Verificar conexión a la base de datos (MEJORADO)
async function verificarConexion() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Conectado a la base de datos MySQL");
    
    // Verificar que las tablas principales existen
    const [tables] = await connection.query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    const tablesRequired = ['bienes', 'usuarios', 'ubicaciones', 'categorias', 'v_resumen_bienes'];
    const missingTables = tablesRequired.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.warn("⚠️  Tablas faltantes:", missingTables);
    } else {
      console.log("✅ Todas las tablas necesarias están presentes");
    }
    
    connection.release();
  } catch (err) {
    console.error("❌ Error de conexión a la base de datos:", err.message);
    console.error("🔧 Verifica que MySQL esté ejecutándose en puerto", dbConfig.port);
    console.error("💡 Comando: docker ps | grep mysql");
    process.exit(1);
  }
}

verificarConexion();

/* ───────────── ROUTER PRINCIPAL ───────────── */
const apiRouter = express.Router();

/* ==================================================
   ENDPOINT: Generar QR Code con toda la información
   ================================================== */
apiRouter.get("/generateQRCode/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Generando QR para bien ID: ${id}`);

    // Llamamos al stored procedure getAssetDetails
    const [resultSets] = await db.query("CALL getAssetDetails(?)", [id]);
    
    if (!resultSets[0] || resultSets[0].length === 0) {
      console.log(`❌ Bien no encontrado: ${id}`);
      return res.status(404).json({ error: "Bien no encontrado" });
    }

    const bien = resultSets[0][0];

    // Contenido del QR Code
    const qrData = `
🏷️ INFORMACIÓN DEL BIEN
━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 ID: ${bien.id_bien}
📋 Código Institucional: ${bien.codigo_institucional}
📄 Código Senescyt: ${bien.codigo_senescyt || "N/A"}
🏗️ Clase de Bien: ${bien.clase_de_bien}
🔧 Modelo: ${bien.modelo || "N/A"}
🔢 Serie: ${bien.serie || "N/A"}
🏭 Marca: ${bien.marca || "N/A"}
⚡ Estado: ${bien.estado}
💰 Valor: $${bien.valor != null ? bien.valor : "0.00"}
📅 Fecha Registro: ${
      bien.fecha_registro
        ? new Date(bien.fecha_registro).toLocaleDateString()
        : "N/A"
    }

👤 CUSTODIO:
${bien.usuario_custodio || "No asignado"}

📍 UBICACIÓN:
${bien.ubicacion_completa || "No asignada"}

📚 CATEGORÍAS:
${bien.categorias || "No asignadas"}

🎓 PERÍODO ACADÉMICO:
${bien.periodo_academico || "No asignado"}

📝 OBSERVACIONES:
${bien.observaciones || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ Sistema de Gestión de Bienes
Instituto Superior Tecnológico
    `;

    // Generar el QR
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 300,
    });

    console.log(`✅ QR generado exitosamente para bien ${id}`);
    res.status(200).json({
      qrCodeDataUrl,
      bienInfo: bien,
    });
  } catch (err) {
    console.error("❌ Error al generar el código QR:", err);
    res.status(500).json({ error: "Error al generar el código QR" });
  }
});

/* =========================
   API DE USUARIOS (CRUD)
   ========================= */
// Obtener todos los usuarios activos
apiRouter.get("/usuarios", async (req, res) => {
  try {
    console.log("📋 Obteniendo lista de usuarios");
    const [rows] = await db.query(
      `
      SELECT
        id_usuario,
        nombres,
        apellidos,
        telefono,
        correo_institucional,
        cedula,
        carrera,
        activo,
        created_at,
        updated_at
      FROM usuarios
      WHERE activo = 1
      ORDER BY apellidos, nombres
      `
    );
    
    console.log(`✅ Usuarios encontrados: ${rows.length}`);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener los usuarios:", error);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});

// Obtener un usuario por ID
apiRouter.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando usuario ID: ${id}`);
    
    const [rows] = await db.query(
      `SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1`,
      [id]
    );
    
    if (rows.length === 0) {
      console.log(`❌ Usuario no encontrado: ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    console.log(`✅ Usuario encontrado: ${rows[0].nombres} ${rows[0].apellidos}`);
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

// Registrar un nuevo usuario
apiRouter.post("/usuarios", async (req, res) => {
  const {
    nombres,
    apellidos,
    telefono,
    correo_institucional,
    cedula,
    carrera,
  } = req.body;

  console.log("➕ Creando nuevo usuario:", { nombres, apellidos, cedula });

  // Validaciones mejoradas
  if (!nombres || !apellidos || !cedula) {
    return res.status(400).json({
      error: "Los campos nombres, apellidos y cédula son obligatorios",
    });
  }

  if (cedula.length < 10) {
    return res.status(400).json({
      error: "La cédula debe tener al menos 10 dígitos",
    });
  }

  try {
    // Verificar que la cédula no exista
    const [existing] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE cedula = ?",
      [cedula]
    );
    
    if (existing.length > 0) {
      console.log(`❌ Cédula ya existe: ${cedula}`);
      return res.status(409).json({ error: "Ya existe un usuario con esta cédula" });
    }

    // Insertar
    const query = `
      INSERT INTO usuarios (nombres, apellidos, telefono, correo_institucional, cedula, carrera)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      nombres.trim().toUpperCase(),
      apellidos.trim().toUpperCase(),
      telefono || null,
      correo_institucional?.toLowerCase() || null,
      cedula,
      carrera?.toUpperCase() || null,
    ]);

    const newUser = {
      id_usuario: result.insertId,
      nombres: nombres.trim().toUpperCase(),
      apellidos: apellidos.trim().toUpperCase(),
      telefono,
      correo_institucional: correo_institucional?.toLowerCase(),
      cedula,
      carrera: carrera?.toUpperCase(),
    };

    console.log(`✅ Usuario creado exitosamente: ID ${result.insertId}`);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("❌ Error al guardar el usuario:", err);
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Ya existe un usuario con esta información" });
    } else {
      res.status(500).json({ error: "Error al guardar el usuario" });
    }
  }
});

// Actualizar un usuario
apiRouter.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombres,
    apellidos,
    telefono,
    correo_institucional,
    cedula,
    carrera,
  } = req.body;

  console.log(`📝 Actualizando usuario ID: ${id}`);

  try {
    const query = `
      UPDATE usuarios
      SET nombres = ?, apellidos = ?, telefono = ?, correo_institucional = ?, cedula = ?, carrera = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id_usuario = ? AND activo = 1
    `;
    const [result] = await db.query(query, [
      nombres.trim().toUpperCase(),
      apellidos.trim().toUpperCase(),
      telefono,
      correo_institucional?.toLowerCase(),
      cedula,
      carrera?.toUpperCase(),
      id,
    ]);
    
    if (result.affectedRows > 0) {
      console.log(`✅ Usuario actualizado: ID ${id}`);
      res.status(200).json({ message: "Usuario actualizado con éxito" });
    } else {
      console.log(`❌ Usuario no encontrado para actualizar: ID ${id}`);
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al actualizar el usuario:", err);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

// Desactivar (soft delete) un usuario
apiRouter.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Desactivando usuario ID: ${id}`);
  
  try {
    const [result] = await db.query(
      "UPDATE usuarios SET activo = 0, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ Usuario desactivado: ID ${id}`);
      res.status(200).json({ message: "Usuario desactivado con éxito" });
    } else {
      console.log(`❌ Usuario no encontrado para desactivar: ID ${id}`);
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al desactivar el usuario:", err);
    res.status(500).json({ error: "Error al desactivar el usuario" });
  }
});

/* =========================
   API DE UBICACIONES (CRUD)
   ========================= */
// Obtener todas las ubicaciones activas
apiRouter.get("/ubicaciones", async (req, res) => {
  try {
    console.log("📍 Obteniendo ubicaciones");
    const [rows] = await db.query(
      `
      SELECT *
      FROM ubicaciones
      WHERE activo = 1
      ORDER BY sede, area, numero_aula
      `
    );
    
    console.log(`✅ Ubicaciones encontradas: ${rows.length}`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener las ubicaciones:", err);
    res.status(500).json({ message: "Error al obtener las ubicaciones" });
  }
});

// Crear una nueva ubicación
apiRouter.post("/ubicaciones", async (req, res) => {
  try {
    const { area, numero_aula, piso, sede, descripcion } = req.body;
    
    console.log("➕ Creando nueva ubicación:", { area, numero_aula, sede });
    
    if (!area) {
      return res.status(400).json({ message: "El área es obligatoria" });
    }
    
    const query = `
      INSERT INTO ubicaciones (area, numero_aula, piso, sede, descripcion)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      area.toUpperCase(),
      numero_aula || null,
      piso || null,
      sede || 'Sede Principal',
      descripcion || null,
    ]);
    
    const nuevaUbicacion = {
      id_ubicacion: result.insertId,
      area: area.toUpperCase(),
      numero_aula,
      piso,
      sede: sede || 'Sede Principal',
      descripcion,
    };
    
    console.log(`✅ Ubicación creada: ID ${result.insertId}`);
    res.status(201).json(nuevaUbicacion);
  } catch (err) {
    console.error("❌ Error al guardar la ubicación:", err);
    res.status(500).json({ message: "Error al guardar la ubicación" });
  }
});

// Actualizar una ubicación
apiRouter.put("/ubicaciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { area, numero_aula, piso, sede, descripcion } = req.body;
    
    console.log(`📝 Actualizando ubicación ID: ${id}`);
    
    const query = `
      UPDATE ubicaciones
      SET area = ?, numero_aula = ?, piso = ?, sede = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id_ubicacion = ? AND activo = 1
    `;
    const [result] = await db.query(query, [
      area.toUpperCase(),
      numero_aula || null,
      piso || null,
      sede || null,
      descripcion || null,
      id,
    ]);
    
    if (result.affectedRows > 0) {
      console.log(`✅ Ubicación actualizada: ID ${id}`);
      res.status(200).json({ message: "Ubicación actualizada con éxito" });
    } else {
      console.log(`❌ Ubicación no encontrada: ID ${id}`);
      res.status(404).json({ message: "Ubicación no encontrada" });
    }
  } catch (err) {
    console.error("❌ Error al actualizar la ubicación:", err);
    res.status(500).json({ message: "Error al actualizar la ubicación" });
  }
});

// Desactivar (soft delete) una ubicación
apiRouter.delete("/ubicaciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Desactivando ubicación ID: ${id}`);
    
    const [result] = await db.query(
      "UPDATE ubicaciones SET activo = 0, updated_at = CURRENT_TIMESTAMP WHERE id_ubicacion = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ Ubicación desactivada: ID ${id}`);
      res.status(200).json({ message: "Ubicación desactivada con éxito" });
    } else {
      console.log(`❌ Ubicación no encontrada: ID ${id}`);
      res.status(404).json({ message: "Ubicación no encontrada" });
    }
  } catch (err) {
    console.error("❌ Error al desactivar la ubicación:", err);
    res.status(500).json({ message: "Error al desactivar la ubicación" });
  }
});

/* =====================================
   API DE PERÍODOS ACADÉMICOS (CRUD)
   ===================================== */
// Obtener todos los períodos académicos
apiRouter.get("/periodos_academicos", async (req, res) => {
  try {
    console.log("📚 Obteniendo períodos académicos");
    const [periodos] = await db.query(
      `
      SELECT *
      FROM periodos_academicos
      ORDER BY activo DESC, fecha_inicio DESC
      `
    );
    
    console.log(`✅ Períodos encontrados: ${periodos.length}`);
    res.json(periodos);
  } catch (error) {
    console.error("❌ Error al obtener los períodos académicos:", error);
    res.status(500).json({ error: "Error al obtener los períodos académicos" });
  }
});

// Crear un nuevo período académico
apiRouter.post("/periodos_academicos", async (req, res) => {
  const { nombre_periodo, fecha_inicio, fecha_fin, activo } = req.body;
  
  console.log("➕ Creando período académico:", nombre_periodo);
  
  if (!nombre_periodo || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({
      error: "El nombre del período, fecha de inicio y fecha de fin son obligatorios",
    });
  }
  
  try {
    const [result] = await db.query(
      `
      INSERT INTO periodos_academicos (nombre_periodo, fecha_inicio, fecha_fin, activo)
      VALUES (?, ?, ?, ?)
      `,
      [nombre_periodo.toUpperCase(), fecha_inicio, fecha_fin, activo ?? 1]
    );
    
    console.log(`✅ Período académico creado: ID ${result.insertId}`);
    res.status(201).json({
      id_periodo: result.insertId,
      nombre_periodo: nombre_periodo.toUpperCase(),
      fecha_inicio,
      fecha_fin,
      activo: activo ?? 1,
    });
  } catch (error) {
    console.error("❌ Error al crear el período académico:", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Ya existe un período con este nombre" });
    } else {
      res.status(500).json({ error: "Error al crear el período académico" });
    }
  }
});

// Actualizar un período académico
apiRouter.put("/periodos_academicos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_periodo, fecha_inicio, fecha_fin, activo } = req.body;
  
  console.log(`📝 Actualizando período académico ID: ${id}`);
  
  try {
    const [result] = await db.query(
      `
      UPDATE periodos_academicos
      SET nombre_periodo = ?, fecha_inicio = ?, fecha_fin = ?, activo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id_periodo = ?
      `,
      [nombre_periodo.toUpperCase(), fecha_inicio, fecha_fin, activo, id]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ Período académico actualizado: ID ${id}`);
      res.json({
        id_periodo: +id,
        nombre_periodo: nombre_periodo.toUpperCase(),
        fecha_inicio,
        fecha_fin,
        activo,
      });
    } else {
      console.log(`❌ Período académico no encontrado: ID ${id}`);
      res.status(404).json({ error: "Período académico no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar el período académico:", error);
    res.status(500).json({ error: "Error al actualizar el período académico" });
  }
});

// Eliminar un período académico
apiRouter.delete("/periodos_academicos/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Eliminando período académico ID: ${id}`);
  
  try {
    const [result] = await db.query(
      "DELETE FROM periodos_academicos WHERE id_periodo = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ Período académico eliminado: ID ${id}`);
      res.json({ message: "Período académico eliminado correctamente" });
    } else {
      console.log(`❌ Período académico no encontrado: ID ${id}`);
      res.status(404).json({ error: "Período académico no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al eliminar el período académico:", error);
    res.status(500).json({ error: "Error al eliminar el período académico" });
  }
});

/* ===========================
   API DE CATEGORÍAS (CRUD)
   =========================== */
// Obtener todas las categorías activas
apiRouter.get("/categorias", async (req, res) => {
  try {
    console.log("🏷️ Obteniendo categorías");
    const [rows] = await db.query(
      `
      SELECT *
      FROM categorias
      WHERE activo = 1
      ORDER BY nombre_categoria
      `
    );
    
    console.log(`✅ Categorías encontradas: ${rows.length}`);
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

// Crear una nueva categoría
apiRouter.post("/categorias", async (req, res) => {
  const { nombre_categoria, descripcion } = req.body;
  
  console.log("➕ Creando categoría:", nombre_categoria);
  
  if (!nombre_categoria) {
    return res.status(400).json({
      message: "El nombre de la categoría es obligatorio",
    });
  }
  
  try {
    const [result] = await db.query(
      `
      INSERT INTO categorias (nombre_categoria, descripcion)
      VALUES (?, ?)
      `,
      [nombre_categoria.toUpperCase(), descripcion || null]
    );
    
    console.log(`✅ Categoría creada: ID ${result.insertId}`);
    res.status(201).json({
      id_categoria: result.insertId,
      nombre_categoria: nombre_categoria.toUpperCase(),
      descripcion: descripcion || null,
    });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ message: "Ya existe una categoría con este nombre" });
    } else {
      res.status(500).json({ message: "Error al crear la categoría" });
    }
  }
});

// Actualizar una categoría
apiRouter.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_categoria, descripcion } = req.body;
  
  console.log(`📝 Actualizando categoría ID: ${id}`);
  
  if (!nombre_categoria) {
    return res.status(400).json({
      message: "El nombre de la categoría es obligatorio",
    });
  }
  
  try {
    const [result] = await db.query(
      `
      UPDATE categorias
      SET nombre_categoria = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id_categoria = ? AND activo = 1
      `,
      [nombre_categoria.toUpperCase(), descripcion || null, id]
    );
    
    if (result.affectedRows === 0) {
      console.log(`❌ Categoría no encontrada: ID ${id}`);
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    
    console.log(`✅ Categoría actualizada: ID ${id}`);
    res.status(200).json({ message: "Categoría actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
});

// Desactivar una categoría
apiRouter.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Desactivando categoría ID: ${id}`);
  
  try {
    const [result] = await db.query(
      "UPDATE categorias SET activo = 0, updated_at = CURRENT_TIMESTAMP WHERE id_categoria = ?",
      [id]
    );
    
    if (result.affectedRows === 0) {
      console.log(`❌ Categoría no encontrada: ID ${id}`);
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    
    console.log(`✅ Categoría desactivada: ID ${id}`);
    res.status(200).json({ message: "Categoría desactivada con éxito" });
  } catch (error) {
    console.error("❌ Error al desactivar categoría:", error);
    res.status(500).json({ message: "Error al desactivar la categoría" });
  }
});

/* =========================================
   API DE BIENES (CRUD + Búsqueda + QR)
   ========================================= */
// Crear un nuevo bien
apiRouter.post("/bienes", async (req, res) => {
  const {
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
    vida_util_anos,
    periodo_academico_id,
    categorias,
    ubicaciones,
    usuarios,
  } = req.body;

  console.log("➕ Creando nuevo bien:", codigo_institucional);

  // Validaciones mejoradas
  if (!codigo_institucional || !clase_de_bien) {
    return res.status(400).json({
      error: "El código institucional y la clase de bien son obligatorios",
    });
  }

  try {
    // Llamada al stored procedure "guardar_bien"
    const [resultSets] = await db.query(
      `CALL guardar_bien(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo_institucional,
        codigo_senescyt || null,
        clase_de_bien,
        modelo || null,
        serie || null,
        marca || null,
        estado || "Activo",
        observaciones || null,
        nro_acta_entrega_recepcion || null,
        nro_acta_constatacion_fisica || null,
        valor != null ? parseFloat(valor) : 0,
        codigo_anterior || null,
        fecha_adquisicion || null,
        vida_util_anos || 5,
        periodo_academico_id || null,
        JSON.stringify(categorias || []),
        JSON.stringify(ubicaciones || []),
        JSON.stringify(usuarios || []),
      ]
    );
    
    const id_bien_creado = resultSets[0][0]?.id_bien_creado;
    console.log(`✅ Bien creado exitosamente: ID ${id_bien_creado}`);
    
    res.status(201).json({ 
      message: "Bien registrado con éxito", 
      id_bien_creado 
    });
  } catch (err) {
    console.error("❌ Error al guardar el bien:", err);
    if (err.message.includes("código institucional ya existe")) {
      res.status(409).json({ error: "El código institucional ya existe" });
    } else {
      res.status(500).json({ error: "Error al guardar el bien" });
    }
  }
});

// Obtener todos los bienes (MEJORADO - usando la vista)
apiRouter.get("/bienes", async (req, res) => {
  try {
    console.log("📦 Obteniendo lista de bienes desde v_resumen_bienes");
    
    const [rows] = await db.query(`
      SELECT * FROM v_resumen_bienes
      ORDER BY created_at DESC
    `);
    
    console.log(`✅ Bienes encontrados: ${rows.length}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error al obtener los bienes:", err);
    console.error("💡 Verifica que la vista v_resumen_bienes existe: SHOW TABLES LIKE 'v_%'");
    res.status(500).json({ error: "Error al obtener los bienes" });
  }
});

// Obtener un bien por ID con detalles completos
apiRouter.get("/bienes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Obteniendo detalles del bien ID: ${id}`);
    
    const [resultSets] = await db.query("CALL getAssetDetails(?)", [id]);
    
    if (!resultSets[0] || resultSets[0].length === 0) {
      console.log(`❌ Bien no encontrado: ID ${id}`);
      return res.status(404).json({ error: "Bien no encontrado" });
    }
    
    console.log(`✅ Detalles del bien obtenidos: ${resultSets[0][0].codigo_institucional}`);
    res.status(200).json(resultSets[0][0]);
  } catch (err) {
    console.error("❌ Error al obtener el bien:", err);
    res.status(500).json({ error: "Error al obtener el bien" });
  }
});

// Buscar bienes con filtros
apiRouter.get("/bienes/search", async (req, res) => {
  try {
    const {
      termino,
      estado,
      categoria,
      ubicacion,
      periodo,
      limit = 50,
      offset = 0,
    } = req.query;
    
    console.log("🔍 Búsqueda de bienes con filtros:", { termino, estado, categoria });
    
    const [resultSets] = await db.query(
      "CALL buscar_bienes(?, ?, ?, ?, ?, ?, ?)",
      [
        termino || null,
        estado || null,
        categoria || null,
        ubicacion || null,
        periodo || null,
        parseInt(limit),
        parseInt(offset),
      ]
    );
    
    console.log(`✅ Resultados de búsqueda: ${resultSets[0]?.length || 0}`);
    res.status(200).json(resultSets[0] || []);
  } catch (err) {
    console.error("❌ Error al buscar bienes:", err);
    res.status(500).json({ error: "Error al buscar bienes" });
  }
});

// Actualizar un bien
apiRouter.put("/bienes/:id", async (req, res) => {
  const { id } = req.params;
  const {
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
    vida_util_anos,
  } = req.body;

  console.log(`📝 Actualizando bien ID: ${id}`);

  try {
    const [result] = await db.query(
      `
      UPDATE bienes
      SET
        codigo_institucional = ?,
        codigo_senescyt = ?,
        clase_de_bien = ?,
        modelo = ?,
        serie = ?,
        marca = ?,
        estado = ?,
        observaciones = ?,
        nro_acta_entrega_recepcion = ?,
        nro_acta_constatacion_fisica = ?,
        valor = ?,
        codigo_anterior = ?,
        fecha_adquisicion = ?,
        vida_util_anos = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_bien = ?
      `,
      [
        codigo_institucional,
        codigo_senescyt || null,
        clase_de_bien,
        modelo || null,
        serie || null,
        marca || null,
        estado || "Activo",
        observaciones || null,
        nro_acta_entrega_recepcion || null,
        nro_acta_constatacion_fisica || null,
        valor != null ? parseFloat(valor) : 0,
        codigo_anterior || null,
        fecha_adquisicion || null,
        vida_util_anos || 5,
        id,
      ]
    );

    if (result.affectedRows > 0) {
      console.log(`✅ Bien actualizado: ID ${id}`);
      res.status(200).json({ message: "Bien actualizado con éxito" });
    } else {
      console.log(`❌ Bien no encontrado para actualizar: ID ${id}`);
      res.status(404).json({ error: "Bien no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al actualizar el bien:", err);
    res.status(500).json({ error: "Error al actualizar el bien" });
  }
});

// Eliminar un bien
apiRouter.delete("/bienes/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Eliminando bien ID: ${id}`);
  
  try {
    const [result] = await db.query("DELETE FROM bienes WHERE id_bien = ?", [id]);
    
    if (result.affectedRows > 0) {
      console.log(`✅ Bien eliminado: ID ${id}`);
      res.status(200).json({ message: "Bien eliminado con éxito" });
    } else {
      console.log(`❌ Bien no encontrado para eliminar: ID ${id}`);
      res.status(404).json({ error: "Bien no encontrado" });
    }
  } catch (err) {
    console.error("❌ Error al eliminar el bien:", err);
    res.status(500).json({ error: "Error al eliminar el bien" });
  }
});

/* =========================================
   ENDPOINT: Estadísticas Dashboard
   ========================================= */
apiRouter.get("/dashboard/stats", async (req, res) => {
  try {
    console.log("📊 Obteniendo estadísticas del dashboard");
    
    const [rows] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM bienes) AS total_bienes,
        (SELECT COUNT(*) FROM bienes WHERE estado = 'Activo') AS bienes_activos,
        (SELECT COUNT(*) FROM bienes WHERE estado = 'En Reparación') AS bienes_reparacion,
        (SELECT COUNT(*) FROM bienes WHERE estado = 'Dado de Baja') AS bienes_baja,
        (SELECT COUNT(*) FROM usuarios WHERE activo = 1) AS total_usuarios,
        (SELECT COUNT(*) FROM ubicaciones WHERE activo = 1) AS total_ubicaciones,
        (SELECT COUNT(*) FROM categorias WHERE activo = 1) AS total_categorias,
        (SELECT COALESCE(SUM(valor), 0) FROM bienes) AS valor_total_bienes
    `);
    
    console.log("✅ Estadísticas obtenidas exitosamente");
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

/* ───── Endpoint de salud del servidor ───── */
apiRouter.get("/health", async (req, res) => {
  try {
    // Verificar conexión a BD
    const [result] = await db.query("SELECT 1 as connected");
    
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: result[0].connected === 1 ? "Connected" : "Disconnected",
      environment: process.env.NODE_ENV || "development"
    });
  } catch (err) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      database: "Disconnected",
      error: err.message
    });
  }
});

/* ───── Usar el router bajo la ruta /api ───── */
app.use("/api", apiRouter);

/* ───── Servir archivos estáticos si existen ───── */
app.use(express.static("public"));

/* ───── Middleware para rutas no encontradas ───── */
app.use((req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Ruta no encontrada" });
});

/* ───── Manejo de errores globales ───── */
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

/* ───── Manejo de cierre graceful ───── */
process.on("SIGINT", async () => {
  console.log("\n🔄 Cerrando servidor gracefully...");
  try {
    await db.end();
    console.log("✅ Pool de conexiones cerrado");
    server.close(() => {
      console.log("✅ Servidor HTTP cerrado");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Error al cerrar:", err);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("🔄 Recibida señal SIGTERM, cerrando servidor...");
  await db.end();
  process.exit(0);
});

/* ───── Iniciar el servidor ───── */
server.listen(port, "0.0.0.0", () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 SERVIDOR INTBienes INICIADO");
  console.log("=".repeat(50));
  console.log(`📡 URL: http://localhost:${port}`);
  console.log(`🔗 API: http://localhost:${port}/api`);
  console.log(`💊 Health: http://localhost:${port}/api/health`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️ Base de datos: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  console.log("=".repeat(50));
  console.log("✅ Servidor listo para recibir peticiones\n");
});