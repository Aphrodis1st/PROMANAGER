import { Router } from 'express';
import {
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByPharmacy,
  updatePrescriptionStatus,
  updatePrescriptionPrice,
  markPrescriptionPaid
} from '../../models/prescription.model.js';

const router = Router();

// Get all prescriptions (hospital staff)
router.get('/', async (req, res) => {
  try {
    console.log('🏥 Getting all hospital prescriptions...');
    
    // Get all prescriptions from Firebase
    const { db } = await import('../../utils/firebase.js');
    const snapshot = await db().collection('prescriptions').orderBy('createdAt', 'desc').get();
    
    const prescriptions = [];
    snapshot.forEach(doc => {
      prescriptions.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`📋 Found ${prescriptions.length} prescriptions`);
    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get prescriptions by patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log('🏥 Getting prescriptions for patient:', patientId);
    
    // Get prescriptions for specific patient from Firebase
    const { db } = await import('../../utils/firebase.js');
    const snapshot = await db().collection('prescriptions')
      .where('patientId', '==', patientId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const prescriptions = [];
    snapshot.forEach(doc => {
      prescriptions.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`📋 Found ${prescriptions.length} prescriptions for patient ${patientId}`);
    res.json(prescriptions);
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create prescription (hospital staff)
router.post('/', async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
      createdBy: req.body.createdBy || 'hospital-staff',
      createdAt: new Date(),
      status: 'PENDING'
    };
    
    console.log('🏥 Creating hospital prescription:', prescriptionData);
    const prescription = await createPrescription(prescriptionData);
    console.log('✅ Hospital prescription created:', prescription);
    
    res.status(201).json(prescription);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Failed to create prescription' });
  }
});

// Get prescription by ID
router.get('/:id', async (req, res) => {
  try {
    const prescription = await getPrescriptionById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update prescription
router.put('/:id', async (req, res) => {
  try {
    const prescription = await getPrescriptionById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Update prescription in Firebase
    const { db } = await import('../../utils/firebase.js');
    await db().collection('prescriptions').doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date()
    });
    
    const updatedPrescription = await getPrescriptionById(req.params.id);
    res.json(updatedPrescription);
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete prescription
router.delete('/:id', async (req, res) => {
  try {
    const prescription = await getPrescriptionById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Delete prescription from Firebase
    const { db } = await import('../../utils/firebase.js');
    await db().collection('prescriptions').doc(req.params.id).delete();
    
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;