/*
  Warnings:

  - The `url_imagen` column on the `imagenes_producto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `contrasena` on table `cuentas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."calificaciones" DROP CONSTRAINT "calificaciones_calificado_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."calificaciones" DROP CONSTRAINT "calificaciones_calificador_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transacciones" DROP CONSTRAINT "transacciones_comprador_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transacciones" DROP CONSTRAINT "transacciones_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transacciones" DROP CONSTRAINT "transacciones_vendedor_id_fkey";

-- DropIndex
DROP INDEX "public"."carrito_usuario_id_producto_id_key";

-- AlterTable
ALTER TABLE "cuentas" ALTER COLUMN "contrasena" SET NOT NULL;

-- AlterTable
ALTER TABLE "imagenes_producto" DROP COLUMN "url_imagen",
ADD COLUMN     "url_imagen" BYTEA;

-- AlterTable
ALTER TABLE "productos" ALTER COLUMN "precio_actual" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_comprador_id_fkey" FOREIGN KEY ("comprador_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_calificador_id_fkey" FOREIGN KEY ("calificador_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_calificado_id_fkey" FOREIGN KEY ("calificado_id") REFERENCES "cuentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
