import * as PropertyModel from '../../models/property/property.model.js';

export const create = async (req, res) => {
  try {
    const property = await PropertyModel.createProperty(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const properties = await PropertyModel.getProperties(req.query);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const property = await PropertyModel.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await PropertyModel.updateProperty(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await PropertyModel.deleteProperty(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const properties = await PropertyModel.getProperties();
    const stats = {
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.status === 'active').length,
      totalValue: properties.reduce((sum, p) => sum + (p.value || 0), 0)
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
