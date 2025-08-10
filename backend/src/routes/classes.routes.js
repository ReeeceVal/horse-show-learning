import { Router } from 'express';
import * as classes from '../controllers/classes.controller.js';
import { validate, validateParams } from '../middleware/validate.js';
import { ClassCreate, IdParam } from '../validation/schemas.js';
import { pageParams } from '../middleware/pagination.js';


const router = Router();

router.get('/', classes.list);
router.get('/:id', validateParams(IdParam), classes.getById);
router.post('/', validate(ClassCreate), classes.create);
router.put('/:id', validateParams(IdParam), validate(ClassCreate), classes.update);
router.delete('/:id', validateParams(IdParam), classes.remove);

export default router;
