// routes/admin.js
// Importa Express para crear las rutas.
const express = require('express');
// Crea una instancia del router de Express.
const router = express.Router();
// Importa el cliente de Prisma para interactuar con la base de datos.
const { PrismaClient } = require('@prisma/client');
// Crea una nueva instancia del cliente de Prisma.
const prisma = new PrismaClient();
// Importa los middlewares de autenticación (verificar token) y autorización (requerir rol de admin).
const { authenticateToken, requireAdmin } = require('../middleware/auth'); // pendiente

// ==========================================
// 👥 LISTAR TODOS LOS USUARIOS (Admin)
// GET /api/admin/users
// ==========================================
// Ruta protegida que devuelve una lista de todos los usuarios registrados.
// Solo accesible para administradores.
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Busca todos los registros en la tabla 'cuentas'.
    const users = await prisma.cuentas.findMany({
      // orderBy: { fechaRegistro: 'desc' }, // Opción comentada para ordenar por fecha.
      orderBy: { id: 'asc' }, // Ordena los usuarios por ID ascendente.
      select: { // Especifica qué campos incluir en la respuesta (excluye contraseña).
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        usuario: true,
        rolId: true,
        estadoId: true,
        fechaRegistro: true,
        campus: true,
        reputacion: true
      }
    });

    // Envía la respuesta JSON con el total de usuarios y la lista de usuarios.
    res.json({ total: users.length, users });
  } catch (err) {
    // Captura cualquier error durante la consulta.
    console.error('Error obteniendo usuarios (Admin):', err); // Loguea el error.
    // Envía una respuesta de error 500.
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

// ==========================================
// 🗑️ ELIMINAR USUARIO (Admin - Hard Delete)
// DELETE /api/admin/users/:id
// ==========================================
// Ruta protegida para eliminar permanentemente un usuario por su ID.
// Solo accesible para administradores.
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Obtiene el ID del usuario de los parámetros de la ruta.
    const { id } = req.params;

    // Busca al usuario por ID para asegurarse de que existe antes de intentar eliminarlo.
    const user = await prisma.cuentas.findUnique({
      where: { id: parseInt(id) } // Convierte el ID a número.
    });

    // Si el usuario no se encuentra, devuelve un error 404.
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si el usuario existe, procede a eliminarlo de la base de datos.
    await prisma.cuentas.delete({
      where: { id: parseInt(id) } // Especifica el ID del usuario a eliminar.
    });

    // Envía una respuesta de éxito.
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    // Captura cualquier error durante la búsqueda o eliminación.
    console.error('Error eliminando usuario (Admin):', error); // Loguea el error.
    // Envía una respuesta de error 500.
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
});

// ==========================================
// 🚫 BANEAR / DESBANEAR USUARIO (Admin)
// PATCH /api/admin/users/:id/ban
// ==========================================
// Ruta protegida para cambiar el estado de un usuario (activo/baneado).
// Solo accesible para administradores. Usa PATCH porque es una actualización parcial.
router.patch('/users/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Obtiene el ID del usuario de los parámetros de la ruta.
    const { id } = req.params;
    // Obtiene el estado deseado (true para banear, false para desbanear) del cuerpo de la petición.
    const { banned } = req.body;

    // Busca al usuario por ID para asegurarse de que existe.
    const user = await prisma.cuentas.findUnique({
      where: { id: parseInt(id) },
    });

    // Si el usuario no se encuentra, devuelve un error 404.
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Determina el 'estadoId' correspondiente basado en el valor de 'banned'.
    // Asume que 2 = BANEADO y 1 = ACTIVO.
    const nuevoEstado = banned ? 2 : 1;

    // Actualiza el 'estadoId' del usuario en la base de datos.
    const updated = await prisma.cuentas.update({
      where: { id: parseInt(id) }, // Especifica el usuario a actualizar.
      data: { estadoId: nuevoEstado }, // Establece el nuevo estado.
      include: { // Incluye el objeto 'estado' relacionado en la respuesta.
        estado: true,
      },
    });

    // Envía una respuesta de éxito con el usuario actualizado.
    res.json({
      success: true,
      message: banned ? 'Usuario baneado' : 'Usuario desbaneado',
      user: updated,
    });
  } catch (error) {
    // Captura cualquier error durante la búsqueda o actualización.
    console.error('Error al actualizar estado del usuario (Admin):', error); // Loguea el error.
    // Envía una respuesta de error 500.
    res.status(500).json({ error: 'Error al actualizar estado del usuario' });
  }
});

// ==========================================
// 📊 OBTENER MÉTRICAS GENERALES (Admin)
// GET /api/admin/metrics
// ==========================================
// Ruta protegida que calcula y devuelve estadísticas globales de la aplicación.
// Solo accesible para administradores.
router.get('/metrics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Define promesas para realizar conteos básicos de diferentes entidades.
    // Estas promesas se ejecutarán en paralelo.
    const totalUsersPromise = prisma.cuentas.count();
    const totalProductsPromise = prisma.productos.count();
    const totalPublicationsPromise = prisma.publicaciones.count();
    const totalMessagesPromise = prisma.mensajes.count();

    // Calcula la fecha de hace 30 días para filtrar usuarios activos.
    const since30d = new Date();
    since30d.setDate(since30d.getDate() - 30);
    // Define una promesa para contar usuarios activos (basado en la tabla 'actividadUsuario').
    // Intenta usar 'distinct' (comentado, ya que Prisma ORM puede no soportarlo directamente en count).
    const activeUsers30dPromise = prisma.actividadUsuario.count({
      where: { fecha: { gte: since30d } }, // Filtra por actividad en los últimos 30 días.
      // distinct: ['usuarioId'] // Intento de contar usuarios distintos (puede no funcionar).
    }).catch(async () => { // Si 'distinct' falla (o no está implementado), usa un fallback.
      // Fallback: Ejecuta una consulta SQL cruda para contar usuarios distintos.
      const raw = await prisma.$queryRaw`SELECT COUNT(DISTINCT(usuario_id)) as cnt FROM actividad_usuario WHERE fecha >= NOW() - INTERVAL '30 days'`;
      // Convierte el resultado BigInt a Number, o devuelve 0 si no hay resultados.
      return Number(raw[0]?.cnt ?? 0);
    });

    // Busca el 'estadoId' que corresponde a "Pendiente" en la tabla 'estadosReporte'.
    const estadoPendiente = await prisma.estadosReporte.findFirst({
      where: { nombre: { equals: 'Pendiente', mode: 'insensitive' } }
    });
    // Define una promesa para contar los reportes que tienen ese 'estadoId'.
    const openReportsPromise = prisma.reportes.count({
      where: estadoPendiente ? { estadoId: estadoPendiente.id } : {} // Usa el ID si se encontró, si no, cuenta todos.
    });

    // Busca el 'estadoId' que corresponde a "Completada" en la tabla 'estadosTransaccion'.
    const estadoCompletada = await prisma.estadosTransaccion.findFirst({
      where: { nombre: { equals: 'Completada', mode: 'insensitive' } }
    });
    // Define una promesa para contar las transacciones que tienen ese 'estadoId'.
    const completedTransactionsPromise = prisma.transacciones.count({
      where: estadoCompletada ? { estadoId: estadoCompletada.id } : {} // Usa el ID si se encontró.
    });

    // Calcula la fecha de hace 7 días.
    const since7d = new Date();
    since7d.setDate(since7d.getDate() - 7);
    // Define una promesa para contar los mensajes enviados desde esa fecha.
    const messagesLast7dPromise = prisma.mensajes.count({
      where: { fechaEnvio: { gte: since7d } } // Filtra por fecha de envío >= hace 7 días.
    });

    // Espera a que se resuelvan la mayoría de las promesas de conteo.
    // (activeUsers30dPromise se maneja por separado debido al fallback).
    const [
      totalUsers,
      totalProducts,
      totalPublications,
      // activeUsers30d, // Se obtiene después con $queryRaw por seguridad.
      openReports,
      completedTransactions,
      messagesLast7d
    ] = await Promise.all([
      totalUsersPromise,
      totalProductsPromise,
      totalPublicationsPromise,
      // activeUsers30dPromise, // Se omite aquí.
      openReportsPromise,
      completedTransactionsPromise,
      messagesLast7dPromise
    ]);

    // Ejecuta la consulta SQL cruda para obtener el conteo exacto de usuarios activos distintos.
    const activeRaw = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT(usuario_id)) as cnt
      FROM actividad_usuario
      WHERE fecha >= NOW() - INTERVAL '30 days'
    `;
    // Convierte el resultado BigInt a Number.
    const activeUsers30d = Number(activeRaw[0]?.cnt ?? 0);

    // Ejecuta una consulta SQL cruda para contar nuevos usuarios por día en los últimos 7 días.
    const newUsersRaw = await prisma.$queryRaw`
      SELECT to_char(fecha_registro::date, 'YYYY-MM-DD') as day, COUNT(*) as cnt -- Formatea la fecha y cuenta
      FROM cuentas
      WHERE fecha_registro >= NOW() - INTERVAL '6 days' -- Filtra por los últimos 7 días (hoy + 6 días atrás)
      GROUP BY day -- Agrupa por día
      ORDER BY day ASC -- Ordena por día
    `;
    // Mapea el resultado crudo (array de {day, cnt: BigInt}) a un formato más usable (array de {day, count: Number}).
    const newUsersByDay = (newUsersRaw || []).map(r => ({ day: r.day, count: Number(r.cnt) }));

    // Envía la respuesta JSON con todas las métricas calculadas.
    res.json({
      ok: true,
      metrics: {
        totalUsers,
        activeUsers30d,
        totalProducts,
        totalPublications,
        openReports, // Reportes pendientes.
        completedTransactions, // Transacciones completadas.
        messagesLast7d, // Mensajes en los últimos 7 días.
        newUsersByDay // Array de {día, conteo} para nuevos usuarios.
      }
    });
  } catch (error) {
    // Captura cualquier error durante las consultas.
    console.error('Error obteniendo métricas (Admin):', error); // Loguea el error.
    // Envía una respuesta de error 500.
    res.status(500).json({ ok: false, error: 'Error interno obteniendo métricas' });
  }
});

// Exporta el router para que pueda ser usado en 'server.js'.
module.exports = router;
