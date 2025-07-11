import app from './app';
import config from '@/config';
import prisma from '@/config/database';

// Database connection test
async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test passed');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🔄 Received ${signal}. Gracefully shutting down...`);
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start server
async function startServer(): Promise<void> {
  try {
    await connectDB();
    
    const server = app.listen(config.PORT, () => {
      console.log('🚀 UniVerse Backend Started Successfully!');
      console.log(`📍 Server running on port ${config.PORT}`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
      console.log(`📚 API Base URL: http://localhost:${config.PORT}/api/${config.API_VERSION}`);
      console.log(`❤️  Health Check: http://localhost:${config.PORT}/health`);
      console.log(`🔍 Database Studio: npx prisma studio`);
    });

    // Handle server errors
    server.on('error', (error: Error) => {
      console.error('❌ Server failed to start:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server only if this file is run directly
if (require.main === module) {
  startServer().catch(console.error);
}

export { startServer };