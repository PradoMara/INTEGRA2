# Flujo de Datos de Alto Nivel

Este diagrama ofrece una vista simplificada de la arquitectura, enfocándose en la interacción y el flujo de datos entre los componentes principales del sistema en su estado actual.

```mermaid
graph TD
    %% ---- Actores ----
    Usuario([Usuario UCT])

    %% ---- Frontend ----
    subgraph Frontend ["Frontend - React + TypeScript"]
        Login[Pantalla de Login]
        Marketplace[Vista Marketplace y Búsqueda]
        DetallePub[Vista Detalle de Publicación]
        FormPub[Formulario de Publicación]
        Chat[Vista de Chats]
    end

    %% ---- Backend ----
    subgraph Backend ["Backend - Node.js + Express"]
        API[API REST]
        WS[Servidor WebSocket]
        
        subgraph Controladores
            AuthController[Auth Controller]
            PubController[Publicaciones Controller]
            ChatController[Chat Controller]
        end
    end

    %% ---- Persistencia y Servicios Externos ----
    subgraph Datos_Servicios ["Datos y Servicios Externos"]
        DB[(Base de Datos PostgreSQL)]
        OAuth[Google OAuth 2.0]
        Cloud[Almacenamiento de Imágenes]
    end

    %% ---- Flujos de Datos ----
    Usuario --> Login
    Usuario --> Marketplace
    
    %% Flujo de Autenticación
    Login --"1. Inicia Sesión"--> AuthController
    AuthController --"2. Valida Token"--> OAuth
    AuthController --"3. Crea/Obtiene Usuario"--> DB
    
    %% Flujo de Publicaciones
    Marketplace --"GET /publicaciones"--> PubController
    PubController --"CRUD"--> DB
    PubController --"URL de Imagen"--> Cloud

    %% Flujo de Chat
    Chat --"GET /conversaciones"--> ChatController
    ChatController --"Historial"--> DB
    Chat --"Conexión WebSocket"--> WS
    WS --"Mensajes en tiempo real"--> Chat

    %% Estilos
    classDef frontend fill:#1976D2,stroke:#0D47A1,color:#FFF
    classDef backend fill:#7B1FA2,stroke:#4A148C,color:#FFF
    classDef data fill:#388E3C,stroke:#1B5E20,color:#FFF
    classDef external fill:#F57C00,stroke:#E65100,color:#FFF
    classDef actor fill:#424242,stroke:#000,color:#FFF

    class Login,Marketplace,DetallePub,FormPub,Chat frontend
    class API,WS,AuthController,PubController,ChatController backend
    class DB,Cloud data
    class OAuth external
    class Usuario actor
```