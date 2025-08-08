"use strict";
// ============================================================================
// AgroKart Backend - Database Configuration
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
// Database configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');
const DB_NAME = process.env.DB_NAME || 'agrokart';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'password';
// Create Sequelize instance
exports.sequelize = new sequelize_1.Sequelize({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 20,
        min: 0,
        acquire: 60000,
        idle: 10000,
    },
});
/**
 * Initialize database connection
 */
const initializeDatabase = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        if (process.env.NODE_ENV === 'development') {
            // Sync models in development (this would run migrations in production)
            await exports.sequelize.sync({ alter: true });
            console.log('✅ Database synchronized');
        }
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
/**
 * Close database connection
 */
const closeDatabase = async () => {
    try {
        await exports.sequelize.close();
        console.log('✅ Database connection closed');
    }
    catch (error) {
        console.error('❌ Error closing database connection:', error);
        throw error;
    }
};
exports.closeDatabase = closeDatabase;
//# sourceMappingURL=database.js.map