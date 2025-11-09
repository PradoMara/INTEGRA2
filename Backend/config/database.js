// Importa la clase principal de Prisma
const { PrismaClient } = require('@prisma/client');
// Carga las variables de entorno (del archivo .env) para que estén disponibles
require('dotenv').config();

// --- Creación de la Instancia Global de Prisma ---
// Esta es la instancia principal que usarás en toda tu aplicación
// para interactuar (consultar, crear, actualizar, borrar) con la base de datos.
const prisma = new PrismaClient({
  // Configuración de logs:
  // Si estamos en 'development' (desarrollo), muestra todos los logs (queries, info, etc.).
  // Si estamos en 'production' (producción), solo muestra los 'errores'.
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  // Formatea los errores de Prisma para que sean más fáciles de leer en la consola.
  errorFormat: 'pretty',
});

// --- Funciones Utilitarias de Conexión ---

/**
 * Intenta conectarse a la base de datos.
 * Es muy útil para verificar que la variable DATABASE_URL es correcta
 * al iniciar el servidor (como se ve en tu script 'verify-setup.js').
 */
async function testConnection() {
  try {
    // Intenta establecer la conexión
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    return true;
  } catch (error) {
    // Si falla (ej. contraseña incorrecta, DB no existe), muestra el error
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
}

/**
 * Cierra la conexión de Prisma de forma segura.
 */
async function closeConnection() {
  try {
    await prisma.$disconnect();
    console.log('✅ Conexión a PostgreSQL cerrada correctamente');
  } catch (error) {
    console.error('❌ Error cerrando conexión a PostgreSQL:', error.message);
  }
}

// --- Manejo de Cierre Limpio (Graceful Shutdown) ---
// Escucha las señales del sistema operativo para apagar el servidor.
// Esto asegura que, antes de que el servidor se apague, cerremos
// la conexión a la base de datos para no dejar conexiones "colgadas".

// 'SIGINT' es la señal que se envía cuando presionas Ctrl+C en la terminal.
process.on('SIGINT', async () => {
  await closeConnection(); // Cierra la conexión a la BD
  process.exit(0); // Termina el proceso
});

// 'SIGTERM' es una señal de terminación genérica (ej. usada por Docker, Heroku o Kubernetes).
process.on('SIGTERM', async () => {
  await closeConnection(); // Cierra la conexión a la BD
  process.exit(0); // Termina el proceso
});

// --- Exportaciones ---
// Exporta la instancia de 'prisma' para que pueda ser importada
// y utilizada en otras partes de tu aplicación (como en las rutas y controladores).
module.exports = {
  prisma,
  testConnection,
  closeConnection
};