import express from 'express';
const router = express.Router();

// In-memory storage for treatment plans
let treatmentPlans = [
  {
    id: 'TP001',
    patientId: 'patient1',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    diagnosis: 'Type 2 Diabetes Mellitus',
    icd10Code: 'E11.9',
    treatmentGoals: 'Achieve HbA1c < 7%, maintain healthy weight, prevent complications',
    expectedOutcome: 'Improved glycemic control, reduced risk of complications',
    estimatedDuration: '6 months',
    therapyPlan: 'Metformin 1000mg BID, lifestyle modifications, regular monitoring',
    careType: 'Outpatient',
    treatmentPhase: 'Active',
    interventions: 'Medication management, dietary counseling, exercise program',
    medications: 'Metformin 1000mg BID, Atorvastatin 20mg QD',
    dietaryRestrictions: 'Low carbohydrate diet, limit sugar intake',
    nutritionPlan: 'Balanced diet with controlled portions, regular meal times',
    activityLevel: 'Moderate',
    physicalTherapy: 'Walking 30 minutes daily',
    reviewDate: '2024-04-15',
    followUpSchedule: 'Monthly follow-up visits',
    monitoringParameters: 'HbA1c, fasting glucose, lipid profile',
    warningSignsSymptoms: 'Hypoglycemia symptoms, vision changes, foot problems',
    planCreatedBy: 'doc1',
    doctorName: 'Dr. Smith',
    planDate: '2024-01-15',
    patientEducation: 'Diabetes self-management education provided',
    caregiverInstructions: 'Monitor blood glucose, ensure medication compliance',
    status: 'ACTIVE',
    recordType: 'TREATMENT_PLAN',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Get all treatment plans
router.get('/', async (req, res) => {
  try {
    res.json(treatmentPlans);
  } catch (error) {
    console.error('Error fetching treatment plans:', error);
    res.status(500).json({ message: 'Error fetching treatment plans', error: error.message });
  }
});

// Get treatment plan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = treatmentPlans.find(p => p.id === id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Treatment plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error fetching treatment plan:', error);
    res.status(500).json({ message: 'Error fetching treatment plan', error: error.message });
  }
});

// Get treatment plans by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patientPlans = treatmentPlans.filter(p => p.patientId === patientId);
    res.json(patientPlans);
  } catch (error) {
    console.error('Error fetching patient treatment plans:', error);
    res.status(500).json({ message: 'Error fetching patient treatment plans', error: error.message });
  }
});

// Create new treatment plan
router.post('/', async (req, res) => {
  try {
    const planData = req.body;
    
    // Generate unique ID
    const newId = `TP${String(treatmentPlans.length + 1).padStart(3, '0')}`;
    
    const newPlan = {
      id: newId,
      ...planData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    treatmentPlans.push(newPlan);
    
    console.log('✅ Treatment plan created:', newId);
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating treatment plan:', error);
    res.status(500).json({ message: 'Error creating treatment plan', error: error.message });
  }
});

// Update treatment plan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const index = treatmentPlans.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Treatment plan not found' });
    }
    
    treatmentPlans[index] = {
      ...treatmentPlans[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Treatment plan updated:', id);
    res.json(treatmentPlans[index]);
  } catch (error) {
    console.error('Error updating treatment plan:', error);
    res.status(500).json({ message: 'Error updating treatment plan', error: error.message });
  }
});

// Delete treatment plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = treatmentPlans.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Treatment plan not found' });
    }
    
    treatmentPlans.splice(index, 1);
    
    console.log('✅ Treatment plan deleted:', id);
    res.json({ message: 'Treatment plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting treatment plan:', error);
    res.status(500).json({ message: 'Error deleting treatment plan', error: error.message });
  }
});

export default router;
