// utils/AppError.js

/**
 * Define una clase de error personalizada que hereda de la clase 'Error' nativa de JavaScript.
 * Esto nos permite estandarizar los errores en toda la aplicación.
 *
 * En lugar de hacer:
 * throw new Error("Algo salió mal");
 *
 * Hacemos:
 * throw new AppError("Usuario no encontrado", "USER_NOT_FOUND", 404);
 */
class AppError extends Error {

  /**
   * Constructor para crear un nuevo error de aplicación.
   *
   * @param {string} message - El mensaje de error legible (ej. "Contraseña incorrecta").
   * @param {string} [code="APP_ERROR"] - Un código interno único para este tipo de error (ej. "AUTH_FAILED").
   * @param {number} [statusCode=400] - El código de estado HTTP que el servidor debe responder (ej. 400, 401, 404, 500).
   * @param {any} [details=null] - Un objeto o valor opcional para pasar información extra (ej. { campo: "email" }).
   */
  constructor(message, code = "APP_ERROR", statusCode = 400, details = null) {
    // 1. Llama al constructor de la clase padre 'Error' y le pasa el mensaje.
    //    Esto establece la propiedad 'this.message'.
    super(message);

    // 2. Propiedades personalizadas que añadimos a nuestro error:

    // Un código de error interno, legible para el desarrollador.
    this.code = code;
    // El código de estado HTTP que usará el 'errorHandler' para la respuesta.
    this.statusCode = statusCode;
    // Un campo para adjuntar datos adicionales sobre el error (opcional).
    this.details = details;
  }
}

// Exporta la clase 'AppError' para que pueda ser importada y utilizada
// en otras partes de la aplicación (como en las rutas y controladores).
module.exports = AppError;