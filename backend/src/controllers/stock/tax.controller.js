import { TaxModel } from "../../models/stock/tax.model.js";
import { TaxGroupModel } from "../../models/stock/taxGroup.model.js";
import { TaxTransactionModel } from "../../models/stock/taxTransaction.model.js";

export const TaxController = {
  // Tax Configuration
  async createTax(req, res) {
    try {
      console.log('Creating tax with data:', req.body);
      const tax = await TaxModel.create(req.body);
      console.log('Tax created successfully:', tax);
      return res.status(201).json(tax);
    } catch (err) {
      console.error("Error creating tax:", err);
      return res.status(500).json({ 
        error: "Failed to create tax",
        message: err.message,
        details: err.stack 
      });
    }
  },

  async getAllTaxes(req, res) {
    try {
      const taxes = await TaxModel.getAll();
      return res.status(200).json(taxes);
    } catch (err) {
      console.error("Error fetching taxes:", err);
      return res.status(500).json({ error: "Failed to fetch taxes" });
    }
  },

  async getActiveTaxes(req, res) {
    try {
      const taxes = await TaxModel.getActive();
      return res.status(200).json(taxes);
    } catch (err) {
      console.error("Error fetching active taxes:", err);
      return res.status(500).json({ error: "Failed to fetch active taxes" });
    }
  },

  async getTaxById(req, res) {
    try {
      const { id } = req.params;
      const tax = await TaxModel.getById(id);
      if (!tax) return res.status(404).json({ error: "Tax not found" });
      return res.status(200).json(tax);
    } catch (err) {
      console.error("Error fetching tax:", err);
      return res.status(500).json({ error: "Failed to fetch tax" });
    }
  },

  async updateTax(req, res) {
    try {
      const { id } = req.params;
      const updated = await TaxModel.update(id, req.body);
      if (!updated) return res.status(404).json({ error: "Tax not found" });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating tax:", err);
      return res.status(500).json({ error: "Failed to update tax" });
    }
  },

  async deleteTax(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TaxModel.remove(id);
      if (!deleted) return res.status(404).json({ error: "Tax not found" });
      return res.status(200).json({ message: "Tax deleted successfully" });
    } catch (err) {
      console.error("Error deleting tax:", err);
      return res.status(500).json({ error: "Failed to delete tax" });
    }
  },

  // Tax Groups
  async createTaxGroup(req, res) {
    try {
      const group = await TaxGroupModel.create(req.body);
      return res.status(201).json(group);
    } catch (err) {
      console.error("Error creating tax group:", err);
      return res.status(500).json({ error: "Failed to create tax group" });
    }
  },

  async getAllTaxGroups(req, res) {
    try {
      const groups = await TaxGroupModel.getAll();
      return res.status(200).json(groups);
    } catch (err) {
      console.error("Error fetching tax groups:", err);
      return res.status(500).json({ error: "Failed to fetch tax groups" });
    }
  },

  async updateTaxGroup(req, res) {
    try {
      const { id } = req.params;
      const updated = await TaxGroupModel.update(id, req.body);
      if (!updated) return res.status(404).json({ error: "Tax group not found" });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating tax group:", err);
      return res.status(500).json({ error: "Failed to update tax group" });
    }
  },

  async deleteTaxGroup(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TaxGroupModel.remove(id);
      if (!deleted) return res.status(404).json({ error: "Tax group not found" });
      return res.status(200).json({ message: "Tax group deleted successfully" });
    } catch (err) {
      console.error("Error deleting tax group:", err);
      return res.status(500).json({ error: "Failed to delete tax group" });
    }
  },

  // Tax Reports
  async getTaxTransactions(req, res) {
    try {
      const { startDate, endDate, taxType } = req.query;
      const filters = { startDate, endDate, taxType };
      const transactions = await TaxTransactionModel.getAll(filters);
      return res.status(200).json(transactions);
    } catch (err) {
      console.error("Error fetching tax transactions:", err);
      return res.status(500).json({ error: "Failed to fetch tax transactions" });
    }
  },

  async getTaxReport(req, res) {
    try {
      const { taxType, startDate, endDate } = req.query;
      const transactions = await TaxTransactionModel.getByTaxType(taxType, startDate, endDate);
      return res.status(200).json(transactions);
    } catch (err) {
      console.error("Error generating tax report:", err);
      return res.status(500).json({ error: "Failed to generate tax report" });
    }
  },

  async getTaxSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const summary = await TaxTransactionModel.getTaxSummary(startDate, endDate);
      return res.status(200).json(summary);
    } catch (err) {
      console.error("Error generating tax summary:", err);
      return res.status(500).json({ error: "Failed to generate tax summary" });
    }
  },
};
