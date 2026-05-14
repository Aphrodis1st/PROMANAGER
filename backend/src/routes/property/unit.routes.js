import { Router } from 'express';
import * as controller from '../../controllers/property/unit.controller.js';

const router = Router();

router.post('/', controller.create);
router.post('/bulk-import', controller.bulkImport);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
