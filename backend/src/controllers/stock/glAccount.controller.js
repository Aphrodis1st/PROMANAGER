import { GLAccountModel } from "../../models/stock/glAccount.model.js";

export const GLAccountController = {
  async createGLAccount(req, res) {
    try {
      const account = await GLAccountModel.create(req.body);
      return res.status(201).json(account);
    } catch (err) {
      console.error("Error creating GL account:", err);
      return res.status(500).json({ error: "Failed to create GL account" });
    }
  },

  async getAllGLAccounts(req, res) {
    try {
      const accounts = await GLAccountModel.getAll();
      return res.status(200).json(accounts);
    } catch (err) {
      console.error("Error fetching GL accounts:", err);
      return res.status(500).json({ error: "Failed to fetch GL accounts" });
    }
  },

  async getGLAccountByCode(req, res) {
    try {
      const { code } = req.params;
      const account = await GLAccountModel.getByCode(code);
      if (!account) return res.status(404).json({ error: "GL account not found" });
      return res.status(200).json(account);
    } catch (err) {
      console.error("Error fetching GL account:", err);
      return res.status(500).json({ error: "Failed to fetch GL account" });
    }
  },

  async getGLAccountById(req, res) {
    try {
      const { id } = req.params;
      const account = await GLAccountModel.getById(id);
      if (!account) return res.status(404).json({ error: "GL account not found" });
      return res.status(200).json(account);
    } catch (err) {
      console.error("Error fetching GL account:", err);
      return res.status(500).json({ error: "Failed to fetch GL account" });
    }
  },

  async updateGLAccount(req, res) {
    try {
      const { id } = req.params;
      const updated = await GLAccountModel.update(id, req.body);
      if (!updated) return res.status(404).json({ error: "GL account not found" });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating GL account:", err);
      return res.status(500).json({ error: "Failed to update GL account" });
    }
  },

  async deleteGLAccount(req, res) {
    try {
      const { id } = req.params;
      const deleted = await GLAccountModel.remove(id);
      if (!deleted) return res.status(404).json({ error: "GL account not found" });
      return res.status(200).json({ message: "GL account deleted successfully" });
    } catch (err) {
      console.error("Error deleting GL account:", err);
      return res.status(500).json({ error: "Failed to delete GL account" });
    }
  },

  async initializeDefaultAccounts(req, res) {
    try {
      const created = await GLAccountModel.initializeDefaultTaxAccounts();
      return res.status(200).json({
        message: "Default tax GL accounts initialized",
        created: created.length,
        accounts: created,
      });
    } catch (err) {
      console.error("Error initializing default accounts:", err);
      return res.status(500).json({ error: "Failed to initialize default accounts" });
    }
  },

  async updateBalance(req, res) {
    try {
      const { id } = req.params;
      const { amount, operation } = req.body;
      const updated = await GLAccountModel.updateBalance(id, amount, operation);
      if (!updated) return res.status(404).json({ error: "GL account not found" });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating GL account balance:", err);
      return res.status(500).json({ error: "Failed to update balance" });
    }
  },
};
