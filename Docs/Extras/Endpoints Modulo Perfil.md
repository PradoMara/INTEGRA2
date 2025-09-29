# Endpoints del Modulo de Perfil

Descripcion de todos los endpoints identificados para el modulo de perfil del proyecto:

---

### 1. **Endpoint: `GET /profile`**
- **Descripcion:** Obtiene la informacion del perfil del usuario autenticado.
- **Parametros que recibe:**
  - Token de autenticacion (en los encabezados, para identificar al usuario).
- **Datos que devuelve:** Devuelve informacion basica del usuario como su nombre, correo electronico institucional, foto de perfil, rol asignado (usuario estandar o administrador), campus principal, y lugares preferidos de entrega.

---

### 2. **Endpoint: `PUT /profile`**
- **Descripcion:** Permite al usuario actualizar su informacion de perfil.
- **Parametros que recibe:**
  - Foto de perfil (opcional, como archivo multimedia).
  - Campus principal (obligatorio).
  - Lugares preferidos de entrega (obligatorio).
- **Datos que devuelve:** Confirmacion de que la informacion del perfil se ha actualizado correctamente.

---

### 3. **Endpoint: `GET /profile/public/{userId}`**
- **Descripcion:** Obtiene la informacion publica de un usuario especifico.
- **Parametros que recibe:**
  - `userId` (obligatorio): Identificador unico del usuario cuyo perfil publico se desea consultar.
- **Datos que devuelve:** Informacion publica del usuario como su nombre, foto de perfil, calificacion promedio basada en transacciones completadas, y campus principal.

---

### 4. **Endpoint: `GET /profile/transactions`**
- **Descripcion:** Obtiene un resumen de las transacciones completadas en las que el usuario ha participado.
- **Parametros que recibe:**
  - Token de autenticacion (en los encabezados, para identificar al usuario).
- **Datos que devuelve:** Listado de transacciones realizadas, incluyendo detalles como el titulo del producto/servicio, fecha de la transaccion, calificacion obtenida/dada, y estado de la transaccion.

---

### 5. **Endpoint: `GET /profile/posts`**
- **Descripcion:** Obtiene un resumen de las publicaciones activas e inactivas del usuario.
- **Parametros que recibe:**
  - Token de autenticacion (en los encabezados, para identificar al usuario).
- **Datos que devuelve:** Listado de publicaciones del usuario, incluyendo detalles como titulo, categoria, estado (activo/inactivo), y numero de interacciones o mensajes recibidos.

---

### 6. **Endpoint: `GET /profile/ratings`**
- **Descripcion:** Obtiene el historial de calificaciones del usuario, tanto como comprador como vendedor.
- **Parametros que recibe:**
  - Token de autenticacion (en los encabezados, para identificar al usuario).
- **Datos que devuelve:** Listado de calificaciones dadas y recibidas, incluyendo detalles como la calificacion (por ejemplo, 4/5 estrellas), comentarios asociados, y fecha de la transaccion.

---

### 7. **Endpoint: `POST /profile/report`**
- **Descripcion:** Permite al usuario reportar a otro usuario por comportamiento inapropiado o actividad sospechosa.
- **Parametros que recibe:**
  - `reportedUserId` (obligatorio): Identificador unico del usuario reportado.
  - Descripcion del motivo del reporte (obligatorio).
- **Datos que devuelve:** Confirmacion de que el reporte ha sido enviado para su revision por parte de los administradores.

---

### 8. **Endpoint: `GET /profile/notifications`**
- **Descripcion:** Obtiene las notificaciones internas del usuario.
- **Parametros que recibe:**
  - Token de autenticacion (en los encabezados, para identificar al usuario).
- **Datos que devuelve:** Listado de notificaciones, incluyendo detalles como el tipo de evento, mensaje asociado, y estado de lectura (leido/no leido).

---

### 9. **Endpoint: `PUT /profile/settings`**
- **Descripcion:** Permite al usuario actualizar sus preferencias de configuracion.
- **Parametros que recibe:**
  - Preferencias de notificaciones (habilitar/deshabilitar) (opcional).
  - Preferencias de privacidad para mostrar u ocultar informacion como calificaciones o campus (opcional).
- **Datos que devuelve:** Confirmacion de que las configuraciones se han actualizado correctamente.

---

### 10. **Endpoint: `GET /profile/dashboard`**
- **Descripcion:** Proporciona un resumen general de la actividad del usuario, incluyendo estadisticas clave sobre sus publicaciones, transacciones y calificaciones.
- **Parametros que recibe:**
  - Token de autenticacion (en los encabezados, para identificar al usuario).
- **Datos que devuelve:** Informacion como numero total de publicaciones, numero de transacciones completadas, calificacion promedio, y metricas de interaccion con publicaciones.

---

### 11. **Endpoint: `POST /profile/avatar`**
- **Descripcion:** Permite al usuario actualizar su foto de perfil.
- **Parametros que recibe:**
  - Imagen en formato soportado (JPEG, PNG, etc.) (obligatorio).
- **Datos que devuelve:** Confirmacion de que la foto de perfil ha sido actualizada correctamente.

---

### 12. **Endpoint: `GET /profile/activity`**
- **Descripcion:** Obtiene el historial de actividad reciente del usuario en la plataforma.
- **Parametros que recibe:** 
  - Token de autenticacion (en los encabezados, para identificar al usuario).
- **Datos que devuelve:** Listado de actividades recientes, incluyendo publicaciones creadas, transacciones realizadas, mensajes enviados, y cambios en el perfil.

---

### 13. **Endpoint: `DELETE /profile`**
- **Descripcion:** Permite al usuario eliminar su cuenta de forma permanente.
- **Parametros que recibe:**
  - Confirmacion del usuario (obligatorio).
  - Contrasena actual (obligatorio).
- **Datos que devuelve:** Confirmacion de que la cuenta ha sido eliminada.

---
