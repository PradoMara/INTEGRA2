const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { prisma } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/chat');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'chat-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: function (req, file, cb) {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Configuración para imágenes de productos
const storageProductos = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/productos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadProductos = multer({
  storage: storageProductos,
  limits: upload.limits,
  fileFilter: upload.fileFilter
});

// Configuración para fotos de perfil
const storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadProfile = multer({
  storage: storageProfile,
  limits: {
    fileSize: 3 * 1024 * 1024 // 2MB límite para fotos de perfil
  },
  fileFilter: function (req, file, cb) {
    console.log('🔍 Archivo recibido para perfil:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname,
      size: file.size
    });

    // Tipos MIME permitidos para imágenes
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];

    // Verificar por tipo MIME
    if (file.mimetype && allowedMimes.includes(file.mimetype.toLowerCase())) {
      console.log('✅ Tipo MIME aceptado:', file.mimetype);
      cb(null, true);
    } 
    // Verificar por extensión como fallback
    else if (file.originalname) {
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      
      if (allowedExts.includes(ext)) {
        console.log('✅ Extensión aceptada:', ext);
        cb(null, true);
      } else {
        console.log('❌ Archivo rechazado - extensión no válida:', ext);
        cb(new Error(`Tipo de archivo no permitido. Solo se permiten: ${allowedExts.join(', ')}`), false);
      }
    } else {
      console.log('❌ Archivo rechazado - tipo MIME no válido:', file.mimetype);
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten imágenes.`), false);
    }
  }
});

// 📸 Subir imagen de chat
router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: 'No se proporcionó imagen' });
    }

    // Crear URL pública para la imagen
    const imageUrl = `/uploads/chat/${req.file.filename}`;
    
    console.log('📸 Imagen subida:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: imageUrl
    });

    res.json({ 
      ok: true, 
      imageUrl: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

// 📦 Subida de imagen para productos (sin autenticación, para compatibilidad Flutter)
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      return res.status(400).json({ ok: false, error: err.message });
    } else if (err) {
      // Otro error (por ejemplo, filtro de tipo)
      return res.status(400).json({ ok: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No se envió ninguna imagen.' });
    }
    // Construye la URL pública absoluta
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/chat/${req.file.filename}`;
    res.json({ ok: true, imageUrl });
  });
});

// 📦 Subida de imagen para productos (guarda en BD)
router.post('/producto', authenticateToken, async (req, res, next) => {
  uploadProductos.single('image')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ ok: false, error: err.message });
    } else if (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No se envió ninguna imagen.' });
    }

    try {
      // Leer los bytes de la imagen
      const fs = require('fs');
      const imageBuffer = fs.readFileSync(req.file.path);
      const mimeType = req.file.mimetype || 'image/jpeg';

      // Eliminar el archivo temporal (ya no lo necesitamos)
      fs.unlinkSync(req.file.path);

      // Guardar en la BD usando Prisma
      const { prisma } = require('../config/database');
      
      // Primero necesitamos un productoId, pero aquí no lo tenemos
      // Así que retornamos los datos para que el cliente los guarde al crear el producto
      // Convertir buffer a base64 para enviarlo al cliente
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      res.json({ 
        ok: true, 
        imageData: base64Image, // Base64 para enviar en JSON
        mimeType: mimeType,
        size: imageBuffer.length,
        // También mantenemos URL para compatibilidad (será una URL especial)
        imageUrl: `/api/images/db/${Date.now()}-${Math.random().toString(36).substring(7)}`
      });
    } catch (error) {
      console.error('Error procesando imagen:', error);
      // Limpiar archivo si existe
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ ok: false, error: 'Error procesando imagen: ' + error.message });
    }
  });
});

// 👤 Subir foto de perfil
router.post('/profile-photo', authenticateToken, (req, res) => {
  uploadProfile.single('photo')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Error de Multer:', err);
      return res.status(400).json({ 
        ok: false, 
        message: 'Error de archivo',
        error: err.message 
      });
    } else if (err) {
      console.error('Error de filtro:', err);
      return res.status(400).json({ 
        ok: false, 
        message: err.message || 'Error de validación de archivo'
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ ok: false, message: 'No se proporcionó imagen' });
      }

      console.log('📁 Archivo procesado exitosamente:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });

      // Crear URL pública para la imagen
      const photoUrl = `/uploads/profile/${req.file.filename}`;
      
      // Actualizar la foto de perfil en la base de datos
      const { prisma } = require('../config/database');
      
      await prisma.cuentas.update({
        where: { id: req.user.userId },
        data: { 
          fotoPerfilUrl: photoUrl 
        }
      });

      console.log('👤 Foto de perfil actualizada en BD:', {
        userId: req.user.userId,
        filename: req.file.filename,
        url: photoUrl
      });

      res.json({ 
        ok: true, 
        message: 'Foto de perfil actualizada correctamente',
        photoUrl: photoUrl,
        filename: req.file.filename 
      });
    } catch (error) {
      console.error('❌ Error procesando foto de perfil:', error);
      // Limpiar archivo si existe
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ 
        ok: false, 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  });
});

// 📁 Servir archivos estáticos de uploads
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;