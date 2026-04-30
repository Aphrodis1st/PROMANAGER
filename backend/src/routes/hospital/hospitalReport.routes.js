import express from 'express';
import { generateHospitalReport } from '../../controllers/hospital/hospitalReport.controller.js';
import { hospitalAuth } from '../../middleware/hospitalAuth.js';

const router = express.Router();

router.get('/generate', hospitalAuth, generateHospitalReport);

export default router;