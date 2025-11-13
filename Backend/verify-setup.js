// Importa la instancia de Prisma y la función 'testConnection' desde la configuración de la BD.
const { prisma, testConnection } = require('./config/database');

/**
 * Función asíncrona principal que realiza las verificaciones.
 * Devuelve 'true' si todo está correcto, 'false' si algo falla.
 */
async function verifySetup() {
  console.log('🔍 Verificando configuración de PostgreSQL + Prisma...\n'); // Mensaje inicial

  try {
    // --- Test 1: Conexión a la Base de Datos ---
    console.log('1. Probando conexión a PostgreSQL...');
    // Llama a la función 'testConnection' (definida en config/database.js)
    // que intenta conectarse a la BD usando la URL del .env.
    const connected = await testConnection();
    if (!connected) {
      // Si la conexión falla, muestra un error y sugiere revisar el .env.
      console.log('❌ No se pudo conectar a PostgreSQL');
      console.log('💡 Verifica tu DATABASE_URL en el archivo .env');
      return false; // Termina la verificación con fallo.
    }

    // --- Test 2: Verificar si las Tablas Existen ---
    console.log('2. Verificando estructura de base de datos (tablas)...');
    try {
      // Ejecuta una consulta SQL cruda para contar las tablas en el esquema 'public'.
      // Esto verifica si las migraciones (o 'db push') se han aplicado.
      const tablesCount = await prisma.$queryRaw`
     SELECT COUNT(*) as count 
     FROM information_schema.tables 
     WHERE table_schema = 'public'
      `;
      // Muestra cuántas tablas se encontraron.
      console.log(`✅ Base de datos configurada con ${tablesCount[0].count} tablas`);
    } catch (error) {
      // Si la consulta falla (ej. la BD existe pero está vacía), sugiere ejecutar 'db push'.
      console.log('⚠️  Base de datos conectada pero sin tablas - ejecuta: npm run db:push');
      // No retorna 'false' aquí, ya que la conexión es buena, solo faltan tablas.
    }

    // --- Test 3: Probar Consulta Básica a una Tabla ---
    console.log('3. Probando consultas básicas (tabla cuentas)...');
    try {
      // Intenta contar registros en la tabla 'cuentas'.
      // Si esto funciona, confirma que Prisma puede interactuar con el schema.
      const userCount = await prisma.cuentas.count();
      console.log(`✅ Tabla cuentas accesible - ${userCount} usuarios registrados`);
    } catch (error) {
      // Si falla (ej. la tabla 'cuentas' no existe), sugiere de nuevo 'db push'.
      console.log('⚠️  No se pudo consultar la tabla cuentas - ejecuta: npm run db:push');
      // No retorna 'false' aquí tampoco.
    }

    // --- Test 4: Verificar Variables de Entorno Esenciales ---
    console.log('4. Verificando variables de entorno (.env)...');
    // Define una lista de variables de entorno que son CRÍTICAS para la app.
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    // Filtra la lista para encontrar las variables que NO están definidas en 'process.env'.
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    // Si faltan variables...
    if (missingVars.length > 0) {
      // Muestra cuáles faltan y termina con fallo.
      console.log(`❌ Variables de entorno faltantes en .env: ${missingVars.join(', ')}`);
      return false;
    } else {
      // Si todas las variables requeridas existen.
      console.log('✅ Variables de entorno esenciales configuradas correctamente');
    }

    // --- Éxito ---
    // Si todos los tests críticos pasaron, muestra mensajes de éxito y próximos pasos.
    console.log('\n🎉 Configuración verificada exitosamente!');
    console.log('\n📋 Próximos pasos sugeridos:');
    console.log('- npm run db:seed (poblar con datos iniciales)');
    console.log('- npm run dev (iniciar servidor)');
    console.log('- npm run db:studio (abrir GUI de base de datos)');

    return true; // Termina la verificación con éxito.

  } catch (error) {
    // Captura cualquier error inesperado durante las verificaciones.
    console.error('❌ Error durante la verificación:', error.message);
    return false; // Termina con fallo.
  } finally {
    // ASEGURA que la conexión de Prisma se cierre, incluso si hubo errores.
    await prisma.$disconnect();
  }
}

/**
 * Función para mostrar información básica del proyecto leída desde package.json y .env.
 */
function showProjectInfo() {
  console.log('\n📊 Información del Proyecto');
  console.log('═══════════════════════════');
  // Lee 'name' y 'version' directamente desde package.json.
  console.log(`🏷️  Nombre: ${require('./package.json').name}`);
  console.log(`📦 Versión: ${require('./package.json').version}`);
  console.log(`🗄️  Base de datos: PostgreSQL + Prisma`);
  // Muestra el puerto (del .env o el default).
  console.log(`🌐 Puerto: ${process.env.PORT || 3001}`);
  // Muestra el entorno de ejecución (del .env o 'development').
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);

  console.log('\n🛠️  Scripts disponibles (principales):');
  // Lee la sección 'scripts' de package.json.
  const scripts = require('./package.json').scripts;
  // Itera sobre los scripts y muestra los más relevantes (db:, dev, start).
  Object.entries(scripts).forEach(([name, command]) => {
    if (name.startsWith('db:') || ['dev', 'start'].includes(name)) {
      // Muestra el comando 'npm run ...' y su definición.
      console.log(`   npm run ${name.padEnd(12)} # ${command}`);
    }
  });
}

// --- Ejecución del Script ---
// Esta condición verifica si el archivo fue ejecutado DIRECTAMENTE desde node
// (ej. 'node verify-setup.js') en lugar de ser importado ('require') por otro archivo.
if (require.main === module) {
  // 1. Muestra la información del proyecto.
  showProjectInfo();
  // 2. Ejecuta la función de verificación.
  verifySetup().then(success => {
    // 3. Termina el proceso:
    //    - con código 0 si 'verifySetup' devolvió 'true' (éxito).
    //    - con código 1 si 'verifySetup' devolvió 'false' (error).
    process.exit(success ? 0 : 1);
  });
}

// Exporta las funciones para que puedan ser usadas por otros scripts si es necesario
// (ej. tu script 'startServer' en 'server.js' podría llamar a 'verifySetup' antes de iniciar).
module.exports = { verifySetup, showProjectInfo };