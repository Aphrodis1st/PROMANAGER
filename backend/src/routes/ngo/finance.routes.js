import express from 'express';
import { 
  createFinance, 
  getAllFinances, 
  getFinance, 
  updateFinance, 
  deleteFinance,
  getFinancialSummary,
  getFinancesByProject
} from '../../controllers/ngo/finance.controller.js';

const router = express.Router();

router.post('/', createFinance);
router.get('/', getAllFinances);
router.get('/:id', getFinance);
router.get('/summary/:organizationId', getFinancialSummary);
router.get('/project/:projectId', getFinancesByProject);
router.put('/:id', updateFinance);
router.delete('/:id', deleteFinance);

export default router;
