import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove,
  discharge
} from '../../controllers/hospital/admission.controller.js';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);
router.put('/:id/discharge', discharge);

export default router;
