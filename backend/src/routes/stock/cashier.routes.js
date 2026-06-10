import express from 'express';
import { CashierController } from '../../controllers/stock/cashier.controller.js';
import { requireAuth } from '../../middleware/stock/auth.js';

const router = express.Router();

// Complete a sale
router.post('/complete-sale', requireAuth, CashierController.completeSale);

// Get shift sales
router.get('/shift-sales', requireAuth, CashierController.getShiftSales);

// Hold a sale
router.post('/hold-sale', requireAuth, CashierController.holdSale);

// Recall a held sale
router.put('/recall-sale/:saleId', requireAuth, CashierController.recallSale);

// Get held sales
router.get('/held-sales', requireAuth, CashierController.getHeldSales);

// Generate receipt
router.get('/receipt/:saleId', requireAuth, CashierController.generateReceipt);

// End shift
router.post('/end-shift', requireAuth, CashierController.endShift);

export default router;
