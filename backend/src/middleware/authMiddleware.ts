// ============================================================================
// AgroKart Backend - Authentication Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // TODO: Implement JWT token verification
  console.log('Auth middleware called - not fully implemented yet');
  
  // For now, just proceed without authentication
  next();
};
