# Diagrama de Secuencia — Publicar y Moderar

Este diagrama representa la secuencia de mensajes entre Frontend, API REST, WebSocket (WS) y Base de Datos (DB) para los procesos de publicación de un anuncio y su moderación en el Marketplace UCT.

---

## Secuencia: Publicar y Moderar Publicación

```mermaid
sequenceDiagram
    participant Usuario
    participant Frontend
    participant API
    participant WS
    participant DB
    participant Moderador

    Usuario->>Frontend: (1) Completa formulario y envía datos
    Frontend->>API: (2) POST /api/publicaciones
    API->>DB: (3) Guarda publicación
    DB-->>API: (4) ID publicación
    API->>Frontend: (5) Respuesta éxito
    API->>WS: (6) Notifica nueva publicación
    WS->>Moderador: (7) Notificación panel moderador

    Moderador->>Frontend: (8) Revisa publicación
    Frontend->>API: (9) PUT /api/publicaciones/:id/moderar
    API->>DB: (10) Actualiza estado publicación
    API->>WS: (11) Notifica resultado moderación
    WS->>Usuario: (12) Notificación aprobación/rechazo
```

---
