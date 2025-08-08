"use strict";
// ============================================================================
// AgroKart Backend - Request Validation Middleware
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_1 = require("express");
const validateRequest = (schemaName) => {
    return (req, res, next) => {
        // TODO: Implement request validation using Joi
        console.log(`Validating request with schema: ${schemaName} - not fully implemented yet`);
        // For now, just proceed without validation
        next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map