import { PrismaClient } from '@prisma/client';

/**
 * Cliente de Prisma singleton para reutilización en toda la app.
 * Evita crear múltiples instancias en desarrollo (hot reload).
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Desconectar Prisma al cerrar la app
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
