import { pool } from '../db/pool.js';
import { ApiError } from '../middleware/errors.js';

export async function list(req, res, next) {
    try {
        const { limit = 25, offset = 0 } = req.page ?? {};
        const { rows } = await pool.query(
            'SELECT id, name, category, max_entries FROM class ORDER BY id',
            [limit, offset]
        );
        res.json(rows);
    } catch (e) { next(e); }
}

export async function getById(req, res, next) {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'SELECT id, name, category, max_entries FROM class WHERE id=$1',
            [id]
        );
        if (!rows.length) return next(new ApiError(404, 'Class not found'));
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function create(req, res, next) {
    try {
        const { name, category = null, max_entries = null } = req.body || {};
        const { rows } = await pool.query(
            `INSERT INTO class (name, category, max_entries)
       VALUES ($1, $2, $3)
       RETURNING id, name, category, max_entries`,
            [name, category, max_entries]
        );
        res.status(201).json(rows[0]);
    } catch (e) { next(e); }
}

export async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { name, category = null, max_entries = null } = req.body || {};
        const { rows } = await pool.query(
            `UPDATE class
         SET name=$1, category=$2, max_entries=$3
       WHERE id=$4
       RETURNING id, name, category, max_entries`,
            [name, category, max_entries, id]
        );
        if (!rows.length) return next(new ApiError(404, 'Class not found'));
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM class WHERE id=$1', [id]);
        if (!rowCount) return next(new ApiError(404, 'Class not found'));
        res.status(204).send();
    } catch (e) { next(e); }
}
