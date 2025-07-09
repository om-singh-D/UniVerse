import { ApiResponse } from '../types/api';

// Response formatters
export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
  return {
    success: true,
    data,
    message
  };
};

export const errorResponse = (error: string, message?: string): ApiResponse => {
  return {
    success: false,
    error,
    message
  };
};

export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
