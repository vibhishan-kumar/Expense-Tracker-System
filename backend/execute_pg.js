require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runPostgresInit() {
    const config = process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || process.env.DB_PASS || 'postgres',
            database: process.env.DB_NAME || 'expense_tracker'
        };

    console.log('Connecting to PostgreSQL database:', config.database || 'via connection string');
    const client = new Client(config);

    try {
        await client.connect();
        console.log('Connected to PostgreSQL successfully.');

        console.log('Running PostgreSQL DDL schema...');
        const ddl = fs.readFileSync(path.join(__dirname, '../schema_pg.sql'), 'utf-8');
        await client.query(ddl);
        console.log('DDL execution completed successfully.');

        console.log('Running PostgreSQL DML seed data...');
        const dml = fs.readFileSync(path.join(__dirname, '../seed_pg.sql'), 'utf-8');
        await client.query(dml);
        console.log('DML seed execution completed successfully.');

        await client.end();
        console.log('PostgreSQL Database Initialization Complete!');
    } catch (err) {
        console.error('Error during PostgreSQL initialization:', err);
        process.exit(1);
    }
}

runPostgresInit();
