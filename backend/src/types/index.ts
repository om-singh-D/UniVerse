export * from './auth';
export * from './api';
export * from './database';

// Global utility types
export interface BaseEntity {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  category?: string;
  status?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchQuery extends PaginationQuery {
  q?: string;
  filters?: Record<string, any>;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}