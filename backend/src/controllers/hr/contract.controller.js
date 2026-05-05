import { Contract } from '../../models/hr/contract.model.js';

export const createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContracts = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const contracts = await Contract.getByEmployee(employeeId);
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExpiringContracts = async (req, res) => {
  try {
    const { organizationId, days } = req.query;
    const contracts = await Contract.getExpiring(organizationId, parseInt(days) || 30);
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const contract = await Contract.update(req.params.id, req.body);
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
