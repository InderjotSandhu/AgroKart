#!/usr/bin/env node

/**
 * AgroKart Database Setup Script
 * 
 * This script sets up the AgroKart database by running all migrations
 * in the correct order and optionally seeding with sample data.
 * 
 * Usage:
 *   node setup.js                    # Run migrations only
 *   node setup.js --seed            # Run migrations and seed data
 *   node setup.js --reset           # Drop all tables and recreate
 *   node setup.js --help            # Show help
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Configuration
const config = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'agrokart_dev'
};

// Get command line arguments
const args = process.argv.slice(2);
const shouldSeed = args.includes('--seed');
const shouldReset = args.includes('--reset');
const showHelp = args.includes('--help') || args.includes('-h');

// Help text
const helpText = `
AgroKart Database Setup Script

Usage:
  node setup.js [options]

Options:
  --seed     Run migrations and seed with sample data
  --reset    Drop all tables and recreate (DESTRUCTIVE)
  --help     Show this help message

Environment Variables:
  DB_USER    Database username (default: postgres)
  DB_PASS    Database password (default: password)
  DB_HOST    Database host (default: localhost)
  DB_PORT    Database port (default: 5432)
  DB_NAME    Database name (default: agrokart_dev)

Examples:
  node setup.js                    # Run migrations only
  node setup.js --seed            # Run migrations and seed data
  node setup.js --reset --seed    # Reset database and seed data
`;

if (showHelp) {
    console.log(helpText);
    process.exit(0);
}

// Utility functions
const log = {
    info: (msg) => console.log(`ℹ️  ${msg}`),
    success: (msg) => console.log(`✅ ${msg}`),
    error: (msg) => console.error(`❌ ${msg}`),
    warning: (msg) => console.warn(`⚠️  ${msg}`)
};

// Get all migration files in order
function getMigrationFiles() {
    const migrationDir = path.join(__dirname, '..', 'migrations');
    
    if (!fs.existsSync(migrationDir)) {
        throw new Error('Migration directory not found');
    }
    
    const files = fs.readdirSync(migrationDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Files should be named with numeric prefix
    
    return files.map(file => path.join(migrationDir, file));
}

// Get all seed files in order
function getSeedFiles() {
    const seedDir = path.join(__dirname, '..', 'seeds');
    
    if (!fs.existsSync(seedDir)) {
        return [];
    }
    
    const files = fs.readdirSync(seedDir)
        .filter(file => file.endsWith('.sql'))
        .sort();
    
    return files.map(file => path.join(seedDir, file));
}

// Execute SQL file
async function executeSqlFile(client, filePath) {
    const sql = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    try {
        log.info(`Executing ${fileName}...`);
        await client.query(sql);
        log.success(`Completed ${fileName}`);
    } catch (error) {
        log.error(`Failed to execute ${fileName}: ${error.message}`);
        throw error;
    }
}

// Drop all tables (for reset)
async function dropAllTables(client) {
    log.warning('Dropping all tables...');
    
    const dropTablesQuery = `
        DO $$ DECLARE
            r RECORD;
        BEGIN
            -- Drop all tables
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
            
            -- Drop all types
            FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
                EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
            END LOOP;
            
            -- Drop all functions
            FOR r IN (SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
                EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.proname) || ' CASCADE';
            END LOOP;
        END $$;
    `;
    
    await client.query(dropTablesQuery);
    log.success('All tables dropped');
}

// Main setup function
async function setupDatabase() {
    const client = new Client(config);
    
    try {
        // Connect to database
        log.info('Connecting to database...');
        await client.connect();
        log.success('Connected to database');
        
        // Reset database if requested
        if (shouldReset) {
            await dropAllTables(client);
        }
        
        // Run migrations
        log.info('Starting database migrations...');
        const migrationFiles = getMigrationFiles();
        
        if (migrationFiles.length === 0) {
            log.warning('No migration files found');
        } else {
            for (const filePath of migrationFiles) {
                await executeSqlFile(client, filePath);
            }
            log.success(`Completed ${migrationFiles.length} migrations`);
        }
        
        // Run seeds if requested
        if (shouldSeed) {
            log.info('Starting database seeding...');
            const seedFiles = getSeedFiles();
            
            if (seedFiles.length === 0) {
                log.warning('No seed files found');
            } else {
                for (const filePath of seedFiles) {
                    await executeSqlFile(client, filePath);
                }
                log.success(`Completed ${seedFiles.length} seed files`);
            }
        }
        
        // Verify setup
        log.info('Verifying database setup...');
        const tableCountResult = await client.query(`
            SELECT COUNT(*) as table_count 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        const tableCount = parseInt(tableCountResult.rows[0].table_count);
        log.success(`Database setup complete! Created ${tableCount} tables`);
        
    } catch (error) {
        log.error(`Database setup failed: ${error.message}`);
        process.exit(1);
    } finally {
        await client.end();
        log.info('Database connection closed');
    }
}

// Run setup
if (require.main === module) {
    log.info('AgroKart Database Setup Starting...');
    log.info(`Target database: ${config.host}:${config.port}/${config.database}`);
    
    if (shouldReset) {
        log.warning('⚠️  RESET MODE: All existing data will be lost!');
    }
    if (shouldSeed) {
        log.info('🌱 Seeding mode enabled');
    }
    
    setupDatabase()
        .then(() => {
            log.success('🎉 Database setup completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            log.error(`Setup failed: ${error.message}`);
            process.exit(1);
        });
}

module.exports = {
    setupDatabase,
    getMigrationFiles,
    getSeedFiles,
    executeSqlFile
};
