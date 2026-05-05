import express from 'express';
import * as payrollController from '../../controllers/hr/payroll.controller.js';

const router = express.Router();

router.post('/generate', payrollController.generatePayroll);
router.get('/', payrollController.getPayroll);
router.get('/organization', payrollController.getOrganizationPayroll);
router.get('/:id/payslip', payrollController.getPayslip);

export default router;
