# DIAGRAMA DE ARQUITECTURA - MARKETPLACE UCT

## Arquitectura Hexagonal (Clean Architecture)

Este diagrama muestra la arquitectura del sistema del marketplace UCT siguiendo los principios de Clean Architecture y Arquitectura Hexagonal.

```mermaid
flowchart TD
    %% =======================
    %% SERVICIOS DE HOSTING Y DESPLIEGUE
    %% =======================
    subgraph Hosting ["HOSTING Y DESPLIEGUE"]
        DOCKER["Contenedores Docker<br/>(Frontend + Backend)"]
        HOST["Servicio de Hosting<br/>(Servicio Privado)"]
    end
    
    %% =======================
    %% CAPA API EXTERNA (INTEGRA IV)
    %% =======================
    subgraph ApiExterna ["API EXTERNA - INTEGRA IV - Microservicios + Gateway"]
        API_GW["API Gateway - Integra IV<br/>(Punto de Entrada Único)"]
        API_AUTH["Servicio Auth - Integra IV<br/>(Autenticación y Autorización)"]
        API_USER["Servicio Usuarios - Integra IV<br/>(Gestión de Perfiles)"]
        API_PUB["Servicio Publicaciones - Integra IV<br/>(CRUD de Publicaciones)"]
        API_TRANS["Servicio Transacciones - Integra IV<br/>(Procesamiento de Ventas)"]
        API_MSG["Servicio Mensajería - Integra IV<br/>(Chat y Comunicación)"]
    end

    %% =======================
    %% FRONTEND
    %% =======================
    subgraph Frontend ["FRONTEND (React + TypeScript + Tailwind CSS)"]
        UI["Componentes de Interfaz<br/>(Botones, Tarjetas, Formularios, Listados)"]
        GE["Gestión de Estado<br/>(React Query + Context API)"]
        NAV["Navegación<br/>(React Router)"]
        UTIL["Utilidades<br/>(Validaciones, Helpers, Formateo)"]
        API_CLIENT["Cliente API<br/>(Preparado para Integra IV)"]
    end

    %% =======================
    %% BACKEND (Node.js + TypeScript)
    %% =======================
    subgraph Backend ["BACKEND(Node.js+TypeScript)"]

        %% ---------- CAPA PRESENTACION ----------
        subgraph Presentacion ["CAPA DE PRESENTACIÓN"]
            ROUTES["Rutas y Controladores<br/>(Autenticación, Publicaciones, Transacciones, Mensajería, Administración)"]
            MW["Middlewares<br/>(Autenticación, Validación, Control de Velocidad, Manejo de Errores)"]
            VALID["Validadores<br/>(Esquemas de Datos, DTOs)"]
        end
        
        %% ---------- CAPA APLICACION ----------
        subgraph Aplicacion ["CAPA DE APLICACIÓN"]
            UC["Casos de Uso<br/>(Crear Publicación, Confirmar Transacción, Enviar Mensaje, Moderar Contenido)"]
            SERV["Servicios de Aplicación<br/>(Orquestadores de Lógica de Negocio)"]
            INTER["Interfaces de Repositorio<br/>(Contratos para Persistencia de Datos)"]
        end
        
        %% ---------- CAPA DOMINIO ----------
        subgraph Dominio ["CAPA DE DOMINIO"]
            ENT["Entidades de Negocio<br/>(Usuario, Publicación, Transacción, Valoración, Mensaje, Ubicación)"]
            VO["Objetos de Valor<br/>(Email Institucional, Rol de Usuario, Estado de Publicación)"]
            RN["Reglas de Negocio<br/>(Sistema de Reputación, Políticas de Visibilidad, Validaciones de Dominio)"]
        end
        
        %% ---------- CAPA INFRAESTRUCTURA ----------
        subgraph Infraestructura ["CAPA DE INFRAESTRUCTURA"]
            REPOS["Repositorios<br/>(Implementaciones con PostgreSQL)"]
            CONFIG["Configuración<br/>(Variables de Entorno, Migraciones de BD)"]
        end
    end

    %% =======================
    %% BASE DE DATOS
    %% =======================
    subgraph Database ["BASE DE DATOS(PostgreSQL)"]
        DB_MAIN[(Base de Datos Principal<br/>Usuarios, Publicaciones, Transacciones, Mensajes, Ubicaciones)]
    end

    %% =======================
    %% SERVICIOS EXTERNOS
    %% =======================
    subgraph External ["SERVICIOS EXTERNOS"]
        OAUTH["Google OAuth 2.0<br/>(Autenticación UCT)"]
    end

    %% =======================
    %% FLUJOS DE DEPENDENCIA
    %% =======================

    %% Hosting y Despliegue
    DOCKER --> HOST

    %% Frontend - Preparado para usar API o Backend directo
    UI <--> GE
    GE <--> NAV
    NAV <--> UI
    UI <--> UTIL
    GE <--> API_CLIENT

    %% Conexiones alternativas del Frontend
    %% Opción 1: Conectar a API Externa (Integra IV) - Futuro
    API_CLIENT -.-> API_GW
    %% Opción 2: Conectar directamente al Backend - Actual
    API_CLIENT --> ROUTES

    %% API Externa (Integra IV) - Preparada para el futuro
    API_GW --> API_AUTH
    API_GW --> API_USER
    API_GW --> API_PUB
    API_GW --> API_TRANS
    API_GW --> API_MSG

    %% Capa de Presentación del Backend
    ROUTES --> MW
    ROUTES --> VALID
    MW --> UC
    VALID --> UC

    %% Capa de Aplicación
    UC --> SERV
    SERV --> INTER
    UC --> ENT

    %% Capa de Dominio
    ENT --> VO
    ENT --> RN

    %% Capa de Infraestructura
    INTER --> REPOS
    REPOS --> CONFIG
    REPOS --> DB_MAIN

    %% Servicios Externos
    ROUTES --> OAUTH
    API_AUTH -.-> OAUTH

    %% Despliegue
    DOCKER -.-> Frontend
    DOCKER -.-> Backend

    %% Actores del Sistema
    Vendedor([Vendedor UCT]) --> Frontend
    Comprador([Comprador UCT]) --> Frontend
    Administrador([Administrador]) --> Frontend

    %% =======================
    %% ESTILOS
    %% =======================
    classDef hosting fill:#2E7D32,stroke:#1B5E20,stroke-width:2px,color:#FFFFFF
    classDef apiexterna fill:#FF5722,stroke:#D84315,stroke-width:2px,color:#FFFFFF
    classDef frontend fill:#1565C0,stroke:#0D47A1,stroke-width:2px,color:#FFFFFF
    classDef presentation fill:#FF8F00,stroke:#E65100,stroke-width:2px,color:#FFFFFF
    classDef application fill:#388E3C,stroke:#2E7D32,stroke-width:2px,color:#FFFFFF
    classDef domain fill:#FBC02D,stroke:#F57F17,stroke-width:2px,color:#000000
    classDef infra fill:#D32F2F,stroke:#B71C1C,stroke-width:2px,color:#FFFFFF
    classDef database fill:#7B1FA2,stroke:#4A148C,stroke-width:2px,color:#FFFFFF
    classDef external fill:#F57C00,stroke:#E65100,stroke-width:2px,color:#FFFFFF

    class DOCKER,HOST,DOMAIN hosting
    class API_GW,API_AUTH,API_USER,API_PUB,API_TRANS,API_MSG apiexterna
    class UI,GE,NAV,UTIL,API_CLIENT frontend
    class ROUTES,MW,VALID presentation
    class UC,SERV,INTER application
    class ENT,VO,RN domain
    class REPOS,CONFIG infra
    class DB_MAIN database
    class OAUTH external
```

## Descripción de los Componentes

### 🚀 Hosting y Despliegue - Docker + Cloud Services (Verde Oscuro)
- **Contenedores Docker**: Empaquetado de aplicaciones Frontend y Backend
- **Servicio de Hosting**: Plataforma de despliegue (Railway, Vercel, Heroku)
- **Dominio y DNS**: Configuración de dominio personalizado

### 🔗 API Externa - Integra IV - Microservicios + Gateway (Rojo Intenso)
**Preparada para integración futura con el equipo de Integra IV**
- **API Gateway - Integra IV**: Punto de entrada único para todas las peticiones
- **Servicio Auth - Integra IV**: Manejo centralizado de autenticación y autorización
- **Servicio Usuarios - Integra IV**: Gestión completa de perfiles y usuarios
- **Servicio Publicaciones - Integra IV**: CRUD y gestión de publicaciones del marketplace
- **Servicio Transacciones - Integra IV**: Procesamiento de ventas y transacciones
- **Servicio Mensajería - Integra IV**: Sistema de chat y comunicación

### 🖥️ Frontend - React + TypeScript + Tailwind CSS (Azul)
- **Componentes de Interfaz**: Elementos reutilizables de la interfaz de usuario
- **Gestión de Estado**: Manejo del estado con React Query y Context API
- **Navegación**: Sistema de enrutamiento con React Router
- **Utilidades**: Funciones de validación, formateo y helpers
- **Cliente API**: **Preparado para conectar con Integra IV** o funcionar independientemente

### ⚙️ Backend - Node.js + TypeScript + Clean Architecture

#### 📡 Capa de Presentación - Express.js (Naranja)
- **Rutas y Controladores**: Endpoints HTTP para todas las funcionalidades
- **Middlewares**: Autenticación, validación y manejo de errores
- **Validadores**: Esquemas de validación de datos de entrada

#### 🔧 Capa de Aplicación - Casos de Uso (Verde)
- **Casos de Uso**: Lógica específica de cada funcionalidad del marketplace
- **Servicios de Aplicación**: Orquestación de operaciones complejas
- **Interfaces de Repositorio**: Contratos para el acceso a datos

#### 💼 Capa de Dominio - Lógica de Negocio (Amarillo)
- **Entidades de Negocio**: Modelos principales del sistema
- **Objetos de Valor**: Tipos inmutables con validaciones específicas
- **Reglas de Negocio**: Lógica central del dominio del marketplace

#### 🔌 Capa de Infraestructura - Prisma ORM (Rojo)
- **Repositorios**: Implementaciones concretas para PostgreSQL
- **Configuración**: Variables de entorno y migraciones de base de datos

### 🗄️ Base de Datos - PostgreSQL (Morado)
- **Base de Datos Principal**: Almacenamiento de toda la información del sistema

### 🌐 Servicios Externos - Google OAuth 2.0 (Naranja)
- **Google OAuth 2.0**: Autenticación exclusiva para usuarios UCT

## Arquitectura Modular y Preparación para API

### Diseño Actual (Desarrollo Independiente)
- El Frontend se conecta directamente al Backend desarrollado internamente
- Funcionalidad completa sin dependencias externas
- Base sólida para el marketplace UCT

### Preparación Futura (Integra IV)
- **Cliente API** preparado para cambiar la conexión
- **Interfaces compatibles** con los servicios de Integra IV
- **Transición transparente** cuando esté disponible la API externa
- **Líneas punteadas** indican conexiones futuras preparadas

## Stack Tecnológico Detallado

### Frontend
- **Framework**: React 18+ con TypeScript
- **Estilos**: Tailwind CSS para diseño responsivo
- **Estado**: React Query + Context API
- **Navegación**: React Router v6
- **Build**: Vite para desarrollo y construcción

### Backend
- **Runtime**: Node.js con TypeScript
- **Framework Web**: Express.js
- **Arquitectura**: Clean Architecture / Hexagonal
- **ORM**: Prisma para manejo de base de datos
- **Validación**: Zod para esquemas de datos

### Base de Datos
- **SGBD**: PostgreSQL 15+
- **Migraciones**: Prisma Migrate
- **Conexión**: Pool de conexiones optimizado

### Infraestructura
- **Contenedores**: Docker + Docker Compose
- **Despliegue**: Railway, Vercel o Heroku
- **Autenticación**: Google OAuth 2.0 para validación UCT
```
