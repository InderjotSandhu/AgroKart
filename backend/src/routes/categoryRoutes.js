"use strict";
// ============================================================================
// AgroKart Backend - Category Routes
// ============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map