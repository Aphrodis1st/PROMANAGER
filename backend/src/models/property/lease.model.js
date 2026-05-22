import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('leases');
const unitsColl = () => db().collection('units');
const tenantsColl = () => db().collection('tenants');

export const createLease = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  if (data.unitId) {
    await unitsColl().doc(data.unitId).set({
      status: data.status === 'active' ? 'occupied' : 'reserved',
      tenantId: data.tenantId || '',
      leaseId: doc.id,
      updatedAt: new Date()
    }, { merge: true });
  }
  if (data.tenantId) {
    await tenantsColl().doc(data.tenantId).set({
      propertyId: data.propertyId || '',
      unitId: data.unitId || '',
      rentAmount: data.rentAmount || '',
      securityDeposit: data.securityDeposit || '',
      leaseStartDate: data.startDate || '',
      leaseEndDate: data.endDate || '',
      status: data.status === 'active' ? 'active' : 'pending',
      updatedAt: new Date()
    }, { merge: true });
  }
  return { id: doc.id, ...data };
};

export const getLeases = async (filters = {}) => {
  let query = coll().orderBy('createdAt', 'desc');
  if (filters.tenantId) query = query.where('tenantId', '==', filters.tenantId);
  if (filters.unitId) query = query.where('unitId', '==', filters.unitId);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getLeaseById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateLease = async (id, data) => {
  const ref = coll().doc(id);
  const existingDoc = await ref.get();
  const existing = existingDoc.exists ? existingDoc.data() : {};
  const merged = { ...existing, ...data };
  await ref.update({ ...data, updatedAt: new Date() });
  if (existing.unitId && existing.unitId !== merged.unitId) {
    await unitsColl().doc(existing.unitId).set({
      status: 'vacant',
      tenantId: '',
      leaseId: '',
      updatedAt: new Date()
    }, { merge: true });
  }
  if (merged.unitId) {
    await unitsColl().doc(merged.unitId).set({
      status: merged.status === 'active' ? 'occupied' : 'reserved',
      tenantId: merged.tenantId || '',
      leaseId: id,
      updatedAt: new Date()
    }, { merge: true });
  }
  if (merged.tenantId) {
    await tenantsColl().doc(merged.tenantId).set({
      propertyId: merged.propertyId || '',
      unitId: merged.unitId || '',
      rentAmount: merged.rentAmount || '',
      securityDeposit: merged.securityDeposit || '',
      leaseStartDate: merged.startDate || '',
      leaseEndDate: merged.endDate || '',
      status: merged.status === 'active' ? 'active' : 'pending',
      updatedAt: new Date()
    }, { merge: true });
  }
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteLease = async (id) => {
  const ref = coll().doc(id);
  const existingDoc = await ref.get();
  const existing = existingDoc.exists ? existingDoc.data() : {};
  await ref.delete();
  if (existing.unitId) {
    await unitsColl().doc(existing.unitId).set({
      status: 'vacant',
      tenantId: '',
      leaseId: '',
      updatedAt: new Date()
    }, { merge: true });
  }
  return { success: true };
};
