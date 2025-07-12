import { Request, Response } from 'express';
import { ApiError, ErrorCodes } from '@/types';

export const notFound = (req: Request, res: Response): void => {
  const errorResponse: ApiError = {
    success: false,
    error: {
      code: ErrorCodes.NOT_FOUND,
      message: `Endpoint ${req.method} ${req.path} not found`
    },
    timestamp: new Date().toISOString()
  };

  res.status(404).json(errorResponse);
};