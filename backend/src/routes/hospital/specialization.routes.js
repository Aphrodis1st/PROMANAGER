import { Router } from 'express';
import {
  create,
  getByDept,
  update,
  remove
} from '../../controllers/hospital/specialization.controller.js';

const router = Router();

router.post('/', create);
router.get('/department/:departmentId', getByDept);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;