#!/usr/bin/env node // 'Shebang': Indica que este script puede ser ejecutado directamente desde la terminal (ej. ./setup-postgresql.js)

// Importa módulos nativos de Node.js
const { execSync } = require('child_process'); // Para ejecutar comandos de terminal (como 'npm install')
const fs = require('fs'); // Para interactuar con el sistema de archivos (leer, escribir, copiar)
const path = require('path'); // Para construir rutas de archivo de forma segura (independiente del SO)

console.log('🚀 Configurando PostgreSQL con Prisma...\n'); // Mensaje inicial

/**
 * Función auxiliar para ejecutar un comando de terminal.
 * Muestra una descripción, ejecuta el comando y maneja errores.
 * @param {string} command - El comando a ejecutar (ej. 'npm install').
 * @param {string} description - Descripción amigable de lo que hace el comando.
 */
function runCommand(command, description) {
  console.log(`📋 ${description}...`); // Muestra qué se está haciendo
  try {
    // Ejecuta el comando de forma síncrona.
    // 'stdio: 'inherit'' hace que la salida del comando (y los errores) se muestren directamente en la terminal.
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado\n`); // Mensaje de éxito
  } catch (error) {
    // Si el comando falla (ej. 'npm install' sin conexión), captura el error.
    console.error(`❌ Error en: ${description}`);
    console.error(error.message); // Muestra el mensaje de error específico.
    process.exit(1); // Termina el script con un código de error.
  }
}

/**
 * Función para verificar/crear el archivo .env.
 * Comprueba si existe un archivo .env. Si no, intenta copiarlo desde .env.example.
 */
function setupEnvFile() {
  // Construye las rutas completas a los archivos .env y .env.example
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');

  // Verifica si el archivo .env NO existe
  if (!fs.existsSync(envPath)) {
    // Si no existe, verifica si SÍ existe .env.example
    if (fs.existsSync(envExamplePath)) {
      console.log('📄 Creando archivo .env desde .env.example...');
      // Copia el contenido de .env.example a un nuevo archivo .env
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Archivo .env creado');
      // ¡Importante! Recuérdale al usuario que debe editar el .env
      console.log('⚠️  IMPORTANTE: Edita el archivo .env con tu configuración de PostgreSQL\n');
    } else {
      // Si no existe ni .env ni .env.example, el script no puede continuar.
      console.log('❌ No se encontró .env.example');
      process.exit(1); // Termina con error.
    }
  } else {
    // Si .env ya existe, no hace nada.
    console.log('✅ Archivo .env ya existe\n');
  }
}

/**
 * Función principal asíncrona que orquesta los pasos de configuración.
 */
async function main() {
  try {
    // 1. Verifica la versión de Node.js instalada (solo informativo).
    console.log('🔍 Verificando Node.js...');
    const nodeVersion = process.version;
    console.log(`✅ Node.js ${nodeVersion} detectado\n`);

    // 2. Ejecuta 'npm install' para instalar todas las dependencias del package.json.
    runCommand('npm install', 'Instalando dependencias');

    // 3. Llama a la función para configurar el archivo .env.
    setupEnvFile();

    // 4. Ejecuta 'npx prisma generate' para crear/actualizar el cliente de Prisma
    //    basado en el schema.prisma.
    runCommand('npx prisma generate', 'Generando cliente de Prisma');

    // --- Mensajes Finales ---
    // Si todos los pasos fueron exitosos, muestra las instrucciones siguientes.
    console.log('🎉 Configuración completada!\n');
    console.log('📋 Próximos pasos:');
    console.log('1. Edita el archivo .env con tu configuración de PostgreSQL');
    console.log('2. Ejecuta: npm run db:push (para aplicar el schema)'); // Sincroniza BD con schema (desarrollo)
    console.log('3. Ejecuta: npm run db:seed (para datos iniciales)'); // Pobla la BD
    console.log('4. Ejecuta: npm run dev (para iniciar el servidor)\n'); // Inicia el servidor

    // Muestra comandos útiles definidos en package.json.
    console.log('💡 Comandos útiles:');
    console.log('- npm run db:studio    # Abrir GUI de base de datos');
    console.log('- npm run db:migrate   # Crear migraciones');
    console.log('- npm run dev          # Iniciar servidor\n');

  } catch (error) {
    // Captura cualquier error inesperado en la función 'main'.
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1); // Termina con error.
  }
}

// Llama a la función principal para iniciar la ejecución del script.
main();