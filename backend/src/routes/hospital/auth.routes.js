import express from 'express';
import { 
  hospitalLogin, 
  completePassword,
  getHospitalMe, 
  updateAdminProfile, 
  changeAdminPassword,
  updateHospitalSettings,
  getAnalytics
} from '../../controllers/hospital/auth.controller.js';
import { hospitalAuth } from '../../middleware/hospitalAuth.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Hospital auth routes working' });
});

router.post('/login', hospitalLogin);
router.post('/complete-password', completePassword);
router.get('/me', hospitalAuth, getHospitalMe);
router.put('/profile', hospitalAuth, updateAdminProfile);
router.put('/password', hospitalAuth, changeAdminPassword);
router.put('/settings', hospitalAuth, updateHospitalSettings);
router.get('/analytics', hospitalAuth, getAnalytics);

export default router;
