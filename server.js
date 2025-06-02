// INTBienes/backend/server.js

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

// Configuración de Socket.IO (si necesitas notificaciones en tiempo real)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Puerto del servidor (por defecto 3000 si no existe en .env)
const port = process.env.PORT || 3000;

/* ──────────────── MIDDLEWARE ──────────────── */
// Para permitir llamadas CORS desde el frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Para parsear JSON de cuerpo de las peticiones (hasta 10 MB)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

/* ───────────── CONEXIÓN A MYSQL (POOL) ───────────── */
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "intbienes",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
 
});

// Verificar conexión a la base de datos
db.getConnection()
  .then((conn) => {
    console.log("✅ Conectado a la base de datos MySQL");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Error de conexión a la base de datos:", err);
    process.exit(1);
  });

/* ───────────── ROUTER PRINCIPAL ───────────── */
const apiRouter = express.Router();

/* ==================================================
   ENDPOINT: Generar QR Code con toda la información
   ================================================== */
apiRouter.get("/generateQRCode/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Llamamos al stored procedure getAssetDetails
    const [resultSets] = await db.query("CALL getAssetDetails(?)", [id]);
    // resultSets[0] es un arreglo con los datos del bien
    if (!resultSets[0] || resultSets[0].length === 0) {
      return res.status(404).json({ error: "Bien no encontrado" });
    }

    const bien = resultSets[0][0]; // Obtenemos el primer registro

    // Armamos el contenido textual que queremos incrustar en el QR
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

    // Generar el QR como DataURL (Base64 PNG)
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

    // Enviamos el DataURL junto con la info del bien
    res.status(200).json({
      qrCodeDataUrl,
      bienInfo: bien,
    });
  } catch (err) {
    console.error("Error al generar el código QR:", err);
    res.status(500).json({ error: "Error al generar el código QR" });
  }
});

/* =========================
   API DE USUARIOS (CRUD)
   ========================= */
// Obtener todos los usuarios activos
apiRouter.get("/usuarios", async (req, res) => {
  try {
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
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});

// Obtener un usuario por ID
apiRouter.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
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

  // Validaciones básicas
  if (!nombres || !apellidos || !cedula) {
    return res.status(400).json({
      error: "Los campos nombres, apellidos y cédula son obligatorios",
    });
  }

  try {
    // Verificar que la cédula no exista
    const [existing] = await db.query(
      "SELECT id_usuario FROM usuarios WHERE cedula = ?",
      [cedula]
    );
    if (existing.length > 0) {
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
      telefono,
      correo_institucional?.toLowerCase(),
      cedula,
      carrera?.toUpperCase(),
    ]);

    // Construimos el objeto de retorno
    const newUser = {
      id_usuario: result.insertId,
      nombres: nombres.trim().toUpperCase(),
      apellidos: apellidos.trim().toUpperCase(),
      telefono,
      correo_institucional: correo_institucional?.toLowerCase(),
      cedula,
      carrera: carrera?.toUpperCase(),
    };

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error al guardar el usuario:", err);
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

  try {
    const query = `
      UPDATE usuarios
      SET nombres = ?, apellidos = ?, telefono = ?, correo_institucional = ?, cedula = ?, carrera = ?
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
      res.status(200).json({ message: "Usuario actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

// Desactivar (soft delete) un usuario
apiRouter.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Usuario desactivado con éxito" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error al desactivar el usuario:", err);
    res.status(500).json({ error: "Error al desactivar el usuario" });
  }
});

/* =========================
   API DE UBICACIONES (CRUD)
   ========================= */
// Obtener todas las ubicaciones activas
apiRouter.get("/ubicaciones", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM ubicaciones
      WHERE activo = 1
      ORDER BY sede, area, numero_aula
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener las ubicaciones:", err);
    res.status(500).json({ message: "Error al obtener las ubicaciones" });
  }
});

// Crear una nueva ubicación
apiRouter.post("/ubicaciones", async (req, res) => {
  try {
    const { area, numero_aula, piso, sede, descripcion } = req.body;
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
      sede || null,
      descripcion || null,
    ]);
    const nuevaUbicacion = {
      id_ubicacion: result.insertId,
      area: area.toUpperCase(),
      numero_aula,
      piso,
      sede,
      descripcion,
    };
    res.status(201).json(nuevaUbicacion);
  } catch (err) {
    console.error("Error al guardar la ubicación:", err);
    res.status(500).json({ message: "Error al guardar la ubicación" });
  }
});

// Actualizar una ubicación
apiRouter.put("/ubicaciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { area, numero_aula, piso, sede, descripcion } = req.body;
    const query = `
      UPDATE ubicaciones
      SET area = ?, numero_aula = ?, piso = ?, sede = ?, descripcion = ?
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
      res.status(200).json({ message: "Ubicación actualizada con éxito" });
    } else {
      res.status(404).json({ message: "Ubicación no encontrada" });
    }
  } catch (err) {
    console.error("Error al actualizar la ubicación:", err);
    res.status(500).json({ message: "Error al actualizar la ubicación" });
  }
});

// Desactivar (soft delete) una ubicación
apiRouter.delete("/ubicaciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "UPDATE ubicaciones SET activo = 0 WHERE id_ubicacion = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Ubicación desactivada con éxito" });
    } else {
      res.status(404).json({ message: "Ubicación no encontrada" });
    }
  } catch (err) {
    console.error("Error al desactivar la ubicación:", err);
    res.status(500).json({ message: "Error al desactivar la ubicación" });
  }
});

/* =====================================
   API DE PERÍODOS ACADÉMICOS (CRUD)
   ===================================== */
// Obtener todos los períodos académicos (ordenados por activo y fecha_inicio)
apiRouter.get("/periodos_academicos", async (req, res) => {
  try {
    const [periodos] = await db.query(
      `
      SELECT *
      FROM periodos_academicos
      ORDER BY activo DESC, fecha_inicio DESC
      `
    );
    res.json(periodos);
  } catch (error) {
    console.error("Error al obtener los períodos académicos:", error);
    res.status(500).json({ error: "Error al obtener los períodos académicos" });
  }
});

// Crear un nuevo período académico
apiRouter.post("/periodos_academicos", async (req, res) => {
  const { nombre_periodo, fecha_inicio, fecha_fin, activo } = req.body;
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
    res.status(201).json({
      id_periodo: result.insertId,
      nombre_periodo: nombre_periodo.toUpperCase(),
      fecha_inicio,
      fecha_fin,
      activo: activo ?? 1,
    });
  } catch (error) {
    console.error("Error al crear el período académico:", error);
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
  try {
    const [result] = await db.query(
      `
      UPDATE periodos_academicos
      SET nombre_periodo = ?, fecha_inicio = ?, fecha_fin = ?, activo = ?
      WHERE id_periodo = ?
      `,
      [nombre_periodo.toUpperCase(), fecha_inicio, fecha_fin, activo, id]
    );
    if (result.affectedRows > 0) {
      res.json({
        id_periodo: +id,
        nombre_periodo: nombre_periodo.toUpperCase(),
        fecha_inicio,
        fecha_fin,
        activo,
      });
    } else {
      res.status(404).json({ error: "Período académico no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el período académico:", error);
    res.status(500).json({ error: "Error al actualizar el período académico" });
  }
});

// Eliminar un período académico (DELETE físico)
apiRouter.delete("/periodos_academicos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM periodos_academicos WHERE id_periodo = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Período académico eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Período académico no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el período académico:", error);
    res.status(500).json({ error: "Error al eliminar el período académico" });
  }
});

/* ===========================
   API DE CATEGORÍAS (CRUD)
   =========================== */
// Obtener todas las categorías activas
apiRouter.get("/categorias", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM categorias
      WHERE activo = 1
      ORDER BY nombre_categoria
      `
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

// Crear una nueva categoría
apiRouter.post("/categorias", async (req, res) => {
  const { nombre_categoria, descripcion } = req.body;
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
    res.status(201).json({
      id_categoria: result.insertId,
      nombre_categoria: nombre_categoria.toUpperCase(),
      descripcion: descripcion || null,
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
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
  if (!nombre_categoria) {
    return res.status(400).json({
      message: "El nombre de la categoría es obligatorio",
    });
  }
  try {
    const [result] = await db.query(
      `
      UPDATE categorias
      SET nombre_categoria = ?, descripcion = ?
      WHERE id_categoria = ? AND activo = 1
      `,
      [nombre_categoria.toUpperCase(), descripcion || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
});

// Desactivar (soft delete) una categoría
apiRouter.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "UPDATE categorias SET activo = 0 WHERE id_categoria = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría desactivada con éxito" });
  } catch (error) {
    console.error("Error al desactivar categoría:", error);
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

  // Validaciones básicas
  if (!codigo_institucional || !clase_de_bien) {
    return res.status(400).json({
      error: "El código institucional y la clase de bien son obligatorios",
    });
  }

  try {
    // Llamada al stored procedure “guardar_bien”
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
        valor != null ? valor : 0,
        codigo_anterior || null,
        fecha_adquisicion || null,
        vida_util_anos || 5,
        periodo_academico_id || null,
        JSON.stringify(categorias || []),
        JSON.stringify(ubicaciones || []),
        JSON.stringify(usuarios || []),
      ]
    );
    // El stored procedure devuelve en resultSets[0][0].id_bien_creado
    const id_bien_creado = resultSets[0][0]?.id_bien_creado;
    res
      .status(201)
      .json({ message: "Bien registrado con éxito", id_bien_creado });
  } catch (err) {
    console.error("Error al guardar el bien:", err);
    if (err.message.includes("código institucional ya existe")) {
      res.status(409).json({ error: "El código institucional ya existe" });
    } else {
      res.status(500).json({ error: "Error al guardar el bien" });
    }
  }
});

// Obtener todos los bienes (usando la vista v_resumen_bienes)
apiRouter.get("/bienes", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM v_resumen_bienes
      ORDER BY created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener los bienes:", err);
    res.status(500).json({ error: "Error al obtener los bienes" });
  }
});

// Obtener un bien por ID con detalles completos (usa getAssetDetails)
apiRouter.get("/bienes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [resultSets] = await db.query("CALL getAssetDetails(?)", [id]);
    if (!resultSets[0] || resultSets[0].length === 0) {
      return res.status(404).json({ error: "Bien no encontrado" });
    }
    res.status(200).json(resultSets[0][0]);
  } catch (err) {
    console.error("Error al obtener el bien:", err);
    res.status(500).json({ error: "Error al obtener el bien" });
  }
});

// Buscar bienes con filtros (usa buscar_bienes)
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
    // El procedimiento devuelve resultSets[0] como el conjunto de resultados
    res.status(200).json(resultSets[0] || []);
  } catch (err) {
    console.error("Error al buscar bienes:", err);
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
        vida_util_anos = ?
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
        valor != null ? valor : 0,
        codigo_anterior || null,
        fecha_adquisicion || null,
        vida_util_anos || 5,
        id,
      ]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Bien actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Bien no encontrado" });
    }
  } catch (err) {
    console.error("Error al actualizar el bien:", err);
    res.status(500).json({ error: "Error al actualizar el bien" });
  }
});

// Eliminar un bien (DELETE físico; las relaciones en otras tablas tienen ON DELETE CASCADE)
apiRouter.delete("/bienes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM bienes WHERE id_bien = ?", [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Bien eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Bien no encontrado" });
    }
  } catch (err) {
    console.error("Error al eliminar el bien:", err);
    res.status(500).json({ error: "Error al eliminar el bien" });
  }
});

/* =========================================
   ENDPOINT ADICIONAL: Estadísticas Dashboard
   ========================================= */
apiRouter.get("/dashboard/stats", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM bienes) AS total_bienes,
        (SELECT COUNT(*) FROM bienes WHERE estado = 'Activo') AS bienes_activos,
        (SELECT COUNT(*) FROM bienes WHERE estado = 'En Reparación') AS bienes_reparacion,
        (SELECT COUNT(*) FROM bienes WHERE estado = 'Dado de Baja') AS bienes_baja,
        (SELECT COUNT(*) FROM usuarios WHERE activo = 1) AS total_usuarios,
        (SELECT COUNT(*) FROM ubicaciones WHERE activo = 1) AS total_ubicaciones,
        (SELECT COUNT(*) FROM categorias WHERE activo = 1) AS total_categorias,
        (SELECT SUM(valor) FROM bienes) AS valor_total_bienes
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

/* ───── Usa el router bajo la ruta /api ───── */
app.use("/api", apiRouter);

/* ───── Middleware para rutas no encontradas ───── */
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

/* ───── Manejo de cierre “graceful” ───── */
process.on("SIGINT", async () => {
  console.log("\n🔄 Cerrando servidor...");
  try {
    await db.end(); // Cierra el pool de conexiones
    console.log("✅ Base de datos desconectada");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al cerrar la base de datos:", err);
    process.exit(1);
  }
});

/* ───── Iniciar el servidor en el puerto definido ───── */
server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${port}`);
  console.log(`📊 API disponible en http://0.0.0.0:${port}/api`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
});
