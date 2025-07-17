import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
  isAdmin: boolean;
  isVerified: boolean;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  username: string;
  year_of_study?: number;
  major?: string;
  bio?: string;
  profile_visibility?: 'public' | 'private' | 'friends_only';
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  tokens: TokenPair;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  year_of_study?: number;
  major?: string;
  profile_visibility?: 'public' | 'private' | 'friends_only';
}

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email?: boolean;
}

export interface MicrosoftProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface SocialAuthResponse extends AuthResponse {
  is_new_user: boolean;
}