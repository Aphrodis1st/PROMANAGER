import express from 'express';
import * as attendanceController from '../../controllers/hr/attendance.controller.js';

const router = express.Router();

router.post('/check-in', attendanceController.checkIn);
router.put('/:id/check-out', attendanceController.checkOut);
router.get('/', attendanceController.getAttendance);
router.get('/today', attendanceController.getTodayAttendance);

export default router;
