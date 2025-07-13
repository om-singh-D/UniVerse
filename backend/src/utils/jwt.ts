import jwt from 'jsonwebtoken';
import { JWTPayload, TokenPair } from '@/types';
import config from '@/config';

export const generateTokenPair = (payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair => {
  const access_token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });

  const refresh_token = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE
  });

  // Calculate expiry in seconds
  const expires_in = 7 * 24 * 60 * 60; // 7 days in seconds

  return {
    access_token,
    refresh_token,
    expires_in
  };
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;
};