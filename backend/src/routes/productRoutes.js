"use strict";
// ============================================================================
// AgroKart Backend - Product Routes
// ============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
//# sourceMappingURL=productRoutes.js.map