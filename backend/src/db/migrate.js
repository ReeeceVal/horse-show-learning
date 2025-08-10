// Tiny SQL-first migration runner. Tracks applied files in schema_migrations.
import fs from 'fs';
import path from 'path';
import url from 'url';
import { pool } from './pool.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '../../../db/migrations');

async function ensureTable() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id serial primary key,
      filename text UNIQUE NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function appliedFilenames() {
    const { rows } = await pool.query('SELECT filename FROM schema_migrations');
    return new Set(rows.map(r => r.filename));
}

async function run() {
    await ensureTable();
    const applied = await appliedFilenames();
    const files = fs
        .readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        if (applied.has(file)) {
            console.log('SKIP', file);
            continue;
        }
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        console.log('APPLY', file);
        await pool.query('BEGIN');
        try {
            await pool.query(sql);
            await pool.query('INSERT INTO schema_migrations(filename) VALUES ($1)', [file]);
            await pool.query('COMMIT');
        } catch (e) {
            await pool.query('ROLLBACK');
            console.error('FAILED', file, e.message);
            process.exitCode = 1;
            throw e;
        }
    }
    await pool.end();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});