/*
  Warnings:

  - You are about to drop the column `conversacionId` on the `mensajes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `mensajes` table. All the data in the column will be lost.
  - You are about to drop the column `remitenteId` on the `mensajes` table. All the data in the column will be lost.
  - You are about to drop the column `autorId` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `campus` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `fechaPublicacion` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `imagen` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `publicaciones` table. All the data in the column will be lost.
  - You are about to alter the column `titulo` on the `publicaciones` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `conversaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `miembros_conversacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios_mensajes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `destinatario_id` to the `mensajes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remitente_id` to the `mensajes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `publicaciones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."mensajes" DROP CONSTRAINT "mensajes_conversacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."mensajes" DROP CONSTRAINT "mensajes_remitenteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."miembros_conversacion" DROP CONSTRAINT "miembros_conversacion_conversacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."miembros_conversacion" DROP CONSTRAINT "miembros_conversacion_lastReadMsgId_fkey";

-- DropForeignKey
ALTER TABLE "public"."miembros_conversacion" DROP CONSTRAINT "miembros_conversacion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."publicaciones" DROP CONSTRAINT "publicaciones_autorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."usuarios_mensajes" DROP CONSTRAINT "usuarios_mensajes_mensajeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."usuarios_mensajes" DROP CONSTRAINT "usuarios_mensajes_usuarioId_fkey";

-- DropIndex
DROP INDEX "public"."mensajes_conversacionId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."publicaciones_autorId_idx";

-- AlterTable
ALTER TABLE "mensajes" DROP COLUMN "conversacionId",
DROP COLUMN "createdAt",
DROP COLUMN "remitenteId",
ADD COLUMN     "destinatario_id" INTEGER NOT NULL,
ADD COLUMN     "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "leido" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remitente_id" INTEGER NOT NULL,
ADD COLUMN     "tipo" VARCHAR(50) NOT NULL DEFAULT 'texto',
ALTER COLUMN "contenido" DROP NOT NULL;

-- AlterTable
ALTER TABLE "publicaciones" DROP COLUMN "autorId",
DROP COLUMN "campus",
DROP COLUMN "createdAt",
DROP COLUMN "descripcion",
DROP COLUMN "fechaPublicacion",
DROP COLUMN "imagen",
DROP COLUMN "precio",
DROP COLUMN "stock",
DROP COLUMN "updatedAt",
ADD COLUMN     "cuerpo" TEXT,
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usuario_id" INTEGER NOT NULL,
ADD COLUMN     "visto" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "titulo" DROP NOT NULL,
ALTER COLUMN "titulo" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "estado" DROP NOT NULL,
ALTER COLUMN "estado" DROP DEFAULT,
ALTER COLUMN "estado" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "public"."conversaciones";

-- DropTable
DROP TABLE "public"."miembros_conversacion";

-- DropTable
DROP TABLE "public"."usuarios";

-- DropTable
DROP TABLE "public"."usuarios_mensajes";

-- DropEnum
DROP TYPE "public"."Campus";

-- DropEnum
DROP TYPE "public"."ConversationType";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_producto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_transaccion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_reporte" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "estados_reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50),
    "correo" VARCHAR(255) NOT NULL,
    "usuario" VARCHAR(255) NOT NULL,
    "contrasena" VARCHAR(255),
    "rol_id" INTEGER NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campus" VARCHAR(100),
    "reputacion" DECIMAL(5,2) NOT NULL DEFAULT 0,

    CONSTRAINT "cuentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumen_usuario" (
    "usuario_id" INTEGER NOT NULL,
    "total_productos" INTEGER NOT NULL DEFAULT 0,
    "total_ventas" INTEGER NOT NULL DEFAULT 0,
    "total_compras" INTEGER NOT NULL DEFAULT 0,
    "promedio_calificacion" DECIMAL(3,2) NOT NULL DEFAULT 0,

    CONSTRAINT "resumen_usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "categoria_padre_id" INTEGER,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "categoria_id" INTEGER,
    "vendedor_id" INTEGER NOT NULL,
    "precio_anterior" DECIMAL(10,2),
    "precio_actual" DECIMAL(10,2) NOT NULL,
    "descripcion" TEXT,
    "calificacion" DECIMAL(3,2),
    "cantidad" INTEGER,
    "fecha_agregado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "url_imagen" TEXT,

    CONSTRAINT "imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foros" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "creador_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicaciones_foro" (
    "id" SERIAL NOT NULL,
    "foro_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "titulo" VARCHAR(255),
    "contenido" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicaciones_foro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentarios_publicacion" (
    "id" SERIAL NOT NULL,
    "publicacion_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "contenido" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id" SERIAL NOT NULL,
    "reportante_id" INTEGER NOT NULL,
    "usuario_reportado_id" INTEGER,
    "producto_id" INTEGER,
    "motivo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacciones" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "comprador_id" INTEGER NOT NULL,
    "vendedor_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_id" INTEGER NOT NULL,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones" (
    "id" SERIAL NOT NULL,
    "transaccion_id" INTEGER NOT NULL,
    "calificador_id" INTEGER NOT NULL,
    "calificado_id" INTEGER NOT NULL,
    "puntuacion" DECIMAL(3,2),
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo" VARCHAR(50),
    "mensaje" TEXT,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividad_usuario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "accion" VARCHAR(50),
    "detalles" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividad_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguidores" (
    "usuario_sigue_id" INTEGER NOT NULL,
    "usuario_seguido_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seguidores_pkey" PRIMARY KEY ("usuario_sigue_id","usuario_seguido_id")
);

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre_lugar" VARCHAR(255),
    "descripcion" TEXT,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricas_diarias" (
    "id" SERIAL NOT NULL,
    "fecha_metricas" DATE NOT NULL,
    "usuarios_activos" INTEGER NOT NULL DEFAULT 0,
    "nuevos_usuarios" INTEGER NOT NULL DEFAULT 0,
    "productos_creados" INTEGER NOT NULL DEFAULT 0,
    "transacciones_completadas" INTEGER NOT NULL DEFAULT 0,
    "mensajes_enviados" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "metricas_diarias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_correo_key" ON "cuentas"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_usuario_key" ON "cuentas"("usuario");

-- CreateIndex
CREATE INDEX "cuentas_rol_id_idx" ON "cuentas"("rol_id");

-- CreateIndex
CREATE INDEX "cuentas_estado_id_idx" ON "cuentas"("estado_id");

-- CreateIndex
CREATE INDEX "categorias_categoria_padre_id_idx" ON "categorias"("categoria_padre_id");

-- CreateIndex
CREATE INDEX "productos_estado_id_idx" ON "productos"("estado_id");

-- CreateIndex
CREATE INDEX "productos_categoria_id_idx" ON "productos"("categoria_id");

-- CreateIndex
CREATE INDEX "productos_vendedor_id_idx" ON "productos"("vendedor_id");

-- CreateIndex
CREATE INDEX "imagenes_producto_producto_id_idx" ON "imagenes_producto"("producto_id");

-- CreateIndex
CREATE INDEX "carrito_usuario_id_idx" ON "carrito"("usuario_id");

-- CreateIndex
CREATE INDEX "carrito_producto_id_idx" ON "carrito"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "carrito_usuario_id_producto_id_key" ON "carrito"("usuario_id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_usuario_id_producto_id_key" ON "favoritos"("usuario_id", "producto_id");

-- CreateIndex
CREATE INDEX "foros_creador_id_idx" ON "foros"("creador_id");

-- CreateIndex
CREATE INDEX "publicaciones_foro_foro_id_idx" ON "publicaciones_foro"("foro_id");

-- CreateIndex
CREATE INDEX "publicaciones_foro_autor_id_idx" ON "publicaciones_foro"("autor_id");

-- CreateIndex
CREATE INDEX "comentarios_publicacion_publicacion_id_idx" ON "comentarios_publicacion"("publicacion_id");

-- CreateIndex
CREATE INDEX "comentarios_publicacion_autor_id_idx" ON "comentarios_publicacion"("autor_id");

-- CreateIndex
CREATE INDEX "reportes_reportante_id_idx" ON "reportes"("reportante_id");

-- CreateIndex
CREATE INDEX "reportes_usuario_reportado_id_idx" ON "reportes"("usuario_reportado_id");

-- CreateIndex
CREATE INDEX "reportes_producto_id_idx" ON "reportes"("producto_id");

-- CreateIndex
CREATE INDEX "reportes_estado_id_idx" ON "reportes"("estado_id");

-- CreateIndex
CREATE INDEX "transacciones_producto_id_idx" ON "transacciones"("producto_id");

-- CreateIndex
CREATE INDEX "transacciones_comprador_id_idx" ON "transacciones"("comprador_id");

-- CreateIndex
CREATE INDEX "transacciones_vendedor_id_idx" ON "transacciones"("vendedor_id");

-- CreateIndex
CREATE INDEX "transacciones_estado_id_idx" ON "transacciones"("estado_id");

-- CreateIndex
CREATE INDEX "calificaciones_transaccion_id_idx" ON "calificaciones"("transaccion_id");

-- CreateIndex
CREATE INDEX "calificaciones_calificador_id_idx" ON "calificaciones"("calificador_id");

-- CreateIndex
CREATE INDEX "calificaciones_calificado_id_idx" ON "calificaciones"("calificado_id");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_idx" ON "notificaciones"("usuario_id");

-- CreateIndex
CREATE INDEX "actividad_usuario_usuario_id_idx" ON "actividad_usuario"("usuario_id");

-- CreateIndex
CREATE INDEX "seguidores_usuario_seguido_id_idx" ON "seguidores"("usuario_seguido_id");

-- CreateIndex
CREATE INDEX "ubicaciones_usuario_id_idx" ON "ubicaciones"("usuario_id");

-- CreateIndex
CREATE INDEX "mensajes_remitente_id_idx" ON "mensajes"("remitente_id");

-- CreateIndex
CREATE INDEX "mensajes_destinatario_id_idx" ON "mensajes"("destinatario_id");

-- CreateIndex
CREATE INDEX "publicaciones_usuario_id_idx" ON "publicaciones"("usuario_id");

-- AddForeignKey
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumen_usuario" ADD CONSTRAINT "resumen_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoria_padre_id_fkey" FOREIGN KEY ("categoria_padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_producto" ADD CONSTRAINT "imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foros" ADD CONSTRAINT "foros_creador_id_fkey" FOREIGN KEY ("creador_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones_foro" ADD CONSTRAINT "publicaciones_foro_foro_id_fkey" FOREIGN KEY ("foro_id") REFERENCES "foros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones_foro" ADD CONSTRAINT "publicaciones_foro_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_publicacion" ADD CONSTRAINT "comentarios_publicacion_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "publicaciones_foro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_publicacion" ADD CONSTRAINT "comentarios_publicacion_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_remitente_id_fkey" FOREIGN KEY ("remitente_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_reportante_id_fkey" FOREIGN KEY ("reportante_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuario_reportado_id_fkey" FOREIGN KEY ("usuario_reportado_id") REFERENCES "cuentas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados_reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados_transaccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_transaccion_id_fkey" FOREIGN KEY ("transaccion_id") REFERENCES "transacciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_calificador_id_fkey" FOREIGN KEY ("calificador_id") REFERENCES "cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_calificado_id_fkey" FOREIGN KEY ("calificado_id") REFERENCES "cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividad_usuario" ADD CONSTRAINT "actividad_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_usuario_sigue_id_fkey" FOREIGN KEY ("usuario_sigue_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_usuario_seguido_id_fkey" FOREIGN KEY ("usuario_seguido_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
