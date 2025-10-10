# Diagrama de Secuencia — Chat y Notificación

Este diagrama representa la secuencia de mensajes para la interacción de chat entre usuarios y la notificación de nuevos mensajes en el Marketplace UCT.

---

## Secuencia: Chat y Notificación

```mermaid
sequenceDiagram
    participant UsuarioA
    participant FrontendA
    participant API
    participant WS
    participant DB
    participant UsuarioB
    participant FrontendB

    UsuarioA->>FrontendA: (1) Redacta y envía mensaje
    FrontendA->>API: (2) POST /api/chats/:id/mensajes
    API->>DB: (3) Guarda mensaje
    API->>WS: (4) Notifica nuevo mensaje
    WS->>FrontendB: (5) Notificación UsuarioB

    UsuarioB->>FrontendB: (6) Abre chat y solicita historial
    FrontendB->>API: (7) GET /api/chats/:id/mensajes
    API->>DB: (8) Consulta historial
    DB-->>API: (9) Responde historial
    API->>FrontendB: (10) Respuesta mensajes
```

