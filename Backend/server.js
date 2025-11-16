// Carga las variables de entorno (del .env) al inicio de todo.
require('dotenv').config();

// --- Importaciones de Módulos ---
const express = require('express'); // El framework principal para el servidor web.
const cors = require('cors'); // Para permitir peticiones desde otros dominios (el frontend).
const helmet = require('helmet'); // Añade un conjunto de cabeceras de seguridad HTTP.
const rateLimit = require('express-rate-limit'); // Limita la cantidad de peticiones para prevenir ataques.
const { createServer } = require('http'); // Módulo 'http' nativo de Node (necesario para Socket.io).
const { Server } = require('socket.io'); // El servidor de WebSockets para el chat en tiempo real.
const jwt = require('jsonwebtoken'); // Para verificar los tokens de los usuarios (usado en el chat).
const { testConnection, closeConnection } = require('./config/database'); // Funciones para probar y cerrar la conexión a la BD.

// --- Importación de todas las rutas de la API ---
// Cada uno de estos archivos define los endpoints para un módulo (ej. /auth/login, /auth/register)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const publicationsRoutes = require('./routes/publications');
const chatRoutes = require('./routes/chat'); // Rutas para OBTENER el historial de chat (vía HTTP)
const uploadRoutes = require('./routes/upload');
const favoritesRoutes = require('./routes/favorites');
const reportsRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

// --- Inicialización del Servidor ---
const app = express(); // Inicializa la aplicación de Express.
const server = createServer(app); // Crea un servidor HTTP que manejará las peticiones de Express.

// Inicializa Socket.io y lo "ata" al servidor HTTP.
// Express (app) maneja las peticiones HTTP (API REST).
// Socket.io (io) maneja las conexiones WebSocket (Chat).
const io = new Server(server, {
  // Configuración de CORS específica para Socket.io.
  cors: {
    origin: function (origin, callback) {
      // Permite conexiones sin origen (ej. apps móviles, Postman).
      if (!origin) return callback(null, true);

      // En desarrollo, permite cualquier localhost (http://localhost:3000, http://localhost:8080, etc.)
      if (process.env.NODE_ENV === 'development') {
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
      }

      // En producción, usa la lista de orígenes permitidos del archivo .env
      const allowedOrigins = process.env.CORS_ORIGIN.split(',');
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        // Permite subdominios si se usa '*' (ej. *.tuapp.com)
        if (allowedOrigin.includes('*')) {
          const baseUrl = allowedOrigin.replace('*', '');
          return origin.startsWith(baseUrl);
        }
        return origin === allowedOrigin;
      });

      callback(null, isAllowed); // Devuelve el resultado del chequeo
    },
    credentials: true // Permite que se envíen cookies o cabeceras de autorización.
  }
});

// Define el puerto a usar (tomado del .env o 3001 por defecto).
const PORT = process.env.PORT || 3001;

// --- Configuración de Middlewares Globales (para Express) ---

// 1. Seguridad de Cabeceras
app.use(helmet()); // Aplica el middleware de seguridad Helmet a todas las rutas.

// 2. Límite de Peticiones (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo: 15 minutos
  max: 100, // Límite: 100 peticiones por IP en esa ventana de tiempo
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter); // Aplica el limitador a todas las peticiones.

// 3. Configuración de CORS para Express (API REST)
// Esta lógica es similar a la de Socket.io para mantener consistencia.
const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS: Petición desde origen:', origin);

    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✅ CORS: Permitiendo request sin origen');
      return callback(null, true);
    }

    // En desarrollo, permitir localhost en cualquier puerto
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        console.log('✅ CORS: Permitiendo localhost en desarrollo');
        return callback(null, true);
      }
    }

    // Verificar la lista específica del .env
    const allowedOrigins = process.env.CORS_ORIGIN.split(',');
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const baseUrl = allowedOrigin.replace('*', '');
        return origin.startsWith(baseUrl);
      }
      return origin === allowedOrigin;
    });

    if (isAllowed) {
      console.log('✅ CORS: Origen permitido por configuración');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origen NO permitido:', origin);
      callback(new Error(`No permitido por CORS: ${origin}`));
      İ
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// 4. Middlewares para "entender" (parsear) las peticiones
// Permite leer 'req.body' en formato JSON.
app.use(express.json({ limit: '10mb' })); // Límite de 10mb para el payload JSON
// Permite leer 'req.body' de formularios web (ej. `x-www-form-urlencoded`).
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Ruta de Verificación de Salud (Health Check) ---
// Es una ruta pública para saber si la API está "viva" y conectada a la BD.
app.get('/api/health', async (req, res) => {
  try {
    // Intenta conectarse a la base de datos
    const dbOk = await testConnection();
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      database: dbOk ? 'connected' : 'disconnected', // Informa el estado de la BD
      service: 'Marketplace API',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Error en health check:', error);
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// --- Definición de Rutas de la API ---
// Aquí le decimos a Express que use los archivos de rutas importados.
// Cualquier petición a /api/auth será manejada por 'authRoutes'.
// Cualquier petición a /api/users será manejada por 'userRoutes'.
// etc.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/chat', chatRoutes); // Rutas para historial (GET)
app.use('/api', uploadRoutes); // Rutas para subir archivos
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);

// ==================================================
//           LÓGICA DEL CHAT (Socket.io)
// ==================================================

// Mapa para rastrear usuarios conectados: (clave: userId, valor: socket.id)
// Esto nos permite saber a qué "socket" específico enviar un mensaje
// si sabemos el ID de usuario del destinatario.
const connectedUsers = new Map();

// --- Middleware de Autenticación para WebSockets ---
// Esto se ejecuta ANTES de que un usuario sea aceptado como "conectado".
io.use((socket, next) => {
  // El cliente debe enviar su token JWT en el 'handshake' (la conexión inicial).
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Token de autenticación requerido'));
  }

  try {
    // Verifica si el token es válido y no ha expirado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añade los datos del usuario (del token) al objeto 'socket'
    // para que estén disponibles en todos los eventos de este socket.
    socket.userId = decoded.userId;
    socket.userName = decoded.nombre;
    next(); // ¡Autenticación exitosa! Permite la conexión.
  } catch (error) {
    next(new Error('Token inválido')); // Rechaza la conexión.
  }
});

// --- Manejador Principal de Conexión de Socket ---
// Esto se ejecuta DESPUÉS de que el middleware de autenticación (io.use) es exitoso.
io.on('connection', (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.userName} (ID: ${socket.userId})`);
  console.log(`🔌 Socket ID: ${socket.id}`);

  // Registra al usuario en el mapa de conexiones activas.
  connectedUsers.set(socket.userId, socket.id);

  console.log(`👥 Usuarios conectados ahora:`, Array.from(connectedUsers.keys()));
  console.log(`📋 Map de conexiones:`, Object.fromEntries(connectedUsers));

  // Une al usuario a una "sala" privada con su propio ID.
  // Esto es útil si quisiéramos enviarle notificaciones solo a él.
  socket.join(`user_${socket.userId}`);

  // Avisa a TODOS LOS DEMÁS usuarios conectados que este usuario está 'online'.
  socket.broadcast.emit('user_online', {
    userId: socket.userId,
    userName: socket.userName
  });

  // --- Evento: Recibir un mensaje de un cliente ---
  // El cliente emite un evento 'send_message' y nosotros lo "escuchamos" aquí.
  socket.on('send_message', async (data) => {
    try {
      console.log('📨 Evento send_message recibido:', data);
      console.log('👤 Usuario remitente:', socket.userId, socket.userName);

      const { destinatarioId, contenido, tipo = 'texto' } = data;

      if (!destinatarioId || !contenido) {
        console.log('❌ Datos incompletos:', { destinatarioId, contenido });
        // Avisa al remitente que hubo un error
        socket.emit('message_error', { error: 'Datos incompletos' });
        return;
      }

      // --- Lógica de Envío ---
      // 1. Guardar el mensaje en la Base de Datos (usando Prisma)
      const { prisma } = require('./config/database'); // Importamos prisma
      const mensaje = await prisma.Mensajes.create({
        data: {
          remitenteId: socket.userId, // El ID del remitente (el dueño de este socket)
          destinatarioId: parseInt(destinatarioId), // El ID del destinatario (del payload)
          contenido,
          tipo: tipo || 'texto'
        },
        include: { // Incluimos los datos del remitente y destinatario para el cliente
          remitente: { select: { id: true, nombre: true, usuario: true } },
          destinatario: { select: { id: true, nombre: true, usuario: true } }
        }
      });

      console.log('💾 Mensaje guardado en BD:', mensaje.id);

      // BUG FIX: Incluir clientTempId en el mensaje para sincronización
      const { clientTempId } = data;
      const mensajeConTempId = {
        ...mensaje,
        clientTempId: clientTempId || null,
        chatId: null // Se puede calcular o enviar desde el frontend si es necesario
      };

      // 2. Busca si el destinatario está conectado AHORA MISMO.
      const destinatarioIdInt = parseInt(destinatarioId);
      const destinatarioSocketId = connectedUsers.get(destinatarioIdInt);

      console.log(`📤 Enviando mensaje:`);
      console.log(`   - DestinatarioId: ${destinatarioId} (${destinatarioIdInt})`);
      console.log(`   - DestinatarioSocketId: ${destinatarioSocketId}`);

      // 3. Si está conectado, le envía el mensaje en tiempo real.
      if (destinatarioSocketId) {
        console.log(`✅ Enviando mensaje a destinatario conectado: ${destinatarioSocketId}`);
        // BUG FIX: Enviar mensaje SIN clientTempId al destinatario (no es su mensaje temporal)
        io.to(destinatarioSocketId).emit('new_message', mensaje);
        console.log(`📤 Evento new_message emitido al socket: ${destinatarioSocketId}`);
      } else {
        // 4. Si no está conectado, no se hace nada (el usuario recibirá el mensaje
        //    cuando abra la app y pida su historial por la API REST).
        console.log(`⚠️ Destinatario ${destinatarioId} no está conectado`);
      }

      // 5. BUG FIX: Confirma al remitente con clientTempId para actualizar mensaje temporal
      socket.emit('message_sent', mensajeConTempId);
      console.log(`✅ Confirmación enviada al remitente: ${socket.userId} con clientTempId: ${clientTempId}`);

    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      socket.emit('message_error', { error: 'Error enviando mensaje' });
    }
  });

  // --- Evento: Usuario está escribiendo (Typing Indicator) ---
  socket.on('typing_start', (data) => {
    const { destinatarioId } = data;
    const destinatarioSocketId = connectedUsers.get(parseInt(destinatarioId));
    if (destinatarioSocketId) {
      // Avisa al destinatario que el remitente está escribiendo
      io.to(destinatarioSocketId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: true
      });
    }
  });

  // --- Evento: Usuario dejó de escribir ---
  socket.on('typing_stop', (data) => {
    const { destinatarioId } = data;
    const destinatarioSocketId = connectedUsers.get(parseInt(destinatarioId));
    if (destinatarioSocketId) {
      io.to(destinatarioSocketId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: false
      });
    }
  });

  // --- Evento: Usuario se desconecta ---
  socket.on('disconnect', () => {
    console.log(`🔌 Usuario desconectado: ${socket.userName} (ID: ${socket.userId})`);
    // Elimina al usuario del mapa de conectados
    connectedUsers.delete(socket.userId);

    // Avisa a todos los demás que se desconectó
    socket.broadcast.emit('user_offline', {
      userId: socket.userId,
      userName: socket.userName
    });
  });
});

// --- Manejadores de Errores y Rutas No Encontradas (404) ---

// 1. Middleware global para manejar errores (debe ir DESPUÉS de las rutas).
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 2. Manejador para rutas 404 (Not Found).
// Se ejecuta si ninguna de las rutas anteriores (API, health) coincide.
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Ruta no encontrada"
    },
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// --- Función de Arranque del Servidor ---
async function startServer() {
  try {
    // 1. Prueba la conexión a la BD antes de iniciar.
    console.log('🗄️  Intentando conectar a PostgreSQL...');
    const dbConnected = await testConnection();

    // 2. Si falla, muestra un error claro y termina el proceso.
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      console.log('\n💡 Asegúrate de que PostgreSQL esté corriendo y las credenciales sean correctas');
      console.log('   Revisa el archivo .env y configura DATABASE_URL para PostgreSQL');
      console.log('   Ejemplo: DATABASE_URL="postgresql://username:password@localhost:5432/marketplace"');
      process.exit(1); // Termina la aplicación con un código de error.
    }

    // 3. Si la BD está OK, inicia el servidor (HTTP y Sockets).
    // Usamos 'server.listen' (el servidor HTTP) en lugar de 'app.listen'
    // porque 'server' es el que está conectado a Socket.io.
    server.listen(PORT, async () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🗄️  PostgreSQL con Prisma configurado`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 Entorno: ${process.env.NODE_ENV}`);
      console.log(`🎨 Prisma Studio: npm run db:studio`);

      // (Opcional) Ejecutar tests automáticamente en desarrollo
      if (process.env.NODE_ENV === 'development') {
        setTimeout(async () => {
          try {
            // (Este script 'test-api' no estaba en tu árbol de archivos, pero la lógica está aquí)
            // const { testAPI } = require('./scripts/test-api');
            // await testAPI();
          } catch (error) {
            console.log('⚠️  (Test API no disponible aún)');
          }
        }, 1000);
      }
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// --- Manejo de Cierre Limpio (Graceful Shutdown) ---
// Escucha la señal de "interrupción" (Ctrl+C en la terminal).
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando servidor (SIGINT)...');
  await closeConnection(); // Cierra la conexión a la BD
  process.exit(0); // Termina el proceso
});

// Escucha la señal de "terminación" (enviada por Docker, Heroku, etc.).
process.on('SIGTERM', async () => {
  console.log('\n🔄 Cerrando servidor (SIGTERM)...');
  await closeConnection(); // Cierra la conexión a la BD
  process.exit(0); // Termina el proceso
});

// ¡Inicia la aplicación ejecutando la función de arranque!
startServer();