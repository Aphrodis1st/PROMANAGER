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
    const { employeeId } = req.query;
    const performance = await Performance.getByEmployee(employeeId);
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
