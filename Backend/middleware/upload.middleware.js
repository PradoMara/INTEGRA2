// src/middlewares/upload.middleware.js

const multer = require('multer')
const path = require('path')
// const fs = require('fs') // Ya no es necesario para la carpeta local

// Usamos memoryStorage para manejar archivos como buffers en memoria
const storage = multer.memoryStorage(); 

const fileFilter = (_req, file, cb) => {
  if (/^image\/(png|jpeg|jpg|webp|gif)$/.test(file.mimetype)) cb(null, true)
  else cb(new Error('Archivo no permitido'), false)
}

// Configuración de Multer: Ahora solo maneja el buffer en memoria (req.files)
const upload = multer({ 
    storage: storage, // <- CAMBIO CLAVE
    fileFilter: fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB c/u
}) 

module.exports = { upload } 

// NOTA: ELIMINAR el código de creación de carpeta local:
// const uploadDir = path.join(process.cwd(), 'uploads')
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)