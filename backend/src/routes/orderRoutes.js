"use strict";
// ============================================================================
// AgroKart Backend - Order Routes
// ============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply auth middleware to all order routes
router.use(authMiddleware_1.authMiddleware);
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
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map