"use strict";
// ============================================================================
// AgroKart Backend - Authentication Middleware
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const express_1 = require("express");
const authMiddleware = (req, res, next) => {
    // TODO: Implement JWT token verification
    console.log('Auth middleware called - not fully implemented yet');
    // For now, just proceed without authentication
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map