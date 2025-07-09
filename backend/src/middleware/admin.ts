import { Request, Response, NextFunction } from 'express';

// Admin-only middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement admin authorization logic
    next();
  } catch (error) {
    res.status(403).json({ error: 'Admin access required' });
  }
};
