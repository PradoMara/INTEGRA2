// Importa Express para crear las rutas.
const express = require('express');
// Importa funcionalidades de 'express-validator' (aunque no se usan activamente en las validaciones aquí).
const { body, validationResult } = require('express-validator');
// Importa la instancia de Prisma desde la configuración de la base de datos.
const { prisma } = require('../config/database');
// Importa el middleware para verificar tokens JWT y proteger rutas.
const { authenticateToken } = require('../middleware/auth');

// Crea un nuevo router de Express.
const router = express.Router();

// ------------------------------------------
// 📈 LISTAR VENTAS DEL VENDEDOR (Protegido)
// GET /api/sales
// ------------------------------------------
// Ruta protegida que devuelve las ventas del usuario autenticado (vendedor).
// Permite paginación y filtrado por estado.
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Obtiene parámetros de paginación (page, limit) y filtro (estado) de la query string.
    // Establece valores por defecto si no se proporcionan.
    const { page = 1, limit = 20, estado } = req.query;

    // Valida y ajusta los valores de página y límite para asegurar que sean números positivos.
    const currentPage = Math.max(1, parseInt(page));
    const currentLimit = Math.max(1, Math.min(100, parseInt(limit))); // Límite máximo de 100 por página.
    // Calcula cuántos registros saltar basado en la página actual y el límite.
    const skip = (currentPage - 1) * currentLimit;

    // Construye el objeto 'where' para la consulta Prisma.
    // Inicialmente, filtra solo por el ID del vendedor (obtenido del token JWT).
    const where = {
      vendedorId: req.user.userId
    };

    // Si se proporcionó un parámetro 'estado' en la query...
    if (estado) {
      // ...añade una condición al 'where' para filtrar por el nombre del estado (case-insensitive).
      where.estado = {
        nombre: { equals: estado, mode: 'insensitive' }
      };
    }

    // Realiza la consulta a la base de datos para obtener las ventas que coinciden con los filtros.
    const ventas = await prisma.transacciones.findMany({
      where, // Aplica los filtros construidos.
      include: { // Incluye datos relacionados para mostrar información útil.
        producto: { // Datos del producto vendido.
          select: { // Selecciona campos específicos del producto.
            id: true,
            nombre: true,
            descripcion: true,
            precioActual: true,
            categoria: { // Incluye el nombre de la categoría del producto.
              select: { nombre: true }
            }
          }
        },
        comprador: { // Datos del usuario que compró.
          select: { // Selecciona campos específicos del comprador (evita contraseña, etc.).
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            usuario: true,
            campus: true
          }
        },
        estado: true // Incluye el objeto completo del estado de la transacción.
      },
      orderBy: { // Ordena los resultados.
        fechaTransaccion: 'desc' // Las más recientes primero.
      },
      skip, // Aplica el salto para la paginación.
      take: currentLimit // Limita el número de resultados por página.
    });

    // Realiza una segunda consulta para contar el número total de ventas que coinciden con los filtros (para la paginación).
    const total = await prisma.transacciones.count({ where });

    // Calcula estadísticas agregadas para el vendedor.
    // Usa 'aggregate' para sumar 'precioTotal' y contar el total de transacciones.
    const estadisticas = await prisma.transacciones.aggregate({
      where: { vendedorId: req.user.userId }, // Solo para este vendedor.
      _sum: { precioTotal: true }, // Suma el campo 'precioTotal'.
      _count: { id: true } // Cuenta el número de transacciones (por su ID).
    });

    // Usa 'groupBy' para contar cuántas ventas hay por cada 'estadoId'.
    const ventasPorEstado = await prisma.transacciones.groupBy({
      by: ['estadoId'], // Agrupa por el ID del estado.
      where: { vendedorId: req.user.userId }, // Solo para este vendedor.
      _count: { id: true } // Cuenta las transacciones en cada grupo.
    });

    // Envía la respuesta JSON al cliente.
    res.json({
      ok: true, // Indica éxito.
      ventas: ventas.map(venta => ({ // Mapea los resultados a un formato específico.
        id: venta.id,
        fechaTransaccion: venta.fechaTransaccion,
        precioTotal: Number(venta.precioTotal), // Convierte Decimal a Number.
        cantidad: venta.cantidad,
        estado: venta.estado.nombre, // Usa el nombre del estado.
        producto: { // Formatea los datos del producto.
          id: venta.producto.id,
          nombre: venta.producto.nombre,
          descripcion: venta.producto.descripcion,
          precioActual: Number(venta.producto.precioActual), // Convierte Decimal.
          categoria: venta.producto.categoria?.nombre // Usa el nombre de la categoría.
        },
        comprador: venta.comprador // Incluye el objeto comprador formateado.
      })),
      estadisticas: { // Incluye las estadísticas calculadas.
        totalVentas: estadisticas._count.id,
        totalIngresos: Number(estadisticas._sum.precioTotal || 0), // Convierte Decimal, usa 0 si es null.
        ventasPorEstado: ventasPorEstado.map(e => ({ // Formatea el conteo por estado.
          estadoId: e.estadoId,
          cantidad: e._count.id
        }))
      },
      pagination: { // Incluye información de paginación.
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit) // Calcula el número total de páginas.
      }
    });

  } catch (error) {
    // Si ocurre un error en cualquier parte del 'try', lo captura.
    console.error('❌ Error obteniendo ventas:', error); // Loguea el error en el servidor.
    // Envía una respuesta de error 500 al cliente.
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
});

// ------------------------------------------
// ℹ️ DETALLE DE UNA VENTA (Protegido por Rol)
// GET /api/sales/:id
// ------------------------------------------
// Ruta protegida para obtener los detalles completos de una venta específica.
// Solo accesible por el vendedor, el comprador o un administrador.
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Obtiene el ID de la venta de los parámetros de la ruta.
    const { id } = req.params;

    // Busca la transacción única por su ID.
    const venta = await prisma.transacciones.findUnique({
      where: { id: parseInt(id) }, // Convierte el ID a número.
      include: { // Incluye datos relacionados completos.
        producto: {
          include: { // Incluye categoría e imágenes del producto.
            categoria: true,
            imagenes: true
          }
        },
        comprador: {
          select: { // Selecciona campos específicos del comprador.
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            usuario: true,
            campus: true,
            telefono: true,
            direccion: true,
            reputacion: true
          }
        },
        vendedor: {
          select: { // Selecciona campos básicos del vendedor.
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            usuario: true
          }
        },
        estado: true // Incluye el objeto estado.
      }
    });

    // Si no se encontró la venta con ese ID, devuelve 404.
    if (!venta) {
      return res.status(404).json({
        ok: false,
        message: 'Venta no encontrada'
      });
    }

    // Control de permisos: Verifica si el usuario autenticado es el vendedor,
    // el comprador, o si tiene rol de 'ADMIN' (el rol viene del token).
    if (
      venta.vendedorId !== req.user.userId &&
      venta.compradorId !== req.user.userId &&
      req.user.role !== 'ADMIN' // Compara con el rol del token.
    ) {
      // Si no cumple ninguna condición, devuelve 403 (Prohibido).
      return res.status(403).json({
        ok: false,
        message: 'No tienes permiso para ver esta venta'
      });
    }

    // Si los permisos son correctos, envía la respuesta formateada.
    res.json({
      ok: true,
      venta: { // Formatea la respuesta.
        id: venta.id,
        fechaTransaccion: venta.fechaTransaccion,
        precioTotal: Number(venta.precioTotal), // Convierte Decimal.
        cantidad: venta.cantidad,
        estado: venta.estado.nombre,
        producto: { // Formatea producto.
          id: venta.producto.id,
          nombre: venta.producto.nombre,
          descripcion: venta.producto.descripcion,
          precioActual: Number(venta.producto.precioActual), // Convierte Decimal.
          categoria: venta.producto.categoria?.nombre,
          imagenes: venta.producto.imagenes
        },
        comprador: { // Formatea comprador.
          ...venta.comprador,
          reputacion: Number(venta.comprador.reputacion || 0) // Convierte Decimal, usa 0 si es null.
        },
        vendedor: venta.vendedor // Incluye el objeto vendedor formateado.
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo venta:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
});

// ------------------------------------------
// 📊 RESUMEN DE ESTADÍSTICAS (Protegido)
// GET /api/sales/stats/summary
// ------------------------------------------
// Ruta protegida que calcula y devuelve estadísticas clave para el dashboard del vendedor.
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    // Calcula el número total de ventas del vendedor.
    const totalVentas = await prisma.transacciones.count({
      where: { vendedorId: req.user.userId }
    });

    // Calcula el total de ingresos sumando 'precioTotal'.
    const ingresos = await prisma.transacciones.aggregate({
      where: { vendedorId: req.user.userId },
      _sum: { precioTotal: true }
    });

    // Calcula la fecha de hace un mes.
    const unMesAtras = new Date();
    unMesAtras.setMonth(unMesAtras.getMonth() - 1);

    // Cuenta cuántas ventas ocurrieron desde esa fecha hasta ahora.
    const ventasUltimoMes = await prisma.transacciones.count({
      where: {
        vendedorId: req.user.userId,
        fechaTransaccion: { // Filtra por fechaTransaccion >= unMesAtras.
          gte: unMesAtras
        }
      }
    });

    // Encuentra los 5 productos más vendidos por este vendedor.
    // Agrupa las transacciones por 'productoId'.
    const productosMasVendidos = await prisma.transacciones.groupBy({
      by: ['productoId'],
      where: { vendedorId: req.user.userId },
      _sum: { cantidad: true }, // Suma la cantidad vendida de cada producto.
      _count: { id: true }, // Cuenta cuántas veces se vendió cada producto.
      orderBy: { // Ordena por la suma de cantidad descendente.
        _sum: { cantidad: 'desc' }
      },
      take: 5 // Limita a los primeros 5 resultados (Top 5).
    });

    // Obtiene los IDs de los productos Top 5.
    const productosIds = productosMasVendidos.map(p => p.productoId);
    // Busca los nombres de esos productos en la tabla 'productos'.
    const productos = await prisma.productos.findMany({
      where: { id: { in: productosIds } }, // Busca solo los IDs del Top 5.
      select: { id: true, nombre: true } // Solo necesita ID y nombre.
    });

    // Combina los datos de ventas agrupadas con los nombres de los productos.
    const topProductos = productosMasVendidos.map(pv => {
      const producto = productos.find(p => p.id === pv.productoId); // Encuentra el nombre correspondiente.
      return {
        productoId: pv.productoId,
        nombre: producto?.nombre || 'Desconocido', // Usa el nombre o 'Desconocido' si no se encuentra.
        cantidadVendida: pv._sum.cantidad, // La suma de cantidades.
        numeroVentas: pv._count.id // El número de veces que se vendió.
      };
    });

    // Envía el resumen de estadísticas.
    res.json({
      ok: true,
      resumen: {
        totalVentas,
        totalIngresos: Number(ingresos._sum.precioTotal || 0), // Convierte Decimal.
        ventasUltimoMes,
        productosMasVendidos: topProductos // Incluye la lista Top 5 formateada.
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo resumen:', error);
    res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
});

// Exporta el router para que pueda ser usado en 'server.js'.
module.exports = router;