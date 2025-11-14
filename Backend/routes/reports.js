// routes/reports.js
const express = require('express');
const { body, validationResult } = require('express-validator'); // Para validar el body
const { prisma } = require('../config/database'); // Acceso a la BD
const { authenticateToken, requireAdmin } = require('../middleware/auth'); // Middlewares de seguridad

const router = express.Router();

// Middleware local para manejar errores de 'express-validator'
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            message: 'Datos de entrada inválidos',
            errors: errors.array(),
        });
    }
    next();
};

// ==========================================
// 🚩 CREAR UN REPORTE (Protegido)
// POST /api/reports
// ==========================================
router.post(
    '/',
    authenticateToken, // 1. Debe estar autenticado
    [
        // 2. Validaciones de entrada
        body('motivo')
            .isLength({ min: 10 })
            .withMessage('El motivo debe tener al menos 10 caracteres'),
        body('productoId')
            .optional() // Puede ser nulo
            .isInt()
            .withMessage('productoId debe ser un número entero'),
        body('usuarioReportadoId')
            .optional() // Puede ser nulo
            .isInt()
            .withMessage('usuarioReportadoId debe ser un número entero'),
    ],
    handleValidationErrors, // 3. Manejar errores de validación
    async (req, res) => {
        try {
            const { motivo, productoId, usuarioReportadoId } = req.body;
            const reportanteId = req.user.userId; // ID del usuario que hace el reporte

            // 4. 🛡️ Lógica de Negocio: Validar que se reporte ALGO
            if (!productoId && !usuarioReportadoId) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe especificar al menos un productoId o usuarioReportadoId',
                });
            }

            // 5. 🛡️ Lógica de Negocio: No auto-reportarse
            if (usuarioReportadoId && Number(usuarioReportadoId) === reportanteId) {
                return res.status(400).json({
                    ok: false,
                    message: 'No puedes reportarte a ti mismo',
                });
            }

            // 6. 🛡️ Lógica de Negocio: Validar Producto (si existe)
            let productoReportado = null; // Guardamos el producto para usarlo en la notificación
            if (productoId) {
                productoReportado = await prisma.productos.findUnique({
                    where: { id: Number(productoId) },
                });

                if (!productoReportado) {
                    return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
                }

                // No puedes reportar tu propio producto
                if (productoReportado.vendedorId === reportanteId) {
                    return res.status(400).json({
                        ok: false,
                        message: 'No puedes reportar tu propio producto',
                    });
                }
            }

            // 7. 🛡️ Lógica de Negocio: Validar Usuario (si existe)
            if (usuarioReportadoId) {
                const usuario = await prisma.cuentas.findUnique({
                    where: { id: Number(usuarioReportadoId) },
                });
                if (!usuario) {
                    return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
                }
            }

            // 8. 🛡️ Lógica de Negocio: Evitar duplicados
            //    Busca si este usuario YA tiene un reporte PENDIENTE (estado 1)
            //    sobre el mismo producto o usuario.
            const reporteExistente = await prisma.reportes.findFirst({
                where: {
                    reportanteId,
                    ...(productoId && { productoId: Number(productoId) }),
                    ...(usuarioReportadoId && { usuarioReportadoId: Number(usuarioReportadoId) }),
                    estadoId: 1, // 1 = Pendiente
                },
            });

            if (reporteExistente) {
                return res.status(409).json({ // 409 Conflict
                    ok: false,
                    message: 'Ya has reportado este elemento y está pendiente de revisión',
                });
            }

            // 9. Crear el reporte en la BD
            const nuevoReporte = await prisma.reportes.create({
                data: {
                    reportanteId,
                    productoId: productoId ? Number(productoId) : null,
                    usuarioReportadoId: usuarioReportadoId ? Number(usuarioReportadoId) : null,
                    motivo,
                    estadoId: 1, // Estado "Pendiente" por defecto
                },
                include: { // Incluye datos para la notificación y la respuesta
                    reportante: { select: { id: true, nombre: true, usuario: true } },
                    producto: { select: { id: true, nombre: true, vendedorId: true } },
                    usuarioReportado: { select: { id: true, nombre: true } },
                    estado: true,
                },
            });

            // 10. Registrar actividad (para auditoría interna)
            await prisma.actividadUsuario.create({
                data: {
                    usuarioId: reportanteId,
                    accion: 'REPORTE_CREADO',
                    detalles: `Reportó ${productoId ? 'producto #' + productoId : 'usuario #' + usuarioReportadoId}`,
                },
            });

            // 11. ⭐️ LÓGICA DE NOTIFICACIÓN AUTOMÁTICA ⭐️
            let recipientId = null;
            let notificationMessage = '';
            const reporterName = nuevoReporte.reportante.usuario || 'Alguien'; // Nombre de quien reporta

            if (nuevoReporte.usuarioReportadoId) {
                // 11a. Si se reportó un usuario, notificar a ESE usuario.
                recipientId = nuevoReporte.usuarioReportadoId;
                notificationMessage = `${reporterName} ha reportado tu cuenta. Motivo: "${motivo}"`;

            } else if (nuevoReporte.productoId && productoReportado) {
                // 11b. Si se reportó un producto, notificar al VENDEDOR de ese producto.
                recipientId = productoReportado.vendedorId;

                if (recipientId !== reportanteId) { // Doble chequeo para no auto-notificar
                    notificationMessage = `${reporterName} ha reportado tu producto "${productoReportado.nombre}". Motivo: "${motivo}"`;
                } else {
                    recipientId = null; // Anula si el vendedor es el mismo que reporta
                }
            }

            // 11c. Crear la notificación en la BD (si hay un destinatario)
            if (recipientId && notificationMessage) {
                try {
                    await prisma.notificaciones.create({
                        data: {
                            usuarioId: recipientId, // Quién la recibe
                            tipo: 'reporte_recibido',
                            mensaje: notificationMessage,
                        }
                    });
                    console.log(`✅ Notificación de reporte creada para usuario ${recipientId}.`);
                } catch (notificationError) {
                    // Si falla la notificación, solo se registra en consola, no detiene la respuesta
                    console.error(`❌ Error al crear notificación de reporte para ${recipientId}:`, notificationError);
                }
            }
            // --- Fin Lógica de Notificación ---

            // 12. Respuesta al usuario que creó el reporte
            res.status(201).json({
                ok: true,
                message: 'Reporte enviado exitosamente',
                reporte: { // Devuelve datos simplificados
                    id: nuevoReporte.id,
                    motivo: nuevoReporte.motivo,
                    fecha: nuevoReporte.fecha,
                    estado: nuevoReporte.estado.nombre,
                    productoId: nuevoReporte.productoId,
                    usuarioReportadoId: nuevoReporte.usuarioReportadoId,
                },
            });
        } catch (error) {
            console.error('❌ Error creando reporte:', error);
            res.status(500).json({ ok: false, message: 'Error interno del servidor' });
        }
    }
);


// ==========================================
// 🛡️ LISTAR TODOS LOS REPORTES (Solo Admin)
// GET /api/reports
// ==========================================
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // 1. Paginación y filtro por estado
        const { page = 1, limit = 20, estado } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {};

        // 2. Si se pide un estado (ej. ?estado=Pendiente), busca el ID de ese estado
        if (estado) {
            const estadoObj = await prisma.estadosReporte.findFirst({
                where: { nombre: { equals: estado, mode: 'insensitive' } },
            });
            if (estadoObj) {
                where.estadoId = estadoObj.id; // Añade el ID al filtro
            }
        }

        // 3. Busca reportes y cuenta el total (en paralelo)
        const [reportes, total] = await Promise.all([
            prisma.reportes.findMany({
                where,
                include: { // Incluye todos los datos relacionados
                    reportante: { select: { id: true, nombre: true, correo: true } },
                    producto: { select: { id: true, nombre: true, vendedorId: true } },
                    usuarioReportado: { select: { id: true, nombre: true, correo: true } },
                    estado: true,
                },
                orderBy: { fecha: 'desc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.reportes.count({ where }),
        ]);

        // 4. Devuelve la lista y la paginación
        res.json({
            ok: true,
            reportes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('❌ Error listando reportes:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// ==========================================
// 📝 LISTAR MIS REPORTES CREADOS (Protegido)
// GET /api/reports/my-reports
// ==========================================
router.get('/my-reports', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const reportanteId = req.user.userId; // ID del usuario del token

        // 1. Busca solo reportes donde el 'reportanteId' sea el del usuario
        const [reportes, total] = await Promise.all([
            prisma.reportes.findMany({
                where: { reportanteId },
                include: {
                    producto: { select: { id: true, nombre: true } },
                    usuarioReportado: { select: { id: true, nombre: true } },
                    estado: true, // Importante: para ver si está "Pendiente" o "Resuelto"
                },
                orderBy: { fecha: 'desc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.reportes.count({ where: { reportanteId } }),
        ]);

        res.json({
            ok: true,
            reportes,
            pagination: { /* ... */ },
        });
    } catch (error) {
        console.error('❌ Error obteniendo mis reportes:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// ==========================================
// 🔄 ACTUALIZAR ESTADO DE REPORTE (Solo Admin)
// PATCH /api/reports/:id
// ==========================================
router.patch(
    '/:id',
    authenticateToken,
    requireAdmin, // 1. Protegido por Admin
    [
        body('estadoId') // 2. Valida que el 'estadoId' sea un número
            .isInt({ min: 1 })
            .withMessage('estadoId debe ser un número válido'),
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { estadoId } = req.body;

            // 3. Verificar que el reporte existe
            const reporte = await prisma.reportes.findUnique({
                where: { id: Number(id) },
            });
            if (!reporte) {
                return res.status(404).json({ ok: false, message: 'Reporte no encontrado' });
            }

            // 4. Verificar que el estado (ej. 2="Resuelto") existe en la BD
            const estado = await prisma.estadosReporte.findUnique({
                where: { id: Number(estadoId) },
            });
            if (!estado) {
                return res.status(400).json({ ok: false, message: 'Estado no válido' });
            }

            // 5. Actualizar el reporte
            const reporteActualizado = await prisma.reportes.update({
                where: { id: Number(id) },
                data: { estadoId: Number(estadoId) },
                include: {
                    /* ... incluir datos completos para la respuesta ... */
                    reportante: { select: { id: true, nombre: true } },
                    producto: { select: { id: true, nombre: true } },
                    usuarioReportado: { select: { id: true, nombre: true } },
                    estado: true,
                },
            });

            res.json({
                ok: true,
                message: 'Estado del reporte actualizado',
                reporte: reporteActualizado,
            });
        } catch (error) {
            console.error('❌ Error actualizando reporte:', error);
            res.status(500).json({ ok: false, message: 'Error interno del servidor' });
        }
    }
);

// ==========================================
// 🗂️ OBTENER LISTA DE ESTADOS (Público)
// GET /api/reports/estados/list
// ==========================================
// Ruta de utilidad para que el frontend (Admin) pueda mostrar
// un <select> con los estados disponibles (Pendiente, Resuelto, etc.)
router.get('/estados/list', async (req, res) => {
    try {
        const estados = await prisma.estadosReporte.findMany({
            orderBy: { id: 'asc' },
        });

        res.json({
            ok: true,
            estados,
        });
    } catch (error) {
        console.error('❌ Error obteniendo estados de reporte:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// ==========================================
// ℹ️ DETALLE DE UN REPORTE (Solo Admin)
// GET /api/reports/:id
// ==========================================
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Busca el reporte con todos sus datos relacionados
        const reporte = await prisma.reportes.findUnique({
            where: { id: Number(id) },
            include: {
                producto: { select: { id: true, nombre: true, descripcion: true, vendedorId: true } },
                usuarioReportado: { select: { id: true, nombre: true, correo: true } },
                reportante: { select: { id: true, nombre: true, correo: true } },
                estado: true,
            },
        });

        if (!reporte) {
            return res.status(404).json({ ok: false, message: 'Reporte no encontrado' });
        }

        res.json({
            ok: true,
            reporte,
        });
    } catch (error) {
        console.error('❌ Error obteniendo detalle del reporte:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;