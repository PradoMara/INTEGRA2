// routes/publications.js
const express = require('express');
const { body, validationResult } = require('express-validator'); // Para validar la entrada
const { prisma } = require('../config/database'); // Acceso a la BD
const { authenticateToken } = require('../middleware/auth'); // Middleware de autenticación

const router = express.Router();

// ------------------------------------------
// 📰 LISTAR PUBLICACIONES (Público)
// GET /api/publications
// ------------------------------------------
// Ruta pública que devuelve una lista paginada de todas las publicaciones.
// Permite buscar por 'titulo' o 'cuerpo'.
router.get('/', async (req, res) => {
  try {
    // 1. Obtener paginación y búsqueda de los query params
    const { page = 1, limit = 10, search } = req.query;

    // 2. Construir filtro de búsqueda (si existe)
    const where = {};
    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { cuerpo: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 3. Calcular el 'skip' para la paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 4. Buscar las publicaciones en la BD
    const publications = await prisma.publicaciones.findMany({
      where,
      include: {
        usuario: { // Incluye datos básicos del autor
          select: { id: true, nombre: true, apellido: true, usuario: true }
        }
      },
      orderBy: { fecha: 'desc' }, // Más nuevas primero
      skip,
      take: parseInt(limit)
    });

    // 5. Contar el total de publicaciones para la paginación
    const total = await prisma.publicaciones.count({ where });

    // 6. Enviar respuesta
    res.json({
      ok: true,
      publications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error listando publicaciones:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// ➕ CREAR PUBLICACIÓN (Protegido)
// POST /api/publications
// ------------------------------------------
router.post(
  '/',
  authenticateToken, // 1. Ruta protegida: requiere token
  [
    // 2. Validaciones de entrada
    body('titulo')
      .isLength({ min: 3 })
      .withMessage('El título debe tener al menos 3 caracteres'),
    body('cuerpo')
      .isLength({ min: 10 })
      .withMessage('El cuerpo debe tener al menos 10 caracteres'),
  ],
  async (req, res) => {
    try {
      // 3. Manejar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          message: 'Datos inválidos',
          errors: errors.array(),
        });
      }

      const { titulo, cuerpo, estado } = req.body;

      // 4. Crear la publicación en la BD
      const newPublication = await prisma.publicaciones.create({
        data: {
          titulo,
          cuerpo,
          estado: estado || 'Activo', // Estado por defecto
          usuarioId: req.user.userId // Asigna el ID del usuario autenticado
        },
        include: {
          usuario: { // Devuelve los datos del autor
            select: { id: true, nombre: true, apellido: true, usuario: true }
          }
        }
      });

      // 5. Enviar respuesta 201 (Creado)
      res.status(201).json({
        ok: true,
        message: 'Publicación creada exitosamente',
        publication: newPublication
      });
    } catch (error) {
      console.error('Error creando publicación:', error);
      res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
);

// ------------------------------------------
// 🗑️ ELIMINAR PUBLICACIÓN (Protegido)
// DELETE /api/publications/:id
// ------------------------------------------
// NOTA: Esta ruta no verifica si el usuario es el dueño o un admin.
// Debería añadirse un control de permisos.
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // 1. (PENDIENTE) Verificar permisos:
    //    const publicacion = await prisma.publicaciones.findUnique({ where: { id } });
    //    if (publicacion.usuarioId !== req.user.userId && req.user.role !== 'ADMIN') {
    //      return res.status(403).json({ ok: false, message: 'No autorizado' });
    //    }

    // 2. Eliminar la publicación (Hard Delete)
    const deleted = await prisma.publicaciones.delete({
      where: { id }
    });

    res.json({ ok: true, message: 'Publicación eliminada', deleted });
  } catch (error) {
    // Si el 'delete' falla (ej. 'findUnique' no encuentra el ID), Prisma lanza un error
    console.error('Error eliminando publicación:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// ✔️ MARCAR COMO VISTA (Protegido)
// PATCH /api/publications/:id/visto
// ------------------------------------------
// Actualiza solo el campo 'visto' de una publicación.
router.patch('/:id/visto', authenticateToken, async (req, res) => {
  try {
    const updated = await prisma.publicaciones.update({
      where: { id: parseInt(req.params.id) },
      data: { visto: true } // Actualización parcial
    });
    res.json({ ok: true, message: 'Publicación marcada como vista', updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Error interno' });
  }
});

// ------------------------------------------
// 🔄 ACTUALIZAR PUBLICACIÓN (Protegido)
// PUT /api/publications/:id
// ------------------------------------------
// NOTA: Esta ruta tampoco verifica permisos (dueño o admin).
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { titulo, cuerpo, estado } = req.body;

    // 1. (PENDIENTE) Verificar permisos (ver ruta DELETE)

    // 2. Actualizar la publicación
    const updated = await prisma.publicaciones.update({
      where: { id: parseInt(req.params.id) },
      data: { titulo, cuerpo, estado } // Actualiza los campos enviados
    });

    res.json({ ok: true, message: 'Publicación actualizada', updated });
  } catch (error) {
    console.error('Error actualizando publicación:', error);
    res.status(500).json({ ok: false, message: 'Error interno' });
  }
});


// ------------------------------------------
// ⚠️ OBTENER CATEGORÍAS (Ruta pública)
// GET /api/publications/get_categorias
// ------------------------------------------
// NOTA: Esta ruta parece estar fuera de lugar.
// Obtiene las categorías de *Productos* (tabla 'Categorias'),
// pero está definida en el router de *Publicaciones*.
// Debería estar en 'routes/products.js' o en un 'routes/categories.js' dedicado.
router.get('/get_categorias', async (req, res) => {
  try {
    // 1. Obtiene todas las categorías de la tabla 'Categorias'
    const categories = await prisma.categorias.findMany({
      orderBy: { nombre: 'asc' },
    });

    // 2. Organiza las categorías en una estructura de árbol (padres e hijos)
    const categoriasMap = {};
    categories.forEach(cat => {
      categoriasMap[cat.id] = { ...cat, subcategorias: [] };
    });

    const rootCategorias = [];
    categories.forEach(cat => {
      if (cat.categoriaPadreId) {
        // Si tiene padre, se añade como hija
        categoriasMap[cat.categoriaPadreId]?.subcategorias.push(categoriasMap[cat.id]);
      } else {
        // Si no tiene padre, es una categoría raíz
        rootCategorias.push(categoriasMap[cat.id]);
      }
    });

    res.json({
      ok: true,
      categorias: rootCategorias, // Devuelve solo las categorías raíz (con sus hijas anidadas)
      total: categories.length,
    });
  } catch (error) {
    console.error('Error listando categorías:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;