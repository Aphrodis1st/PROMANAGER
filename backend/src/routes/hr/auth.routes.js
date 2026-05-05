import express from 'express';
import { 
  hrLogin, 
  completePassword,
  getHRMe, 
  updateAdminProfile, 
  changeAdminPassword,
  getAnalytics
} from '../../controllers/hr/auth.controller.js';
import { hrAuth } from '../../middleware/hrAuth.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'HR auth routes working' });
});

router.post('/login', hrLogin);
router.post('/complete-password', completePassword);
router.get('/me', hrAuth, getHRMe);
router.put('/profile', hrAuth, updateAdminProfile);
router.put('/password', hrAuth, changeAdminPassword);
router.get('/analytics', hrAuth, getAnalytics);

export default router;
