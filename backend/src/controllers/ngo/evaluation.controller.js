import { Evaluation } from '../../models/ngo/evaluation.model.js';

export const createEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ success: true, data: evaluation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllEvaluations = async (req, res) => {
  try {
    const { organizationId, projectId } = req.query;
    const evaluations = await Evaluation.getAll(organizationId, projectId);
    res.json({ success: true, data: evaluations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.getById(req.params.id);
    if (!evaluation) return res.status(404).json({ success: false, error: 'Evaluation not found' });
    res.json({ success: true, data: evaluation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.update(req.params.id, req.body);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteEvaluation = async (req, res) => {
  try {
    await Evaluation.delete(req.params.id);
    res.json({ success: true, message: 'Evaluation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
