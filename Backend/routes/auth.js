// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Para comparar contraseñas (login) y hashear (register)
const jwt = require('jsonwebtoken'); // Para crear los tokens de sesión
const { body, validationResult } = require('express-validator'); // Para validar la entrada (req.body)
const { prisma } = require('../config/database'); // Acceso directo a la base de datos
const { authenticateToken } = require('../middleware/auth'); // Importa el middleware de autenticación

const router = express.Router();

/**
 * Middleware local para manejar los errores de 'express-validator'.
 * Si hay errores de validación (ej. email inválido), detiene la
 * petición y envía una respuesta 400.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Si hay errores, responde con un 400
    return res.status(400).json({
      ok: false,
      message: 'Datos de entrada invalidos',
      errors: errors.array()
    });
  }
  // Si no hay errores, continúa con el controlador de la ruta
  next();
};

// ------------------------------------------
// 🔑 ENDPOINT: POST /api/auth/login
// ------------------------------------------
// Ruta pública para iniciar sesión
router.post('/login', [
  // Validaciones de entrada
  body('email').isEmail().normalizeEmail().withMessage('Email debe ser valido'),
  body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
  // Middleware que revisa las validaciones
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario en la BD que esté ACTIVO (estadoId: 1)
    const user = await prisma.cuentas.findFirst({
      where: {
        correo: email,
        estadoId: 1 // ¡Importante! No permite login a usuarios baneados
      },
      include: { rol: true, estado: true } // Incluye el ROL para el token
    });

    // 2. Si el usuario no existe (o está baneado), devuelve error 401
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Credenciales invalidas' });
    }

    // 3. Comparar la contraseña enviada con el hash guardado en la BD
    const passwordMatch = await bcrypt.compare(password, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ ok: false, message: 'Credenciales invalidas' });
    }

    // 4. Si todo es correcto, crear el JSON Web Token (JWT)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.correo,
        role: user.rol.nombre.toUpperCase() // Guarda el ROL en el token (crucial para 'requireAdmin')
      },
      process.env.JWT_SECRET, // Firma el token con el secreto del .env
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Define la expiración
    );

    // 5. Enviar respuesta exitosa con el token y los datos del usuario
    res.json({
      ok: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.correo,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.rol.nombre.toUpperCase(),
        campus: user.campus,
        reputacion: user.reputacion
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// 📝 ENDPOINT: POST /api/auth/register
// ------------------------------------------
// Ruta pública para registrar un nuevo usuario
router.post('/register', [
  // Validaciones de entrada
  body('email')
    .isEmail().normalizeEmail().withMessage('Email debe ser valido')
    .custom(async (email) => {
      // ¡LÓGICA DE NEGOCIO CLAVE!
      // Solo permite registros con correos de la universidad.
      if (!email.endsWith('@uct.cl') && !email.endsWith('@alu.uct.cl')) {
        throw new Error('Solo se permiten correos de @uct.cl o @alu.uct.cl');
      }
    }),
  body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('nombre').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('usuario').isLength({ min: 3 }).withMessage('Usuario debe tener al menos 3 caracteres'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, password, nombre, usuario } = req.body;

    // 1. Verificar si el email O el nombre de usuario ya existen
    const existingUser = await prisma.cuentas.findFirst({
      where: { OR: [{ correo: email }, { usuario: usuario }] }
    });

    if (existingUser) {
      const campo = existingUser.correo === email ? 'correo' : 'usuario';
      return res.status(409).json({ ok: false, message: `El ${campo} ya esta en uso` });
    }

    // 2. Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // ¡LÓGICA DE NEGOCIO! Asigna rol Vendedor (2) o Cliente (3) según el dominio.
    const rolId = email.endsWith('@uct.cl') ? 2 : 3;

    // 3. Crear el nuevo usuario en la base de datos
    const newUser = await prisma.cuentas.create({
      data: {
        correo: email,
        contrasena: hashedPassword,
        nombre,
        usuario,
        apellido: '',
        rolId,         // Rol asignado (Vendedor o Cliente)
        estadoId: 1,  // Se crea como ACTIVO
        campus: 'Campus Temuco'
      },
      include: { rol: true, estado: true }
    });

    // 4. IMPORTANTE: Crea la entrada de 'ResumenUsuario' para las estadísticas
    await prisma.resumenUsuario.create({
      data: {
        usuarioId: newUser.id,
        totalProductos: 0,
        totalVentas: 0,
        totalCompras: 0,
        promedioCalificacion: 0.0
      }
    });

    // 5. Crear el JWT para que el usuario inicie sesión automáticamente
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.correo, role: newUser.rol.nombre.toUpperCase() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 6. Enviar respuesta 201 (Creado)
    res.status(201).json({
      ok: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        correo: newUser.correo,
        usuario: newUser.usuario,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        role: newUser.rol.nombre.toUpperCase(),
        campus: newUser.campus
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// 🇬 ENDPOINT: POST /api/auth/google
// ------------------------------------------
// Ruta pública para manejar el inicio de sesión/registro con Google
router.post('/google', [
  // Valida que los datos básicos de Google vengan en el body
  body('idToken').notEmpty().withMessage('ID Token es requerido'),
  body('email').isEmail().withMessage('Email debe ser valido'),
  body('name').notEmpty().withMessage('Nombre es requerido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, name } = req.body;

    // 1. ¡LÓGICA DE NEGOCIO! Se re-aplica la restricción de dominio UCT.
    if (!email.endsWith('@uct.cl') && !email.endsWith('@alu.uct.cl')) {
      return res.status(403).json({ ok: false, message: 'Solo se permiten correos de @uct.cl o @alu.uct.cl' });
    }

    // 2. Lógica de "Find or Create" (Upsert)
    let user = await prisma.cuentas.findFirst({
      where: { correo: email, estadoId: 1 }, // Busca si el usuario ya existe y está activo
      include: { rol: true, estado: true }
    });

    // 3. Si el usuario NO existe, se crea
    if (!user) {
      // NOTA: Todos los registros de Google se asignan como 'Cliente' (ID 3) por defecto.
      const rolId = 3; // Cliente
      // Genera un nombre de usuario único inicial
      const baseUsuario = name.toLowerCase().replace(/\s+/g, '_');
      const usuario = `${baseUsuario}_${Date.now()}`;

      user = await prisma.cuentas.create({
        data: {
          correo: email,
          contrasena: '', // Se crea sin contraseña, la autenticación es por Google
          nombre: name,
          usuario,
          apellido: '',
          rolId,
          estadoId: 1,
          campus: 'Campus Temuco'
        },
        include: { rol: true, estado: true }
      });

      // 4. Crea el resumen de usuario (solo si es nuevo)
      await prisma.resumenUsuario.create({
        data: {
          usuarioId: user.id,
          totalProductos: 0,
          totalVentas: 0,
          totalCompras: 0,
          promedioCalificacion: 0.0
        }
      });
    }

    // 5. Crear el JWT para la sesión
    const token = jwt.sign(
      { userId: user.id, email: user.correo, role: user.rol.nombre.toUpperCase() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 6. Devolver el token y los datos del usuario
    res.json({
      ok: true,
      message: '¡Cuenta creada/actualizada en base de datos!',
      token,
      user: {
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        apellido: user.apellido || '',
        usuario: user.usuario,
        campus: user.campus || 'Campus Temuco',
        role: user.rol.nombre.toUpperCase(),
        // Informa al frontend qué campos puede editar el usuario
        editableFields: ['apellido', 'usuario', 'campus']
      }
    });
  } catch (error) {
    console.error('Error en login Google:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// 👤 ENDPOINT: GET /api/auth/me
// ------------------------------------------
// Ruta PROTEGIDA para obtener el perfil del usuario autenticado
router.get('/me', authenticateToken, async (req, res) => {
  // 'authenticateToken' se ejecuta primero.
  // Si el token es válido, 'req.user' (con el userId) está disponible.
  try {
    // FEATURE: Permite al cliente pedir "includes" dinámicos
    // Ejemplos:
    // /me?include=perfil           -> solo datos básicos
    // /me?include=notificaciones
    // /me?include=productos,seguidores
    // /me                          -> trae todo
    const { include } = req.query;

    // Define todas las relaciones que el frontend podría solicitar
    const relacionesDisponibles = {
      rol: true,
      estado: true,
      productos: { include: { categoria: true, estado: true, imagenes: true } },
      transaccionesCompra: { include: { producto: true, vendedor: true, estado: true } },
      transaccionesVenta: { include: { producto: true, comprador: true, estado: true } },
      calificacionesDadas: { include: { calificado: true, transaccion: true } },
      calificacionesRecibidas: { include: { calificador: true, transaccion: true } },
      carrito: { include: { producto: true } },
      actividades: true,
      mensajesEnviados: { include: { destinatario: true } },
      mensajesRecibidos: { include: { remitente: true } },
      reportes: { include: { producto: true, usuarioReportado: true, estado: true } },
      reportesRecibidos: { include: { reportante: true, producto: true, estado: true } },
      publicaciones: true,
      foros: true,
      publicacionesForo: { include: { foro: true, comentarios: true } },
      comentariosPublicacion: { include: { publicacion: true } },
      notificaciones: true,
      ubicaciones: true,
      resumenUsuario: true,
      siguiendo: { include: { usuarioSeguido: true } },
      seguidores: { include: { usuarioSigue: true } },
    };

    let includeOptions = {};

    // Lógica para construir el 'include' de Prisma
    if (!include || include === "todo") {
      // 1. Si no se pide nada o se pide "todo", incluir todo
      includeOptions = relacionesDisponibles;
    } else if (include === "perfil") {
      // 2. Si se pide "perfil", solo incluir lo básico (rol y estado)
      includeOptions = {
        rol: true,
        estado: true,
      };
    } else {
      // 3. Se pidió algo específico, ej: ?include=notificaciones,productos
      const partes = include.split(",");
      for (const key of partes) {
        if (relacionesDisponibles[key]) {
          includeOptions[key] = relacionesDisponibles[key]; // Añade la relación pedida
        }
      }
      // Siempre incluir lo básico (rol y estado)
      includeOptions.rol = true;
      includeOptions.estado = true;
    }

    // Buscar al usuario en la BD usando el ID del token
    const user = await prisma.cuentas.findUnique({
      where: { id: req.user.userId },
      include: includeOptions // Pasa las opciones dinámicas a Prisma
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    // (Prisma es inteligente y excluye 'contrasena' por defecto si no se pide)
    res.json({
      ok: true,
      user
    });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;