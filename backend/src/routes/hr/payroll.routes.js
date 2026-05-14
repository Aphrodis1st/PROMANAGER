import express from 'express';
import * as payrollController from '../../controllers/hr/payroll.controller.js';

const router = express.Router();

// Payroll generation
router.post('/generate', payrollController.generatePayroll);
router.post('/bulk-generate', payrollController.bulkGeneratePayroll);

// Payroll CRUD operations
router.get('/', payrollController.getPayroll);
router.get('/organization', payrollController.getOrganizationPayroll);
router.get('/stats', payrollController.getPayrollStats);
router.get('/:id', payrollController.getPayslip);
router.put('/:id', payrollController.updatePayroll);
router.delete('/:id', payrollController.deletePayroll);

// Payroll workflow
router.patch('/:id/approve', payrollController.approvePayroll);
router.patch('/:id/process', payrollController.processPayroll);

// Legacy route for backward compatibility
router.get('/:id/payslip', payrollController.getPayslip);

export default router;
