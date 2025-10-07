import { beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '../src/repositories/prismaClient';

/**
 * Setup para tests con Prisma.
 * 
 * Estrategia: usar la misma BD de desarrollo pero con transacciones
 * que se revierten después de cada test (opción futura).
 * 
 * Para producción de tests, considera:
 * 1. SQLite in-memory (cambiar provider en schema.prisma para tests)
 * 2. Docker con PostgreSQL dedicado para tests
 * 3. Prisma test containers
 */

beforeAll(async () => {
  // Conectar a BD antes de todos los tests
  await prisma.$connect();
});

afterAll(async () => {
  // Desconectar después de todos los tests
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Opcional: limpiar datos de prueba antes de cada test
  // Descomentar si quieres limpiar la tabla cuentas entre tests:
  // await prisma.cuentas.deleteMany({ where: { correo: { contains: 'test' } } });
});
