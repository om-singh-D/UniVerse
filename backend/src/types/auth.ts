// Auth types
export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}
