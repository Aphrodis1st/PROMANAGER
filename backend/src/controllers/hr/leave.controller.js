import { Leave } from '../../models/hr/leave.model.js';

export const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const leaves = await Leave.getByEmployee(employeeId);
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const leaves = await Leave.getPending(organizationId);
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    const leave = await Leave.updateStatus(id, 'approved', approvedBy);
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    const leave = await Leave.updateStatus(id, 'rejected', approvedBy);
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
