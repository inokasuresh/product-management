const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/productdb';
// const connectionString = process.env.DATABASE_URL || 'jdbc:mysql://localhost:3306/productdb';

const pool = new Pool({
    connectionString,
});

async function query(text, params) {
    return pool.query(text, params);
}

async function runMigrations() {
    const migrationFile = path.join(__dirname, 'migrations', '001-create-products.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    await pool.query(sql);
    console.log('Migrations applied');
}

module.exports = {
    query,
    pool,
    runMigrations
};
