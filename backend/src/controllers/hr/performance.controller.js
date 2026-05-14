import { Performance } from '../../models/hr/performance.model.js';

export const createPerformance = async (req, res) => {
  try {
    const performance = await Performance.create(req.body);
    res.status(201).json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPerformance = async (req, res) => {
  try {
    const { organizationId, employeeId } = req.query;
    const performance = organizationId 
      ? await Performance.getByOrganization(organizationId)
      : await Performance.getByEmployee(employeeId);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.update(req.params.id, req.body);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePerformance = async (req, res) => {
  try {
    await Performance.delete(req.params.id);
    res.json({ message: 'Performance review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
