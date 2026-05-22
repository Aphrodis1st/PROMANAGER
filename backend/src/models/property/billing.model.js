import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('propertyBilling');

const toNumber = (value) => Number.parseFloat(value) || 0;

const normalizeInvoiceTotals = (data = {}) => {
  const items = Array.isArray(data.items) ? data.items : [];
  const subtotal = items.length
    ? items.reduce((sum, item) => sum + toNumber(item.amount), 0)
    : toNumber(data.subtotal || data.amount);
  const taxableAmount = data.taxCategory === 'exempt' ? 0 : subtotal;
  const taxAmount = data.taxCategory === 'exempt' || data.taxCategory === 'zero_rated'
    ? 0
    : taxableAmount * (toNumber(data.taxRate) / 100);
  const withholdingTaxAmount = taxableAmount * (toNumber(data.withholdingTaxRate) / 100);
  const grossAmount = subtotal + taxAmount;
  const totalDue = Math.max(grossAmount - withholdingTaxAmount, 0);
  const commissionBase = data.commissionBasis === 'gross' ? grossAmount : subtotal;
  const commissionAmount = data.commissionEnabled
    ? data.commissionType === 'fixed'
      ? toNumber(data.commissionFixedAmount)
      : commissionBase * (toNumber(data.commissionRate) / 100)
    : 0;
  const netOwnerRemittance = Math.max(totalDue - commissionAmount, 0);

  return {
    ...data,
    items,
    amount: totalDue,
    subtotal,
    taxableAmount,
    taxAmount,
    withholdingTaxAmount,
    grossAmount,
    commissionAmount,
    netOwnerRemittance,
    accountingBreakdown: {
      ...(data.accountingBreakdown || {}),
      subtotal,
      taxAmount,
      withholdingTaxAmount,
      grossAmount,
      totalDue,
      commissionAmount,
      netOwnerRemittance
    }
  };
};

export const createInvoice = async (data) => {
  const invoice = normalizeInvoiceTotals(data);
  const doc = await coll().add({ ...invoice, createdAt: new Date() });
  return { id: doc.id, ...invoice };
};

export const getInvoices = async (filters = {}) => {
  let query = coll().orderBy('createdAt', 'desc');
  if (filters.tenantId) query = query.where('tenantId', '==', filters.tenantId);
  if (filters.status) query = query.where('status', '==', filters.status);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getInvoiceById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateInvoice = async (id, data) => {
  const ref = coll().doc(id);
  const current = await ref.get();
  const existing = current.exists ? current.data() : {};
  const updateData = normalizeInvoiceTotals({ ...existing, ...data });
  await ref.update({ ...updateData, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteInvoice = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
