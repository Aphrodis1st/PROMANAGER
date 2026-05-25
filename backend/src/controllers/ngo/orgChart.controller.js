import { OrgChart } from '../../models/ngo/orgChart.model.js';

export const createOrgChart = async (req, res) => {
  try {
    const orgChart = await OrgChart.create(req.body);
    res.status(201).json({ success: true, data: orgChart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllOrgCharts = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const orgCharts = await OrgChart.getAll(organizationId);
    res.json({ success: true, data: orgCharts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrgChart = async (req, res) => {
  try {
    const orgChart = await OrgChart.getById(req.params.id);
    if (!orgChart) return res.status(404).json({ success: false, error: 'Org chart not found' });
    res.json({ success: true, data: orgChart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getActiveOrgChart = async (req, res) => {
  try {
    const orgChart = await OrgChart.getActive(req.params.organizationId);
    if (!orgChart) return res.status(404).json({ success: false, error: 'No active org chart found' });
    res.json({ success: true, data: orgChart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOrgChart = async (req, res) => {
  try {
    const orgChart = await OrgChart.update(req.params.id, req.body);
    res.json({ success: true, data: orgChart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOrgChart = async (req, res) => {
  try {
    await OrgChart.delete(req.params.id);
    res.json({ success: true, message: 'Org chart deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateOrgChart = async (req, res) => {
  try {
    const structure = await OrgChart.generateFromStructure(req.params.organizationId);
    res.json({ success: true, data: structure });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
