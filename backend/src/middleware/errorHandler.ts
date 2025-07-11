import { Request, Response, NextFunction } from 'express';
import { ApiError, ErrorCodes } from '@/types';
import config from '@/config';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.code || ErrorCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    errorCode = ErrorCodes.DATABASE_ERROR;
    message = 'Database operation failed';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = ErrorCodes.AUTHENTICATION_ERROR;
    message = 'Invalid token';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = ErrorCodes.VALIDATION_ERROR;
  }

  const errorResponse: ApiError = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(config.NODE_ENV === 'development' && { details: err.stack })
    },
    timestamp: new Date().toISOString()
  };

  // Log error in development
  if (config.NODE_ENV === 'development') {
    console.error('🚨 Error:', err);
  }

  res.status(statusCode).json(errorResponse);
};