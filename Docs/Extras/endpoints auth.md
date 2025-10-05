### Endpoints de Autenticación y Validación

---

#### 1. Nombre del endpoint: `/login` (POST)
- **Descripcion:** Permite a un usuario iniciar sesión en la plataforma utilizando su correo institucional y contraseña, o mediante Google OAuth.
- **Parametros que recibe:**
  - Correo electrónico institucional (obligatorio)
  - Contraseña (obligatorio)
  - Token de Google OAuth (obligatorio)
- **Datos que devuelve:**
  - Identificador único de usuario.
  - Correo electrónico.
  - Nombre del usuario.
  - Token de sesión.
  - Rol asignado (usuario o administrador).

---

#### 2. Nombre del endpoint: `/logout` (POST)
- **Descripcion:** Cierra la sesión activa del usuario, invalidando el token de autenticación.
- **Parametros que recibe:**
  - Token de autenticación (en los encabezados)
- **Datos que devuelve:**
  - Confirmación de cierre de sesión.

---

#### 3. Nombre del endpoint: `/validate-email-domain` (POST/GET)
- **Descripcion:** Verifica si un correo electrónico pertenece a uno de los dominios permitidos para acceder.
- **Parametros que recibe:**
  - Correo electrónico a validar (obligatorio)
- **Datos que devuelve:**
  - Indicación de validez del correo para acceso.
  - Mensaje con los dominios aceptados (si es inválido).

---

#### 4. Nombre del endpoint: `/profile` (GET)
- **Descripcion:** Recupera la información del perfil del usuario autenticado.
- **Parametros que recibe:**
  - Token de autenticación (en los encabezados)
- **Datos que devuelve:**
  - Nombre real.
  - Correo institucional.
  - Foto de perfil.
  - Rol.
  - Campus principal.
  - Lugares preferidos de entrega.

---

#### 5. Nombre del endpoint: `/profile` (PUT)
- **Descripcion:** Permite actualizar información del perfil del usuario.
- **Parametros que recibe:**
  - Foto de perfil (opcional)
  - Campus principal (obligatorio)
  - Lugares preferidos de entrega (obligatorio)
- **Datos que devuelve:**
  - Confirmación de actualización exitosa.

---

#### 6. Nombre del endpoint: `/profile` (DELETE)
- **Descripcion:** Permite eliminar la cuenta de usuario permanentemente.
- **Parametros que recibe:**
  - Confirmación del usuario (obligatorio)
- **Datos que devuelve:**
  - Confirmación de eliminación de la cuenta.

---

#### 7. Nombre del endpoint: `/allowed-domains` (GET)
- **Descripcion:** Devuelve la lista de dominios institucionales permitidos.
- **Parametros que recibe:**
  - Ninguno.
- **Datos que devuelve:**
  - Listado de dominios válidos.

---

#### 8. Nombre del endpoint: `/auth/google` (POST)
- **Descripcion:** Autenticación institucional usando Google OAuth 2.0, validando dominio.
- **Parametros que recibe:**
  - Token de Google OAuth (obligatorio)
- **Datos que devuelve:**
  - Identificador único de usuario.
  - Correo electrónico validado.
  - Nombre.
  - Token de sesión.
  - Rol asignado.

---

#### 9. Nombre del endpoint: `/session/check` (GET)
- **Descripcion:** Verifica si el token de sesión es válido.
- **Parametros que recibe:**
  - Token de autenticación (en los encabezados)
- **Datos que devuelve:**
  - Mensaje sobre el estado de la sesión.

---
