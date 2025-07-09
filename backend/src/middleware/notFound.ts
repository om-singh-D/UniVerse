import { Request, Response, NextFunction } from 'express';

// 404 handler middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not found' });
};
