// src/middlewares/error.middleware.js

// CRÍTICO: Importar Multer para detectar sus errores
const multer = require('multer'); 

function errorHandler(err, _req, res, _next) {
  console.error('❌ API error:', err.message); // <— Log solo el mensaje para evitar saturación
  
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = 'Error interno del servidor.';

  // 1. Manejo de Errores de Multer (Subida de Archivos)
  if (err instanceof multer.MulterError) {
    statusCode = 400; // Siempre es un error de cliente
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'El tamaño del archivo excede el límite (máximo 5MB).';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Se excedió el límite de archivos.';
    }
  } 
  
  // 2. Manejo de errores personalizados del servicio/controlador (ej. tipo Error con mensaje)
  // El error de 'Archivo no permitido' lanzado en upload.middleware.js cae aquí.
  else if (err.message === 'Archivo no permitido') {
      statusCode = 400;
      message = 'Tipo de archivo no permitido. Solo se permiten imágenes.';
  } 
  // 3. Manejo de errores de validación lanzados en el controlador/servicio
  else if (err.statusCode || err.status) {
      statusCode = err.statusCode || err.status;
      message = err.message;
  }
  
  res.status(statusCode).json({ error: message });
}
module.exports = { errorHandler };