import jwt from 'jsonwebtoken';
import { JWTPayload, TokenPair } from '@/types';
import config from '@/config';
import { v4 as uuidv4 } from 'uuid';

export const generateTokenPair = (payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair => {
  const tokenId = uuidv4();
  
  const jwtPayload = {
    ...payload,
    jti: tokenId // JWT ID for token tracking
  };
  
  const access_token = jwt.sign(jwtPayload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
    algorithm: 'HS256',
    issuer: 'universe-api',
    audience: 'universe-app'
  });

  const refresh_token = jwt.sign(jwtPayload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE,
    algorithm: 'HS256',
    issuer: 'universe-api',
    audience: 'universe-app'
  });

  // Calculate expiry in seconds
  const expiresInSeconds = parseTimeToSeconds(config.JWT_EXPIRE);

  return {
    access_token,
    refresh_token,
    expires_in: expiresInSeconds,
    token_type: 'Bearer'
  };
};

export const verifyToken = (token: string, secret: string = config.JWT_SECRET): JWTPayload => {
  try {
    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'universe-api',
      audience: 'universe-app'
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Token not active yet');
    }
    throw new Error('Token verification failed');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return verifyToken(token, config.JWT_REFRESH_SECRET);
};

export const decodeTokenWithoutVerification = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const getTokenExpiryTime = (token: string): Date | null => {
  const decoded = decodeTokenWithoutVerification(token);
  if (decoded?.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
};

export const isTokenExpired = (token: string): boolean => {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return true;
  return Date.now() >= expiryTime.getTime();
};

// Helper function to parse time strings like "7d", "24h", "30m" to seconds
const parseTimeToSeconds = (timeString: string): number => {
  const timeValue = parseInt(timeString.slice(0, -1));
  const timeUnit = timeString.slice(-1);
  
  switch (timeUnit) {
    case 's': return timeValue;
    case 'm': return timeValue * 60;
    case 'h': return timeValue * 60 * 60;
    case 'd': return timeValue * 24 * 60 * 60;
    case 'w': return timeValue * 7 * 24 * 60 * 60;
    default: return 24 * 60 * 60; // Default to 24 hours
  }
};

// Generate a secure random token for password resets, email verification, etc.
export const generateSecureToken = (): string => {
  return uuidv4().replace(/-/g, '') + Date.now().toString(36);
};

// Validate JWT token format
export const isValidJWTFormat = (token: string): boolean => {
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  return jwtRegex.test(token);
};