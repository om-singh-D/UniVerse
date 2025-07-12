import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError, ErrorCodes, ValidationError } from '@/types';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const validationErrors: ValidationError[] = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      const apiError: ApiError = {
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Validation failed',
          details: validationErrors
        },
        timestamp: new Date().toISOString()
      };

      res.status(400).json(apiError);
      return;
    }

    next();
  };
};