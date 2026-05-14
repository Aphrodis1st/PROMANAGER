import * as MaintenanceModel from '../../models/property/maintenance.model.js';

export const create = async (req, res) => {
  try {
    const ticket = await MaintenanceModel.createTicket(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const tickets = await MaintenanceModel.getTickets(req.query);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const ticket = await MaintenanceModel.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await MaintenanceModel.updateTicket(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await MaintenanceModel.deleteTicket(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
