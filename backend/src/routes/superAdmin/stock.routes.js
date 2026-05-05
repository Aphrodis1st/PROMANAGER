import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  createStock,
  getAllStocks,
  getStock,
  updateStock,
  updateStockStatus,
  updateStockFeatures,
  softDeleteStock,
  hardDeleteStock
} from '../../controllers/superAdmin/stock.controller.js';

const router = express.Router();

router.use(superAdminAuth);

router.post('/', createStock);
router.get('/', getAllStocks);
router.get('/:id', getStock);
router.put('/:id', updateStock);
router.patch('/:id/status', updateStockStatus);
router.patch('/:id/features', updateStockFeatures);
router.patch('/:id/soft-delete', softDeleteStock);
router.delete('/:id', hardDeleteStock);

export default router;
