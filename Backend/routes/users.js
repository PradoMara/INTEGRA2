// users.js
const express = require('express');
const { prisma } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');

const router = express.Router();
const admin = require('firebase-admin');

// GET /api/users/profile - Obtener perfil del usuario actual
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const user = await prisma.cuentas.findUnique({
      where: { id: req.user.userId },
      include: {
        rol: true,
        estado: true,
        resumenUsuario: true
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
        fotoPerfilUrl: user.fotoPerfilUrl,
        resumen: user.resumenUsuario
      }
    });
  } catch (error) {
    // 4. Si algo falla, lo pasa al errorHandler global
    next(error);
  }
});

// PUT /api/users/profile - Actualizar perfil del usuario actual
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    // 1. Obtiene los campos permitidos del body de la petición
    const { apellido, usuario, campus, telefono, direccion, fotoPerfil } = req.body;

    // Validar que al menos un campo sea enviado
    const updateData = {};
    if (usuario !== undefined) updateData.usuario = usuario;
    if (campus !== undefined) updateData.campus = campus;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (direccion !== undefined) updateData.direccion = direccion;
    if (fotoPerfil !== undefined) updateData.fotoPerfil = fotoPerfil;

    if (Object.keys(updateData).length === 0) {
      throw new AppError(
        'Se debe proporcionar al menos un campo para actualizar',
        'VALIDATION_ERROR',
        400, // 400 Bad Request
        { fields: ['apellido', 'usuario', 'campus', 'telefono', 'direccion', 'fotoPerfil'] }
      );
    }

    // Verificar que el nombre de usuario sea único si se está cambiando
    if (usuario) {
      const existingUser = await prisma.cuentas.findFirst({
        where: {
          usuario,
          NOT: { id: req.user.userId }
        }
      });

      if (existingUser) {
        throw new AppError(
          'El nombre de usuario ya está en uso',
          'USERNAME_TAKEN',
          400,
          { field: 'usuario', value: usuario }
        );
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.cuentas.update({
      where: { id: req.user.userId },
      data: updateData,
      include: {
        rol: true,
        estado: true
      }
    });    res.json({
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
        editableFields: ['usuario', 'campus', 'telefono', 'direccion']
      }
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/users - Listar usuarios (solo admin)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'Administrador') {
      throw new AppError(
        "Acceso denegado",
        "FORBIDDEN",
        403,
        { requiredRole: "Administrador" }
      );
    }

    const users = await prisma.cuentas.findMany({
      include: {
        rol: true,
        estado: true,
        resumenUsuario: true
      },
      orderBy: {
        fechaRegistro: 'desc'
      }
    });

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

// POST /api/users/rate/:sellerId - Calificar a un vendedor
router.post('/rate/:sellerId', authenticateToken, async (req, res, next) => {
  try {
    // --- Definiciones ---
    const { sellerId } = req.params;
    const { puntuacion, comentario } = req.body;
    const userId = req.user.userId;
    const sellerIdInt = parseInt(sellerId);

    // 1️⃣ Validaciones básicas
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      throw new AppError(
        'La puntuación debe estar entre 1 y 5',
        'VALIDATION_ERROR',
        400,
        { field: 'puntuacion' }
      );
    }

    // 2️⃣ Verificar que haya al menos una transacción con este vendedor
    const transactionExists = await prisma.transacciones.findFirst({
      where: {
        compradorId: userId,
        vendedorId: sellerIdInt
      }
    });

    if (!transactionExists) {
      throw new AppError(
        'No puedes calificar a este vendedor sin haber realizado una transacción',
        'NO_TRANSACTION_ERROR',
        400
      );
    }

    // 3️⃣ Verificar que el usuario no haya calificado antes...
    const alreadyRated = await prisma.calificaciones.findFirst({
      where: {
        calificadorId: userId,
        calificadoId: sellerIdInt,
        transaccionId: transactionExists.id
      }
    });

    if (alreadyRated) {
      throw new AppError(
        'Ya has calificado esta transacción específica con este vendedor',
        'ALREADY_RATED_TRANSACTION_ERROR',
        400
      );
    }

    // 4️⃣ Crear la calificación
    const rating = await prisma.calificaciones.create({
      data: {
        transaccionId: transactionExists.id,
        calificadorId: userId,
        calificadoId: sellerIdInt,
        puntuacion,
        comentario
      }
    });

    // 5️⃣ Recalcular la reputación promedio del vendedor
    const promedio = await prisma.calificaciones.aggregate({
      where: { calificadoId: sellerIdInt },
      _avg: { puntuacion: true }
    });

    await prisma.cuentas.update({
      where: { id: sellerIdInt },
      data: { reputacion: promedio._avg.puntuacion || 0 }
    });

    // ⭐️ INICIO: Enviar Notificación Push ⭐️
    try {
      // (Obtener el nombre del comprador para el mensaje)
      const buyer = await prisma.cuentas.findUnique({
        where: { id: userId },
        select: { usuario: true }
      });
      const buyerName = buyer ? buyer.usuario : 'Un usuario';

      // 1. Busca el token FCM del vendedor 
      const vendedor = await prisma.cuentas.findUnique({
        where: { id: sellerIdInt },
        select: { fcm_token: true }
      });

      // 2. Si el vendedor tiene un token, envía la notificación
      if (vendedor && vendedor.fcm_token) {
        const message = {
          token: vendedor.fcm_token,
          notification: {
            title: '¡Nueva Valoración! ⭐',
            body: `${buyerName} te ha calificado con ${puntuacion} estrellas.`
          },
          data: {
            screen: 'ratings',
            sellerId: sellerIdInt.toString()
          }
        };
        console.log(`🔔 Enviando notificación a ${vendedor.fcm_token}`);
        await admin.messaging().send(message);
      }
    } catch (fcmError) {
      console.error("❌ Error al enviar notificación FCM:", fcmError);
      // No detenemos la respuesta principal si la notificación falla
    }
    // ⭐️ FIN: Enviar Notificación Push ⭐️

    // 6️⃣ Respuesta
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


// ==========================================
// PUT /api/users/profile/fcm-token - Guardar Token FCM
// ==========================================
router.put('/profile/fcm-token', authenticateToken, async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.userId;

    if (!fcmToken || typeof fcmToken !== 'string') {
      return res.status(400).json({
        ok: false,
        message: 'fcmToken es requerido y debe ser un string',
      });
    }

    await prisma.cuentas.update({
      where: { id: userId },
      data: { fcm_token: fcmToken },
    });

    res.json({
      ok: true,
      message: 'Token FCM guardado exitosamente',
    });

  } catch (error) {
    next(error); // Pasa el error al manejador de errores
  }
});

// ✅ NUEVA RUTA: GET /api/users/:id - Obtener perfil PÚBLICO de un usuario por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw new AppError(
        "ID de usuario inválido",
        "INVALID_INPUT",
        400,
        { field: "id", value: id }
      );
    }    const user = await prisma.cuentas.findUnique({
      where: { id: userId },
      select: { // Selecciona solo los campos públicos que quieres mostrar
        id: true,
        nombre: true,
        apellido: true,
        usuario: true, // Puedes decidir si mostrar el nombre de usuario
        campus: true,
        reputacion: true,
        fechaRegistro: true,
        fotoPerfilUrl: true, // ✅ AGREGADO: Incluir foto de perfil
        // NO incluyas correo o contraseña aquí por seguridad
      }
    });

    if (!user) {
      throw new AppError(
        "Usuario no encontrado",
        "USER_NOT_FOUND",
        404,
        { field: "id", value: userId }
      );
    }

    // ✅ NUEVO: Obtener estadísticas del vendedor
    const [totalPublicaciones, publicacionesActivas, totalVentas] = await Promise.all([
      // Total de productos publicados por este vendedor
      prisma.productos.count({
        where: { vendedorId: userId }
      }),
      
      // Productos activos/disponibles
      prisma.productos.count({
        where: { 
          vendedorId: userId,
          estadoId: 1, // Estado "Disponible"
          visible: true 
        }
      }),
      
      // Total de ventas completadas
      prisma.transacciones.count({
        where: { 
          vendedorId: userId,
          estado: 'Completada'
        }
      })
    ]);    // Formatea la respuesta (opcional pero bueno)
    res.json({
      success: true,
      data: {
        id: user.id,
        nombre: user.nombre, // ✅ AGREGADO: Nombre individual
        apellido: user.apellido, // ✅ AGREGADO: Apellido individual  
        nombreCompleto: `${user.nombre || ''} ${user.apellido || ''}`.trim(),
        usuario: user.usuario,
        campus: user.campus,
        reputacion: user.reputacion ? Number(user.reputacion) : 0.0,
        miembroDesde: user.fechaRegistro,
        fotoPerfilUrl: user.fotoPerfilUrl, // ✅ Incluir foto de perfil
        
        // ✅ NUEVO: Estadísticas del vendedor
        estadisticas: {
          totalPublicaciones,
          publicacionesActivas,
          totalVentas,
          ventasCompletadas: totalVentas // Alias para claridad
        }
      }
    });

  } catch (error) {
    // Asegúrate de que los errores 404 lleguen a la app
    if (error instanceof AppError && error.statusCode === 404) {
      return res.status(404).json({ success: false, error: { code: error.code, message: error.message } });
    }
    next(error); // Otros errores van al errorHandler general
  }
});

module.exports = router;