// ============================================================================
// AgroKart Backend - Category Routes
// ============================================================================

import express from 'express';

const router = express.Router();

/**
 * GET /api/categories
 * Get all categories
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Category routes not fully implemented yet',
    data: [],
  });
});

export default router;
