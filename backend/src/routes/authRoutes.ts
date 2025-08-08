// ============================================================================
// AgroKart Backend - Authentication Routes
// ============================================================================

import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/authMiddleware';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();
const authController = new AuthController();

// Authentication routes with rate limiting
router.use(rateLimiter);

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  validateRequest('register'),
  authController.register
);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT tokens
 */
router.post(
  '/login',
  validateRequest('login'),
  authController.login
);

/**
 * POST /api/auth/logout
 * Logout user (blacklist JWT token)
 */
router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  validateRequest('refresh'),
  authController.refreshToken
);

/**
 * GET /api/auth/verify
 * Verify JWT token validity
 */
router.get(
  '/verify',
  authMiddleware,
  authController.verifyToken
);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post(
  '/forgot-password',
  validateRequest('forgotPassword'),
  authController.forgotPassword
);

/**
 * POST /api/auth/reset-password
 * Reset password using reset token
 */
router.post(
  '/reset-password',
  validateRequest('resetPassword'),
  authController.resetPassword
);

/**
 * POST /api/auth/verify-email
 * Verify email address using verification token
 */
router.post(
  '/verify-email',
  validateRequest('verifyEmail'),
  authController.verifyEmail
);

/**
 * POST /api/auth/resend-verification
 * Resend email verification
 */
router.post(
  '/resend-verification',
  authMiddleware,
  authController.resendVerification
);

export default router;
