import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('vitalSigns');

export const createVitalSigns = async (data) => {
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

  const doc = await coll().add(vitalSignsData);
  return { id: doc.id, ...vitalSignsData };
};

export const getVitalSignsByPatient = async (patientId) => {
  const snap = await coll()
    .where('patientId', '==', patientId)
    .orderBy('recordedAt', 'desc')
    .limit(50)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getLatestVitalSigns = async (patientId) => {
  const snap = await coll()
    .where('patientId', '==', patientId)
    .orderBy('recordedAt', 'desc')
    .limit(1)
    .get();
  
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
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