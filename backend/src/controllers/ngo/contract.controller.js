import { Contract } from '../../models/ngo/contract.model.js';

export const createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllContracts = async (req, res) => {
  try {
    const { organizationId, projectId } = req.query;
    const contracts = await Contract.getAll(organizationId, projectId);
    res.json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getContract = async (req, res) => {
  try {
    const contract = await Contract.getById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, error: 'Contract not found' });
    res.json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const contract = await Contract.update(req.params.id, req.body);
    res.json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    await Contract.delete(req.params.id);
    res.json({ success: true, message: 'Contract deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
