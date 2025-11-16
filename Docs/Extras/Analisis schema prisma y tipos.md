# Analisis Completo: Tipos TypeScript vs Schema de Base de Datos

### Hallazgos Principales:
- 0 tipos completamente alineados con el schema
- 9 tipos con diferencias parciales
- 5 entidades del schema sin tipos correspondientes
- 15+ campos con nombres diferentes
- 10+ tipos de datos incompatibles

---

## 1. Analisis de Entidad: CUENTAS (Users)

### Schema de Base de Datos: `cuentas`
```sql
Table "cuentas" {
  "id" int [pk, not null, increment]
  "nombre" varchar(50) [not null]
  "apellido" varchar(50) [default: NULL]
  "correo" varchar(255) [not null]
  "usuario" varchar(255) [not null]
  "contrasena" varchar(255) [not null]
  "rol_id" int [not null]
  "estado_id" int [not null]
  "fecha_registro" timestamp [default: CURRENT_TIMESTAMP]
  "campus" varchar(100) [default: NULL]
  "reputacion" decimal(5,2) [default: '0.00']
}
```

### Tipos TypeScript Encontrados:

#### /frontend/src/features/marketplace/Marketplace.Types/User.ts
```typescript
export type User = {
  id: string        // Error: Schema: int
  email: string     // Aviso: Schema: correo
  name?: string     // Aviso: Schema: nombre + apellido (separados)
  token?: string    // Error: No existe en schema
}
```

#### /frontend/src/features/Perfil/Perfil.Types/User.ts
```typescript
export type User = {
  id: string
  email: string
  name?: string
  token?: string
}
```

#### /frontend/src/features/Login/Login.Types/User.ts
```typescript
export type User = {
  id: string
  email: string
  name?: string
  token?: string
}
```

#### /frontend/src/features/auth/entities/User.ts
```typescript
export type User = {
  id: string
  email: string
  name?: string
  token?: string
}
```

### Diferencias detectadas:

| Campo TypeScript | Campo Schema   | Tipo TS | Tipo Schema        | Estado                    |
|------------------|----------------|---------|--------------------|---------------------------|
| id               | id             | string  | int                | Tipo incompatible         |
| email            | correo         | string  | varchar(255)       | Nombre diferente          |
| name             | nombre/apellido| string? | varchar(50)/varchar(50) | Estructura diferente  |
| token            | -              | string? | -                  | No existe en schema       |
| -                | usuario        | -       | varchar(255)       | Falta en tipos            |
| -                | contrasena     | -       | varchar(255)       | Falta en tipos            |
| -                | rol_id         | -       | int                | Falta en tipos            |
| -                | estado_id      | -       | int                | Falta en tipos            |
| -                | fecha_registro | -       | timestamp          | Falta en tipos            |
| -                | campus         | -       | varchar(100)       | Falta en tipos            |
| -                | reputacion     | -       | decimal(5,2)       | Falta en tipos            |

### Recomendaciones:

Tipo User Correcto sugerido:
```typescript
export interface User {
  id: number
  nombre: string
  apellido?: string
  correo: string
  usuario: string
  contrasena?: string
  rol_id: number
  estado_id: number
  fecha_registro?: Date
  campus?: string
  reputacion: number

  // Relaciones y campos calculados
  rol?: Role
  estado?: EstadoUsuario
  token?: string // Solo para autenticacion, no persistir en DB
}
```

---

## 2. Analisis de Entidad: PRODUCTOS

### Schema de Base de Datos: `productos`
```sql
Table "productos" {
  "id" int [pk, not null, increment]
  "nombre" varchar(100) [not null]
  "categoria_id" int [default: NULL]
  "vendedor_id" int [not null]
  "precio_anterior" decimal(10,2) [default: NULL]
  "precio_actual" decimal(10,2) [default: NULL]
  "descripcion" text
  "calificacion" decimal(3,2) [default: NULL]
  "cantidad" int [default: NULL]
  "fecha_agregado" timestamp [default: CURRENT_TIMESTAMP]
  "estado_id" int [not null]
}
```

### Tipos TypeScript Encontrados:

#### /frontend/src/types.ts
```typescript
export type Item = {
  id: string;
  title: string;
  author: string;
  category: string;
  buyNow: number;
  sellerSales: number;
  sellerRating: number;
  stock: number;
}
```

#### /frontend/src/features/ProductDetail/ProductDetail.Types/publication.ts
```typescript
export type Publication = {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  images?: string[];
  attributes?: Record<string, string | number>;
  seller?: {
    id?: string | number;
    name?: string;
    avatarUrl?: string;
    reputation?: number;
  };
  stock?: number;
  location?: string;
  campus?: string;
  category?: string;
  categoryName?: string;
  condition?: string;
  createdAt?: string | number | Date;
}
```

### Diferencias detectadas:

| Campo TypeScript | Campo Schema       | Tipo TS           | Tipo Schema         | Estado                                           |
|------------------|--------------------|-------------------|---------------------|--------------------------------------------------|
| id               | id                 | string            | int                 | Tipo incompatible                                |
| title            | nombre             | string            | varchar(100)        | Nombre diferente                                 |
| author           | vendedor_id        | string            | int                 | Tipo y concepto diferentes                       |
| category         | categoria_id       | string            | int                 | Tipo incompatible                                |
| buyNow           | precio_actual      | number            | decimal(10,2)       | Nombre diferente                                 |
| stock            | cantidad           | number            | int                 | Nombre diferente                                 |
| sellerSales      | -                  | number            | -                   | No existe en schema (calcular de transacciones)  |
| sellerRating     | calificacion       | number            | decimal(3,2)        | Confusion: rating vendedor vs producto           |
| -                | precio_anterior    | -                 | decimal(10,2)       | Falta en tipos                                   |
| -                | fecha_agregado     | -                 | timestamp           | Parcial (createdAt)                              |
| -                | estado_id          | -                 | int                 | Falta en tipos                                   |
| condition        | -                  | string?           | -                   | No existe en schema                              |

### Recomendaciones:

Tipo Product correcto sugerido:
```typescript
export interface Product {
  id: number
  nombre: string
  categoria_id?: number
  vendedor_id: number
  precio_anterior?: number
  precio_actual?: number
  descripcion?: string
  calificacion?: number
  cantidad?: number
  fecha_agregado?: Date
  estado_id: number

  // Relaciones
  categoria?: Category
  vendedor?: User
  imagenes?: ImagenProducto[]
  estado?: EstadoProducto

  // Campos calculados (no almacenados en DB)
  categoryName?: string
  sellerName?: string
  sellerRating?: number
  sellerSales?: number
}
```

---

## 3. Analisis de Entidad: PUBLICACIONES / POST

### Schema de Base de Datos: `publicaciones`
```sql
Table "publicaciones" {
  "id" int [pk, not null, increment]
  "titulo" varchar(255) [default: NULL]
  "cuerpo" text
  "usuario_id" int [not null]
  "estado" varchar(255) [default: NULL]
  "fecha" timestamp [default: CURRENT_TIMESTAMP]
}
```

### Tipos TypeScript Encontrados:

#### /frontend/src/features/marketplace/Marketplace.Types/Post.ts
```typescript
export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  categoryName: string;
  author: string;
  avatar: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  price?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Diferencias detectadas:

Confusion conceptual: el tipo Post en TypeScript mezcla datos de publicaciones, productos y publicaciones de foro.

| Campo TypeScript | Campo Schema (publicaciones) | Estado                                 |
|------------------|------------------------------|----------------------------------------|
| id               | id                           | OK                                     |
| title            | titulo                       | Nombre diferente                       |
| content          | cuerpo                       | Nombre diferente                       |
| author           | usuario_id                   | Tipo incompatible (string vs int)      |
| createdAt        | fecha                        | Nombre diferente                       |
| description      | -                            | No existe                              |
| categoryId       | -                            | No existe                              |
| categoryName     | -                            | No existe                              |
| avatar           | -                            | No existe                              |
| image            | -                            | No existe                              |
| likes/comments/shares | -                      | No existen (deben calcularse)          |
| price            | -                            | No existe                              |
| -                | estado                       | Falta en tipos                         |

### Recomendaciones:

Separar entidades y tipos:

1) Publicaciones (social):
```typescript
export interface Publicacion {
  id: number
  titulo?: string
  cuerpo?: string
  usuario_id: number
  estado?: string
  fecha?: Date

  usuario?: User
  comentarios?: ComentarioPublicacion[]
  likes?: number
  shares?: number
}
```

2) Productos: ver sección Productos

3) Publicaciones de foro:
```typescript
export interface PublicacionForo {
  id: number
  foro_id: number
  autor_id: number
  titulo?: string
  contenido?: string
  fecha?: Date

  foro?: Foro
  autor?: User
  comentarios?: ComentarioPublicacion[]
}
```

---

## 4. Analisis de Entidad: CATEGORIAS

### Schema de Base de Datos: `categorias`
```sql
Table "categorias" {
  "id" int [pk, not null, increment]
  "nombre" varchar(255) [not null]
  "categoria_padre_id" int [default: NULL]
}
```

### Tipos TypeScript Encontrados:

#### /frontend/src/types.ts
```typescript
export const CATEGORIES = [
  "Todo",
  "Electonica",
  "Musica",
  "Deportes",
  "Entretenimiento",
  "Servicios",
] as const;
export type Category = (typeof CATEGORIES)[number];
```

#### /frontend/src/features/marketplace/Marketplace.Types/Post.ts
```typescript
export interface PostCategory {
  id: string;
  name: string;
  description?: string;
}
```

### Diferencias detectadas:

| Campo TypeScript | Campo Schema        | Tipo TS | Tipo Schema   | Estado                      |
|------------------|---------------------|---------|---------------|-----------------------------|
| id               | id                  | string  | int           | Tipo incompatible           |
| name             | nombre              | string  | varchar(255)  | Nombre diferente            |
| description      | -                   | string? | -             | No existe en schema         |
| -                | categoria_padre_id  | -       | int           | Falta en tipos              |

Problema adicional: las categorias estan hardcodeadas en el frontend en lugar de obtenerse dinamicamente desde la API.

### Recomendaciones:
```typescript
export interface Category {
  id: number
  nombre: string
  categoria_padre_id?: number

  categoriaPadre?: Category
  subcategorias?: Category[]
  productos?: Product[]
}
```
Eliminar la constante CATEGORIES y consumir categorias desde la API.

---

## 5. Analisis de Entidad: MENSAJES / CHAT

### Schema de Base de Datos: `mensajes`
```sql
Table "mensajes" {
  "id" int [pk, not null, increment]
  "remitente_id" int [not null]
  "destinatario_id" int [not null]
  "contenido" text
  "fecha_envio" timestamp [default: CURRENT_TIMESTAMP]
  "leido" tinyint(1) [default: '0']
}
```

### Tipos TypeScript Encontrados:

#### /frontend/src/features/marketplace/Marketplace.Types/chat.ts
```typescript
export interface Mensaje {
  id: number | string;
  texto: string;
  autor: "yo" | "otro";
  estado?: "enviando" | "enviado" | "recibido" | "leido";
  hora: string;
}

export interface Chat {
  id: number;
  nombre: string;
  ultimoMensaje: string;
  mensajes: Mensaje[];
}
```

### Diferencias detectadas:

El schema no define tabla "chats". Los chats son agregaciones logicas de mensajes.

| Campo TypeScript | Campo Schema                | Tipo TS         | Tipo Schema     | Estado                      |
|------------------|----------------------------|-----------------|-----------------|-----------------------------|
| id               | id                         | number|string   | int             | Tipo inconsistente          |
| texto            | contenido                  | string          | text            | Nombre diferente            |
| autor            | remitente_id/destinatario_id | "yo"|"otro"   | int             | Concepto distinto           |
| hora             | fecha_envio                | string          | timestamp       | Tipo diferente              |
| estado           | leido                      | string?         | tinyint(1)      | Estructura diferente        |
| -                | remitente_id               | -               | int             | Falta en tipos              |
| -                | destinatario_id            | -               | int             | Falta en tipos              |

### Recomendaciones:

```typescript
export interface Mensaje {
  id: number
  remitente_id: number
  destinatario_id: number
  contenido: string
  fecha_envio: Date
  leido: boolean

  remitente?: User
  destinatario?: User

  // Campos calculados para UI
  esPropio?: boolean
  horaFormateada?: string
}

export interface Chat {
  usuario_id: number
  usuario?: User
  mensajes: Mensaje[]
  ultimoMensaje?: Mensaje
  noLeidos?: number
}
```

---

## 6. Analisis de Entidades SIN Tipos Correspondientes

Las siguientes tablas del schema NO tienen tipos TypeScript correspondientes:

### 6.1 TRANSACCIONES
```sql
Table "transacciones" {
  "id" int [pk, not null, increment]
  "producto_id" int [not null]
  "comprador_id" int [not null]
  "vendedor_id" int [not null]
  "fecha" timestamp [default: CURRENT_TIMESTAMP]
  "estado_id" int [not null]
}
```

Falta tipo Transaccion

Tipo recomendado:
```typescript
export interface Transaccion {
  id: number
  producto_id: number
  comprador_id: number
  vendedor_id: number
  fecha: Date
  estado_id: number

  producto?: Product
  comprador?: User
  vendedor?: User
  estado?: EstadoTransaccion
  calificaciones?: Calificacion[]
}
```

### 6.2 CALIFICACIONES
```sql
Table "calificaciones" {
  "id" int [pk, not null, increment]
  "transaccion_id" int [not null]
  "calificador_id" int [not null]
  "calificado_id" int [not null]
  "puntuacion" decimal(3,2) [default: NULL]
  "comentario" text
  "fecha" timestamp [default: CURRENT_TIMESTAMP]
}
```

Falta tipo Calificacion

Tipo recomendado:
```typescript
export interface Calificacion {
  id: number
  transaccion_id: number
  calificador_id: number
  calificado_id: number
  puntuacion?: number
  comentario?: string
  fecha: Date

  transaccion?: Transaccion
  calificador?: User
  calificado?: User
}
```

### 6.3 REPORTES
```sql
Table "reportes" {
  "id" int [pk, not null, increment]
  "reportante_id" int [not null]
  "usuario_reportado_id" int [default: NULL]
  "producto_id" int [default: NULL]
  "motivo" text
  "fecha" timestamp [default: CURRENT_TIMESTAMP]
  "estado_id" int [not null]
}
```

Falta tipo Reporte

Tipo recomendado:
```typescript
export interface Reporte {
  id: number
  reportante_id: number
  usuario_reportado_id?: number
  producto_id?: number
  motivo?: string
  fecha: Date
  estado_id: number

  reportante?: User
  usuarioReportado?: User
  producto?: Product
  estado?: EstadoReporte
}
```

### 6.4 CARRITO
```sql
Table "carrito" {
  "id" int [pk, not null, increment]
  "usuario_id" int [not null]
  "producto_id" int [not null]
  "cantidad" int [not null]
}
```

Falta tipo Carrito

Tipo recomendado:
```typescript
export interface ItemCarrito {
  id: number
  usuario_id: number
  producto_id: number
  cantidad: number

  producto?: Product
}

export interface Carrito {
  usuario_id: number
  items: ItemCarrito[]
  total?: number
  cantidadItems?: number
}
```

### 6.5 NOTIFICACIONES
```sql
Table "notificaciones" {
  "id" int [pk, not null, increment]
  "usuario_id" int [not null]
  "tipo" varchar(50) [default: NULL]
  "mensaje" text
  "leido" tinyint(1) [default: '0']
  "fecha" timestamp [default: CURRENT_TIMESTAMP]
}
```

Falta tipo Notificacion

Tipo recomendado:
```typescript
export interface Notificacion {
  id: number
  usuario_id: number
  tipo?: string
  mensaje?: string
  leido: boolean
  fecha: Date

  usuario?: User
}
```

### 6.6 FOROS
```sql
Table "foros" {
  "id" int [pk, not null, increment]
  "nombre" varchar(255) [not null]
  "descripcion" text
  "creador_id" int [not null]
  "fecha_creacion" timestamp [default: CURRENT_TIMESTAMP]
}
```

Falta tipo Foro

Tipo recomendado:
```typescript
export interface Foro {
  id: number
  nombre: string
  descripcion?: string
  creador_id: number
  fecha_creacion: Date

  creador?: User
  publicaciones?: PublicacionForo[]
}
```

### 6.7 ESTADOS (varias tablas)
```sql
Table "estados_usuario" { id, nombre }
Table "estados_producto" { id, nombre }
Table "estados_transaccion" { id, nombre }
Table "estados_reporte" { id, nombre }
```

Falta tipos para estados

Tipos recomendados:
```typescript
export interface EstadoUsuario {
  id: number
  nombre: string
}

export interface EstadoProducto {
  id: number
  nombre: string
}

export interface EstadoTransaccion {
  id: number
  nombre: string
}

export interface EstadoReporte {
  id: number
  nombre: string
}
```

### 6.8 ROLES
```sql
Table "roles" {
  "id" int [pk, not null, increment]
  "nombre" varchar(50) [not null]
}
```

Falta tipo Rol

Tipo recomendado:
```typescript
export interface Rol {
  id: number
  nombre: string
}
```

### 6.9 UBICACIONES
```sql
Table "ubicaciones" {
  "id" int [pk, not null, increment]
  "usuario_id" int [not null]
  "nombre_lugar" varchar(255) [default: NULL]
  "descripcion" text
}
```

Falta tipo Ubicacion

Tipo recomendado:
```typescript
export interface Ubicacion {
  id: number
  usuario_id: number
  nombre_lugar?: string
  descripcion?: string

  usuario?: User
}
```

### 6.10 IMAGENES_PRODUCTO
```sql
Table "imagenes_producto" {
  "id" int [pk, not null, increment]
  "producto_id" int [not null]
  "url_imagen" mediumblob
}
```

Falta tipo ImagenProducto

Tipo recomendado:
```typescript
export interface ImagenProducto {
  id: number
  producto_id: number
  url_imagen: string

  producto?: Product
}
```

---

## 7. Tipos TypeScript SIN Correspondencia en Schema

Estos tipos existen en TypeScript pero no tienen tabla correspondiente en el schema:

### 7.1 Credentials (Login)
/frontend/src/features/Login/Login.Types/LoginUser.ts
```typescript
export type Credentials = {
  email: string
  password: string
}
```
Comentario: Es un DTO para autenticacion, no necesita tabla.

### 7.2 PageMeta / Paginated
/frontend/src/types/types.ts
```typescript
export interface PageMeta {
  page: number
  pageSize: number
  total: number
}

export interface Paginated<T> {
  items: T[]
  meta: PageMeta
}
```
Comentario: Tipos utilitarios, OK.

### 7.3 ApiError / ApiResponse
/frontend/src/types/types.ts
```typescript
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface ApiResponse<T> {
  data: T
  error?: ApiError
}
```
Comentario: Tipos para manejo de respuestas HTTP, OK.

---

## 8. Problemas de Convenciones de Nomenclatura

### 8.1 Ingles vs Espanol
Inconsistencia: el schema usa espanol (nombre, correo, contrasena) mientras TypeScript usa ingles (name, email, password).

Recomendacion: elegir un solo idioma:
- Opcion 1: Todo en ingles
- Opcion 2: Todo en espanol
- Opcion 3: Schema en espanol, tipos en ingles con mapeo explicito

### 8.2 camelCase vs snake_case
Inconsistencia:
- Schema: snake_case (usuario_id, fecha_registro)
- TypeScript: camelCase (userId, fechaRegistro)

Recomendacion: usar transformadores (ej. con Prisma o TypeORM) para mapear automaticamente.

### 8.3 Plurales en Nombres de Tablas
Schema: plural (productos, categorias, mensajes)
TypeScript: singular (Product, Category, Message)

Comentario: Esta convencion es aceptable.

---

## 9. Problemas de Tipos de Datos

### 9.1 IDs: string vs number
Critico: Muchos IDs en TypeScript son string pero en schema son int.

Ejemplo:
```typescript
// Incorrecto
id: string

// Correcto
id: number
```

Impacto:
- Comparaciones fallidas
- Errores en queries
- Problemas de serializacion

### 9.2 Decimales: number vs decimal
Schema: decimal(10,2), decimal(3,2), decimal(5,2)
TypeScript: number

Aviso: JS/TS no tiene tipo decimal. Opciones:
- usar number (puede perder precision)
- usar string (mantener precision, parsear cuando se necesite)
- usar libreria como decimal.js o big.js

### 9.3 Booleanos: boolean vs tinyint
Schema: tinyint(1) para booleanos (leido, etc.)
TypeScript: debe usar boolean y mapear tinyint <-> boolean en backend.

Ejemplo:
```typescript
leido: boolean
```

### 9.4 Fechas: Date vs timestamp/string
Schema: timestamp, date
TypeScript: Date, string o mixto

Recomendacion:
- Opcion A: siempre Date (objetos)
- Opcion B: ISO strings ("2025-11-02T10:30:00Z")
- Opcion C: Date | string con transformaciones

---

## 10. Relaciones Faltantes en Tipos

Relaciones existentes en schema pero no modeladas en TypeScript:

| Relacion | Recomendacion |
|----------|---------------|
| Usuario -> Productos (vendedor) | User.productosEnVenta?: Product[]; User.productosVendidos?: Product[] |
| Usuario -> Transacciones | User.compras?: Transaccion[]; User.ventas?: Transaccion[] |
| Producto -> Imagenes | Product.imagenes?: ImagenProducto[] |
| Producto -> Transacciones | Product.transacciones?: Transaccion[] |
| Categoria -> Subcategorias | Category.categoriaPadre?: Category; Category.subcategorias?: Category[] |

---

## 11. Campos Calculados vs Persistidos

Algunos campos en TypeScript deben ser calculados, no persistidos:

- En User:
  - sellerSales: calcular de transacciones
  - sellerRating: existe en schema como reputacion

- En Post/Publication:
  - likes, comments, shares: calcular de tablas relacionadas
  - timeAgo: calcular desde fecha en frontend

- En Chat:
  - ultimoMensaje: calcular de mensajes

---

## 12. Resumen de Inconsistencias por Archivo

- frontend/src/types.ts
  - Item no coincide con productos
  - IDs como string en lugar de number
  - Campos con nombres diferentes
  - sellerSales no existe en schema
  - categorias hardcodeadas

- frontend/src/types/types.ts
  - Duplicado de types.ts, mismo problema

- frontend/src/features/marketplace/Marketplace.Types/types.ts
  - Duplicado, mismos errores

- frontend/src/features/marketplace/Marketplace.Types/User.ts
  - Tipo User incompleto: faltan campos y nombres difieren

- frontend/src/features/marketplace/Marketplace.Types/Post.ts
  - Confusion entre publicaciones y productos

- frontend/src/features/marketplace/Marketplace.Types/chat.ts
  - Tabla chats no existe en schema
  - Mensaje no coincide con mensajes

- frontend/src/features/ProductDetail/ProductDetail.Types/publication.ts
  - Publication mezcla producto con datos de UI

- frontend/src/features/Login/Login.Types/User.ts
  - Duplicado del tipo User

- frontend/src/features/Perfil/Perfil.Types/User.ts
  - Duplicado del tipo User

- frontend/src/features/auth/entities/User.ts
  - Duplicado del tipo User

---

## 13. Conclusiones por Archivo

Nivel de criticidad:

- Critico:
  - IDs como string vs number
  - Campos requeridos faltantes (vendedor_id, estado_id, etc.)
  - Tipos duplicados en multiples archivos
  - Tablas sin tipos (Transacciones, Calificaciones, etc.)

- Alto:
  - Nombres de campos diferentes
  - Confusion entre entidades
  - Relaciones no modeladas
  - Campos calculados modelados como persistidos

- Medio:
  - Inconsistencia en nomenclatura (ingles vs espanol)
  - Falta de enums para estados y roles
  - Sin validaciones de tipos

- Bajo:
  - Categorias hardcodeadas
  - Falta de tipos utilitarios
  - Sin generacion automatica de tipos

---

## 14. Archivos que Requieren Atencion Inmediata

Prioridad Alta (corregir esta semana):
1. frontend/src/types.ts - Corregir tipo Item
2. frontend/src/features/marketplace/Marketplace.Types/User.ts - Completar tipo User
3. Crear frontend/src/types/entities/Product.ts - Nuevo tipo correcto
4. Crear frontend/src/types/entities/Transaction.ts - Tipo faltante
5. Crear frontend/src/types/entities/Rating.ts - Tipo faltante

Prioridad Media (proximas 2 semanas):
6. Separar conceptos de Post y Product
7. Crear tipos para estados y roles
8. Completar tipos de relaciones
9. Eliminar duplicaciones
10. Crear DTOs para API

Baja prioridad (backlog):
11. Implementar validaciones
12. Documentar con JSDoc
13. Generar tipos automaticos
14. Crear tests

---