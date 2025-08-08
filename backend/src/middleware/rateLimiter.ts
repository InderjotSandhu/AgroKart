// ============================================================================
// AgroKart Backend - Rate Limiter Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (for production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per window

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  // Get or create request count for this client
  let clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset the counter if window has expired
    clientData = {
      count: 0,
      resetTime: now + WINDOW_SIZE,
    };
  }
  
  clientData.count++;
  requestCounts.set(clientId, clientData);
  
  // Check if limit exceeded
  if (clientData.count > MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
    return;
  }
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': Math.max(0, MAX_REQUESTS - clientData.count).toString(),
    'X-RateLimit-Reset': Math.ceil(clientData.resetTime / 1000).toString(),
  });
  
  next();
};
