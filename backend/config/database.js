require('dotenv').config();
const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || (process.env.DATABASE_URL?.startsWith('postgres') ? 'postgres' : 'mysql');
let sequelize;

if (dialect === 'postgres') {
    if (process.env.DATABASE_URL) {
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            dialectOptions: process.env.DB_SSL === 'true' ? {
                ssl: { require: true, rejectUnauthorized: false }
            } : {},
            logging: false,
        });
    } else {
        sequelize = new Sequelize(
            process.env.DB_NAME || 'expense_tracker',
            process.env.DB_USER || 'postgres',
            process.env.DB_PASSWORD || process.env.DB_PASS || 'postgres',
            {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                dialect: 'postgres',
                logging: false,
            }
        );
    }
} else {
    // MySQL configuration
    const mysql = require('mysql2/promise');

    const ensureDatabaseExists = async () => {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
            });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
            await connection.end();
        } catch (err) {
            console.error('Error verifying MySQL database:', err);
        }
    };

    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    });

    sequelize._ensureDatabaseExists = ensureDatabaseExists;
}

const connectDB = async () => {
    try {
        if (dialect === 'mysql' && sequelize._ensureDatabaseExists) {
            await sequelize._ensureDatabaseExists();
        }
        await sequelize.authenticate();
        console.log(`Sequelize connected successfully using [${dialect.toUpperCase()}].`);
    } catch (error) {
        console.error(`Unable to connect to the ${dialect} database:`, error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB, dialect };
