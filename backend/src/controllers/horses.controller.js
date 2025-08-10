import { pool } from '../db/pool.js';
import { ApiError } from '../middleware/errors.js';

export async function list(req, res, next) {
    try {
        const { limit = 25, offset = 0 } = req.page ?? {};
        const { rows } = await pool.query(
            'SELECT id, name, owner_name FROM horse ORDER BY id',
            [limit, offset]
        );
        res.json(rows);
    } catch (e) { next(e); }
}



export async function getById(req, res, next) {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'SELECT id, name, owner_name FROM horse WHERE id=$1',
            [id]
        );
        if (!rows.length) return next(new ApiError(404, 'Horse not found'));
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function create(req, res, next) {
    try {
        const { name, owner_name = null } = req.body || {};
        const { rows } = await pool.query(
            `INSERT INTO horse (name, owner_name)
       VALUES ($1, $2)
       RETURNING id, name, owner_name`,
            [name, owner_name]
        );
        res.status(201).json(rows[0]);
    } catch (e) { next(e); }
}

export async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { name, owner_name = null } = req.body || {};
        const { rows } = await pool.query(
            `UPDATE horse
         SET name=$1, owner_name=$2
       WHERE id=$3
       RETURNING id, name, owner_name`,
            [name, owner_name, id]
        );
        if (!rows.length) return next(new ApiError(404, 'Horse not found'));
        res.json(rows[0]);
    } catch (e) { next(e); }
}

export async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM horse WHERE id=$1', [id]);
        if (!rowCount) return next(new ApiError(404, 'Horse not found'));
        res.status(204).send();
    } catch (e) { next(e); }
}
