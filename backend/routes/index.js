const express = require("express");
const router = express.Router();
const { query, testConnection } = require("../config/database");
const { initializeDatabase } = require("../config/init-database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
};

// ==================== RUTAS PÚBLICAS ====================

// Ruta principal de la API
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Sistema de Bienes Institucionales",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Ruta para probar conexión a la base de datos
router.get("/test-db", async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      success: isConnected,
      message: isConnected ? "Conexión exitosa" : "Error de conexión",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error probando conexión",
      error: error.message,
    });
  }
});

// Ruta para inicializar la base de datos
router.post("/init-db", async (req, res) => {
  try {
    const initialized = await initializeDatabase();
    res.json({
      success: initialized,
      message: initialized
        ? "Base de datos inicializada"
        : "Error inicializando base de datos",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error inicializando base de datos",
      error: error.message,
    });
  }
});

// ==================== AUTENTICACIÓN ====================

// Test endpoint
router.post("/auth/test", (req, res) => {
  console.log("Test endpoint called with body:", req.body);
  res.json({ success: true, message: "Test endpoint works", body: req.body });
});

// Login
router.post("/auth/login", async (req, res) => {
  try {
    console.log("=== LOGIN ATTEMPT ===");
    const { email, password } = req.body;
    console.log("Request body:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    // Validar que el email sea del dominio institucional
    if (!email.endsWith('@intsuperior.edu.ec')) {
      return res.status(400).json({
        success: false,
        message: "Solo se permiten emails institucionales (@intsuperior.edu.ec)",
      });
    }

    const users = await query(
      "SELECT * FROM usuarios WHERE email = ? AND activo = 1",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    const user = users[0];
    console.log("Usuario encontrado:", user);
    console.log("Password hash:", user.password_hash);

    // Función para verificar contraseñas con diferentes métodos
    const verifyPassword = async (password, hash) => {
      console.log("Verificando password:", { password, hash });
      if (!hash) {
        console.log("Hash es null o undefined");
        return false;
      }
      // Si el hash usa el formato pbkdf2_sha512 (nuestro nuevo formato)
      if (hash.startsWith("pbkdf2_sha512$")) {
        const crypto = require("crypto");
        const [algorithm, iterations, salt, hashedPassword] = hash.split("$");
        const testHash = crypto.pbkdf2Sync(
          password,
          salt,
          parseInt(iterations),
          64,
          "sha512"
        );
        return hashedPassword === testHash.toString("hex");
      }

      // Si el hash usa bcrypt (formato anterior)
      if (hash.startsWith("$2b$") || hash.startsWith("$2a$")) {
        return bcrypt.compareSync(password, hash);
      }

      // Fallback: comparación directa (solo para desarrollo)
      return password === hash;
    };

    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Obtener roles reales del usuario
    const rolesQuery = await query(
      `
      SELECT r.id_rol, r.nombre_rol, r.descripcion
      FROM usuario_rol ur 
      JOIN roles r ON ur.id_rol = r.id_rol 
      WHERE ur.id_usuario = ?
    `,
      [user.id_usuario]
    );

    const roles = rolesQuery.map((r) => ({
      id: r.id_rol,
      nombre: r.nombre_rol,
      descripcion: r.descripcion,
      permisos: [], // TODO: Agregar permisos específicos si es necesario
    }));

    const token = jwt.sign(
      {
        id: user.id_usuario,
        email: user.email,
        roles: roles.map((r) => r.nombre),
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        token,
        user: {
          id: user.id_usuario,
          nombre: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          cedula: user.cedula,
          activo: user.activo,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        roles, // <-- array de roles
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el login",
      error: error.message,
    });
  }
});

// ==================== RUTAS PROTEGIDAS ====================

// Obtener usuario actual (para inicialización)
router.get("/auth/me", verifyToken, async (req, res) => {
  try {
    const users = await query(
      `
      SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.cedula, u.activo, u.created_at, u.updated_at
      FROM usuarios u
      WHERE u.id_usuario = ?
    `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Obtener roles del usuario con permisos
    const rolesQuery = await query(
      `
      SELECT r.id_rol, r.nombre_rol 
      FROM usuario_rol ur 
      JOIN roles r ON ur.id_rol = r.id_rol 
      WHERE ur.id_usuario = ?
    `,
      [req.user.id]
    );

    const roles = rolesQuery.map((r) => ({
      id: r.id_rol,
      nombre: r.nombre_rol,
      permisos: [], // Agregar permisos vacíos por ahora
    }));

    const userData = users[0];
    res.json({
      success: true,
      data: {
        user: {
          id: userData.id_usuario,
          nombre: userData.nombres,
          apellido: userData.apellidos,
          email: userData.email,
          documento: userData.cedula,
          telefono: "",
          activo: userData.activo,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        },
        roles: roles,
        permissions: [], // Agregar permisos específicos si es necesario
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo datos del usuario",
      error: error.message,
    });
  }
});

// Obtener perfil del usuario
router.get("/auth/profile", verifyToken, async (req, res) => {
  try {
    const users = await query(
      `
      SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.cedula
      FROM usuarios u
      WHERE u.id_usuario = ?
    `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Obtener roles del usuario con permisos
    const rolesQuery = await query(
      `
      SELECT r.id_rol, r.nombre_rol 
      FROM usuario_rol ur 
      JOIN roles r ON ur.id_rol = r.id_rol 
      WHERE ur.id_usuario = ?
    `,
      [req.user.id]
    );

    const roles = rolesQuery.map((r) => ({
      id: r.id_rol,
      nombre: r.nombre_rol,
      permisos: [], // Agregar permisos vacíos por ahora
    }));

    const userData = users[0];
    res.json({
      success: true,
      data: {
        user: {
          id: userData.id_usuario,
          nombre: userData.nombres,
          apellido: userData.apellidos,
          email: userData.email,
          documento: userData.cedula,
          telefono: "",
          activo: userData.activo,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        },
        roles: roles,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo perfil",
      error: error.message,
    });
  }
});

// ==================== USUARIOS ====================

// Crear usuario
router.post("/usuarios", verifyToken, async (req, res) => {
  try {
    const { nombre, apellido, email, documento, departamento, rol, password } =
      req.body;

    if (!nombre || !apellido || !email || !documento || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Campos requeridos: nombre, apellido, email, documento, password",
      });
    }

    // Validar que el email sea del dominio institucional
    if (!email.endsWith('@intsuperior.edu.ec')) {
      return res.status(400).json({
        success: false,
        message: "Solo se permiten emails institucionales (@intsuperior.edu.ec)",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await query(
      "SELECT * FROM usuarios WHERE email = ? OR cedula = ?",
      [email, documento]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con ese email o documento",
      });
    }

    // Crear hash de contraseña
    const crypto = require("crypto");
    const salt = crypto.randomBytes(32).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    const passwordHash = `pbkdf2_sha512$10000$${salt}$${hashedPassword}`;

    // Insertar usuario
    const result = await query(
      "INSERT INTO usuarios (nombres, apellidos, cedula, email, password_hash, activo) VALUES (?, ?, ?, ?, ?, 1)",
      [nombre, apellido, documento, email, passwordHash]
    );

    // Asignar rol si se proporciona
    if (rol) {
      const roleQuery = await query(
        "SELECT id_rol FROM roles WHERE nombre_rol = ?",
        [rol]
      );
      if (roleQuery.length > 0) {
        await query(
          "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)",
          [result.insertId, roleQuery[0].id_rol]
        );
      }
    }

    res.json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { id: result.insertId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creando usuario",
      error: error.message,
    });
  }
});

// Obtener usuarios
router.get("/usuarios", verifyToken, async (req, res) => {
  try {
    const usuarios = await query(`
      SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.cedula, u.activo, u.created_at, r.nombre_rol as rol
      FROM usuarios u
      LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
      LEFT JOIN roles r ON ur.id_rol = r.id_rol
      ORDER BY u.created_at DESC
    `);

    // Mapear campos para compatibilidad con frontend
    const usuariosFormated = usuarios.map((user) => ({
      id: user.id_usuario,
      nombre: user.nombres,
      apellido: user.apellidos,
      email: user.email,
      documento: user.cedula,
      telefono: user.telefono || "",
      departamento: user.departamento || "",
      rol: user.rol || "Usuario",
      estado: user.activo ? "activo" : "inactivo",
      activo: user.activo,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    res.json({
      success: true,
      data: usuariosFormated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo usuarios",
      error: error.message,
    });
  }
});

// Actualizar usuario
router.put("/usuarios/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, documento, departamento, rol, activo } =
      req.body;

    // Verificar si el usuario existe
    const existingUser = await query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Actualizar usuario
    await query(
      "UPDATE usuarios SET nombres = ?, apellidos = ?, email = ?, cedula = ?, activo = ? WHERE id_usuario = ?",
      [
        nombre,
        apellido,
        email,
        documento,
        activo !== undefined ? activo : 1,
        id,
      ]
    );

    // Actualizar rol si se proporciona
    if (rol) {
      // Eliminar roles anteriores
      await query("DELETE FROM usuario_rol WHERE id_usuario = ?", [id]);

      // Agregar nuevo rol
      const roleQuery = await query(
        "SELECT id_rol FROM roles WHERE nombre_rol = ?",
        [rol]
      );
      if (roleQuery.length > 0) {
        await query(
          "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)",
          [id, roleQuery[0].id_rol]
        );
      }
    }

    res.json({
      success: true,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error actualizando usuario",
      error: error.message,
    });
  }
});

// Eliminar usuario
router.delete("/usuarios/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const existingUser = await query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Eliminar relaciones de roles
    await query("DELETE FROM usuario_rol WHERE id_usuario = ?", [id]);

    // Eliminar usuario
    await query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);

    res.json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error eliminando usuario",
      error: error.message,
    });
  }
});

// ==================== ROLES ====================

// Obtener roles
router.get("/roles", verifyToken, async (req, res) => {
  try {
    const roles = await query("SELECT * FROM roles ORDER BY nombre_rol");

    // Mapear campos para compatibilidad con frontend
    const rolesFormated = roles.map((rol) => ({
      id: rol.id_rol,
      nombre: rol.nombre_rol,
      descripcion: rol.descripcion,
    }));

    res.json({
      success: true,
      data: rolesFormated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo roles",
      error: error.message,
    });
  }
});

// ==================== CATEGORÍAS ====================

// Obtener categorías
router.get("/categorias", verifyToken, async (req, res) => {
  try {
    const categorias = await query(
      "SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre_categoria"
    );

    // Mapear campos para compatibilidad con frontend
    const categoriasFormated = categorias.map((cat) => ({
      id: cat.id_categoria,
      nombre: cat.nombre_categoria,
      descripcion: cat.descripcion,
      activo: cat.activo,
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    }));

    res.json({
      success: true,
      data: categoriasFormated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo categorías",
      error: error.message,
    });
  }
});

// Crear categoría
router.post("/categorias", verifyToken, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es requerido",
      });
    }

    // Verificar si la categoría ya existe
    const existing = await query(
      "SELECT * FROM categorias WHERE nombre_categoria = ?",
      [nombre]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoría con ese nombre",
      });
    }

    // Insertar categoría
    const result = await query(
      "INSERT INTO categorias (nombre_categoria, descripcion, activo) VALUES (?, ?, 1)",
      [nombre, descripcion || null]
    );

    res.json({
      success: true,
      message: "Categoría creada exitosamente",
      data: { id: result.insertId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creando categoría",
      error: error.message,
    });
  }
});

// Actualizar categoría
router.put("/categorias/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;

    // Verificar si la categoría existe
    const existing = await query(
      "SELECT * FROM categorias WHERE id_categoria = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    // Actualizar categoría
    await query(
      "UPDATE categorias SET nombre_categoria = ?, descripcion = ?, activo = ? WHERE id_categoria = ?",
      [nombre, descripcion, activo !== undefined ? activo : 1, id]
    );

    res.json({
      success: true,
      message: "Categoría actualizada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error actualizando categoría",
      error: error.message,
    });
  }
});

// Eliminar categoría
router.delete("/categorias/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la categoría existe
    const existing = await query(
      "SELECT * FROM categorias WHERE id_categoria = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    // Verificar si hay bienes asociados
    const bienes = await query(
      "SELECT COUNT(*) as count FROM bienes WHERE categoria_id = ?",
      [id]
    );
    if (bienes[0].count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar la categoría porque tiene bienes asociados",
      });
    }

    // Eliminar categoría
    await query("DELETE FROM categorias WHERE id_categoria = ?", [id]);

    res.json({
      success: true,
      message: "Categoría eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error eliminando categoría",
      error: error.message,
    });
  }
});

// ==================== UBICACIONES ====================

// Obtener ubicaciones
router.get("/ubicaciones", verifyToken, async (req, res) => {
  try {
    const ubicaciones = await query(
      "SELECT * FROM ubicaciones WHERE activo = 1 ORDER BY area"
    );

    // Mapear campos para compatibilidad con frontend
    const ubicacionesFormated = ubicaciones.map((ub) => ({
      id: ub.id_ubicacion,
      nombre: ub.area, // El frontend espera 'nombre' pero la DB usa 'area'
      descripcion: ub.descripcion,
      edificio: ub.sede || "",
      piso: ub.piso || "",
      aula: ub.numero_aula || "",
      tipo: ub.tipo || "oficina",
      capacidad: ub.capacidad || 0,
      estado: ub.activo ? "activo" : "inactivo",
      bienesAsignados: 0, // Se calculará dinámicamente
      activo: ub.activo,
      created_at: ub.created_at,
      updated_at: ub.updated_at,
    }));

    res.json({
      success: true,
      data: ubicacionesFormated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo ubicaciones",
      error: error.message,
    });
  }
});

// Crear ubicación
router.post("/ubicaciones", verifyToken, async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      edificio,
      piso,
      aula,
      tipo,
      capacidad,
      estado,
    } = req.body;

    if (!nombre || !edificio) {
      return res.status(400).json({
        success: false,
        message: "Nombre y edificio son requeridos",
      });
    }

    // Verificar si la ubicación ya existe
    const existing = await query(
      "SELECT * FROM ubicaciones WHERE area = ? AND sede = ?",
      [nombre, edificio]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una ubicación con ese nombre en el edificio",
      });
    }

    // Insertar ubicación
    const result = await query(
      "INSERT INTO ubicaciones (area, descripcion, sede, piso, numero_aula, tipo, capacidad, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        descripcion || null,
        edificio,
        piso || null,
        aula || null,
        tipo || "oficina",
        capacidad || 0,
        estado === "activo" ? 1 : 0,
      ]
    );

    res.json({
      success: true,
      message: "Ubicación creada exitosamente",
      data: { id: result.insertId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creando ubicación",
      error: error.message,
    });
  }
});

// Actualizar ubicación
router.put("/ubicaciones/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      edificio,
      piso,
      aula,
      tipo,
      capacidad,
      estado,
    } = req.body;

    // Verificar si la ubicación existe
    const existing = await query(
      "SELECT * FROM ubicaciones WHERE id_ubicacion = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ubicación no encontrada",
      });
    }

    // Actualizar ubicación
    await query(
      "UPDATE ubicaciones SET area = ?, descripcion = ?, sede = ?, piso = ?, numero_aula = ?, tipo = ?, capacidad = ?, activo = ? WHERE id_ubicacion = ?",
      [
        nombre,
        descripcion,
        edificio,
        piso,
        aula,
        tipo || "oficina",
        capacidad || 0,
        estado === "activo" ? 1 : 0,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Ubicación actualizada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error actualizando ubicación",
      error: error.message,
    });
  }
});

// Eliminar ubicación
router.delete("/ubicaciones/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la ubicación existe
    const existing = await query(
      "SELECT * FROM ubicaciones WHERE id_ubicacion = ?",
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ubicación no encontrada",
      });
    }

    // Verificar si hay bienes asociados
    const bienes = await query(
      "SELECT COUNT(*) as count FROM bienes WHERE ubicacion_id = ?",
      [id]
    );
    if (bienes[0].count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar la ubicación porque tiene bienes asociados",
      });
    }

    // Eliminar ubicación
    await query("DELETE FROM ubicaciones WHERE id_ubicacion = ?", [id]);

    res.json({
      success: true,
      message: "Ubicación eliminada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error eliminando ubicación",
      error: error.message,
    });
  }
});

// ==================== BIENES ====================

// Obtener bienes
router.get("/bienes", verifyToken, async (req, res) => {
  try {
    const bienes = await query(`
      SELECT 
        b.*,
        c.nombre_categoria as categoria_nombre,
        u.area as ubicacion_nombre,
        usr.nombres as usuario_nombre,
        usr.apellidos as usuario_apellidos
      FROM bienes b
      LEFT JOIN categorias c ON b.categoria_id = c.id_categoria
      LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id_ubicacion
      LEFT JOIN usuarios usr ON b.responsable_id = usr.id_usuario
      ORDER BY b.created_at DESC
    `);

    // Mapear campos para compatibilidad con frontend
    const bienesFormated = bienes.map((bien) => ({
      id: bien.id_bien,
      codigo_institucional: bien.codigo_institucional,
      codigo_senescyt: bien.codigo_senescyt,
      nombre: bien.nombre,
      descripcion: bien.descripcion,
      marca: bien.marca,
      modelo: bien.modelo,
      serie: bien.serie,
      estado: bien.estado.toLowerCase(),
      valor_adquisicion: bien.valor,
      fecha_adquisicion: bien.fecha_adquisicion,
      vida_util: bien.vida_util,
      categoria_id: bien.categoria_id,
      categoria: {
        id: bien.categoria_id,
        nombre: bien.categoria_nombre,
      },
      ubicacion_id: bien.ubicacion_id,
      ubicacion: {
        id: bien.ubicacion_id,
        nombre: bien.ubicacion_nombre,
      },
      responsable_id: bien.responsable_id,
      responsable: {
        id: bien.responsable_id,
        nombre: bien.usuario_nombre,
        apellido: bien.usuario_apellidos,
      },
      observaciones: bien.observaciones,
      created_at: bien.created_at,
      updated_at: bien.updated_at,
    }));

    res.json({
      success: true,
      data: bienesFormated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo bienes",
      error: error.message,
    });
  }
});

// Obtener bien por ID
router.get("/bienes/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const bienes = await query(
      `
      SELECT 
        b.*,
        c.nombre_categoria as categoria_nombre,
        u.area as ubicacion_nombre,
        usr.nombres as usuario_nombre,
        usr.apellidos as usuario_apellidos
      FROM bienes b
      LEFT JOIN categorias c ON b.categoria_id = c.id_categoria
      LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id_ubicacion
      LEFT JOIN usuarios usr ON b.responsable_id = usr.id_usuario
      WHERE b.id_bien = ?
    `,
      [id]
    );

    if (bienes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    res.json({
      success: true,
      data: bienes[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo bien",
      error: error.message,
    });
  }
});

// ==================== DASHBOARD ====================

// Obtener métricas del dashboard
router.get("/dashboard/stats", verifyToken, async (req, res) => {
  try {
    // Obtener total de bienes
    const totalBienes = await query("SELECT COUNT(*) as total FROM bienes");

    // Obtener valor total
    const valorTotal = await query("SELECT SUM(valor) as total FROM bienes");

    // Obtener alertas activas
    const alertasActivas = await query(
      "SELECT COUNT(*) as total FROM alertas WHERE estado = 'pendiente'"
    );

    // Obtener usuarios activos
    const usuariosActivos = await query(
      "SELECT COUNT(*) as total FROM usuarios WHERE activo = 1"
    );

    // Obtener bienes agregados este mes
    const bienesEsteMes = await query(`
      SELECT COUNT(*) as total 
      FROM bienes 
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    const stats = {
      totalBienes: totalBienes[0]?.total || 0,
      valorTotal: valorTotal[0]?.total || 0,
      alertasActivas: alertasActivas[0]?.total || 0,
      usuariosActivos: usuariosActivos[0]?.total || 0,
      incrementoBienes: bienesEsteMes[0]?.total || 0,
      incrementoValor: 5.2, // Calculado dinámicamente más tarde
      alertasCriticas: 2,
      nuevosUsuarios: 3,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo estadísticas del dashboard",
      error: error.message,
    });
  }
});

// Obtener bienes por categoría
router.get("/dashboard/bienes-por-categoria", verifyToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.nombre_categoria as nombre,
        COUNT(b.id_bien) as cantidad,
        ROUND((COUNT(b.id_bien) * 100.0) / (SELECT COUNT(*) FROM bienes), 2) as porcentaje
      FROM categorias c
      LEFT JOIN bienes b ON c.id_categoria = b.categoria_id
      GROUP BY c.id_categoria, c.nombre_categoria
      ORDER BY cantidad DESC
    `);

    // Agregar colores para el gráfico
    const colores = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#84CC16",
    ];
    const data = result.map((item, index) => ({
      ...item,
      color: colores[index % colores.length],
    }));

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo bienes por categoría",
      error: error.message,
    });
  }
});

// Obtener valor por ubicación
router.get("/dashboard/valor-por-ubicacion", verifyToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.area as nombre,
        COALESCE(SUM(b.valor), 0) as valor,
        COUNT(b.id_bien) as cantidad
      FROM ubicaciones u
      LEFT JOIN bienes b ON u.id_ubicacion = b.ubicacion_id
      GROUP BY u.id_ubicacion, u.area
      ORDER BY valor DESC
    `);

    // Calcular porcentajes
    const total = result.reduce((sum, item) => sum + item.valor, 0);
    const colores = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#84CC16",
    ];

    const data = result.map((item, index) => ({
      ...item,
      porcentaje: total > 0 ? Math.round((item.valor * 100) / total) : 0,
      color: colores[index % colores.length],
    }));

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo valor por ubicación",
      error: error.message,
    });
  }
});

// Obtener alertas recientes
router.get("/dashboard/alertas-recientes", verifyToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        a.id_alerta as id,
        a.tipo_alerta as tipo,
        a.descripcion as titulo,
        a.descripcion,
        a.fecha_alerta as tiempo,
        b.codigo_institucional as bien_codigo
      FROM alertas a
      LEFT JOIN bienes b ON a.id_bien = b.id_bien
      WHERE a.estado = 'pendiente'
      ORDER BY a.fecha_alerta DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo alertas recientes",
      error: error.message,
    });
  }
});

// Obtener actividades recientes
router.get(
  "/dashboard/actividades-recientes",
  verifyToken,
  async (req, res) => {
    try {
      const result = await query(`
      SELECT 
        ab.id_auditoria as id,
        CONCAT(u.nombres, ' ', u.apellidos) as usuario,
        ab.accion,
        ab.created_at as tiempo,
        b.codigo_institucional as bien_codigo
      FROM auditoria_bienes ab
      LEFT JOIN usuarios u ON ab.usuario_id = u.id_usuario
      LEFT JOIN bienes b ON ab.id_bien = b.id_bien
      ORDER BY ab.created_at DESC
      LIMIT 10
    `);

      const data = result.map((item) => ({
        ...item,
        detalle: `${item.accion} bien ${item.bien_codigo || "N/A"}`,
      }));

      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error obteniendo actividades recientes",
        error: error.message,
      });
    }
  }
);

// Buscar bien por código QR
router.get("/bienes/search", verifyToken, async (req, res) => {
  try {
    const { codigo, qr } = req.query;

    if (!codigo && !qr) {
      return res.status(400).json({
        success: false,
        message: "Código o datos QR requeridos",
      });
    }

    let searchCode = codigo;

    // Si viene datos QR completos, intentar parsearlo
    if (qr && !codigo) {
      try {
        const qrData = JSON.parse(qr);
        searchCode = qrData.codigo || qrData.codigo_institucional;
      } catch (e) {
        // Si no es JSON válido, usar como código directo
        searchCode = qr;
      }
    }

    const result = await query(
      `
      SELECT 
        b.*,
        c.nombre_categoria as categoria_nombre,
        u.area as ubicacion_nombre,
        usr.nombres as usuario_nombre,
        usr.apellidos as usuario_apellidos
      FROM bienes b
      LEFT JOIN categorias c ON b.categoria_id = c.id_categoria
      LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id_ubicacion
      LEFT JOIN usuarios usr ON b.responsable_id = usr.id_usuario
      WHERE b.codigo_institucional = ? OR b.codigo_senescyt = ? OR b.serie = ?
      ORDER BY b.created_at DESC
    `,
      [searchCode, searchCode, searchCode]
    );

    res.json({
      success: true,
      data: result,
      searchCode: searchCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error buscando bien por código QR",
      error: error.message,
    });
  }
});

// Generar código QR para un bien
router.get("/generateQRCode/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el bien con información completa
    const bienes = await query(
      `
      SELECT 
        b.*,
        c.nombre_categoria as categoria_nombre,
        u.area as ubicacion_nombre,
        usr.nombres as usuario_nombre,
        usr.apellidos as usuario_apellidos
      FROM bienes b
      LEFT JOIN categorias c ON b.categoria_id = c.id_categoria
      LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id_ubicacion
      LEFT JOIN usuarios usr ON b.responsable_id = usr.id_usuario
      WHERE b.id_bien = ?
    `,
      [id]
    );

    if (bienes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    const bien = bienes[0];

    // Crear datos estructurados para el QR
    const qrData = {
      id: bien.id_bien,
      codigo: bien.codigo_institucional,
      codigo_senescyt: bien.codigo_senescyt,
      nombre: bien.nombre,
      descripcion: bien.descripcion,
      marca: bien.marca,
      modelo: bien.modelo,
      serie: bien.serie,
      estado: bien.estado,
      categoria: bien.categoria_nombre,
      ubicacion: bien.ubicacion_nombre,
      responsable: bien.usuario_nombre
        ? `${bien.usuario_nombre} ${bien.usuario_apellidos}`
        : null,
      valor: bien.valor,
      fecha_adquisicion: bien.fecha_adquisicion,
      url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/bienes/${bien.id_bien}`,
      sistema: "Instituto Nelson Torres - Gestión de Bienes",
      timestamp: new Date().toISOString(),
    };

    // Usar la librería qrcode para generar QR real
    const QRCode = require("qrcode");
    const qrString = JSON.stringify(qrData);

    // Generar QR como Data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        qrData: qrData,
        codigo: bien.codigo_institucional,
        bien: bien,
      },
    });
  } catch (error) {
    console.error("Error generando código QR:", error);
    res.status(500).json({
      success: false,
      message: "Error generando código QR",
      error: error.message,
    });
  }
});

// Generar QR en diferentes formatos
router.get("/generateQRCode/:id/:format?", verifyToken, async (req, res) => {
  try {
    const { id, format = "json" } = req.params;

    // Obtener el bien con información completa
    const bienes = await query(
      `
      SELECT 
        b.*,
        c.nombre_categoria as categoria_nombre,
        u.area as ubicacion_nombre,
        usr.nombres as usuario_nombre,
        usr.apellidos as usuario_apellidos
      FROM bienes b
      LEFT JOIN categorias c ON b.categoria_id = c.id_categoria
      LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id_ubicacion
      LEFT JOIN usuarios usr ON b.responsable_id = usr.id_usuario
      WHERE b.id_bien = ?
    `,
      [id]
    );

    if (bienes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    const bien = bienes[0];

    let qrString;

    // Generar contenido según formato
    switch (format.toLowerCase()) {
      case "simple":
        qrString = bien.codigo_institucional;
        break;
      case "url":
        qrString = `${process.env.FRONTEND_URL || "http://localhost:3001"}/bienes/${bien.id_bien}`;
        break;
      case "compact":
        qrString = JSON.stringify({
          id: bien.id_bien,
          codigo: bien.codigo_institucional,
          nombre: bien.nombre,
          url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/bienes/${bien.id_bien}`,
        });
        break;
      default: // 'json' o formato completo
        qrString = JSON.stringify({
          id: bien.id_bien,
          codigo: bien.codigo_institucional,
          codigo_senescyt: bien.codigo_senescyt,
          nombre: bien.nombre,
          descripcion: bien.descripcion,
          marca: bien.marca,
          modelo: bien.modelo,
          serie: bien.serie,
          estado: bien.estado,
          categoria: bien.categoria_nombre,
          ubicacion: bien.ubicacion_nombre,
          responsable: bien.usuario_nombre
            ? `${bien.usuario_nombre} ${bien.usuario_apellidos}`
            : null,
          valor: bien.valor,
          fecha_adquisicion: bien.fecha_adquisicion,
          url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/bienes/${bien.id_bien}`,
          sistema: "Instituto Nelson Torres - Gestión de Bienes",
          timestamp: new Date().toISOString(),
        });
    }

    // Usar la librería qrcode para generar QR real
    const QRCode = require("qrcode");

    // Generar QR como Data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        qrString: qrString,
        format: format,
        codigo: bien.codigo_institucional,
        bien: bien,
      },
    });
  } catch (error) {
    console.error("Error generando código QR:", error);
    res.status(500).json({
      success: false,
      message: "Error generando código QR",
      error: error.message,
    });
  }
});

// Crear bien
router.post("/bienes", verifyToken, async (req, res) => {
  try {
    const {
      codigo_institucional,
      codigo_senescyt,
      nombre,
      descripcion,
      marca,
      modelo,
      serie,
      estado,
      valor_adquisicion,
      fecha_adquisicion,
      vida_util,
      categoria_id,
      ubicacion_id,
      responsable_id,
      observaciones,
      color,
      material,
    } = req.body;

    if (!codigo_institucional || !codigo_senescyt || !nombre || !categoria_id) {
      return res.status(400).json({
        success: false,
        message:
          "Campos requeridos: codigo_institucional, codigo_senescyt, nombre, categoria_id",
      });
    }

    // Verificar si el bien ya existe
    const existing = await query(
      "SELECT * FROM bienes WHERE codigo_institucional = ? OR codigo_senescyt = ?",
      [codigo_institucional, codigo_senescyt]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un bien con ese código institucional o SENESCYT",
      });
    }

    // Insertar bien
    const result = await query(
      `INSERT INTO bienes (
        codigo_institucional, codigo_senescyt, nombre, descripcion, marca, modelo, serie, 
        estado, valor_adquisicion, fecha_adquisicion, vida_util, categoria_id, ubicacion_id, 
        responsable_id, observaciones, color, material
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo_institucional,
        codigo_senescyt,
        nombre,
        descripcion || null,
        marca || null,
        modelo || null,
        serie || null,
        estado || "ACTIVO",
        valor_adquisicion || 0,
        fecha_adquisicion || null,
        vida_util || null,
        categoria_id,
        ubicacion_id || null,
        responsable_id || null,
        observaciones || null,
        color || null,
        material || null,
      ]
    );

    res.json({
      success: true,
      message: "Bien creado exitosamente",
      data: { id: result.insertId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creando bien",
      error: error.message,
    });
  }
});

// Actualizar bien
router.put("/bienes/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo_institucional,
      codigo_senescyt,
      nombre,
      descripcion,
      marca,
      modelo,
      serie,
      estado,
      valor_adquisicion,
      fecha_adquisicion,
      vida_util,
      categoria_id,
      ubicacion_id,
      responsable_id,
      observaciones,
      color,
      material,
    } = req.body;

    // Verificar si el bien existe
    const existing = await query("SELECT * FROM bienes WHERE id_bien = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    // Actualizar bien
    await query(
      `UPDATE bienes SET 
        codigo_institucional = ?, codigo_senescyt = ?, nombre = ?, descripcion = ?, 
        marca = ?, modelo = ?, serie = ?, estado = ?, valor_adquisicion = ?, fecha_adquisicion = ?, 
        vida_util = ?, categoria_id = ?, ubicacion_id = ?, responsable_id = ?, observaciones = ?,
        color = ?, material = ?
      WHERE id_bien = ?`,
      [
        codigo_institucional,
        codigo_senescyt,
        nombre,
        descripcion,
        marca,
        modelo,
        serie,
        estado,
        valor_adquisicion,
        fecha_adquisicion,
        vida_util,
        categoria_id,
        ubicacion_id,
        responsable_id,
        observaciones,
        color,
        material,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Bien actualizado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error actualizando bien",
      error: error.message,
    });
  }
});

// Eliminar bien
router.delete("/bienes/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el bien existe
    const existing = await query("SELECT * FROM bienes WHERE id_bien = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    // Eliminar registros relacionados primero
    await query("DELETE FROM auditoria_bienes WHERE id_bien = ?", [id]);
    await query("DELETE FROM alertas WHERE id_bien = ?", [id]);

    // Eliminar bien
    await query("DELETE FROM bienes WHERE id_bien = ?", [id]);

    res.json({
      success: true,
      message: "Bien eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error eliminando bien",
      error: error.message,
    });
  }
});

module.exports = router;
