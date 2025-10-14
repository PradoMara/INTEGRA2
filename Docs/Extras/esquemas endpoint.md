# Esquema de Endpoints a Consumir del Backend

Este documento resume y propone los principales endpoints REST y WebSocket que debe exponer y consumir el backend para cubrir los flujos funcionales del marketplace universitario.

---

## 1. Autenticacion y Usuarios

- **POST** `/auth/login`  
  Login institucional (OAuth o credenciales).
- **GET** `/auth/me`  
  Obtener perfil del usuario autenticado.
- **POST** `/auth/logout`  
  Cerrar sesion.
- **GET** `/usuarios/:id`  
  Obtener perfil publico de un usuario.
- **PUT** `/usuarios/:id`  
  Editar informacion de perfil (nombre, campus, lugares de entrega, etc.).

## 2. Publicaciones (Marketplace)

- **GET** `/publicaciones`  
  Listar publicaciones (con filtros: categoria, busqueda, paginacion).
- **POST** `/publicaciones`  
  Crear nueva publicacion.
- **GET** `/publicaciones/:id`  
  Ver detalle de una publicacion.
- **PUT** `/publicaciones/:id`  
  Editar una publicacion propia.
- **DELETE** `/publicaciones/:id`  
  Eliminar/ocultar publicacion del feed (soft delete).
- **GET** `/categorias`  
  Listar categorias y subcategorias.

## 3. Transacciones y Reputacion

- **POST** `/transacciones`  
  Iniciar una transaccion (marcar como interesado o iniciar compra/permuta).
- **PUT** `/transacciones/:id/confirmar`  
  Confirmar entrega/recepcion.
- **POST** `/transacciones/:id/calificar`  
  Calificar usuario luego de la transaccion.
- **GET** `/transacciones/mis`  
  Ver mis transacciones.

## 4. Mensajeria Interna (Chats)

- **GET** `/chats`  
  Listar mis chats activos.
- **GET** `/chats/:id/mensajes`  
  Obtener mensajes de un chat.
- **POST** `/chats/:id/mensajes`  
  Enviar mensaje a un chat.

### WebSocket

- **ws://<host>/ws?userId=...**  
  Conexion en tiempo real para recibir y enviar mensajes instantaneos en los chats.

## 5. Reportes y Moderacion

- **POST** `/reportes/publicacion/:id`  
  Reportar una publicacion.
- **POST** `/reportes/usuario/:id`  
  Reportar un usuario.
- **GET** `/admin/reportes`  
  Listar reportes para moderadores.
- **PUT** `/admin/reportes/:id/resolver`  
  Resolver reporte (bloquear, advertir, descartar).

## 6. Notificaciones

- **GET** `/notificaciones`  
  Listar notificaciones para el usuario.
- **PUT** `/notificaciones/:id/leida`  
  Marcar notificacion como leida.

## 7. Comunidad y Foros

- **GET** `/foros`  
  Listar foros tematicos y general.
- **GET** `/foros/:id/posts`  
  Listar posts de un foro.
- **POST** `/foros/:id/posts`  
  Crear post en un foro.
- **POST** `/foros/:id/posts/:postId/comentarios`  
  Comentar en un post del foro.

---

Este esquema cubre los principales flujos para usuarios, publicaciones, chats, transacciones, reputacion, moderacion, notificaciones y comunidad, facilitando la integracion frontend-backend.
