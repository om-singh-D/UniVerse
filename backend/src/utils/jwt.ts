import jwt from 'jsonwebtoken';
import config from '../config';

// JWT utilities
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
