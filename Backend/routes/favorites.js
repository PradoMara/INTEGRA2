// favorites.js
const express = require('express');
const { body, validationResult } = require('express-validator'); // Para validar la entrada (body)
const { prisma } = require('../config/database'); // Acceso a la BD
const { authenticateToken } = require('../middleware/auth'); // Middleware para proteger rutas

const router = express.Router();

// Middleware local simple para manejar errores de 'express-validator'
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  // Si hay errores (ej. productoId no es un entero), responde con 400
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array(),
    });
  }
  next(); // Si no hay errores, continúa
};

// ------------------------------------------
// ❤️ LISTAR MIS FAVORITOS (Protegido)
// GET /api/favorites
// ------------------------------------------
// Ruta protegida que devuelve la lista paginada de productos
// que el usuario actual (autenticado por token) ha marcado como favoritos.
router.get('/', authenticateToken, async (req, res) => {
  try {
    // 1. Obtener paginación de los query params
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 2. Ejecutar dos consultas en paralelo para eficiencia:
    //    a) Obtener la lista de favoritos paginada
    //    b) Contar el total de favoritos (para la paginación)
    const [favorites, total] = await Promise.all([
      prisma.favoritos.findMany({
        where: { usuarioId: req.user.userId }, // Solo los del usuario del token
        include: {
          producto: { // Incluye la información completa del producto asociado
            include: {
              vendedor: { select: { id: true, nombre: true, apellido: true, correo: true } },
              categoria: true,
              estado: true,
              imagenes: true,
            },
          },
        },
        orderBy: { fecha: 'desc' }, // Más nuevos primero
        skip,
        take: parseInt(limit),
      }),
      prisma.favoritos.count({ where: { usuarioId: req.user.userId } }), // Conteo total
    ]);

    // 3. Enviar respuesta con los favoritos y la info de paginación
    res.json({
      ok: true,
      favorites, // La lista de favoritos (con productos anidados)
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error listando favoritos:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// ➕ AGREGAR A FAVORITOS (Protegido)
// POST /api/favorites
// ------------------------------------------
// Añade un producto a la lista de favoritos del usuario.
router.post(
  '/',
  authenticateToken, // Ruta protegida
  [body('productoId').isInt().withMessage('productoId debe ser entero')], // Validación de entrada
  handleValidationErrors, // Manejador de la validación
  async (req, res) => {
    try {
      const { productoId } = req.body;

      // 1. Verifica que el producto que se quiere añadir existe
      const producto = await prisma.productos.findUnique({ where: { id: Number(productoId) } });
      if (!producto) {
        return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
      }

      // 2. Crea la entrada en la tabla 'Favoritos'
      const fav = await prisma.favoritos.create({
        data: {
          usuarioId: req.user.userId, // ID del usuario del token
          productoId: Number(productoId), // ID del producto del body
        },
      });

      res.status(201).json({ ok: true, message: 'Producto añadido a favoritos', favorite: fav });
    } catch (error) {
      // 3. Manejo de error de duplicado.
      //    Esto funciona porque el 'schema.prisma' tiene un '@@unique([usuarioId, productoId])'.
      //    Si se viola esa restricción, Prisma devuelve el código 'P2002'.
      if (error.code === 'P2002') {
        return res.status(409).json({ ok: false, message: 'El producto ya está en favoritos' });
      }
      console.error('Error creando favorito:', error);
      res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
);

// ------------------------------------------
// ➖ QUITAR DE FAVORITOS (Protegido)
// DELETE /api/favorites/:productoId
// ------------------------------------------
// Elimina un producto de la lista de favoritos del usuario.
router.delete('/:productoId', authenticateToken, async (req, res) => {
  try {
    const productoId = Number(req.params.productoId);

    // 1. Elimina la entrada de 'Favoritos'
    //    Se usa 'deleteMany' con un 'where' compuesto para máxima seguridad:
    //    - Solo borra si 'productoId' coincide
    //    - Y 'usuarioId' coincide con el del token.
    //    Esto evita que un usuario borre (por accidente o malicia)
    //    el favorito de otro usuario.
    const result = await prisma.favoritos.deleteMany({
      where: {
        usuarioId: req.user.userId,
        productoId
      },
    });

    // 2. 'result.count' será 1 si lo borró, o 0 si no lo encontró (o no era suyo)
    return res.json({ ok: true, message: 'Eliminado de favoritos', deleted: result.count });
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;