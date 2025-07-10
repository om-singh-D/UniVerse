import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
  isAdmin: boolean;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  username: string;
  year_of_study?: number;
  major?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  tokens: TokenPair;
}

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}