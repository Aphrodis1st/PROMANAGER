import {
  createInvoice,
  getInvoices,
  getInvoicesByPatient,
  markInvoicePaid,
  deleteInvoice
} from '../../models/hospital/billing.model.js';

// CREATE
export const create = async (req, res) => {
  try {
    const invoice = await createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Create invoice error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL
export const getAll = async (req, res) => {
  try {
    const invoices = await getInvoices();
    res.json(invoices);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET BY PATIENT
export const getByPatient = async (req, res) => {
  try {
    const invoices = await getInvoicesByPatient(req.params.patientId);
    res.json(invoices);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// MARK AS PAID
export const markPaid = async (req, res) => {
  try {
    const updated = await markInvoicePaid(req.params.id);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
export const remove = async (req, res) => {
  try {
    await deleteInvoice(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};