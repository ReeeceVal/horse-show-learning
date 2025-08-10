import { pool } from '../db/pool.js';
import { ApiError } from '../middleware/errors.js';

export async function list(req, res, next) {
    try {
        const { limit = 25, offset = 0 } = req.page ?? {};
        const { rows } = await pool.query(
            `SELECT e.id,
              e.rider_id, r.full_name AS rider_name,
              e.horse_id, h.name AS horse_name
         FROM entry e
         JOIN rider r ON r.id = e.rider_id
         JOIN horse h ON h.id = e.horse_id
        ORDER BY e.id`,
            [limit, offset]
        );
        res.json(rows);
    } catch (e) { next(e); }
}

export async function getById(req, res, next) {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            `SELECT e.id,
              e.rider_id, r.full_name AS rider_name,
              e.horse_id, h.name AS horse_name
         FROM entry e
         JOIN rider r ON r.id = e.rider_id
         JOIN horse h ON h.id = e.horse_id
        WHERE e.id = $1`,
            [id]
        );
        if (!rows.length) return next(new ApiError(404, 'Entry not found'));

        const { rows: cls } = await pool.query(
            'SELECT class_id FROM entry_class WHERE entry_id = $1 ORDER BY class_id',
            [id]
        );

        res.json({ ...rows[0], class_ids: cls.map(c => c.class_id) });
    } catch (e) { next(e); }
}

export async function create(req, res, next) {
    const client = await pool.connect();
    try {
        const { rider_id, horse_id, class_ids = [] } = req.body || {};
        await client.query('BEGIN');

        // ensure FKs
        const r = await client.query('SELECT 1 FROM rider WHERE id=$1', [rider_id]);
        const h = await client.query('SELECT 1 FROM horse WHERE id=$1', [horse_id]);
        if (!r.rowCount) throw new ApiError(400, 'rider_id does not exist');
        if (!h.rowCount) throw new ApiError(400, 'horse_id does not exist');

        // insert entry
        const { rows: eRows } = await client.query(
            'INSERT INTO entry (rider_id, horse_id) VALUES ($1,$2) RETURNING id, rider_id, horse_id',
            [rider_id, horse_id]
        );
        const entry = eRows[0];

        // enforce class capacity and insert links
        for (const cid of class_ids) {
            const { rows: cap } = await client.query(
                `SELECT c.max_entries,
                (SELECT COUNT(*) FROM entry_class ec WHERE ec.class_id = $1) AS current_count
           FROM class c
          WHERE c.id = $1`,
                [cid]
            );
            if (!cap.length) throw new ApiError(400, `class_id ${cid} does not exist`);
            const { max_entries, current_count } = cap[0];
            if (max_entries !== null && Number(current_count) >= max_entries) {
                throw new ApiError(400, `class_id ${cid} is full`);
            }
            await client.query(
                'INSERT INTO entry_class (entry_id, class_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
                [entry.id, cid]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(entry);
    } catch (e) {
        await client.query('ROLLBACK'); // use the same client!
        next(e);
    } finally {
        client.release();
    }
}

export async function update(req, res, next) {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { rider_id, horse_id, class_ids = [] } = req.body || {};
        await client.query('BEGIN');

        // ensure entry exists
        const current = await client.query('SELECT id FROM entry WHERE id=$1', [id]);
        if (!current.rowCount) throw new ApiError(404, 'Entry not found');

        // ensure FKs
        const r = await client.query('SELECT 1 FROM rider WHERE id=$1', [rider_id]);
        const h = await client.query('SELECT 1 FROM horse WHERE id=$1', [horse_id]);
        if (!r.rowCount) throw new ApiError(400, 'rider_id does not exist');
        if (!h.rowCount) throw new ApiError(400, 'horse_id does not exist');

        // update entry
        const { rows: eRows } = await client.query(
            `UPDATE entry
          SET rider_id=$1, horse_id=$2
        WHERE id=$3
        RETURNING id, rider_id, horse_id`,
            [rider_id, horse_id, id]
        );
        const entry = eRows[0];

        // replace classes: clear then re-insert with capacity checks
        await client.query('DELETE FROM entry_class WHERE entry_id=$1', [id]);

        for (const cid of class_ids) {
            const { rows: cap } = await client.query(
                `SELECT c.max_entries,
                (SELECT COUNT(*) FROM entry_class ec WHERE ec.class_id = $1) AS current_count
           FROM class c
          WHERE c.id = $1`,
                [cid]
            );
            if (!cap.length) throw new ApiError(400, `class_id ${cid} does not exist`);
            const { max_entries, current_count } = cap[0];
            if (max_entries !== null && Number(current_count) >= max_entries) {
                throw new ApiError(400, `class_id ${cid} is full`);
            }
            await client.query(
                'INSERT INTO entry_class (entry_id, class_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
                [id, cid]
            );
        }

        await client.query('COMMIT');
        res.json(entry);
    } catch (e) {
        await client.query('ROLLBACK');
        next(e);
    } finally {
        client.release();
    }
}

export async function remove(req, res, next) {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM entry WHERE id=$1', [id]);
        if (!rowCount) return next(new ApiError(404, 'Entry not found'));
        // entry_class rows cascade-delete via FK ON DELETE CASCADE
        res.status(204).send();
    } catch (e) { next(e); }
}
