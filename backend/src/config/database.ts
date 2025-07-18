import { PrismaClient } from '@prisma/client';
import config from './index';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.__prisma || new PrismaClient({
  log: config.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: config.DATABASE_URL
    }
  }
});

if (config.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Connection event handlers
prisma.$on('beforeExit', async () => {
  console.log('🔌 Disconnecting from database...');
});

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

// Database health check
export const getDatabaseHealth = async () => {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    return {
      status: 'connected' as const,
      response_time: responseTime
    };
  } catch (error) {
    return {
      status: 'disconnected' as const,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default prisma;