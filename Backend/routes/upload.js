const express = require('express');
const multer = require('multer'); // La librería clave para manejar 'multipart/form-data' (subida de archivos)
const path = require('path'); // Utilidad de Node para trabajar con rutas de archivos (ej. /uploads/chat)
const fs = require('fs'); // File System: para crear carpetas (mkdirSync)
const { prisma } = require('../config/database'); // Importado, pero no se usa en este archivo (podría ser un remanente)
const { authenticateToken } = require('../middleware/auth'); // Middleware para proteger la ruta

const router = express.Router();

// --- Configuración de Almacenamiento (Multer) ---
// Define DÓNDE y CÓMO se guardarán los archivos en el disco.
const storage = multer.diskStorage({
  // 'destination': Dónde guardar el archivo
  destination: function (req, file, cb) {
    // Define la ruta del directorio de subida (ej. C:/.../backend/uploads/chat)
    const uploadDir = path.join(__dirname, '../uploads/chat');

    // Verifica si la carpeta /uploads/chat existe
    if (!fs.existsSync(uploadDir)) {
      // Si no existe, la crea recursivamente
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // 'cb' (callback) le dice a multer que el destino es 'uploadDir'
    cb(null, uploadDir);
  },
  // 'filename': Qué nombre tendrá el archivo
  filename: function (req, file, cb) {
    // Crea un nombre de archivo único para evitar colisiones (ej. 1678886400000-123456789)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Combina el prefijo, el sufijo único y la extensión original del archivo
    // Resultado: 'chat-1678886400000-123456789.jpg'
    cb(null, 'chat-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// --- Inicialización de Multer ---
// Crea la instancia de 'upload' con la configuración definida
const upload = multer({
  storage: storage, // Usa el 'diskStorage' que definimos arriba
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite de tamaño de archivo
  },
  fileFilter: function (req, file, cb) {
    // 1. Filtro de seguridad: solo permitir archivos de imagen
    if (file.mimetype.startsWith('image/')) {
      // 'cb(null, true)' -> Aceptar el archivo
      cb(null, true);
    } else {
      // 'cb(new Error(...), false)' -> Rechazar el archivo y pasar un error
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// ------------------------------------------
// 📸 SUBIR IMAGEN DE CHAT (Protegido)
// POST /api/upload-image
// ------------------------------------------
// Esta ruta usa DOS middlewares:
// 1. 'authenticateToken': Verifica que el usuario esté logeado.
// 2. 'upload.single('image')': Busca un archivo en el campo 'image' del form-data,
//    lo procesa con Multer y, si tiene éxito, añade 'req.file' al objeto request.
router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    // Si 'upload' falló (ej. filtro de tipo de archivo) o no se envió nada,
    // 'req.file' no existirá.
    if (!req.file) {
      return res.status(400).json({ ok: false, message: 'No se proporcionó imagen o el formato no es válido' });
    }

    // 1. Construir la URL PÚBLICA que el frontend usará para VER la imagen.
    //    Esta URL funcionará gracias al 'router.use('/uploads', ...)' de más abajo.
    //    El path base es '/api' (definido en server.js), por lo que la URL completa
    //    será /api/uploads/chat/nombre_archivo.jpg
    const imageUrl = `/uploads/chat/${req.file.filename}`;

    console.log('📸 Imagen subida:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: imageUrl
    });

    // 2. Devolver la URL al frontend.
    //    El frontend tomará esta URL y la enviará como un mensaje de chat
    //    normal (vía WebSocket) pero con tipo 'imagen', que luego se
    //    guardará en la tabla 'Mensajes'.
    res.json({
      ok: true,
      imageUrl: imageUrl, // La URL relativa
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// ------------------------------------------
// 📁 SERVIDOR DE ARCHIVOS ESTÁTICOS
// GET /api/uploads/*
// ------------------------------------------
// Esto es CRUCIAL. Le dice a Express que cualquier petición que
// comience con '/api/uploads' (porque este router está montado en /api)
// debe ser tratada como una petición de un archivo estático.
//
// 'express.static' buscará el archivo en la ruta física del servidor.
//
// Ejemplo:
// Petición del frontend: GET /api/uploads/chat/chat-123.jpg
// Express buscará en:  [ruta_del_proyecto]/uploads/chat/chat-123.jpg
// Y lo devolverá al navegador.
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;