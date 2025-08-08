"use strict";
// ============================================================================
// AgroKart Backend - Rate Limiter Middleware
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_1 = require("express");
// Simple in-memory rate limiter (for production, use Redis)
const requestCounts = new Map();
const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per window
const rateLimiter = (req, res, next) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    // Get or create request count for this client
    let clientData = requestCounts.get(clientId);
    if (!clientData || now > clientData.resetTime) {
        // Reset the counter if window has expired
        clientData = {
            count: 0,
            resetTime: now + WINDOW_SIZE,
        };
    }
    clientData.count++;
    requestCounts.set(clientId, clientData);
    // Check if limit exceeded
    if (clientData.count > MAX_REQUESTS) {
        res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
        });
        return;
    }
    // Add rate limit headers
    res.set({
        'X-RateLimit-Limit': MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': Math.max(0, MAX_REQUESTS - clientData.count).toString(),
        'X-RateLimit-Reset': Math.ceil(clientData.resetTime / 1000).toString(),
    });
    next();
};
exports.rateLimiter = rateLimiter;
//# sourceMappingURL=rateLimiter.js.map