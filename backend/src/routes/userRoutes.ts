// ============================================================================
// AgroKart Backend - User Routes
// ============================================================================

import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'User routes not fully implemented yet',
    data: null,
  });
});

export default router;
