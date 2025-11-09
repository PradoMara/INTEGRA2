/**
 * Este es un middleware de manejo de errores de Express.
 * Se identifica por tener 4 argumentos: (err, req, res, next).
 * Express lo llama automáticamente cuando ocurre un error en cualquier
 * parte de la cadena de middlewares o rutas (especialmente al usar 'next(err)').
 *
 * @param {Error|AppError} err - El objeto de error. Puede ser un 'Error' genérico
 * o nuestra clase personalizada 'AppError'.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función 'next' de Express.
 */
function errorHandler(err, req, res, next) {
  // 1. Log interno del error
  // Muestra el error completo en la consola del servidor para depuración.
  // El usuario final nunca ve esto.
  console.error(err);

  // 2. Determinar el Código de Estado HTTP
  // Si el error es un 'AppError' (que creamos nosotros), usará el 'err.statusCode' (ej. 404, 401).
  // Si es un error genérico o inesperado (ej. un 'SyntaxError'), usará 500 (Error Interno del Servidor).
  const statusCode = err.statusCode || 500;

  // 3. Enviar una respuesta JSON estandarizada
  // Siempre enviamos una respuesta JSON formateada al cliente/frontend.
  res.status(statusCode).json({
    // 'success: false' le indica al frontend que la petición falló.
    success: false,
    // 'error' es un objeto que contiene los detalles que el frontend SÍ puede leer.
    error: {
      // Usa el código personalizado (ej. "USER_NOT_FOUND") de 'AppError'
      // o un código genérico si es un error inesperado.
      code: err.code || "INTERNAL_SERVER_ERROR",

      // Usa el mensaje legible (ej. "Usuario no encontrado") de 'AppError'
      // o un mensaje genérico.
      message: err.message || "Ocurrió un error inesperado",

      // Incluye cualquier detalle extra que hayamos adjuntado al 'AppError'.
      details: err.details || null
    }
  });
}

// Exporta la función para ser usada en 'server.js'
module.exports = errorHandler;