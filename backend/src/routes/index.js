import { Router } from 'express';
import health from './health.routes.js';
import riders from './riders.routes.js';
import horses from './horses.routes.js';
import classesRoutes from './classes.routes.js';
import entries from './entries.routes.js';

const router = Router();
router.use('/health', health);
router.use('/riders', riders);
router.use('/horses', horses);
router.use('/classes', classesRoutes);
router.use('/entries', entries);

export default router;