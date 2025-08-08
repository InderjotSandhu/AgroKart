"use strict";
// ============================================================================
// AgroKart Backend - Error Handler Middleware
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_1 = require("express");
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    // Log error for debugging
    console.error('API Error:', {
        message: error.message,
        stack: error.stack,
        statusCode,
        path: req.path,
        method: req.method,
    });
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map