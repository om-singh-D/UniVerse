import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from '@/config';

// Import middleware
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';

// Import routes
import authRoutes from '@/routes/auth';
import confessionRoutes from '@/routes/confessions';
import marketplaceRoutes from '@/routes/marketplace';
import groupRoutes from '@/routes/groups';
import eventRoutes from '@/routes/events';
import notificationRoutes from '@/routes/notifications';
import adminRoutes from '@/routes/admin';
import uploadRoutes from '@/routes/upload';

const app: Application = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    },
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Basic middleware
app.use(compression());
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`/api/${config.API_VERSION}/auth`, authRoutes);
app.use(`/api/${config.API_VERSION}/confessions`, confessionRoutes);
app.use(`/api/${config.API_VERSION}/marketplace`, marketplaceRoutes);
app.use(`/api/${config.API_VERSION}/groups`, groupRoutes);
app.use(`/api/${config.API_VERSION}/events`, eventRoutes);
app.use(`/api/${config.API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${config.API_VERSION}/admin`, adminRoutes);
app.use(`/api/${config.API_VERSION}/upload`, uploadRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'UniVerse API is running',
    timestamp: new Date().toISOString(),
    version: config.API_VERSION,
    environment: config.NODE_ENV
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;