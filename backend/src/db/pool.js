import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // keep off for local dev; remove or tweak for prod
});

export async function healthCheck() {
    const { rows } = await pool.query('SELECT 1 as ok');
    return rows[0]?.ok === 1;
}
