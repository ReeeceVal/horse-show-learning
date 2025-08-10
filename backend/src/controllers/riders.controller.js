import { pool } from '../db/pool.js';
import { ApiError } from '../middleware/errors.js';

export async function list(req, res, next) {
    try {
        const { limit = 25, offset = 0 } = req.page ?? {};
        const { rows } = await pool.query(
            'SELECT id, full_name, phone, email FROM rider ORDER BY id',
            [limit, offset]
        );
        res.json(rows);
    } catch (e) { next(e); }
}




export async function getById(req, res, next) {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'SELECT id, full_name, phone, email FROM rider WHERE id=$1',
            [id]
        );
        if (!rows.length) return next(new ApiError(404, 'Rider not found'));
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function create(req, res, next) {
    try {
        const { full_name, phone = null, email = null } = req.body || {};
        const { rows } = await pool.query(
            `INSERT INTO rider (full_name, phone, email)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, phone, email`,
            [full_name, phone, email]
        );
        res.status(201).json(rows[0]);
    } catch (e) { next(e); }
}

export async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { full_name, phone = null, email = null } = req.body || {};
        const { rows } = await pool.query(
            `UPDATE rider
         SET full_name=$1, phone=$2, email=$3
       WHERE id=$4
       RETURNING id, full_name, phone, email`,
            [full_name, phone, email, id]
        );
        if (!rows.length) return next(new ApiError(404, 'Rider not found'));
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM rider WHERE id=$1', [id]);
        if (!rowCount) return next(new ApiError(404, 'Rider not found'));
        res.status(204).send();
    } catch (e) { next(e); }
}
