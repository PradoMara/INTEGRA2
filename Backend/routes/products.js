
// routes/products.js
const express = require('express');
const { body, validationResult } = require('express-validator'); // Para validar el body
const { prisma } = require('../config/database'); // Acceso a la BD
const { authenticateToken } = require('../middleware/auth'); // Middleware de autenticación

const router = express.Router();

// ------------------------------------------
// 🛍️ LISTAR PRODUCTOS (Público, con lógica de rol)
// GET /api/products
// ------------------------------------------
// Este endpoint es público, pero su comportamiento cambia si se envía un token.
// NOTA: Para que la lógica de roles funcione, este endpoint debe usar
// un middleware de autenticación *opcional* que ponga 'req.user' si existe
// un token, pero no falle si no está (no está implementado aquí, asume que 'req.user' puede ser undefined).
router.get('/', async (req, res) => {
  try {
    // 1. Obtener filtros y paginación de los query parameters
    const { category, search, page = 1, limit = 20 } = req.query;

    // 2. Limpiar y validar los valores de paginación
    //    Evita valores negativos o '0' y pone un límite máximo de 100.
    const currentPage = Math.max(1, parseInt(page) || 1);
    const currentLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));

    // 3. Construir la consulta 'where' base
    const where = {
      estadoId: 1 // Solo productos "Disponibles"
    };

    // 4. Añadir filtros si existen
    if (category) {
      where.categoria = {
        nombre: { contains: category, mode: 'insensitive' } // Búsqueda case-insensitive
      };
    }
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 5. Calcular el 'skip' para Prisma (cuántos registros saltar)
    const skip = Math.max(0, (currentPage - 1) * currentLimit);

    // 6. LÓGICA DE ROLES (Visibilidad)
    const user = req.user; // 'req.user' es puesto por 'authenticateToken' (si se usa)

    // Se copia la base de filtros
    const whereClause = {
      ...where,
    };

    // APLICAR REGLAS DE VISIBILIDAD
    if (!user) {
      // 6a. Usuario NO LOGEADO (Invitado) → solo ve productos visibles
      whereClause.visible = true;
    } else if (user.role === "CLIENTE") {
      // 6b. Usuario CLIENTE → solo ve productos visibles
      whereClause.visible = true;
    } else if (user.role === "VENDEDOR") {
      // 6c. Usuario VENDEDOR → solo ve SUS productos (visibles o no)
      whereClause.vendedorId = user.userId;
    } else if (user.role === "ADMIN") {
      // 6d. Usuario ADMIN → Ve todo, no se añaden filtros de visibilidad.
    }

    // 7. Ejecutar la consulta a la BD
    const products = await prisma.productos.findMany({
      where: whereClause, // Aplica los filtros
      include: {
        // Selecciona campos específicos del vendedor para no exponer datos sensibles
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            campus: true,
            reputacion: true
          }
        },
        categoria: true, // Incluye info de categoría
        estado: true, // Incluye info de estado
        imagenes: true // Incluye imágenes
      },
      orderBy: [
        { fechaAgregado: 'desc' } // Más nuevos primero
      ],
      skip, // Paginación (saltar)
      take: currentLimit // Paginación (tomar)
    });

    // 8. Obtener el conteo total para la paginación
    const total = await prisma.productos.count({ where: whereClause });

    // 9. Formatear la respuesta
    //    IMPORTANTE: Convierte los tipos 'Decimal' de Prisma a 'Number' para JSON.
    const formattedProducts = products.map(product => ({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precioAnterior: product.precioAnterior ? Number(product.precioAnterior) : null,
      precioActual: product.precioActual ? Number(product.precioActual) : null,
      categoria: product.categoria?.nombre,
      calificacion: product.calificacion ? Number(product.calificacion) : null,
      cantidad: product.cantidad,
      estado: product.estado.nombre,
      fechaAgregado: product.fechaAgregado,
      imagenes: product.imagenes,
      vendedor: {
        id: product.vendedor.id,
        nombre: product.vendedor.nombre,
        apellido: product.vendedor.apellido,
        correo: product.vendedor.correo,
        campus: product.vendedor.campus,
        reputacion: product.vendedor.reputacion ? Number(product.vendedor.reputacion) : 0
      }
    }));

    // 10. Enviar respuesta final
    res.json({
      ok: true,
      products: formattedProducts,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / currentLimit))
      }
    });

  } catch (error) {
    console.error('❌ Error listando productos:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ------------------------------------------
// 📦 LISTAR MIS PRODUCTOS (Vendedor)
// GET /api/products/my-products
// ------------------------------------------
// Ruta protegida para que un Vendedor/Admin vea solo sus propios productos.
router.get('/my-products', authenticateToken, async (req, res) => {
  try {
    // 1. Paginación
    const { page = 1, limit = 20 } = req.query;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const currentLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const skip = Math.max(0, (currentPage - 1) * currentLimit);

    // 2. Filtro principal: solo productos del ID de usuario del token
    const whereClause = {
      vendedorId: req.user.userId
    };

    // 3. Ejecutar consulta y conteo en una transacción para eficiencia
    const [products, total] = await prisma.$transaction([
      prisma.productos.findMany({
        where: whereClause,
        include: {
          categoria: true,
          estado: true,
          imagenes: true,
          vendedor: { select: { id: true, nombre: true, apellido: true } }
        },
        orderBy: { fechaAgregado: 'desc' },
        skip,
        take: currentLimit
      }),
      prisma.productos.count({ where: whereClause }) // Conteo
    ]);

    // 4. Formatear la respuesta (convirtiendo Decimales)
    const formattedProducts = products.map(product => ({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precioAnterior: product.precioAnterior ? Number(product.precioAnterior) : null,
      precioActual: product.precioActual ? Number(product.precioActual) : null,
      categoria: product.categoria?.nombre,
      calificacion: product.calificacion ? Number(product.calificacion) : null,
      cantidad: product.cantidad,
      estado: product.estado.nombre,
      // Se incluye 'visible' para que el vendedor pueda verlo en su panel
      visible: product.visible,
      fechaAgregado: product.fechaAgregado,
      imagenes: product.imagenes,
      vendedor: product.vendedor
    }));

    res.json({
      ok: true,
      products: formattedProducts,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit)
      }
    });

  } catch (error) {
    console.error('❌ Error listando mis productos:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// ℹ️ OBTENER PRODUCTO POR ID (Público)
// GET /api/products/:id
// ------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
      include: {
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            campus: true,
            reputacion: true
          }
        },
        categoria: true,
        estado: true,
        imagenes: true
      }
    });

    // 1. Validación de seguridad:
    //    Si el producto no existe O su estado NO es "Disponible" (ID 1),
    //    se devuelve 404. Evita que se vean productos vendidos o eliminados.
    if (!product || product.estadoId !== 1) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado'
      });
    }

    // 2. Formatear la respuesta (convirtiendo Decimales)
    const formattedProduct = {
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precioAnterior: product.precioAnterior ? Number(product.precioAnterior) : null,
      precioActual: product.precioActual ? Number(product.precioActual) : null,
      categoria: product.categoria?.nombre,
      calificacion: product.calificacion ? Number(product.calificacion) : null,
      cantidad: product.cantidad,
      estado: product.estado.nombre,
      fechaAgregado: product.fechaAgregado,
      imagenes: product.imagenes,
      vendedor: {
        ...product.vendedor,
        reputacion: product.vendedor.reputacion ? Number(product.vendedor.reputacion) : 0
      }
    };

    res.json({
      ok: true,
      product: formattedProduct
    });

  } catch (error) {
    console.error('❌ Error obteniendo producto:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// ➕ CREAR PRODUCTO (Protegido, con Auto-Promoción)
// POST /api/products
// ------------------------------------------
router.post('/', authenticateToken, [
  // 1. Validaciones del body
  body('nombre').isLength({ min: 3 }).withMessage('Nombre debe tener al menos 3 caracteres'),
  body('descripcion').isLength({ min: 10 }).withMessage('Descripción debe tener al menos 10 caracteres'),
  body('precioActual').isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  body('categoriaId').isInt({ min: 1 }).withMessage('Debe seleccionar una categoría válida')
], async (req, res) => {
  try {
    // 2. Manejar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, message: 'Datos de entrada inválidos', errors: errors.array() });
    }

    const {
      nombre,
      descripcion,
      precioAnterior,
      precioActual,
      categoriaId,
      cantidad
    } = req.body;

    // 3. Validar que la categoría enviada existe
    const categoria = await prisma.categorias.findUnique({
      where: { id: parseInt(categoriaId) }
    });
    if (!categoria) {
      return res.status(400).json({ ok: false, message: 'Categoría no encontrada' });
    }

    // 4. Obtener el usuario actual (del token) y su ROL
    const usuario = await prisma.cuentas.findUnique({
      where: { id: req.user.userId },
      include: { rol: true }
    });
    if (!usuario) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    // 5. ⭐️ LÓGICA DE AUTO-PROMOCIÓN ⭐️
    //    Si el usuario es "CLIENTE", se le promueve a "VENDEDOR".
    let roleChanged = false;
    if (usuario.rol.nombre.toUpperCase() === 'CLIENTE') {
      // 5a. Buscar el ID del rol "Vendedor"
      const rolVendedor = await prisma.roles.findFirst({
        where: { nombre: { equals: 'Vendedor', mode: 'insensitive' } }
      });
      if (!rolVendedor) {
        return res.status(500).json({ ok: false, message: 'Error: Rol de vendedor no encontrado' });
      }

      // 5b. Actualizar el rol del usuario en la BD
      await prisma.cuentas.update({
        where: { id: usuario.id },
        data: { rolId: rolVendedor.id }
      });

      roleChanged = true; // Marcar que el rol cambió
      console.log(`✅ Usuario ${usuario.usuario} promovido a VENDEDOR`);
    }

    // 6. Crear el producto
    const newProduct = await prisma.productos.create({
      data: {
        nombre,
        descripcion,
        precioAnterior: precioAnterior ? parseFloat(precioAnterior) : null,
        precioActual: parseFloat(precioActual),
        categoriaId: parseInt(categoriaId),
        vendedorId: req.user.userId, // Asignar al usuario del token
        cantidad: cantidad ? parseInt(cantidad) : 1,
        estadoId: 1, // "Disponible" por defecto
        visible: true, // Visible por defecto
        calificacion: 0.0
      },
      include: {
        categoria: true,
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            usuario: true
          }
        },
        estado: true
      }
    });

    // 7. Enviar respuesta 201 (Creado)
    res.status(201).json({
      ok: true,
      // Mensaje dinámico si el rol cambió
      message: roleChanged
        ? '🎉 ¡Producto creado! Ahora eres VENDEDOR'
        : 'Producto creado exitosamente',
      roleChanged, // Informa al frontend sobre el cambio
      newRole: roleChanged ? 'VENDEDOR' : usuario.rol.nombre.toUpperCase(),
      product: {
        id: newProduct.id,
        nombre: newProduct.nombre,
        descripcion: newProduct.descripcion,
        precioActual: Number(newProduct.precioActual),
        precioAnterior: newProduct.precioAnterior ? Number(newProduct.precioAnterior) : null,
        categoria: newProduct.categoria?.nombre,
        cantidad: newProduct.cantidad,
        visible: newProduct.visible,
        vendedor: newProduct.vendedor
      }
    });

  } catch (error) {
    console.error('❌ Error creando producto:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ------------------------------------------
// 🗂️ OBTENER CATEGORÍAS (Público)
// GET /api/products/categories/list
// ------------------------------------------
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.categorias.findMany({
      orderBy: { nombre: 'asc' },
      include: { subcategorias: true, categoriaPadre: true }
    });

    // Formatear respuesta para que sea más limpia
    res.json({
      ok: true,
      categories: categories.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        categoriaPadreId: cat.categoriaPadreId,
        subcategorias: cat.subcategorias?.map(sub => ({ id: sub.id, nombre: sub.nombre })) || []
      }))
    });

  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// 👁️ CAMBIAR VISIBILIDAD (Protegido)
// PATCH /api/products/:id/visibility
// ------------------------------------------
// Usa PATCH porque es una actualización parcial (solo un campo).
router.patch("/:id/visibility", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body; // Espera { "visible": true } o { "visible": false }

    // 1. Validar la entrada
    if (typeof visible !== "boolean") {
      return res.status(400).json({ ok: false, message: "El valor de 'visible' debe ser booleano" });
    }

    // 2. Buscar el producto
    const producto = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
    });
    if (!producto) {
      return res.status(404).json({ ok: false, message: "Producto no encontrado" });
    }

    // 3. 🛡️ CONTROL DE PERMISOS
    //    Solo el Vendedor dueño O un Admin pueden cambiar la visibilidad.
    if (producto.vendedorId !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ ok: false, message: "No tienes permiso para modificar este producto" });
    }

    // 4. Actualizar el producto
    const actualizado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: { visible }, // Actualiza solo el campo 'visible'
    });

    res.json({ ok: true, message: "Visibilidad actualizada", producto: actualizado });
  } catch (error) {
    console.error("❌ Error al cambiar visibilidad:", error);
    res.status(500).json({ ok: false, message: "Error interno al cambiar visibilidad" });
  }
});

// ------------------------------------------
// 🔄 ACTUALIZAR PRODUCTO (Protegido)
// PUT /api/products/:id
// ------------------------------------------
// Usa PUT para una actualización completa (o casi completa) del recurso.
router.put('/:id', authenticateToken, [
  // 1. Validaciones (opcionales, ya que es un PUT/actualización)
  body('nombre').optional().isLength({ min: 3 }).withMessage('Nombre debe tener al menos 3 caracteres'),
  body('descripcion').optional().isLength({ min: 10 }).withMessage('Descripción debe tener al menos 10 caracteres'),
  body('precioActual').optional().isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  body('categoriaId').optional().isInt({ min: 1 }).withMessage('Categoría inválida'),
  body('cantidad').optional().isInt({ min: 0 }).withMessage('Cantidad debe ser un número entero positivo')
], async (req, res) => {
  try {
    // 2. Manejar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ok: false, message: 'Datos de entrada inválidos', errors: errors.array() });
    }

    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precioAnterior,
      precioActual,
      categoriaId,
      cantidad,
      estadoId
    } = req.body;

    // 3. Verificar que el producto existe
    const productoExistente = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
      include: { vendedor: true }
    });
    if (!productoExistente) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    // 4. 🛡️ CONTROL DE PERMISOS
    //    Solo el Vendedor dueño O un Admin pueden modificarlo.
    if (productoExistente.vendedorId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ ok: false, message: 'No tienes permiso para modificar este producto' });
    }

    // 5. Construir objeto de actualización dinámico
    //    (Solo actualiza los campos que vienen en el 'body')
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (precioAnterior !== undefined) updateData.precioAnterior = precioAnterior ? parseFloat(precioAnterior) : null;
    if (precioActual !== undefined) updateData.precioActual = parseFloat(precioActual);
    if (categoriaId !== undefined) updateData.categoriaId = parseInt(categoriaId);
    if (cantidad !== undefined) updateData.cantidad = parseInt(cantidad);
    if (estadoId !== undefined) updateData.estadoId = parseInt(estadoId);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    // 6. Validar que la nueva categoría (si se cambió) existe
    if (categoriaId) {
      const categoria = await prisma.categorias.findUnique({
        where: { id: parseInt(categoriaId) }
      });
      if (!categoria) {
        return res.status(400).json({ ok: false, message: 'Categoría no encontrada' });
      }
    }

    // 7. Actualizar el producto en la BD
    const productoActualizado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        categoria: true,
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            usuario: true
          }
        },
        estado: true
      }
    });

    // 8. Enviar respuesta (con datos formateados y Decimales convertidos)
    res.json({
      ok: true,
      message: 'Producto actualizado exitosamente',
      product: {
        id: productoActualizado.id,
        nombre: productoActualizado.nombre,
        descripcion: productoActualizado.descripcion,
        precioActual: Number(productoActualizado.precioActual),
        precioAnterior: productoActualizado.precioAnterior ? Number(productoActualizado.precioAnterior) : null,
        categoria: productoActualizado.categoria?.nombre,
        cantidad: productoActualizado.cantidad,
        visible: productoActualizado.visible,
        estado: productoActualizado.estado.nombre,
        vendedor: productoActualizado.vendedor
      }
    });

  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ------------------------------------------
// 🗑️ ELIMINAR PRODUCTO (Soft Delete)
// DELETE /api/products/:id
// ------------------------------------------
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Buscar el producto
    const producto = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
      include: { vendedor: true, estado: true }
    });
    if (!producto) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    // 2. 🛡️ CONTROL DE PERMISOS
    //    Solo el Vendedor dueño O un Admin pueden eliminarlo.
    if (producto.vendedorId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ ok: false, message: 'No tienes permiso para eliminar este producto' });
    }

    // 3. 🛡️ LÓGICA DE NEGOCIO: Evitar eliminar si hay transacciones pendientes
    const transaccionesPendientes = await prisma.transacciones.findFirst({
      where: {
        productoId: parseInt(id),
        estadoId: { in: [1, 2] } // Asumiendo 1="Pendiente", 2="En proceso"
      }
    });
    if (transaccionesPendientes) {
      return res.status(400).json({
        ok: false,
        message: 'No se puede eliminar: tiene transacciones pendientes'
      });
    }

    // 4. Buscar el ID del estado "Eliminado"
    const estadoEliminado = await prisma.estadosProducto.findFirst({
      where: {
        OR: [
          { nombre: { equals: 'Eliminado', mode: 'insensitive' } },
          { nombre: { equals: 'Inactivo', mode: 'insensitive' } }
        ]
      }
    });
    if (!estadoEliminado) {
      return res.status(500).json({ ok: false, message: 'Error: Estado "Eliminado" no configurado' });
    }

    // 5. ❗️ SOFT DELETE ❗️
    //    No se borra el registro, solo se actualiza su estado y visibilidad.
    const productoEliminado = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: {
        estadoId: estadoEliminado.id, // Cambia el estado
        visible: false // Lo oculta de las búsquedas públicas
      },
      include: {
        estado: true,
        vendedor: {
          select: { id: true, nombre: true, usuario: true }
        }
      }
    });

    res.json({
      ok: true,
      message: 'Producto eliminado exitosamente',
      product: {
        id: productoEliminado.id,
        nombre: productoEliminado.nombre,
        estado: productoEliminado.estado.nombre,
        // Informa quién realizó la acción
        eliminadoPor: { id: req.user.userId, role: req.user.role }
      }
    });

  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;