import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload, ApiError, ErrorCodes } from '@/types';
import { userService } from '@/services/user.service';
import config from '@/config';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const error: ApiError = {
        success: false,
        error: {
          code: ErrorCodes.AUTHENTICATION_ERROR,
          message: 'Access denied. No token provided.'
        },
        timestamp: new Date().toISOString()
      };
      res.status(401).json(error);
      return;
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    const user = await userService.findById(decoded.userId);

    if (!user || !user.is_active) {
      const error: ApiError = {
        success: false,
        error: {
          code: ErrorCodes.AUTHENTICATION_ERROR,
          message: 'Invalid token or user deactivated.'
        },
        timestamp: new Date().toISOString()
      };
      res.status(401).json(error);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    const apiError: ApiError = {
      success: false,
      error: {
        code: ErrorCodes.AUTHENTICATION_ERROR,
        message: 'Invalid token.'
      },
      timestamp: new Date().toISOString()
    };
    res.status(401).json(apiError);
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.is_admin) {
    const error: ApiError = {
      success: false,
      error: {
        code: ErrorCodes.AUTHORIZATION_ERROR,
        message: 'Admin access required.'
      },
      timestamp: new Date().toISOString()
    };
    res.status(403).json(error);
    return;
  }
  next();
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
      const user = await userService.findById(decoded.userId);
      if (user && user.is_active) {
        req.user = user;
      }
    } catch (error) {
      // Ignore invalid tokens for optional auth
    }
  }

  next();
};