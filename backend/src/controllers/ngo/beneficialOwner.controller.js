import { BeneficialOwner } from '../../models/ngo/beneficialOwner.model.js';

export const createBeneficialOwner = async (req, res) => {
  try {
    const owner = await BeneficialOwner.create(req.body);
    res.status(201).json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBeneficialOwners = async (req, res) => {
  try {
    const { organizationId, status, verificationStatus } = req.query;
    const filters = { status, verificationStatus };
    const owners = await BeneficialOwner.getAll(organizationId, filters);
    res.json({ success: true, data: owners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBeneficialOwner = async (req, res) => {
  try {
    const owner = await BeneficialOwner.getById(req.params.id);
    if (!owner) return res.status(404).json({ success: false, error: 'Beneficial owner not found' });
    res.json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBeneficialOwner = async (req, res) => {
  try {
    const owner = await BeneficialOwner.update(req.params.id, req.body);
    res.json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBeneficialOwner = async (req, res) => {
  try {
    await BeneficialOwner.delete(req.params.id);
    res.json({ success: true, message: 'Beneficial owner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyBeneficialOwner = async (req, res) => {
  try {
    const { verifiedBy } = req.body;
    const owner = await BeneficialOwner.verify(req.params.id, verifiedBy);
    res.json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOwnershipStructure = async (req, res) => {
  try {
    const structure = await BeneficialOwner.getOwnershipStructure(req.params.organizationId);
    res.json({ success: true, data: structure });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPoliticallyExposed = async (req, res) => {
  try {
    const owners = await BeneficialOwner.getPoliticallyExposed(req.params.organizationId);
    res.json({ success: true, data: owners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
