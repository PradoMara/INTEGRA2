// Importa la librería para firmar y verificar JSON Web Tokens.
const jwt = require('jsonwebtoken');
// Importa nuestra clase de error personalizada para enviar respuestas de error estándar.
const AppError = require('../utils/AppError');

/**
 * Middleware de Autenticación (¿Quién eres?)
 * Verifica que la petición tenga un token JWT válido.
 * Si es válido, decodifica el 'payload' (datos del usuario) y lo adjunta a 'req.user'.
 */
const authenticateToken = (req, res, next) => {
  // 1. Obtener la cabecera 'Authorization'.
  const authHeader = req.headers['authorization'];

  // 2. Extraer el token. El formato esperado es "Bearer [EL_TOKEN]".
  //    'authHeader.split(' ')[1]' divide el string por el espacio y toma la segunda parte.
  const token = authHeader && authHeader.split(' ')[1];

  // 3. Si no se proporciona ningún token...
  if (!token) {
    // Llama al 'errorHandler' con un error 401 (No Autorizado).
    return next(new AppError(
      "Token de acceso requerido",
      "TOKEN_REQUIRED",
      401 // 401 Unauthorized - Se requiere autenticación.
    ));
  }

  // 4. Si hay un token, intentar verificarlo.
  //    Compara el token con el 'JWT_SECRET' guardado en el .env.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    // 5. Si el token es inválido (firmado mal, expirado, etc.)...
    if (err) {
      // Llama al 'errorHandler' con un error 403 (Prohibido).
      return next(new AppError(
        "Token inválido o expirado",
        "TOKEN_INVALID",
        403 // 403 Forbidden - Eres "alguien", pero no tienes permiso (token malo).
      ));
    }

    // 6. ¡Éxito! El token es válido.
    console.log('Token decodificado:', user);

    // 7. Adjuntar los datos del usuario (del token) al objeto 'request'.
    //    Ahora, TODAS las rutas que se ejecuten DESPUÉS de este middleware
    //    tendrán acceso a 'req.user' (ej. req.user.userId, req.user.role).
    req.user = user;

    // 8. Pasa a la siguiente función (otro middleware o el controlador de la ruta).
    next();
  });
};

/**
 * Middleware de Autorización (¿Qué puedes hacer?)
 * Verifica que el usuario (ya autenticado por 'authenticateToken')
 * tenga el rol de 'Administrador'.
 *
 * IMPORTANTE: Este middleware DEBE ejecutarse DESPUÉS de 'authenticateToken'.
 */
const requireAdmin = (req, res, next) => {
  // Comprueba el rol que se adjuntó en 'req.user'
  if (req.user.role.toLowerCase() !== 'administrador') {
    // Si no es admin, lanza un error 403 (Prohibido).
    return next(new AppError(
      "Acceso denegado: se requieren permisos de administrador",
      "FORBIDDEN_ADMIN",
      403,
      { requiredRole: "Administrador" }
    ));
  }
  // Si es admin, permite el paso.
  next();
};

/**
 * Middleware de Autorización (¿Qué puedes hacer?)
 * Verifica que el usuario sea 'Administrador' O 'VENDEDOR'.
 *
 * IMPORTANTE: Este middleware DEBE ejecutarse DESPUÉS de 'authenticateToken'.
 */
const requireVendor = (req, res, next) => {
  // Comprueba si el rol del usuario está en la lista de roles permitidos.
  // NOTA: Has puesto 'VENDEDOR' en mayúsculas, asegúrate de que coincida con tu base de datos
  // o con lo que guardas en el token.
  if (!['Administrador', 'VENDEDOR'].includes(req.user.role)) {
    // Si no es ninguno de los dos, lanza un error 403.
    return next(new AppError(
      "Acceso denegado: se requieren permisos de vendedor",
      "FORBIDDEN_VENDOR",
      403,
      { requiredRoles: ["Administrador", "VENDEDOR"] }
    ));
  }
  // Si tiene el rol, permite el paso.
  next();
};

// Exporta las funciones para usarlas en los archivos de rutas.
module.exports = {
  authenticateToken,
  requireAdmin,
  requireVendor
};