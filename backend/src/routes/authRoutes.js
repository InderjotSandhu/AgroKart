"use strict";
// ============================================================================
// AgroKart Backend - Authentication Routes
// ============================================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const validateRequest_1 = require("../middleware/validateRequest");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
const authController = new AuthController_1.AuthController();
// Authentication routes with rate limiting
router.use(rateLimiter_1.rateLimiter);
/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (0, validateRequest_1.validateRequest)('register'), authController.register);
/**
 * POST /api/auth/login
 * Authenticate user and return JWT tokens
 */
router.post('/login', (0, validateRequest_1.validateRequest)('login'), authController.login);
/**
 * POST /api/auth/logout
 * Logout user (blacklist JWT token)
 */
router.post('/logout', authMiddleware_1.authMiddleware, authController.logout);
/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', (0, validateRequest_1.validateRequest)('refresh'), authController.refreshToken);
/**
 * GET /api/auth/verify
 * Verify JWT token validity
 */
router.get('/verify', authMiddleware_1.authMiddleware, authController.verifyToken);
/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post('/forgot-password', (0, validateRequest_1.validateRequest)('forgotPassword'), authController.forgotPassword);
/**
 * POST /api/auth/reset-password
 * Reset password using reset token
 */
router.post('/reset-password', (0, validateRequest_1.validateRequest)('resetPassword'), authController.resetPassword);
/**
 * POST /api/auth/verify-email
 * Verify email address using verification token
 */
router.post('/verify-email', (0, validateRequest_1.validateRequest)('verifyEmail'), authController.verifyEmail);
/**
 * POST /api/auth/resend-verification
 * Resend email verification
 */
router.post('/resend-verification', authMiddleware_1.authMiddleware, authController.resendVerification);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map