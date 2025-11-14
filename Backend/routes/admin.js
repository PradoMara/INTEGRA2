// routes/admin.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ==========================================
// 👥 LISTAR TODOS LOS USUARIOS (Admin)
// GET /api/admin/users
// ==========================================
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const rawUsers = await prisma.cuentas.findMany({
      orderBy: { id: 'asc' },
      select: {
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

    // Agrega propiedad "banned" según estadoId (2 = baneado)
    const users = rawUsers.map(u => ({
      ...u,
      banned: Number(u.estadoId) === 2
    }));

    res.json({ total: users.length, users });
  } catch (err) {
    console.error('Error obteniendo usuarios (Admin):', err);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

// ==========================================
// 🗑️ ELIMINAR USUARIO (Admin - Hard Delete)
// DELETE /api/admin/users/:id
// ==========================================
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.cuentas.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await prisma.cuentas.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario (Admin):', error);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
});

// ==========================================
// 🚫 BANEAR / DESBANEAR USUARIO (Admin)
// PATCH /api/admin/users/:id/ban
// ==========================================
router.patch('/users/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;

    const user = await prisma.cuentas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 2 = BANEADO, 1 = ACTIVO
    const nuevoEstado = banned ? 2 : 1;

    const updated = await prisma.cuentas.update({
      where: { id: parseInt(id) },
      data: { estadoId: nuevoEstado },
      include: {
        estado: true,
      },
    });

    // Añadimos propiedad "banned" en la respuesta
    const updatedWithBanned = {
      ...updated,
      banned: Number(updated.estadoId) === 2
    };

    res.json({
      success: true,
      message: banned ? 'Usuario baneado' : 'Usuario desbaneado',
      user: updatedWithBanned,
    });
  } catch (error) {
    console.error('Error al actualizar estado del usuario (Admin):', error);
    res.status(500).json({ error: 'Error al actualizar estado del usuario' });
  }
});

// ==========================================
// 📊 OBTENER MÉTRICAS GENERALES (Admin)
// GET /api/admin/metrics
// ==========================================
router.get('/metrics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsersPromise = prisma.cuentas.count();
    const totalProductsPromise = prisma.productos.count();
    const totalPublicationsPromise = prisma.publicaciones.count();
    const totalMessagesPromise = prisma.mensajes.count();

    const since30d = new Date();
    since30d.setDate(since30d.getDate() - 30);

    const activeUsers30dPromise = prisma.actividadUsuario.count({
      where: { fecha: { gte: since30d } },
    }).catch(async () => {
      const raw = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT(usuario_id)) as cnt 
        FROM actividad_usuario 
        WHERE fecha >= NOW() - INTERVAL '30 days'
      `;
      return Number(raw[0]?.cnt ?? 0);
    });

    const estadoPendiente = await prisma.estadosReporte.findFirst({
      where: { nombre: { equals: 'Pendiente', mode: 'insensitive' } }
    });

    const openReportsPromise = prisma.reportes.count({
      where: estadoPendiente ? { estadoId: estadoPendiente.id } : {}
    });

    const estadoCompletada = await prisma.estadosTransaccion.findFirst({
      where: { nombre: { equals: 'Completada', mode: 'insensitive' } }
    });

    const completedTransactionsPromise = prisma.transacciones.count({
      where: estadoCompletada ? { estadoId: estadoCompletada.id } : {}
    });

    const since7d = new Date();
    since7d.setDate(since7d.getDate() - 7);

    const messagesLast7dPromise = prisma.mensajes.count({
      where: { fechaEnvio: { gte: since7d } }
    });

    const [
      totalUsers,
      totalProducts,
      totalPublications,
      openReports,
      completedTransactions,
      messagesLast7d
    ] = await Promise.all([
      totalUsersPromise,
      totalProductsPromise,
      totalPublicationsPromise,
      openReportsPromise,
      completedTransactionsPromise,
      messagesLast7dPromise
    ]);

    const activeRaw = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT(usuario_id)) as cnt
      FROM actividad_usuario
      WHERE fecha >= NOW() - INTERVAL '30 days'
    `;
    const activeUsers30d = Number(activeRaw[0]?.cnt ?? 0);

    const newUsersRaw = await prisma.$queryRaw`
      SELECT to_char(fecha_registro::date, 'YYYY-MM-DD') as day, COUNT(*) as cnt
      FROM cuentas
      WHERE fecha_registro >= NOW() - INTERVAL '6 days'
      GROUP BY day
      ORDER BY day ASC
    `;
    const newUsersByDay = (newUsersRaw || []).map(r => ({
      day: r.day,
      count: Number(r.cnt)
    }));

    res.json({
      ok: true,
      metrics: {
        totalUsers,
        activeUsers30d,
        totalProducts,
        totalPublications,
        openReports,
        completedTransactions,
        messagesLast7d,
        newUsersByDay
      }
    });
  } catch (error) {
    console.error('Error obteniendo métricas (Admin):', error);
    res.status(500).json({ ok: false, error: 'Error interno obteniendo métricas' });
  }
});

module.exports = router;
