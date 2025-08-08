"use strict";
// ============================================================================
// AgroKart Backend - Main Server Entry Point
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const requestLogger_1 = require("./middleware/requestLogger");
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
// Import database configuration
const database_1 = require("./config/database");
// ============================================================================
// Server Configuration
// ============================================================================
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
// ============================================================================
// Middleware Setup
// ============================================================================
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Compression middleware
app.use((0, compression_1.default)());
// Logging middleware
if (NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.use(requestLogger_1.requestLogger);
// Rate limiting
app.use(rateLimiter_1.rateLimiter);
// ============================================================================
// Health Check Endpoint
// ============================================================================
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AgroKart API is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
    });
});
// ============================================================================
// API Routes
// ============================================================================
const API_PREFIX = '/api';
app.use(`${API_PREFIX}/auth`, authRoutes_1.default);
app.use(`${API_PREFIX}/users`, userRoutes_1.default);
app.use(`${API_PREFIX}/products`, productRoutes_1.default);
app.use(`${API_PREFIX}/categories`, categoryRoutes_1.default);
app.use(`${API_PREFIX}/orders`, orderRoutes_1.default);
// API documentation endpoint
app.get(`${API_PREFIX}`, (req, res) => {
    res.json({
        success: true,
        message: 'AgroKart API v1.0.0',
        documentation: 'https://github.com/agrokart/api-docs',
        endpoints: {
            auth: `${API_PREFIX}/auth`,
            users: `${API_PREFIX}/users`,
            products: `${API_PREFIX}/products`,
            categories: `${API_PREFIX}/categories`,
            orders: `${API_PREFIX}/orders`,
        },
    });
});
// ============================================================================
// 404 Handler
// ============================================================================
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl,
    });
});
// ============================================================================
// Error Handling Middleware (must be last)
// ============================================================================
app.use(errorHandler_1.errorHandler);
// ============================================================================
// Server Startup
// ============================================================================
const startServer = async () => {
    try {
        // Initialize database connection
        await (0, database_1.initializeDatabase)();
        console.log('✅ Database connected successfully');
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 AgroKart API Server running on port ${PORT}`);
            console.log(`📝 Environment: ${NODE_ENV}`);
            console.log(`🌐 API Base URL: http://localhost:${PORT}${API_PREFIX}`);
            console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
            if (NODE_ENV === 'development') {
                console.log('\n📚 Available Endpoints:');
                console.log(`   • Auth: http://localhost:${PORT}${API_PREFIX}/auth`);
                console.log(`   • Users: http://localhost:${PORT}${API_PREFIX}/users`);
                console.log(`   • Products: http://localhost:${PORT}${API_PREFIX}/products`);
                console.log(`   • Categories: http://localhost:${PORT}${API_PREFIX}/categories`);
                console.log(`   • Orders: http://localhost:${PORT}${API_PREFIX}/orders`);
            }
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    console.error('Promise:', promise);
    // Close server & exit process
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('📴 Received SIGINT, shutting down gracefully');
    process.exit(0);
});
// Start the server
startServer();
// Export app for testing
exports.default = app;
//# sourceMappingURL=index.js.map