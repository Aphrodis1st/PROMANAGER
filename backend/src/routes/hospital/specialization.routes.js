import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import {
  create,
  getByDept,
  update,
  remove
} from '../../controllers/hospital/specialization.controller.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN'), create);
router.get('/department/:departmentId', requireAuth, getByDept);
router.put('/:id', requireAuth, requireRole('ADMIN'), update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), remove);

export default router;