import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('vitalSigns');

export const createVitalSigns = async (data) => {
  try {
    console.log('Creating vital signs with data:', data);
    
    const vitalSignsData = {
      patientId: data.patientId,
      patientName: data.patientName,
      temperature: data.temperature ? {
        value: parseFloat(data.temperature),
        unit: data.tempUnit || 'C'
      } : null,
      bloodPressure: (data.systolic && data.diastolic) ? {
        systolic: parseFloat(data.systolic),
        diastolic: parseFloat(data.diastolic),
        map: data.calculated?.map ? parseFloat(data.calculated.map) : null
      } : null,
      heartRate: data.heartRate ? parseFloat(data.heartRate) : null,
      respiratoryRate: data.respiratoryRate ? parseFloat(data.respiratoryRate) : null,
      oxygenSaturation: data.spo2 ? parseFloat(data.spo2) : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      height: data.height ? parseFloat(data.height) : null,
      bloodGlucose: data.glucose ? parseFloat(data.glucose) : null,
      painScale: data.pain ? parseFloat(data.pain) : null,
      calculated: data.calculated || {},
      alerts: data.alerts || [],
      recordedBy: data.recordedBy || 'System',
      recordedAt: data.recordedAt ? new Date(data.recordedAt) : new Date(),
      notes: data.notes || '',
      createdAt: new Date()
    };

    // Remove null fields
    Object.keys(vitalSignsData).forEach(key => {
      if (vitalSignsData[key] === null) {
        delete vitalSignsData[key];
      }
    });

    console.log('Processed vital signs data:', vitalSignsData);
    
    const doc = await coll().add(vitalSignsData);
    console.log('Vital signs created with ID:', doc.id);
    
    return { id: doc.id, ...vitalSignsData };
  } catch (error) {
    console.error('Error creating vital signs:', error);
    throw error;
  }
};

export const getVitalSignsByPatient = async (patientId) => {
  try {
    console.log('Fetching vital signs for patient:', patientId);
    
    // First try simple query without orderBy (no index required)
    const snap = await coll()
      .where('patientId', '==', patientId)
      .get();
    
    console.log('Query successful, found', snap.docs.length, 'vital signs records');
    
    const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Sort in memory by recordedAt (newest first)
    const sorted = results.sort((a, b) => {
      const dateA = a.recordedAt?.toDate ? a.recordedAt.toDate() : new Date(a.recordedAt || 0);
      const dateB = b.recordedAt?.toDate ? b.recordedAt.toDate() : new Date(b.recordedAt || 0);
      return dateB - dateA;
    });
    
    return sorted.slice(0, 50); // Limit to 50 most recent
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    // Return empty array instead of throwing error
    return [];
  }
};

export const getLatestVitalSigns = async (patientId) => {
  try {
    console.log('Fetching latest vital signs for patient:', patientId);
    
    // Use simple query without orderBy
    const snap = await coll()
      .where('patientId', '==', patientId)
      .get();
    
    if (snap.empty) {
      console.log('No vital signs found for patient:', patientId);
      return null;
    }
    
    const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Sort by recordedAt (newest first) and take the first one
    const sorted = results.sort((a, b) => {
      const dateA = a.recordedAt?.toDate ? a.recordedAt.toDate() : new Date(a.recordedAt || 0);
      const dateB = b.recordedAt?.toDate ? b.recordedAt.toDate() : new Date(b.recordedAt || 0);
      return dateB - dateA;
    });
    
    console.log('Found latest vital signs:', sorted[0]?.id);
    return sorted[0] || null;
  } catch (error) {
    console.error('Error fetching latest vital signs:', error);
    return null;
  }
};

export const getVitalSignsById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateVitalSigns = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteVitalSigns = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};