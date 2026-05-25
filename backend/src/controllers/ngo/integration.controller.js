import { NGOIntegrationService } from '../../services/ngoIntegration.service.js';

export const getOrganizationOverview = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const overview = await NGOIntegrationService.getOrganizationOverview(organizationId);
    res.json({ success: true, data: overview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const details = await NGOIntegrationService.getProjectDetails(projectId);
    if (!details) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTenderDetails = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const details = await NGOIntegrationService.getTenderDetails(tenderId);
    if (!details) return res.status(404).json({ success: false, error: 'Tender not found' });
    res.json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const linkTenderToProject = async (req, res) => {
  try {
    const { tenderId, projectId } = req.body;
    await NGOIntegrationService.linkTenderToProject(tenderId, projectId);
    res.json({ success: true, message: 'Tender linked to project' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const linkContractToTenderAndProject = async (req, res) => {
  try {
    const { contractId, tenderId, projectId } = req.body;
    await NGOIntegrationService.linkContractToTenderAndProject(contractId, tenderId, projectId);
    res.json({ success: true, message: 'Contract linked to tender and project' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const linkImpactToProject = async (req, res) => {
  try {
    const { impactId, projectId } = req.body;
    await NGOIntegrationService.linkImpactToProject(impactId, projectId);
    res.json({ success: true, message: 'Impact linked to project' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const linkEvaluationToProject = async (req, res) => {
  try {
    const { evaluationId, projectId } = req.body;
    await NGOIntegrationService.linkEvaluationToProject(evaluationId, projectId);
    res.json({ success: true, message: 'Evaluation linked to project' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
