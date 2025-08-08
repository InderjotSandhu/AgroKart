// ============================================================================
// AgroKart Backend - Order Routes
// ============================================================================

import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all order routes
router.use(authMiddleware);

/**
 * GET /api/orders
 * Get user orders
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Order routes not fully implemented yet',
    data: [],
  });
});

export default router;
