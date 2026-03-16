import {
  createVitalSigns,
  getVitalSignsByPatient,
  getLatestVitalSigns,
  getVitalSignsById,
  updateVitalSigns,
  deleteVitalSigns
} from '../../models/hospital/vitalSigns.model.js';

// CREATE
export const create = async (req, res) => {
  try {
    console.log('Creating vital signs with data:', req.body);
    
    const payload = {
      hospitalId: req.user?.hospitalId || 'default-hospital',
      ...req.body
    };

    const vitalSigns = await createVitalSigns(payload);
    console.log('Vital signs created successfully:', vitalSigns);
    res.status(201).json({ success: true, data: vitalSigns });
  } catch (err) {
    console.error('Create vital signs error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Internal server error',
      error: err.toString()
    });
  }
};

// GET BY PATIENT
export const getByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log('Controller: Getting vital signs for patient:', patientId);
    
    const vitalSigns = await getVitalSignsByPatient(patientId);
    console.log('Controller: Found', vitalSigns.length, 'vital signs records');
    
    res.json(vitalSigns);
  } catch (err) {
    console.error('Get vital signs by patient error:', err);
    // Return empty array instead of error to prevent frontend crashes
    res.json([]);
  }
};

// GET LATEST BY PATIENT
export const getLatestByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log('Controller: Getting latest vital signs for patient:', patientId);
    
    const latestVitalSigns = await getLatestVitalSigns(patientId);
    console.log('Controller: Latest vital signs result:', latestVitalSigns ? 'found' : 'not found');
    
    res.json(latestVitalSigns);
  } catch (err) {
    console.error('Get latest vital signs error:', err);
    // Return null instead of error
    res.json(null);
  }
};

// GET BY ID
export const getById = async (req, res) => {
  try {
    const vitalSigns = await getVitalSignsById(req.params.id);
    if (!vitalSigns) return res.status(404).json({ message: 'Vital signs not found' });
    res.json(vitalSigns);
  } catch (err) {
    console.error('Get vital signs by ID error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
export const update = async (req, res) => {
  try {
    const updated = await updateVitalSigns(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Update vital signs error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
export const remove = async (req, res) => {
  try {
    await deleteVitalSigns(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete vital signs error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET STATISTICS
export const getStats = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { days = 30 } = req.query;
    
    const vitalSigns = await getVitalSignsByPatient(patientId);
    
    // Filter by date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const filteredVitals = vitalSigns.filter(vital => {
      const recordedAt = vital.recordedAt?.toDate ? vital.recordedAt.toDate() : new Date(vital.recordedAt);
      return recordedAt >= startDate;
    });
    
    const stats = {
      totalRecords: filteredVitals.length,
      dateRange: {
        from: startDate,
        to: new Date()
      },
      trends: {
        temperature: filteredVitals.filter(v => v.temperature?.value).map(v => ({
          value: v.temperature.value,
          date: v.recordedAt?.toDate ? v.recordedAt.toDate() : new Date(v.recordedAt)
        })),
        bloodPressure: filteredVitals.filter(v => v.bloodPressure?.systolic).map(v => ({
          systolic: v.bloodPressure.systolic,
          diastolic: v.bloodPressure.diastolic,
          date: v.recordedAt?.toDate ? v.recordedAt.toDate() : new Date(v.recordedAt)
        })),
        heartRate: filteredVitals.filter(v => v.heartRate).map(v => ({
          value: v.heartRate,
          date: v.recordedAt?.toDate ? v.recordedAt.toDate() : new Date(v.recordedAt)
        }))
      }
    };
    
    res.json(stats);
  } catch (err) {
    console.error('Get vital signs stats error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};