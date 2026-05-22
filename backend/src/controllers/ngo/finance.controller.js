import { Finance } from '../../models/ngo/finance.model.js';

export const createFinance = async (req, res) => {
  try {
    const finance = await Finance.create(req.body);
    res.status(201).json({ success: true, data: finance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllFinances = async (req, res) => {
  try {
    const { organizationId, type, projectId, status, startDate, endDate } = req.query;
    const filters = { type, projectId, status, startDate, endDate };
    const finances = await Finance.getAll(organizationId, filters);
    res.json({ success: true, data: finances });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFinance = async (req, res) => {
  try {
    const finance = await Finance.getById(req.params.id);
    if (!finance) return res.status(404).json({ success: false, error: 'Finance record not found' });
    res.json({ success: true, data: finance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateFinance = async (req, res) => {
  try {
    const finance = await Finance.update(req.params.id, req.body);
    res.json({ success: true, data: finance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteFinance = async (req, res) => {
  try {
    await Finance.delete(req.params.id);
    res.json({ success: true, message: 'Finance record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFinancialSummary = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { startDate, endDate } = req.query;
    const summary = await Finance.getFinancialSummary(organizationId, startDate, endDate);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFinancesByProject = async (req, res) => {
  try {
    const finances = await Finance.getByProject(req.params.projectId);
    res.json({ success: true, data: finances });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
