import express from 'express';
const router = express.Router();

// In-memory storage for surgery records (replace with database in production)
let surgeryRecords = [
  {
    id: 'SRG001',
    patientId: 'patient1',
    patientName: 'John Doe',
    patientAge: 45,
    patientGender: 'Male',
    patientBloodType: 'O+',
    procedureName: 'Appendectomy',
    procedureCode: '44950',
    surgeon: 'doc1',
    surgeonName: 'Dr. Smith',
    assistant: 'doc2',
    assistantName: 'Dr. Johnson',
    anesthesiologist: 'doc3',
    anesthesiologistName: 'Dr. Williams',
    surgeryDate: '2024-01-15',
    startTime: '09:00',
    endTime: '11:30',
    anesthesiaType: 'General',
    preOpDiagnosis: 'Acute appendicitis',
    postOpDiagnosis: 'Acute appendicitis with perforation',
    operativeFindings: 'Perforated appendix with localized peritonitis',
    procedureDetails: 'Laparoscopic appendectomy performed. Three ports used. Appendix identified, isolated, and removed.',
    complications: 'None',
    bloodLoss: '50ml',
    postOpPlan: 'NPO for 24 hours, IV antibiotics, pain management, ambulation on POD 1',
    recoveryRoom: 'Recovery Room 3',
    hospitalName: 'E-Hospital System',
    hospitalLicense: 'HL-2024-001',
    accreditation: 'JCI',
    surgicalSuite: 'OR-3',
    equipmentUsed: 'Laparoscopic tower, insufflator, energy device',
    nursingStaff: 'RN Sarah Johnson, RN Mike Davis',
    technicalStaff: 'Surgical Tech Tom Wilson',
    qualityAssurance: 'WHO Surgical Safety Checklist completed, Time-out performed',
    infectionControl: 'Standard sterile technique, prophylactic antibiotics administered',
    professionalNotes: 'Procedure completed without complications. Patient tolerated well.',
    status: 'COMPLETED',
    recordType: 'SURGERY',
    createdBy: 'doc1',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  }
];

// Get all surgery records
router.get('/', async (req, res) => {
  try {
    res.json(surgeryRecords);
  } catch (error) {
    console.error('Error fetching surgery records:', error);
    res.status(500).json({ message: 'Error fetching surgery records', error: error.message });
  }
});

// Get surgery record by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const surgeryRecord = surgeryRecords.find(record => record.id === id);
    
    if (!surgeryRecord) {
      return res.status(404).json({ message: 'Surgery record not found' });
    }
    
    res.json(surgeryRecord);
  } catch (error) {
    console.error('Error fetching surgery record:', error);
    res.status(500).json({ message: 'Error fetching surgery record', error: error.message });
  }
});

// Get surgery records by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const patientSurgeries = surgeryRecords.filter(record => record.patientId === patientId);
    res.json(patientSurgeries);
  } catch (error) {
    console.error('Error fetching patient surgery records:', error);
    res.status(500).json({ message: 'Error fetching patient surgery records', error: error.message });
  }
});

// Create new surgery record
router.post('/', async (req, res) => {
  try {
    const surgeryData = req.body;
    
    // Generate unique ID
    const newId = `SRG${String(surgeryRecords.length + 1).padStart(3, '0')}`;
    
    const newSurgeryRecord = {
      id: newId,
      ...surgeryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    surgeryRecords.push(newSurgeryRecord);
    
    console.log('✅ Surgery record created:', newId);
    res.status(201).json(newSurgeryRecord);
  } catch (error) {
    console.error('Error creating surgery record:', error);
    res.status(500).json({ message: 'Error creating surgery record', error: error.message });
  }
});

// Update surgery record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const index = surgeryRecords.findIndex(record => record.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Surgery record not found' });
    }
    
    surgeryRecords[index] = {
      ...surgeryRecords[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Surgery record updated:', id);
    res.json(surgeryRecords[index]);
  } catch (error) {
    console.error('Error updating surgery record:', error);
    res.status(500).json({ message: 'Error updating surgery record', error: error.message });
  }
});

// Delete surgery record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = surgeryRecords.findIndex(record => record.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Surgery record not found' });
    }
    
    surgeryRecords.splice(index, 1);
    
    console.log('✅ Surgery record deleted:', id);
    res.json({ message: 'Surgery record deleted successfully' });
  } catch (error) {
    console.error('Error deleting surgery record:', error);
    res.status(500).json({ message: 'Error deleting surgery record', error: error.message });
  }
});

export default router;
