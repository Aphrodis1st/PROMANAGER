import express from 'express';
import * as performanceController from '../../controllers/hr/performance.controller.js';

const router = express.Router();

router.post('/', performanceController.createPerformance);
router.get('/', performanceController.getPerformance);
router.put('/:id', performanceController.updatePerformance);
router.delete('/:id', performanceController.deletePerformance);

export default router;
