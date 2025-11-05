/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DM', 'GROUP');

-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('SAN_JOAQUIN', 'CASA_CENTRAL', 'OTRO');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "emailInstitucional" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicaciones" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "stock" INTEGER DEFAULT 0,
    "fechaPublicacion" DATE,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "precio" DECIMAL(12,2),
    "campus" "Campus",
    "imagen" TEXT,
    "autorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversaciones" (
    "id" SERIAL NOT NULL,
    "type" "ConversationType" NOT NULL DEFAULT 'DM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dmKey" TEXT,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "miembros_conversacion" (
    "conversacionId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "role" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadMsgId" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "miembros_conversacion_pkey" PRIMARY KEY ("conversacionId","usuarioId")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id" SERIAL NOT NULL,
    "conversacionId" INTEGER NOT NULL,
    "remitenteId" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_mensajes" (
    "mensajeId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "usuarios_mensajes_pkey" PRIMARY KEY ("mensajeId","usuarioId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_emailInstitucional_key" ON "usuarios"("emailInstitucional");

-- CreateIndex
CREATE INDEX "publicaciones_autorId_idx" ON "publicaciones"("autorId");

-- CreateIndex
CREATE UNIQUE INDEX "conversaciones_dmKey_key" ON "conversaciones"("dmKey");

-- CreateIndex
CREATE INDEX "miembros_conversacion_usuarioId_idx" ON "miembros_conversacion"("usuarioId");

-- CreateIndex
CREATE INDEX "mensajes_conversacionId_createdAt_idx" ON "mensajes"("conversacionId", "createdAt");

-- CreateIndex
CREATE INDEX "usuarios_mensajes_usuarioId_readAt_idx" ON "usuarios_mensajes"("usuarioId", "readAt");

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miembros_conversacion" ADD CONSTRAINT "miembros_conversacion_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miembros_conversacion" ADD CONSTRAINT "miembros_conversacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miembros_conversacion" ADD CONSTRAINT "miembros_conversacion_lastReadMsgId_fkey" FOREIGN KEY ("lastReadMsgId") REFERENCES "mensajes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_remitenteId_fkey" FOREIGN KEY ("remitenteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_mensajes" ADD CONSTRAINT "usuarios_mensajes_mensajeId_fkey" FOREIGN KEY ("mensajeId") REFERENCES "mensajes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_mensajes" ADD CONSTRAINT "usuarios_mensajes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
