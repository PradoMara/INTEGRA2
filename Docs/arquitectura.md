# Arquitectura del Proyecto Marketplace UCT

Este documento describe la arquitectura técnica y funcional del Marketplace local para la comunidad UCT, incluyendo el diseño del frontend, backend, base de datos, el flujo de autenticación, las principales dependencias del sistema y los principios arquitectónicos utilizados.

---

## 1. Visión General

El sistema está compuesto por una plataforma web y móvil que permite a estudiantes y profesores de la Universidad Católica de Temuco comprar, vender e intercambiar productos y servicios en un entorno seguro y cerrado. La solución implementa autenticación institucional, gestión de publicaciones, mensajería interna, moderación y paneles de control diferenciados.

---

## 2. Principios Arquitectónicos

### 2.1 Clean Architecture

El proyecto se construye siguiendo los principios de **Clean Architecture**, que promueven una clara separación de responsabilidades, independencia de frameworks, testabilidad y facilidad de mantenimiento. Esto implica dividir la solución en capas bien definidas (entidades, casos de uso, interfaces y frameworks externos) y asegurar que las dependencias siempre apunten hacia el dominio.

### 2.2 Feature Modularization

Adicionalmente, la arquitectura implementa el enfoque de **Feature Modularization**. Esto implica organizar el código tanto del frontend como del backend en módulos independientes por funcionalidad o "feature" (ejemplo: Autenticación, Publicaciones, Mensajería, Moderación), en lugar de solo por tipo de archivo (controllers, services, etc).

Cada módulo contiene todos los elementos necesarios para su funcionamiento (componentes, servicios, rutas, lógica de dominio, pruebas, estilos), permitiendo que el desarrollo, mantenimiento y escalabilidad de cada feature sea más sencillo y aislado.

---

## 3. Arquitectura de Componentes

### 3.1 Frontend

- **Framework:** React con TypeScript (web), React Native (móvil)
- **Estilos:** Tailwind CSS (web), Styled Components o NativeBase (móvil)
- **Gestión de Estado:** Redux Toolkit o Context API
- **Rutas:** React Router (web)
- **Internacionalización:** i18n (opcional)
- **Autenticación:** Integración con Google OAuth 2.0
- **Consumo de API:** Axios o Fetch
- **Notificaciones:** Web push y notificaciones móviles
- **Prototipado/Diseño:** Figma

#### Ejemplo de estructura modular:

```
src/
  features/
    auth/
      components/
      hooks/
      services/
      store/
      styles/
      tests/
    publicaciones/
    mensajes/
    moderacion/
  shared/
    components/
    utils/
    styles/
```

---

### 3.2 Backend

- **Lenguaje:** TypeScript (Node.js)
- **Framework:** Express.js
- **Autenticación:** Passport.js con Google OAuth 2.0 (restricción por dominio institucional)
- **ORM:** Prisma o TypeORM (con PostgreSQL)
- **Almacenamiento de Imágenes:** AWS S3, Google Cloud Storage o alternativa compatible
- **Mensajería interna:** WebSockets (Socket.io) o API REST
- **Moderación automática:** NLP básico (paquete como `compromise`, `natural` o integración con servicios de IA externos)
- **Panel de administración:** Endpoints protegidos y dashboard para métricas, reportes y gestión de usuarios/publicaciones
- **Validación:** Joi o Zod para datos de entrada

#### Ejemplo de estructura modular:

```
src/
  features/
    auth/
      controllers/
      routes/
      services/
      models/
      tests/
    publicaciones/
    mensajes/
    moderacion/
  shared/
    middlewares/
    utils/
    config/
```

---

### 3.3 Base de Datos

- **Motor:** PostgreSQL
- **Modelo Entidad-Relación (MER):**
  - Usuario: id, nombre, correo institucional, rol, campus, info logística, reputación
  - Publicación: id, título, descripción, categoría, subcategoría, precio, estado, imágenes, ubicación, autor, activa (sí/no), historial
  - Mensaje: id, id_emisor, id_receptor, contenido, fecha, estado
  - Valoración: id, id_usuario_valorado, id_usuario_valorador, puntaje, comentario, fecha
  - Reporte: id, id_reportado, tipo, motivo, estado, fecha
  - Notificación: id, id_usuario, tipo, contenido, leída (sí/no), fecha

#### Diagrama simplificado:

```
Usuario ───< Publicación
Usuario ───< Mensaje >─── Usuario
Usuario ───< Valoración >─── Usuario
Usuario ───< Reporte
Publicación ───< Reporte
Usuario ───< Notificación
```

---

## 4. Flujo de Autenticación

1. **Inicio:** Usuario accede al portal y selecciona "Ingresar con cuenta institucional".
2. **Google OAuth 2.0:** Se inicia el flujo de autenticación con Google, restringiendo el acceso a correos con dominios `@alu.uct.cl` o `@uct.cl`.
3. **Validación:** El backend recibe el token de Google, valida el dominio y obtiene el nombre real del usuario.
4. **Registro/Inicio de sesión:** Si es la primera vez, se crea el perfil en la base de datos; si es usuario existente, se actualiza el último acceso.
5. **Asignación de rol:** El sistema asigna el rol correspondiente (usuario o administrador).
6. **Acceso:** Se genera un JWT o sesión segura y el usuario accede a la plataforma.
7. **Manejo de sesión:** El frontend almacena el token en memoria o almacenamiento seguro; backend valida en cada request protegido.

---

## 5. Dependencias Principales

### Frontend
- react, react-dom, react-router-dom
- typescript
- tailwindcss
- axios
- redux, @reduxjs/toolkit
- i18next (opcional)
- @mui/material o equivalente (opcional)
- socket.io-client (si hay mensajería en tiempo real)

### Backend
- express
- typescript
- passport, passport-google-oauth20
- prisma o typeorm
- pg (PostgreSQL client)
- socket.io (opcional)
- multer, aws-sdk (para imágenes)
- joi o zod
- jsonwebtoken
- dotenv
- cors

### Base de datos y almacenamiento
- postgresql (servidor)
- AWS S3 o Google Cloud Storage (imágenes)

---

## 6. Diagrama Simplificado de Arquitectura

```
[ Usuario (Web/Móvil) ]
        |
        v
[ Frontend (React/React Native) ]
        |
        v
[ API REST / WebSockets ]
        |
        v
[ Backend (Node.js + Express + TypeScript) ]
        |
        v
[ PostgreSQL | S3/Cloud Storage | Google OAuth ]
```

---

## 7. Seguridad y Buenas Prácticas

- Autenticación obligatoria con correo institucional.
- Validación de datos en backend y frontend.
- Cifrado de contraseñas y tokens.
- Control de roles y permisos (usuario/administrador).
- Moderación activa y reporte de usuarios/publicaciones.
- Historial y trazabilidad de todas las transacciones.
- Separación de ambientes (desarrollo, pruebas, producción).

---

## 8. Beneficios de Clean Architecture + Feature Modularization

La combinación de Clean Architecture y Feature Modularization aporta los siguientes beneficios al proyecto:

- **Escalabilidad:** Permite agregar nuevas funcionalidades (features) de manera aislada, sin impactar otras partes del sistema.
- **Mantenibilidad:** Facilita la localización y corrección de errores, así como la actualización de componentes específicos.
- **Reutilización:** Los módulos pueden ser reutilizados o adaptados en otros proyectos o contextos.
- **Independencia tecnológica:** El sistema puede migrar frameworks, librerías o servicios externos sin afectar el núcleo del dominio.
- **Colaboración eficiente:** Equipos de desarrollo pueden trabajar en diferentes features en paralelo, minimizando conflictos y mejorando la productividad.
- **Testabilidad:** Favorece la escritura de pruebas unitarias e integraciones sobre módulos bien aislados y capas independientes.
- **Onboarding rápido:** Los nuevos integrantes del equipo pueden comprender y contribuir rápidamente a features específicos, gracias a la estructura modular y la claridad de las capas.

---

## 9. Observaciones y Futuras Extensiones

- El diseño modular permite agregar nuevos roles, categorías y funcionalidades (foros, IA avanzada, integración con calendarios, etc).
- La arquitectura soporta escalabilidad y despliegue en la nube (Docker, CI/CD, HTTPS).
- La base de datos queda preparada para métricas, auditoría y análisis.

---
