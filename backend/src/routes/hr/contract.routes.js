import express from 'express';
import * as contractController from '../../controllers/hr/contract.controller.js';

const router = express.Router();

router.post('/', contractController.createContract);
router.get('/', contractController.getContracts);
router.get('/expiring', contractController.getExpiringContracts);
router.put('/:id', contractController.updateContract);

export default router;
