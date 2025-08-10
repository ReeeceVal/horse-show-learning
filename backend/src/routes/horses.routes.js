import { Router } from 'express';
import * as horses from '../controllers/horses.controller.js';
import { validate, validateParams } from '../middleware/validate.js';
import { pageParams } from '../middleware/pagination.js';
import { HorseCreate, IdParam } from '../validation/schemas.js';

const router = Router();

router.get('/', horses.list);
router.get('/:id', validateParams(IdParam), horses.getById);
router.post('/', validate(HorseCreate), horses.create);
router.put('/:id', validateParams(IdParam), validate(HorseCreate), horses.update);
router.delete('/:id', validateParams(IdParam), horses.remove);

export default router;
