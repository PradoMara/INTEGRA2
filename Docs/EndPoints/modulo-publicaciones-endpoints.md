# Endpoints — Módulo Publicaciones (Feed) Marketplace UCT

Este documento identifica y describe los endpoints REST necesarios para el módulo de publicaciones, enfocado en el feed principal y la gestión de publicaciones personales (crear, editar, eliminar, listar).

---

## 1. Crear Publicación

- **Endpoint:** `POST /api/publicaciones`
- **Descripción:** Crea una nueva publicación en el marketplace.
- **Payload esperado:**
  ```json
  {
    "titulo": "string",
    "descripcion": "string",
    "categoria": "string",
    "subcategoria": "string",
    "precio": "number",
    "estado": "string", // ej: "disponible", "agotado"
    "imagenes": ["url1", "url2"],
    "ubicacion": "string",
    "campus": "string"
  }
  ```
- **Respuesta:**  
  - 201 Created + publicación creada (JSON)
  - 400 Bad Request si faltan campos requeridos

---

## 2. Editar Publicación

- **Endpoint:** `PUT /api/publicaciones/:id`
- **Descripción:** Edita los datos de una publicación existente (solo el autor o admin).
- **Payload esperado:**
  ```json
  {
    "titulo": "string",
    "descripcion": "string",
    "categoria": "string",
    "subcategoria": "string",
    "precio": "number",
    "estado": "string",
    "imagenes": ["url1", "url2"],
    "ubicacion": "string",
    "campus": "string"
  }
  ```
- **Respuesta:**  
  - 200 OK + publicación actualizada (JSON)
  - 403 Forbidden si el usuario no tiene permisos
  - 404 Not Found si no existe la publicación

---

## 3. Eliminar Publicación

- **Endpoint:** `DELETE /api/publicaciones/:id`
- **Descripción:** Elimina/archiva una publicación propia (solo el autor o admin). Normalmente se oculta del feed pero se conserva en el historial.
- **Respuesta:**  
  - 200 OK + confirmación de eliminación
  - 403 Forbidden si el usuario no tiene permisos
  - 404 Not Found si no existe la publicación

---

## 4. Listar Mis Publicaciones

- **Endpoint:** `GET /api/publicaciones/mis`
- **Descripción:** Devuelve el listado de publicaciones creadas por el usuario autenticado.
- **Respuesta:**  
  - 200 OK + array de publicaciones propias (JSON)
  - 401 Unauthorized si no está autenticado

---

## 5. Listar Publicaciones en Feed

- **Endpoint:** `GET /api/publicaciones`
- **Descripción:** Devuelve el feed principal con filtros opcionales por categoría, campus, estado, etc.
- **Query params opcionales:**
  - `?categoria=string`
  - `?campus=string`
  - `?estado=string`
  - `?autor=string`
  - `?search=string`
  - `?page=number&limit=number`
- **Respuesta:**  
  - 200 OK + array de publicaciones (JSON)

---

## 6. Obtener Detalle de Publicación

- **Endpoint:** `GET /api/publicaciones/:id`
- **Descripción:** Devuelve el detalle completo de una publicación.
- **Respuesta:**  
  - 200 OK + publicación (JSON)
  - 404 Not Found si no existe la publicación

---

## Notas de Seguridad y Buenas Prácticas

- Todos los endpoints requieren autenticación (`Bearer Token`).
- Solo el autor o el administrador pueden editar/eliminar publicaciones propias.
- Las imágenes deben subirse previamente (endpoint aparte o integración, no cubierto aquí).
- Los datos sensibles (precio, historial) deben validarse y sanearse en backend.

---

## Ejemplo de uso en Frontend (Tailwind + React)

```jsx
// Crear publicación
await fetch("/api/publicaciones", {
  method: "POST",
  headers: { "Authorization": "Bearer ...", "Content-Type": "application/json" },
  body: JSON.stringify({ titulo, descripcion, ... }),
});

// Listar mis publicaciones
const res = await fetch("/api/publicaciones/mis", {
  headers: { "Authorization": "Bearer ..." }
});
const misPublicaciones = await res.json();
```
