# Endpoints — Módulo Feed (Marketplace UCT)

Este documento identifica y describe los endpoints REST necesarios para el módulo de Feed, encargado de mostrar publicaciones recientes, gestionar la búsqueda y aplicar filtros por categoría y precio.

---

## 1. Listar Publicaciones Recientes

- **Endpoint:** `GET /api/feed`
- **Descripción:** Devuelve el listado de publicaciones ordenadas por fecha de creación (las más recientes primero).
- **Query params opcionales:**
  - `?page=number` — Paginación (ej: 1, 2, 3)
  - `?limit=number` — Cantidad de publicaciones por página (ej: 20)
- **Respuesta:**  
  - 200 OK + array de publicaciones (JSON)

---

## 2. Búsqueda de Publicaciones

- **Endpoint:** `GET /api/feed/search`
- **Descripción:** Permite buscar publicaciones por palabras clave en título y/o descripción.
- **Query params obligatorios:**
  - `?q=string` — Palabra/s clave a buscar
- **Query params opcionales:**
  - `?page=number`
  - `?limit=number`
- **Respuesta:**  
  - 200 OK + array de publicaciones (JSON)

---

## 3. Filtrar Publicaciones por Categoría

- **Endpoint:** `GET /api/feed`
- **Descripción:** Devuelve publicaciones filtradas por categoría específica.
- **Query params obligatorios:**
  - `?categoria=string` — Nombre de la categoría (ej: "Electrónica", "Libros")
- **Query params opcionales:**
  - `?subcategoria=string`
  - `?page=number`
  - `?limit=number`
- **Respuesta:**  
  - 200 OK + array de publicaciones (JSON)

---

## 4. Filtrar Publicaciones por Precio

- **Endpoint:** `GET /api/feed`
- **Descripción:** Devuelve publicaciones filtradas por rango de precio.
- **Query params opcionales:**
  - `?precio_min=number` — Precio mínimo
  - `?precio_max=number` — Precio máximo
  - También combinable con otros filtros (`categoria`, `search`, etc.)
  - `?page=number`
  - `?limit=number`
- **Respuesta:**  
  - 200 OK + array de publicaciones (JSON)

---

## 5. Filtrar por Estado y Campus

- **Endpoint:** `GET /api/feed`
- **Descripción:** Permite filtrar publicaciones por estado (disponible, agotado) y campus.
- **Query params opcionales:**
  - `?estado=string` — ej: "disponible", "agotado"
  - `?campus=string`
  - `?page=number`
  - `?limit=number`
- **Respuesta:**  
  - 200 OK + array de publicaciones (JSON)

---

## 6. Ejemplo de Endpoint Combinado

- **Endpoint:** `GET /api/feed`
- **Descripción:** Se pueden combinar varios filtros en una sola consulta.
- **Ejemplo de uso:**
  - `/api/feed?categoria=Libros&precio_min=5000&precio_max=20000&estado=disponible&campus=Campus Norte&q=álgebra&page=1&limit=12`
- **Respuesta:**  
  - 200 OK + array de publicaciones filtradas (JSON)

---

## Notas Técnicas

- Todos los endpoints devuelven la respuesta paginada para eficiencia y rendimiento.
- Los parámetros pueden combinarse libremente para búsquedas avanzadas.
- El endpoint base para el feed es `/api/feed`.  
  - Búsqueda avanzada puede ser `/api/feed/search` o simplemente usando `q` como query param en `/api/feed`.
- Los endpoints requieren autenticación si muestran información extendida.  
  - El feed público puede ser visible sin login, según las reglas del proyecto.

---
