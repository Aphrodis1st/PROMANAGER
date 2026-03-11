import {
  createLabTest,
  getLabTests,
  getLabTestsByPatient,
  updateLabTest,
  deleteLabTest,
  createLabOrder,
  getLabOrders,
  getLabOrderById,
  updateLabOrder
} from '../../models/hospital/lab.model.js';

export const create = async (req, res) => {
  try {
    const labTest = await createLabTest(req.body);
    res.status(201).json(labTest);
  } catch (err) {
    console.error('Create lab test error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAll = async (req, res) => {
  try {
    const tests = await getLabTests();
    res.json(tests);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getByPatient = async (req, res) => {
  try {
    const tests = await getLabTestsByPatient(req.params.patientId);
    res.json(tests);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateLabTest(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteLabTest(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getLabOrders();
    res.json(orders);
  } catch (err) {
    console.error('Get lab orders error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await getLabOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Lab order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Get lab order error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await createLabOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error('Create lab order error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitResults = async (req, res) => {
  try {
    const updated = await updateLabOrder(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Submit results error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
