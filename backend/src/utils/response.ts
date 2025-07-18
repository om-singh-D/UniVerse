import { Response } from 'express';
import { ApiResponse, ApiError, ErrorCodes } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    request_id: uuidv4()
  };

  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: any,
  field?: string
): void => {
  const response: ApiError = {
    success: false,
    error: {
      code,
      message,
      details,
      field
    },
    timestamp: new Date().toISOString(),
    request_id: uuidv4()
  };

  res.status(statusCode).json(response);
};

export const sendValidationError = (
  res: Response,
  errors: Array<{ field: string; message: string; value?: any }>,
  message: string = 'Validation failed'
): void => {
  sendError(res, ErrorCodes.VALIDATION_ERROR, message, 400, errors);
};

export const sendNotFound = (res: Response, resource: string = 'Resource'): void => {
  sendError(res, ErrorCodes.NOT_FOUND, `${resource} not found`, 404);
};

export const sendUnauthorized = (res: Response, message: string = 'Authentication required'): void => {
  sendError(res, ErrorCodes.AUTHENTICATION_ERROR, message, 401);
};

export const sendForbidden = (res: Response, message: string = 'Insufficient permissions'): void => {
  sendError(res, ErrorCodes.AUTHORIZATION_ERROR, message, 403);
};

export const sendInternalError = (res: Response, message: string = 'Internal server error'): void => {
  sendError(res, ErrorCodes.INTERNAL_SERVER_ERROR, message, 500);
};

export const sendBadRequest = (res: Response, message: string = 'Bad request'): void => {
  sendError(res, ErrorCodes.VALIDATION_ERROR, message, 400);
};

export const sendConflict = (res: Response, message: string = 'Resource already exists'): void => {
  sendError(res, ErrorCodes.ALREADY_EXISTS, message, 409);
};

export const sendRateLimitError = (res: Response): void => {
  sendError(res, ErrorCodes.RATE_LIMIT_EXCEEDED, 'Rate limit exceeded. Please try again later.', 429);
};

// Pagination helpers
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  },
  message?: string
) => {
  sendSuccess(res, { data, pagination }, message);
};

// Bulk operation response
export const sendBulkOperationResponse = <T>(
  res: Response,
  results: {
    success_count: number;
    error_count: number;
    errors: Array<{ index: number; error: string }>;
    results: T[];
  },
  message?: string
) => {
  const statusCode = results.error_count > 0 ? 207 : 200; // 207 Multi-Status
  sendSuccess(res, results, message, statusCode);
};

// Health check response
export const sendHealthCheck = (
  res: Response,
  health: {
    status: 'healthy' | 'unhealthy';
    uptime: number;
    version: string;
    environment: string;
    database: any;
    redis?: any;
  }
) => {
  const statusCode = health.status === 'healthy' ? 200 : 503;
  sendSuccess(res, health, undefined, statusCode);
};

// File upload response
export const sendFileUploadSuccess = (
  res: Response,
  files: Array<{
    filename: string;
    originalname: string;
    size: number;
    mimetype: string;
    url: string;
  }>,
  message: string = 'Files uploaded successfully'
) => {
  sendSuccess(res, { files, count: files.length }, message, 201);
};

// Generic create response
export const sendCreateSuccess = <T>(res: Response, data: T, message?: string): void => {
  sendSuccess(res, data, message || 'Resource created successfully', 201);
};

// Generic update response
export const sendUpdateSuccess = <T>(res: Response, data: T, message?: string): void => {
  sendSuccess(res, data, message || 'Resource updated successfully');
};

// Generic delete response
export const sendDeleteSuccess = (res: Response, message?: string): void => {
  sendSuccess(res, null, message || 'Resource deleted successfully', 204);
};