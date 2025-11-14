# Diagrama de Arquitectura de Sistema y Despliegue

Este diagrama describe la arquitectura completa del sistema Marketplace UCT, abarcando desde el despliegue hasta la estructura interna del software, siguiendo los principios de Clean Architecture.

```mermaid
flowchart TD
    subgraph Hosting ["HOSTING Y DESPLIEGUE"]
        DOCKER["Contenedores Docker - Frontend + Backend"]
        HOST["Servicio de Hosting - Servicio Privado"]
    end
    
    subgraph ApiExterna ["API EXTERNA - INTEGRA IV - Futuro"]
        API_GW["API Gateway - Integra IV"]
        API_AUTH["Servicio Auth - Integra IV"]
        API_USER["Servicio Usuarios - Integra IV"]
        API_PUB["Servicio Publicaciones - Integra IV"]
        API_TRANS["Servicio Transacciones - Integra IV"]
        API_MSG["Servicio Mensajeria - Integra IV"]
    end

    subgraph Frontend ["FRONTEND - React + TypeScript"]
        UI["Componentes de Interfaz"]
        GE["Gestion de Estado - React Query"]
        NAV["Navegacion - React Router"]
        UTIL["Utilidades y Helpers"]
        API_CLIENT["Cliente API"]
    end

    subgraph Backend ["BACKEND - Node.js + TypeScript"]
        subgraph Presentacion ["CAPA DE PRESENTACION"]
            ROUTES["Rutas y Controladores"]
            MW["Middlewares"]
            VALID["Validadores - DTOs"]
        end
        subgraph Aplicacion ["CAPA DE APLICACION"]
            UC["Casos de Uso"]
            SERV["Servicios de Aplicacion"]
            INTER["Interfaces de Repositorio"]
        end
        subgraph Dominio ["CAPA DE DOMINIO"]
            ENT["Entidades de Negocio"]
            VO["Objetos de Valor"]
            RN["Reglas de Negocio"]
        end
        subgraph Infraestructura ["CAPA DE INFRAESTRUCTURA"]
            REPOS["Repositorios - PostgreSQL"]
            CONFIG["Configuracion y Migraciones"]
        end
    end

    subgraph Database ["BASE DE DATOS - PostgreSQL"]
        DB_MAIN[(Base de Datos Principal)]
    end

    subgraph External ["SERVICIOS EXTERNOS"]
        OAUTH["Google OAuth 2.0"]
    end

    %% Conexiones
    API_CLIENT --> ROUTES
    ROUTES --> MW & VALID --> UC --> SERV --> INTER --> REPOS --> DB_MAIN
    ROUTES --> OAUTH
    DOCKER --> HOST
    API_CLIENT -.-> API_GW

    %% Estilos
    classDef frontend fill:#1565C0,stroke:#0D47A1,color:#fff
    classDef backend fill:#7B1FA2,stroke:#4A148C,color:#fff
    classDef database fill:#388E3C,stroke:#1B5E20,color:#fff
    classDef external fill:#F57C00,stroke:#E65100,color:#fff
    classDef hosting fill:#2E7D32,stroke:#1B5E20,color:#fff
    classDef apiexterna fill:#FF5722,stroke:#D84315,color:#fff
    classDef presentation fill:#FF8F00,stroke:#E65100,color:#fff
    classDef application fill:#388E3C,stroke:#2E7D32,color:#fff
    classDef domain fill:#FBC02D,stroke:#F57F17,color:#000
    classDef infra fill:#D32F2F,stroke:#B71C1C,color:#fff

    class UI,GE,NAV,UTIL,API_CLIENT frontend
    class ROUTES,MW,VALID presentation
    class UC,SERV,INTER application
    class ENT,VO,RN domain
    class REPOS,CONFIG infra
    class DB_MAIN database
    class OAUTH external
    class DOCKER,HOST hosting
    class API_GW,API_AUTH,API_USER,API_PUB,API_TRANS,API_MSG apiexterna
```