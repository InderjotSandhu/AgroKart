// ============================================================================
// AgroKart Backend - Request Logger Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  
  // Log request start
  console.log(`📥 ${req.method} ${req.url} - ${req.ip}`);
  
  // Override res.end to log response time
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: () => void) {
    const duration = Date.now() - start;
    console.log(`📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    
    // Call the original end method
    return originalEnd.call(this, chunk, encoding, cb);
  };
  
  next();
};
