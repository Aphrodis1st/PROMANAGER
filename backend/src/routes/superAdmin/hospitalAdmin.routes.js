import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  createHospitalAdmin,
  getAllHospitalAdmins,
  getHospitalAdminsByHospital,
  getHospitalAdmin,
  updateHospitalAdminStatus,
  resetHospitalAdminPassword,
  trackAdminActivity,
  deleteHospitalAdmin
} from '../../controllers/superAdmin/hospitalAdmin.controller.js';

const router = express.Router();

// Apply super admin auth to all routes
router.use(superAdminAuth);

router.post('/', createHospitalAdmin);
router.get('/', getAllHospitalAdmins);
router.get('/hospital/:hospitalId', getHospitalAdminsByHospital);
router.get('/:id', getHospitalAdmin);
router.patch('/:id/status', updateHospitalAdminStatus);
router.patch('/:id/reset-password', resetHospitalAdminPassword);
router.patch('/:id/track-activity', trackAdminActivity);
router.patch('/:id/hospital', async (req, res) => {
  try {
    const { hospitalId, docId } = req.body;
    const adminId = req.params.id !== 'null' ? req.params.id : docId;
    if (!adminId || adminId === 'null')
      return res.status(400).json({ success: false, error: 'Valid admin ID required' });
    if (!hospitalId)
      return res.status(400).json({ success: false, error: 'hospitalId required' });
    const { HospitalAdmin } = await import('../../models/superAdmin/hospitalAdmin.model.js');
    await HospitalAdmin.update(adminId, { hospitalId });
    res.json({ success: true, message: 'Hospital reassigned' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.delete('/:id', deleteHospitalAdmin);

export default router;