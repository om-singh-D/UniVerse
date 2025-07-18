import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload, ApiError, ErrorCodes } from '@/types';
import { userService } from '@/services/user.service';
import { verifyToken } from '@/utils/jwt';
import { sendError, sendUnauthorized, sendForbidden } from '@/utils/response';
import config from '@/config';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Access token required');
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      sendUnauthorized(res, 'Access token required');
      return;
    }

    // Verify and decode token
    const decoded = verifyToken(token);
    
    // Find user
    const user = await userService.findById(decoded.userId);

    if (!user) {
      sendUnauthorized(res, 'User not found');
      return;
    }

    if (!user.is_active) {
      sendUnauthorized(res, 'Account is deactivated');
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error: any) {
    if (error.message === 'Token has expired') {
      sendError(res, ErrorCodes.TOKEN_EXPIRED, 'Token has expired', 401);
    } else if (error.message === 'Invalid token') {
      sendUnauthorized(res, 'Invalid token');
    } else {
      console.error('Authentication error:', error);
      sendUnauthorized(res, 'Authentication failed');
    }
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    sendUnauthorized(res, 'Authentication required');
    return;
  }

  if (!req.user.is_admin) {
    sendForbidden(res, 'Admin privileges required');
    return;
  }

  next();
};

export const requireVerified = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    sendUnauthorized(res, 'Authentication required');
    return;
  }

  if (!req.user.is_verified) {
    sendForbidden(res, 'Email verification required');
    return;
  }

  next();
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = verifyToken(token);
      const user = await userService.findById(decoded.userId);
      
      if (user && user.is_active) {
        req.user = user;
      }
    } catch (error) {
      // Ignore invalid tokens for optional auth
      console.debug('Optional auth failed:', error);
    }
  }

  next();
};

export const requireOwnershipOrAdmin = (resourceUserIdField: string = 'user_id') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
    
    if (req.user.is_admin || req.user.id === parseInt(resourceUserId)) {
      next();
    } else {
      sendForbidden(res, 'You can only access your own resources');
    }
  };
};

export const rateLimitByUser = (maxRequests: number, windowMs: number) => {
  const userRequests = new Map<number, { count: number; resetTime: number }>();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    const userId = req.user.id;
    const now = Date.now();
    const userLimit = userRequests.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      userRequests.set(userId, { count: 1, resetTime: now + windowMs });
      next();
    } else if (userLimit.count < maxRequests) {
      userLimit.count++;
      next();
    } else {
      sendError(res, ErrorCodes.RATE_LIMIT_EXCEEDED, 'Rate limit exceeded for user', 429);
    }
  };
};