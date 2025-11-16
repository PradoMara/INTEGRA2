// routes/users.js
const express = require('express');
const { prisma } = require('../config/database'); // Acceso a la BD
const { authenticateToken } = require('../middleware/auth'); // Middleware para proteger rutas
const AppError = require('../utils/AppError'); // Clase de error personalizada

const router = express.Router();

// ------------------------------------------
// 👤 OBTENER PERFIL PROPIO
// GET /api/users/profile
// ------------------------------------------
// Ruta protegida que devuelve el perfil del usuario actualmente autenticado (el dueño del token).
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    // 1. Busca al usuario usando el 'userId' que se adjuntó al 'req' en el middleware 'authenticateToken'
    const user = await prisma.cuentas.findUnique({
      where: { id: req.user.userId },
      include: {
        rol: true, // Incluye el nombre del rol (ej. "Cliente")
        estado: true, // Incluye el estado (ej. "ACTIVO")
        resumenUsuario: true // Incluye las estadísticas (ventas, compras, etc.)
      }
    });

    // 2. BUG FIX: Validar que el usuario existe ANTES de intentar acceder a sus propiedades
    // Si el ID del token no existe en la BD, devolver error 404
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "Usuario no encontrado",
          details: { field: "id" }
        }
      });
    }

    // 3. Devuelve los datos del usuario en un formato limpio
    res.json({
      success: true,
      data: {
        id: user.id,
        correo: user.correo,
        usuario: user.usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.rol.nombre,
        estado: user.estado.nombre,
        campus: user.campus,
        reputacion: user.reputacion,
        fechaRegistro: user.fechaRegistro,
        resumen: user.resumenUsuario
      }
    });
  } catch (error) {
    // 4. Si algo falla, lo pasa al errorHandler global
    next(error);
  }
});

// ------------------------------------------
// ✏️ ACTUALIZAR PERFIL PROPIO
// PUT /api/users/profile
// ------------------------------------------
// Ruta protegida para que el usuario actualice sus propios datos editables.
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    // 1. Obtiene los campos permitidos del body de la petición
    const { apellido, usuario, campus, telefono, direccion, fotoPerfil } = req.body;

    // 2. Construye un objeto 'updateData' solo con los campos que el usuario SÍ envió.
    //    Esto evita sobreescribir campos existentes con 'undefined'.
    const updateData = {};
    if (apellido !== undefined) updateData.apellido = apellido;
    if (usuario !== undefined) updateData.usuario = usuario;
    if (campus !== undefined) updateData.campus = campus;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (direccion !== undefined) updateData.direccion = direccion;
    if (fotoPerfil !== undefined) updateData.fotoPerfil = fotoPerfil;

    // 3. Valida que al menos un campo haya sido enviado
    if (Object.keys(updateData).length === 0) {
      throw new AppError(
        'Se debe proporcionar al menos un campo para actualizar',
        'VALIDATION_ERROR',
        400, // 400 Bad Request
        { fields: ['apellido', 'usuario', 'campus', 'telefono', 'direccion', 'fotoPerfil'] }
      );
    }

    // 4. Lógica de UNICIDAD: Si el usuario está intentando cambiar su 'usuario'...
    if (usuario) {
      // 5. ...busca si OTRA persona ya tiene ese nombre de usuario.
      const existingUser = await prisma.cuentas.findFirst({
        where: {
          usuario, // Busca el nombre de usuario
          NOT: { id: req.user.userId } // Excluye al propio usuario de la búsqueda
        }
      });

      // 6. Si se encuentra, lanza un error
      if (existingUser) {
        throw new AppError(
          'El nombre de usuario ya está en uso',
          'USERNAME_TAKEN',
          400, // 400 Bad Request (o 409 Conflict)
          { field: 'usuario', value: usuario }
        );
      }
    }

    // 7. Si pasa todas las validaciones, actualiza al usuario en la BD
    const updatedUser = await prisma.cuentas.update({
      where: { id: req.user.userId }, // Actualiza al usuario del token
      data: updateData, // Usa el objeto dinámico con los campos a actualizar
      include: {
        rol: true,
        estado: true
      }
    });

    // 8. Devuelve el perfil actualizado
    res.json({
      ok: true,
      message: 'Perfil actualizado correctamente',
      user: {
        id: updatedUser.id,
        correo: updatedUser.correo,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido || '',
        usuario: updatedUser.usuario,
        campus: updatedUser.campus || 'Campus Temuco',
        telefono: updatedUser.telefono,
        direccion: updatedUser.direccion,
        role: updatedUser.rol.nombre,
        editableFields: ['apellido', 'usuario', 'campus', 'telefono', 'direccion']
      }
    });

  } catch (error) {
    next(error); // Pasa errores (de unicidad, validación, etc.) al errorHandler
  }
});

// ------------------------------------------
// 👥 LISTAR TODOS LOS USUARIOS (SOLO ADMIN)
// GET /api/users
// ------------------------------------------
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    // 1. AUTORIZACIÓN: Verifica el rol (obtenido del token).
    // Nota: Aquí se usa un 'if' en lugar del middleware 'requireAdmin' (ambos son válidos).
    if (req.user.role.toLowerCase() !== 'administrador') {
      throw new AppError(
        "Acceso denegado. Se requiere rol de Administrador.",
        "FORBIDDEN",
        403, // 403 Forbidden
        { requiredRole: "Administrador" }
      );
    }

    // 2. Si es Admin, busca TODOS los usuarios en la BD
    const users = await prisma.cuentas.findMany({
      include: {
        rol: true,
        estado: true,
        resumenUsuario: true
      },
      orderBy: {
        fechaRegistro: 'desc' // Ordena por los más nuevos primero
      }
    });

    // 3. Devuelve la lista de usuarios, mapeada a un formato limpio
    res.json({
      success: true,
      data: users.map(user => ({
        id: user.id,
        correo: user.correo,
        usuario: user.usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.rol.nombre,
        estado: user.estado.nombre,
        campus: user.campus,
        reputacion: user.reputacion,
        fechaRegistro: user.fechaRegistro,
        resumen: user.resumenUsuario
      }))
    });

  } catch (error) {
    next(error);
  }
});

// ------------------------------------------
// ⭐ CALIFICAR A UN VENDEDOR
// POST /api/users/rate/:sellerId
// ------------------------------------------
// Ruta para que un comprador (autenticado) califique a un vendedor (sellerId)
router.post('/rate/:sellerId', authenticateToken, async (req, res, next) => {
  try {
    const { sellerId } = req.params; // ID del Vendedor (el calificado)
    const sellerIdInt = parseInt(sellerId);
    const { puntuacion, comentario } = req.body;
    const buyerId = req.user.userId; // ID del Comprador (el calificador, del token)

    // 1. Validaciones básicas de la entrada
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      throw new AppError(
        'La puntuación debe estar entre 1 y 5',
        'VALIDATION_ERROR',
        400,
        { field: 'puntuacion' }
      );
    }

    // 1b. Obtener el nombre de usuario del comprador (para la notificación)
    const buyer = await prisma.cuentas.findUnique({
      where: { id: buyerId },
      select: { usuario: true } // Solo necesitamos el nombre de usuario
    });
    const buyerName = buyer ? buyer.usuario : 'Un usuario';


    // 2. LÓGICA DE NEGOCIO: Verificar que el comprador haya tenido una transacción con el vendedor
    const transactionExists = await prisma.transacciones.findFirst({
      where: {
        compradorId: buyerId,
        vendedorId: sellerIdInt
      }
    });

    // 3. Si no hay transacción, no puede calificar
    if (!transactionExists) {
      throw new AppError(
        'No puedes calificar a este vendedor sin haber realizado una transacción previa',
        'NO_TRANSACTION_ERROR',
        400
      );
    }

    // 4. LÓGICA DE NEGOCIO: Verificar que no haya calificado ESTA MISMA transacción
    const alreadyRated = await prisma.calificaciones.findFirst({
      where: {
        calificadorId: buyerId,
        calificadoId: sellerIdInt,
        transaccionId: transactionExists.id // Clave: se liga a la transacción
      }
    });

    if (alreadyRated) {
      throw new AppError(
        'Ya has calificado esta transacción específica con este vendedor',
        'ALREADY_RATED_TRANSACTION_ERROR',
        400
      );
    }

    // 5. Crear la calificación en la tabla 'Calificaciones'
    const rating = await prisma.calificaciones.create({
      data: {
        transaccionId: transactionExists.id,
        calificadorId: buyerId,
        calificadoId: sellerIdInt,
        puntuacion,
        comentario
      }
    });

    // 6. Recalcular la reputación PROMEDIO del vendedor
    const promedio = await prisma.calificaciones.aggregate({
      where: { calificadoId: sellerIdInt }, // Busca todas las calificaciones del vendedor
      _avg: { puntuacion: true } // Calcula el promedio de la columna 'puntuacion'
    });

    // 7. Actualizar el campo 'reputacion' en la tabla 'Cuentas' del vendedor
    await prisma.cuentas.update({
      where: { id: sellerIdInt },
      data: { reputacion: promedio._avg.puntuacion || 0 }
    });

    // 8. ¡NUEVO! Crear una notificación para el VENDEDOR
    const message = `${buyerName} te ha calificado con ${puntuacion} estrellas.`;

    await prisma.notificaciones.create({
      data: {
        usuarioId: sellerIdInt, // El ID del vendedor (quien recibe la notif)
        tipo: 'valoracion',
        mensaje: message
      }
    });

    // 9. Enviar respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Calificación registrada correctamente',
      data: {
        rating,
        reputacionPromedio: promedio._avg.puntuacion || 0
      }
    });

  } catch (error) {
    next(error);
  }
});

// ------------------------------------------
// 🔔 OBTENER NOTIFICACIONES
// GET /api/users/notifications
// ------------------------------------------
// Ruta protegida para que el usuario actual obtenga sus notificaciones
router.get('/notifications', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notificaciones.findMany({
      where: { usuarioId: userId },
      orderBy: { fecha: 'desc' }, // Más nuevas primero
      take: 20 // Limita a las últimas 20 notificaciones
    });

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    next(error);
  }
});

// ------------------------------------------
// ✔️ MARCAR NOTIFICACIÓN COMO LEÍDA
// PUT /api/users/notifications/:id/read
// ------------------------------------------
router.put('/notifications/:id/read', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const notificationId = parseInt(id);
    const userId = req.user.userId; // ID del usuario del token

    // 1. Actualiza la notificación.
    // Se usa 'updateMany' por seguridad: solo actualizará si AMBAS condiciones se cumplen.
    const updateOperation = await prisma.notificaciones.updateMany({
      where: {
        id: notificationId, // 1. El ID de la notificación debe coincidir
        usuarioId: userId,  // 2. La notificación debe pertenecer al usuario
      },
      data: {
        leido: true,
      },
    });

    // 2. 'updateOperation.count' nos dice cuántos registros se actualizaron.
    // Si es 0, significa que la notificación no se encontró o no le pertenecía al usuario.
    if (updateOperation.count === 0) {
      throw new AppError(
        'Notificación no encontrada o no autorizada',
        'NOT_FOUND',
        404,
      );
    }

    // 3. Éxito
    res.json({ success: true, message: 'Notificación marcada como leída' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;