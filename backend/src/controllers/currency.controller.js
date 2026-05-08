import { Currency } from '../models/currency.model.js';

export const createCurrency = async (req, res) => {
  try {
    const { code, name, symbol, decimalPlaces = 2 } = req.body;
    
    if (!code || !name || !symbol) {
      return res.status(400).json({ error: 'Code, name, and symbol are required' });
    }

    const currency = await Currency.create({ code, name, symbol, decimalPlaces });
    res.status(201).json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.getAll();
    res.json(currencies);
  } catch (error) {
    console.error('Get all currencies error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const getActiveCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.getActive();
    res.json(currencies);
  } catch (error) {
    console.error('Get active currencies error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const getCurrencyById = async (req, res) => {
  try {
    const currency = await Currency.getById(req.params.id);
    if (!currency) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCurrency = async (req, res) => {
  try {
    const currency = await Currency.update(req.params.id, req.body);
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCurrency = async (req, res) => {
  try {
    await Currency.delete(req.params.id);
    res.json({ message: 'Currency deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const setDefaultCurrency = async (req, res) => {
  try {
    const { organizationId, moduleType, currencyId } = req.body;
    
    if (!organizationId || !moduleType || !currencyId) {
      return res.status(400).json({ error: 'Organization ID, module type, and currency ID are required' });
    }

    const currency = await Currency.setDefault(organizationId, moduleType, currencyId);
    res.json({ message: 'Default currency set successfully', currency });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDefaultCurrency = async (req, res) => {
  try {
    const { organizationId, moduleType } = req.params;
    const currency = await Currency.getDefaultCurrency(organizationId, moduleType);
    
    if (!currency) {
      return res.status(404).json({ error: 'No default currency set' });
    }
    
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrganizationCurrencySettings = async (req, res) => {
  try {
    const { organizationId, moduleType } = req.params;
    const settings = await Currency.getOrganizationCurrencySettings(organizationId, moduleType);
    
    if (!settings) {
      // Return default USD settings
      return res.json({
        organizationId,
        moduleType,
        currencyCode: 'USD',
        currencySymbol: '$',
        currencyName: 'US Dollar',
        decimalPlaces: 2
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const initializeDefaultCurrencies = async (req, res) => {
  try {
    // Check if currencies already exist
    const existing = await Currency.getAll();
    if (existing.length > 0) {
      return res.json({ message: 'Currencies already initialized', currencies: existing });
    }

    const defaultCurrencies = [
      { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2 },
      { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2 },
      { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2 },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimalPlaces: 0 },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimalPlaces: 2 },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimalPlaces: 2 },
      { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimalPlaces: 2 },
      { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', decimalPlaces: 2 },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimalPlaces: 2 },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimalPlaces: 2 }
    ];

    const created = [];
    for (const curr of defaultCurrencies) {
      const currency = await Currency.create(curr);
      created.push(currency);
    }

    res.json({ message: 'Default currencies initialized', currencies: created });
  } catch (error) {
    console.error('Initialize currencies error:', error);
    res.status(500).json({ error: error.message });
  }
};
