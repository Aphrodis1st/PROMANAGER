import {
  createLabTest,
  getLabTests,
  getLabTestsByPatient,
  updateLabTest,
  deleteLabTest
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
