import { PrismaClient } from '@prisma/client';
import config from './index';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.__prisma || new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (config.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export default prisma;