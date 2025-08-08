"use strict";
// ============================================================================
// AgroKart Backend - User Routes
// ============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply auth middleware to all user routes
router.use(authMiddleware_1.authMiddleware);
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
exports.default = router;
//# sourceMappingURL=userRoutes.js.map