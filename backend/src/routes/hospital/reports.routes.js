import express from 'express';
import { generateHospitalReport } from '../../controllers/hospital/hospitalReport.controller.js';
import { generatePatientReport } from '../../controllers/hospital/patientReport.controller.js';
import { generateMedicalRecordReport } from '../../controllers/hospital/medicalRecordReport.controller.js';
import { generateFinancialReport } from '../../controllers/hospital/financialReport.controller.js';
import { generateDepartmentReport } from '../../controllers/hospital/departmentReport.controller.js';
import { generateLabReport } from '../../controllers/hospital/labReport.controller.js';
import { generateAuditReport } from '../../controllers/hospital/auditReport.controller.js';
import { generateDashboardReport } from '../../controllers/hospital/dashboardReport.controller.js';
import { hospitalAuth } from '../../middleware/hospitalAuth.js';

const router = express.Router();

// Dashboard overview report
router.get('/dashboard', hospitalAuth, generateDashboardReport);

// Comprehensive hospital report
router.get('/comprehensive', hospitalAuth, generateHospitalReport);

// Specific module reports
router.get('/patients', hospitalAuth, generatePatientReport);
router.get('/medical-records', hospitalAuth, generateMedicalRecordReport);
router.get('/financial', hospitalAuth, generateFinancialReport);
router.get('/departments', hospitalAuth, generateDepartmentReport);
router.get('/lab', hospitalAuth, generateLabReport);
router.get('/audit', hospitalAuth, generateAuditReport);

export default router;