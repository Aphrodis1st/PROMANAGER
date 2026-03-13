import { Router } from 'express';
import {
  create,
  getAll,
  getByPatient,
  markPaid,
  remove
} from '../../controllers/hospital/billing.controller.js';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.get('/patient/:patientId', getByPatient);
router.patch('/:id/pay', markPaid);
router.delete('/:id', remove);

export default router;