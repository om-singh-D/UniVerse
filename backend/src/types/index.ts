// Main type exports
export * from './auth';
export * from './api';
export * from './database';
// Global types
export interface BaseEntity {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
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