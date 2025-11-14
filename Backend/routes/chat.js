const express = require('express');
const { prisma } = require('../config/database'); // Acceso a la BD
const { authenticateToken } = require('../middleware/auth'); // Middleware de autenticación

const router = express.Router();

// ------------------------------------------
// 📩 ENVIAR MENSAJE (vía HTTP)
// POST /api/chat/send
// ------------------------------------------
// NOTA: Este endpoint parece ser un *fallback* o una versión antigua.
// La lógica principal de envío de mensajes en tiempo real está en 'server.js'
// usando WebSockets (socket.on('send_message')).
// Este endpoint podría usarse si el WebSocket falla.
router.post('/send', authenticateToken, async (req, res) => {
  try {
    console.log('📨 Petición de envío de mensaje (HTTP):', {
      body: req.body,
      user: req.user
    });

    const { destinatarioId, contenido } = req.body;

    if (!destinatarioId || !contenido) {
      return res.status(400).json({ ok: false, message: 'Faltan campos requeridos' });
    }

    // 1. Guarda el mensaje en la base de datos
    const mensaje = await prisma.Mensajes.create({
      data: {
        remitenteId: req.user.userId, // ID del usuario del token
        destinatarioId,
        contenido,
        tipo: 'texto' // Asume 'texto'
      },
      include: { // Incluye datos del remitente y destinatario para la respuesta
        remitente: { select: { id: true, nombre: true, usuario: true } },
        destinatario: { select: { id: true, nombre: true, usuario: true } }
      }
    });

    // (Falta lógica de WebSocket: este mensaje no se enviará en tiempo real
    //  a menos que también se emita a Socket.io desde aquí).
    res.json({ ok: true, mensaje });
  } catch (error) {
    console.error('Error enviando mensaje (HTTP):', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// 📥 OBTENER HISTORIAL DE CONVERSACIÓN
// GET /api/chat/conversacion/:usuarioId
// ------------------------------------------
// Ruta protegida para obtener todos los mensajes entre el usuario
// autenticado y otro usuario específico (:usuarioId).
router.get('/conversacion/:usuarioId', authenticateToken, async (req, res) => {
  try {
    const { usuarioId } = req.params; // ID del otro usuario

    // 1. Busca mensajes donde:
    //    (Yo soy remitente Y él es destinatario) O
    //    (Él es remitente Y Yo soy destinatario)
    const mensajes = await prisma.Mensajes.findMany({
      where: {
        OR: [
          { remitenteId: req.user.userId, destinatarioId: parseInt(usuarioId) },
          { remitenteId: parseInt(usuarioId), destinatarioId: req.user.userId }
        ]
      },
      orderBy: { fechaEnvio: 'asc' }, // Ordena del más antiguo al más nuevo
      include: { // Incluye datos de quién envió cada mensaje
        remitente: { select: { id: true, nombre: true, usuario: true } },
        destinatario: { select: { id: true, nombre: true, usuario: true } }
      }
    });

    res.json({ ok: true, mensajes });
  } catch (error) {
    console.error('Error obteniendo conversación:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// 📋 LISTAR BANDEJA DE ENTRADA (Resumen)
// GET /api/chat/conversaciones
// ------------------------------------------
// Ruta protegida que devuelve la "bandeja de entrada": una lista
// de todas las conversaciones del usuario, mostrando solo el *último*
// mensaje y el *conteo de no leídos* de cada una.
router.get('/conversaciones', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('📋 Obteniendo conversaciones para usuario:', userId);

    // 1. ⭐️ Optimización: Contar todos los mensajes no leídos en UNA sola consulta
    //    Agrupa los mensajes por 'remitenteId'
    const unreadCounts = await prisma.Mensajes.groupBy({
      by: ['remitenteId'], // Agrupar por quién envió el mensaje
      where: {
        destinatarioId: userId, // Que yo (userId) recibí
        leido: false,           // Y que no he leído
      },
      _count: {
        id: true, // Contar cuántos mensajes (id) hay en cada grupo
      },
    });

    // 2. ⭐️ Convertir el resultado en un 'Map' para acceso rápido
    //    unreadCounts = [ { remitenteId: 5, _count: { id: 3 } }, ... ]
    //    unreadMap = Map( { 5 => 3 } )
    const unreadMap = new Map();
    unreadCounts.forEach(item => {
      unreadMap.set(item.remitenteId, item._count.id);
    });
    console.log('📊 Mapa de no leídos:', unreadMap);

    // 3. Obtener TODOS los mensajes donde el usuario participó
    //    (tanto enviados como recibidos)
    const mensajes = await prisma.Mensajes.findMany({
      where: {
        OR: [
          { remitenteId: userId },
          { destinatarioId: userId }
        ]
      },
      orderBy: { fechaEnvio: 'desc' }, // Más nuevos primero
      include: {
        remitente: { select: { id: true, nombre: true, usuario: true } },
        destinatario: { select: { id: true, nombre: true, usuario: true } }
      }
    });

    console.log(`📨 Total de mensajes encontrados: ${mensajes.length}`);

    // 4. Agrupar mensajes por conversación (para mostrar solo el último)
    const conversaciones = {};
    mensajes.forEach(msg => {
      // Identificar al "otro" usuario en la conversación
      const otroUsuario = msg.remitenteId === userId ? msg.destinatario : msg.remitente;

      // Como los mensajes están ordenados (desc), el primer mensaje
      // que encontramos para 'otroUsuario.id' es el más reciente.
      if (!conversaciones[otroUsuario.id]) {

        // 5. Buscar el conteo de no leídos en el Map
        //    (Solo nos importan los mensajes que 'otroUsuario' me envió)
        const unreadCount = unreadMap.get(otroUsuario.id) || 0;

        // 6. Guardar la conversación con su último mensaje y el conteo
        conversaciones[otroUsuario.id] = {
          usuario: otroUsuario,
          ultimoMensaje: msg,
          unreadCount: unreadCount, // Añadir el conteo
        };

        console.log(`👤 Conversación con ${otroUsuario.nombre}: no leídos: ${unreadCount}`);
      }
    });

    // 7. Convertir el objeto de conversaciones en un array
    const result = Object.values(conversaciones);
    console.log(`✅ Conversaciones procesadas: ${result.length}`);

    res.json({ ok: true, conversaciones: result });

  } catch (error) {
    console.error('Error listando conversaciones:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// ✔️ MARCAR MENSAJES COMO LEÍDOS
// POST /api/chat/conversacion/:usuarioId/mark-read
// ------------------------------------------
// Ruta protegida que se llama cuando el usuario ABRE un chat.
// Actualiza todos los mensajes de 'leido: false' a 'leido: true'.
router.post('/conversacion/:usuarioId/mark-read', authenticateToken, async (req, res) => {
  try {
    const { usuarioId } = req.params; // ID del remitente (el chat que abrí)
    const userId = req.user.userId; // ID del destinatario (yo)

    console.log(`🔵 Marcando como leídos los mensajes de ${usuarioId} para ${userId}`);

    // 1. Actualiza (updateMany) todos los mensajes donde:
    await prisma.Mensajes.updateMany({
      where: {
        destinatarioId: userId, // Yo soy el destinatario
        remitenteId: parseInt(usuarioId), // Él es el remitente
        leido: false // Y que no he leído
      },
      data: {
        leido: true // Marcar como leído
      }
    });

    res.json({ ok: true, message: 'Mensajes marcados como leídos' });
  } catch (error) {
    console.error('Error marcando mensajes como leídos:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;