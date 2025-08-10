import { Router } from 'express';
import * as riders from '../controllers/riders.controller.js';
import { validate, validateParams } from '../middleware/validate.js';
import { pageParams } from '../middleware/pagination.js';
import { RiderCreate, IdParam } from '../validation/schemas.js';

const router = Router();

router.get('/', riders.list);
router.get('/:id', validateParams(IdParam), riders.getById);
router.post('/', validate(RiderCreate), riders.create);
router.put('/:id', validateParams(IdParam), validate(RiderCreate), riders.update);
router.delete('/:id', validateParams(IdParam), riders.remove);


export default router;


