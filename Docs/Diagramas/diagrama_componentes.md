## DIAGRAMA DE COMPONENTES PROYECTO MARKETPLACE UCT



## Arquitectura del Sistema

```mermaid
graph TB
    %% Frontend Layer
    subgraph "Frontend - React/TypeScript + Tailwind CSS"
        UI[Interface de Usuario]
        DASH[Dashboard]
        ADMIN[Panel Admin]
        MSGS[Mensajería]
        FORUMS[Foros]
        NOTIF[Notificaciones]
    end

    %% API Gateway
    API[API Gateway<br/>Express/Node.js]

    %% Backend Services
    subgraph "Backend Services"
        AUTH[Autenticación OAuth<br/>+ Gestión de Roles<br/>Admin/Usuario]
        USER[Gestión de<br/>Usuarios/Perfiles<br/>+ Reputación]
        PUB[Gestión de<br/>Publicaciones]
        PROD[Gestión de<br/>Productos/Categorías<br/>+ Imágenes]
        TRANS[Sistema de<br/>Transacciones<br/>+ Confirmaciones]
        RATING[Sistema de<br/>Calificaciones<br/>+ Reputación]
        MSG[Servicio de<br/>Mensajería]
        ACTIVITY[Tracking de<br/>Actividad Usuario]
        REPORTS[Gestión de<br/>Reportes]
        MOD[Moderación<br/>+ IA/NLP Futuro]
        REC[Sistema de<br/>Recomendaciones ML]
        NOTS[Servicio de<br/>Notificaciones]
    end

    %% Database Layer
    subgraph "Base de Datos - PostgreSQL"
        DB_USER[(Usuarios/Perfiles<br/>+ Reputación)]
        DB_PUB[(Publicaciones<br/>Categorías)]
        DB_PROD[(Productos/Categorías<br/>+ Imágenes)]
        DB_TRANS[(Transacciones<br/>Historial)]
        DB_RATING[(Calificaciones<br/>+ Estados)]
        DB_MSG[(Mensajes<br/>Conversaciones)]
        DB_FORUM[(Foros<br/>Grupos)]
        DB_ACTIVITY[(Actividad<br/>Usuario)]
        DB_REPORTS[(Reportes<br/>+ Estados)]
        DB_NOTIF[(Notificaciones)]
        DB_LOC[(Ubicaciones<br/>Campus)]
    end

    %% External Services
    subgraph "Servicios Externos"
        OAUTH[Google OAuth 2.0<br/>Validación UCT]
        STORAGE[Almacenamiento<br/>AWS S3/Cloudinary]
        CDN[CDN<br/>CloudFlare]
        ML_API[API ML<br/>Recomendaciones]
    end

    %% Real-time Communication
    WS[WebSocket Server<br/>Socket.io]

    %% Connections Frontend -> API
    UI --> API
    DASH --> API
    ADMIN --> API
    MSGS --> WS
    FORUMS --> API
    NOTIF --> WS

    %% API -> Backend Services
    API --> AUTH
    API --> USER
    API --> PUB
    API --> PROD
    API --> TRANS
    API --> RATING
    API --> MSG
    API --> ACTIVITY
    API --> REPORTS
    API --> MOD
    API --> REC
    API --> NOTS

    %% Backend -> Database
    AUTH --> DB_USER
    USER --> DB_USER
    USER --> DB_LOC
    PUB --> DB_PUB
    PROD --> DB_PROD
    PROD --> STORAGE
    TRANS --> DB_TRANS
    TRANS --> DB_USER
    TRANS --> DB_PROD
    RATING --> DB_RATING
    RATING --> DB_TRANS
    RATING --> DB_USER
    MSG --> DB_MSG
    ACTIVITY --> DB_ACTIVITY
    REPORTS --> DB_REPORTS
    REPORTS --> DB_USER
    MOD --> DB_PUB
    MOD --> DB_MSG
    MOD --> DB_REPORTS
    REC --> DB_PUB
    REC --> DB_USER
    REC --> DB_PROD
    NOTS --> DB_NOTIF
    
    %% Forums connections
    API --> DB_FORUM

    %% External Services
    AUTH --> OAUTH
    PUB --> STORAGE
    UI --> CDN
    REC --> ML_API

    %% WebSocket connections
    WS --> MSG
    WS --> NOTS

    %% Styling con colores más vibrantes
    classDef frontend fill:#1976D2,stroke:#0D47A1,stroke-width:3px,color:#FFFFFF
    classDef backend fill:#7B1FA2,stroke:#4A148C,stroke-width:3px,color:#FFFFFF
    classDef database fill:#388E3C,stroke:#1B5E20,stroke-width:3px,color:#FFFFFF
    classDef external fill:#F57C00,stroke:#E65100,stroke-width:3px,color:#FFFFFF
    classDef websocket fill:#C2185B,stroke:#880E4F,stroke-width:3px,color:#FFFFFF
    classDef api fill:#D32F2F,stroke:#B71C1C,stroke-width:3px,color:#FFFFFF
    classDef future fill:#607D8B,stroke:#37474F,stroke-width:2px,color:#FFFFFF

    class UI,DASH,ADMIN,MSGS,FORUMS,NOTIF frontend
    class AUTH,USER,PUB,PROD,TRANS,RATING,MSG,ACTIVITY,REPORTS,REC,NOTS backend
    class MOD future
    class DB_USER,DB_PUB,DB_PROD,DB_TRANS,DB_RATING,DB_MSG,DB_FORUM,DB_ACTIVITY,DB_REPORTS,DB_NOTIF,DB_LOC database
    class OAUTH,STORAGE,CDN,ML_API external
    class WS websocket
    class API api
```

## Componentes Principales

### Frontend (Azul)
- **React + TypeScript + Tailwind CSS**
- Interface responsive y moderna
- Dashboard para usuarios y administradores

### Backend (Morado)
- **Node.js + Express**
- Arquitectura de microservicios
- API RESTful con autenticación OAuth

### Nuevos Servicios Backend Agregados:
- **Gestión de Productos/Categorías**: CRUD completo de productos, categorías e imágenes
- **Sistema de Calificaciones**: Manejo de valoraciones y reputación de usuarios
- **Tracking de Actividad**: Registro y seguimiento de actividad de usuarios
- **Gestión de Reportes**: Administración de reportes y su procesamiento

### Base de Datos (Verde)
- **PostgreSQL**
- Esquema normalizado completo
- Nuevas tablas agregadas: productos, calificaciones, actividad_usuario, reportes

### Servicios Externos (Naranja)
- **Google OAuth 2.0** para autenticación UCT
- **Almacenamiento en la nube** para archivos e imágenes
- **CDN** para optimización de recursos

### Tiempo Real (Rosa)
- **WebSocket** para mensajería instantánea
- Notificaciones en vivo

### Funcionalidades Futuras (Gris)
- **IA/NLP** para moderación automática

## Mejoras Implementadas

✅ **Servicios agregados:**
- Gestión completa de productos y categorías
- Sistema de calificaciones y reputación
- Tracking de actividad de usuarios
- Gestión de reportes y moderación

✅ **Conexiones mejoradas:**
- Productos conectados con transacciones y recomendaciones
- Calificaciones vinculadas con transacciones y usuarios
- Reportes integrados con moderación
- Actividad de usuario para analytics

✅ **Base de datos actualizada:**
- Todas las tablas del esquema MER reflejadas
- Separación clara de responsabilidades por dominio
