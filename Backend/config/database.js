const { PrismaClient } = require('@prisma/client')

// Loggea queries, warnings y errores de Prisma a consola:
const prisma = new PrismaClient({
  log: ['query', 'warn', 'error'],
})

module.exports = { prisma }
