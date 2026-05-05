import { Stock } from '../../models/superAdmin/stock.model.js';

export const createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.getAll();
    res.json({ success: true, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStock = async (req, res) => {
  try {
    const stock = await Stock.getById(req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, error: 'Stock not found' });
    }
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const stock = await Stock.update(req.params.id, req.body);
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateStockStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const stock = await Stock.updateStatus(req.params.id, status);
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateStockFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    const stock = await Stock.updateFeatures(req.params.id, features);
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const softDeleteStock = async (req, res) => {
  try {
    const stock = await Stock.softDelete(req.params.id);
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const hardDeleteStock = async (req, res) => {
  try {
    await Stock.hardDelete(req.params.id);
    res.json({ success: true, message: 'Stock permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
