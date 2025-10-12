import { beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '../src/repositories/prismaClient';


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
