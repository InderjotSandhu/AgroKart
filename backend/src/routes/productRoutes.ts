// ============================================================================
// AgroKart Backend - Product Routes
// ============================================================================

import express from 'express';

const router = express.Router();

/**
 * GET /api/products
 * Get all products
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Product routes not fully implemented yet',
    data: [],
  });
});

export default router;
