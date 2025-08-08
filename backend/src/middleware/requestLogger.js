"use strict";
// ============================================================================
// AgroKart Backend - Request Logger Middleware
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const express_1 = require("express");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log request start
    console.log(`📥 ${req.method} ${req.url} - ${req.ip}`);
    // Override res.end to log response time
    const originalEnd = res.end;
    res.end = function (chunk, encoding, cb) {
        const duration = Date.now() - start;
        console.log(`📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        // Call the original end method
        return originalEnd.call(this, chunk, encoding, cb);
    };
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=requestLogger.js.map