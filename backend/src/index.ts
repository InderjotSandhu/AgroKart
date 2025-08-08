// ============================================================================
// AgroKart Backend - Main Server Entry Point
// ============================================================================

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';

// Import database configuration
import { initializeDatabase } from './config/database';

// ============================================================================
// Server Configuration
// ============================================================================

const app: Application = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// Middleware Setup
// ============================================================================

// Security middleware
app.use(helmet({
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
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {\n  app.use(morgan('dev'));\n} else {\n  app.use(morgan('combined'));\n}\napp.use(requestLogger);\n\n// Rate limiting\napp.use(rateLimiter);\n\n// ============================================================================\n// Health Check Endpoint\n// ============================================================================\n\napp.get('/health', (req, res) => {\n  res.status(200).json({\n    success: true,\n    message: 'AgroKart API is running',\n    timestamp: new Date().toISOString(),\n    environment: NODE_ENV,\n    version: process.env.npm_package_version || '1.0.0',\n  });\n});\n\n// ============================================================================\n// API Routes\n// ============================================================================\n\nconst API_PREFIX = '/api';\n\napp.use(`${API_PREFIX}/auth`, authRoutes);\napp.use(`${API_PREFIX}/users`, userRoutes);\napp.use(`${API_PREFIX}/products`, productRoutes);\napp.use(`${API_PREFIX}/categories`, categoryRoutes);\napp.use(`${API_PREFIX}/orders`, orderRoutes);\n\n// API documentation endpoint\napp.get(`${API_PREFIX}`, (req, res) => {\n  res.json({\n    success: true,\n    message: 'AgroKart API v1.0.0',\n    documentation: 'https://github.com/agrokart/api-docs',\n    endpoints: {\n      auth: `${API_PREFIX}/auth`,\n      users: `${API_PREFIX}/users`,\n      products: `${API_PREFIX}/products`,\n      categories: `${API_PREFIX}/categories`,\n      orders: `${API_PREFIX}/orders`,\n    },\n  });\n});\n\n// ============================================================================\n// 404 Handler\n// ============================================================================\n\napp.use('*', (req, res) => {\n  res.status(404).json({\n    success: false,\n    message: 'Endpoint not found',\n    path: req.originalUrl,\n  });\n});\n\n// ============================================================================\n// Error Handling Middleware (must be last)\n// ============================================================================\n\napp.use(errorHandler);\n\n// ============================================================================\n// Server Startup\n// ============================================================================\n\nconst startServer = async (): Promise<void> => {\n  try {\n    // Initialize database connection\n    await initializeDatabase();\n    console.log('✅ Database connected successfully');\n\n    // Start the server\n    app.listen(PORT, () => {\n      console.log(`🚀 AgroKart API Server running on port ${PORT}`);\n      console.log(`📝 Environment: ${NODE_ENV}`);\n      console.log(`🌐 API Base URL: http://localhost:${PORT}${API_PREFIX}`);\n      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);\n      \n      if (NODE_ENV === 'development') {\n        console.log('\\n📚 Available Endpoints:');\n        console.log(`   • Auth: http://localhost:${PORT}${API_PREFIX}/auth`);\n        console.log(`   • Users: http://localhost:${PORT}${API_PREFIX}/users`);\n        console.log(`   • Products: http://localhost:${PORT}${API_PREFIX}/products`);\n        console.log(`   • Categories: http://localhost:${PORT}${API_PREFIX}/categories`);\n        console.log(`   • Orders: http://localhost:${PORT}${API_PREFIX}/orders`);\n      }\n    });\n  } catch (error) {\n    console.error('❌ Failed to start server:', error);\n    process.exit(1);\n  }\n};\n\n// Handle unhandled promise rejections\nprocess.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {\n  console.error('❌ Unhandled Promise Rejection:', reason);\n  console.error('Promise:', promise);\n  // Close server & exit process\n  process.exit(1);\n});\n\n// Handle uncaught exceptions\nprocess.on('uncaughtException', (error: Error) => {\n  console.error('❌ Uncaught Exception:', error);\n  process.exit(1);\n});\n\n// Graceful shutdown\nprocess.on('SIGTERM', () => {\n  console.log('📴 Received SIGTERM, shutting down gracefully');\n  process.exit(0);\n});\n\nprocess.on('SIGINT', () => {\n  console.log('📴 Received SIGINT, shutting down gracefully');\n  process.exit(0);\n});\n\n// Start the server\nstartServer();\n\n// Export app for testing\nexport default app;
