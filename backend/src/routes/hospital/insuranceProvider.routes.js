import express from 'express';
import {
  createInsuranceProvider,
  getInsuranceProviders,
  getInsuranceProviderById,
  updateInsuranceProvider,
  deleteInsuranceProvider
} from '../../models/hospital/insuranceProvider.model.js';

const router = express.Router();

// GET /api/v1/hospital/insurance-providers
router.get('/', async (req, res) => {
  try {
    const providers = await getInsuranceProviders();
    res.json({ success: true, data: providers });
  } catch (error) {
    console.error('Get insurance providers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/hospital/insurance-providers/:id
router.get('/:id', async (req, res) => {
  try {
    const provider = await getInsuranceProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Insurance provider not found' });
    }
    res.json({ success: true, data: provider });
  } catch (error) {
    console.error('Get insurance provider error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/hospital/insurance-providers
router.post('/', async (req, res) => {
  try {
    console.log('Creating insurance provider:', req.body);
    const provider = await createInsuranceProvider(req.body);
    res.status(201).json({ success: true, data: provider });
  } catch (error) {
    console.error('Create insurance provider error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/hospital/insurance-providers/:id
router.put('/:id', async (req, res) => {
  try {
    const provider = await updateInsuranceProvider(req.params.id, req.body);
    res.json({ success: true, data: provider });
  } catch (error) {
    console.error('Update insurance provider error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/v1/hospital/insurance-providers/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteInsuranceProvider(req.params.id);
    res.json({ success: true, message: 'Insurance provider deleted successfully' });
  } catch (error) {
    console.error('Delete insurance provider error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;