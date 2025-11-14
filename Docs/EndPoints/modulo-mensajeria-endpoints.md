# Endpoints — Módulo Mensajería Marketplace UCT

Este documento identifica y describe los endpoints REST necesarios para el sistema de mensajería del Marketplace UCT, incluyendo la funcionalidad de listar chats, enviar mensajes y ver el historial de conversación entre usuarios.

---

## 1. Listar Chats

- **Endpoint:** `GET /api/chats`
- **Descripción:** Devuelve el listado de chats activos del usuario autenticado.
- **Query params opcionales:**
  - `?page=number` — Paginación
  - `?limit=number` — Cantidad de chats por página
- **Respuesta:**  
  - 200 OK + array de chats (JSON)
    ```json
    [
      {
        "chatId": "string",
        "usuario": {
          "id": "string",
          "nombre": "string",
          "avatar": "url"
        },
        "ultimoMensaje": {
          "contenido": "string",
          "fecha": "ISODate"
        },
        "noLeidos": 2
      }
    ]
    ```
  - 401 Unauthorized si no está autenticado

---

## 2. Ver Historial de Mensajes (Conversación)

- **Endpoint:** `GET /api/chats/:chatId/mensajes`
- **Descripción:** Devuelve el historial de mensajes de un chat específico entre dos usuarios.
- **Query params opcionales:**
  - `?page=number`
  - `?limit=number`
- **Respuesta:**  
  - 200 OK + array de mensajes (JSON)
    ```json
    [
      {
        "mensajeId": "string",
        "remitenteId": "string",
        "destinatarioId": "string",
        "contenido": "string",
        "fecha": "ISODate",
        "leido": true
      }
    ]
    ```
  - 404 Not Found si el chat no existe o el usuario no tiene acceso

---

## 3. Enviar Mensaje

- **Endpoint:** `POST /api/chats/:chatId/mensajes`
- **Descripción:** Envía un nuevo mensaje en un chat existente.
- **Payload esperado:**
  ```json
  {
    "contenido": "string"
  }
  ```
- **Respuesta:**  
  - 201 Created + mensaje creado (JSON)
    ```json
    {
      "mensajeId": "string",
      "remitenteId": "string",
      "destinatarioId": "string",
      "contenido": "string",
      "fecha": "ISODate",
      "leido": false
    }
    ```
  - 404 Not Found si el chat no existe o el usuario no tiene acceso

---

## 4. Iniciar Nuevo Chat (opcional)

- **Endpoint:** `POST /api/chats`
- **Descripción:** Crea un nuevo chat con otro usuario si no existe.
- **Payload esperado:**
  ```json
  {
    "usuarioId": "string"
  }
  ```
- **Respuesta:**  
  - 201 Created + chat creado (JSON)
    ```json
    {
      "chatId": "string",
      "usuario": {
        "id": "string",
        "nombre": "string",
        "avatar": "url"
      }
    }
    ```
  - 409 Conflict si el chat ya existe

---

## 5. Marcar Mensajes como Leídos (opcional)

- **Endpoint:** `PUT /api/chats/:chatId/mensajes/leidos`
- **Descripción:** Marca todos los mensajes de un chat como leídos.
- **Respuesta:**  
  - 200 OK + confirmación
  - 404 Not Found si el chat no existe

---

## Notas Técnicas y Seguridad

- Todos los endpoints requieren autenticación (`Bearer Token`).
- Solo los participantes de un chat pueden acceder al historial y enviar mensajes.
- Los mensajes pueden incluir texto, emojis y enlaces (para imágenes o archivos, endpoint aparte).
- Las respuestas incluyen paginación para eficiencia.
- El sistema debe registrar la fecha y estado de lectura para cada mensaje.

