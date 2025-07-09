// Main configuration exports
export { default as database } from './database';
export { default as auth } from './auth';
export { default as upload } from './upload';

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/universe'
};

export default config;
