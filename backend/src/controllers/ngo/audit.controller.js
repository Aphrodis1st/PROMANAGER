import { Audit } from '../../models/ngo/audit.model.js';

export const createAudit = async (req, res) => {
  try {
    const audit = await Audit.create(req.body);
    res.status(201).json({ success: true, data: audit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllAudits = async (req, res) => {
  try {
    const { organizationId, auditType, status, riskLevel } = req.query;
    const filters = { auditType, status, riskLevel };
    const audits = await Audit.getAll(organizationId, filters);
    res.json({ success: true, data: audits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAudit = async (req, res) => {
  try {
    const audit = await Audit.getById(req.params.id);
    if (!audit) return res.status(404).json({ success: false, error: 'Audit not found' });
    res.json({ success: true, data: audit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAudit = async (req, res) => {
  try {
    const audit = await Audit.update(req.params.id, req.body);
    res.json({ success: true, data: audit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAudit = async (req, res) => {
  try {
    await Audit.delete(req.params.id);
    res.json({ success: true, message: 'Audit deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addAuditFinding = async (req, res) => {
  try {
    const audit = await Audit.addFinding(req.params.id, req.body);
    res.json({ success: true, data: audit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAuditTrail = async (req, res) => {
  try {
    const { organizationId, entityType, entityId } = req.query;
    const trail = await Audit.getAuditTrail(organizationId, entityType, entityId);
    res.json({ success: true, data: trail });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getComplianceStatus = async (req, res) => {
  try {
    const status = await Audit.getComplianceStatus(req.params.organizationId);
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
