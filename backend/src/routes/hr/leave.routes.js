import express from 'express';
import * as leaveController from '../../controllers/hr/leave.controller.js';

const router = express.Router();

router.post('/', leaveController.createLeave);
router.get('/', leaveController.getLeaves);
router.get('/pending', leaveController.getPendingLeaves);
router.put('/:id/approve', leaveController.approveLeave);
router.put('/:id/reject', leaveController.rejectLeave);

export default router;
