import { Router } from 'express';
import * as entries from '../controllers/entries.controller.js';
import { validate, validateParams } from '../middleware/validate.js';
import { EntryCreate, IdParam } from '../validation/schemas.js';
import { pageParams } from '../middleware/pagination.js';


const router = Router();

router.get('/', entries.list);
router.get('/:id', validateParams(IdParam), entries.getById);
router.post('/', validate(EntryCreate), entries.create);
router.put('/:id', validateParams(IdParam), validate(EntryCreate), entries.update);
router.delete('/:id', validateParams(IdParam), entries.remove);

export default router;
