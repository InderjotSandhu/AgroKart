import { Sequelize } from 'sequelize';
export declare const sequelize: Sequelize;
/**
 * Initialize database connection
 */
export declare const initializeDatabase: () => Promise<void>;
/**
 * Close database connection
 */
export declare const closeDatabase: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map