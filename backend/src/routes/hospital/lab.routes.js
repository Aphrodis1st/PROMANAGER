import { Router } from 'express';
import {
  create,
  getAll,
  getByPatient,
  update,
  remove,
  getAllOrders,
  getOrderById,
  createOrder,
  submitResults
} from '../../controllers/hospital/lab.controller.js';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.get('/patient/:patientId', getByPatient);
router.put('/:id', update);
router.delete('/:id', remove);

router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);
router.put('/orders/:id/results', submitResults);

export default router;