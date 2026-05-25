import { Dashboard } from '../../models/ngo/dashboard.model.js';

export const getDashboardOverview = async (req, res) => {
  try {
    const data = await Dashboard.getOverview(req.organizationId);
    res.json({ success: true, data });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ success: false, error: error.message });
  }
};
