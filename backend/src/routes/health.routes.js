import { Router } from 'express';
import { healthCheck } from '../db/pool.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const dbOk = await healthCheck();
        res.json({ status: 'ok', db: dbOk ? 'ok' : 'down' });
    } catch (e) {
        next(e);
    }
});

export default router;