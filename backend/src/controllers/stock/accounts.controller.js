import  defaultChartAccounts  from "../../data/defaultChartAccounts.js";
import { AccountModel } from "../../models/stock/accounts.model.js";

export const AccountController = {
  // Seed default chart of accounts
  async seedDefault(req, res) {
    try {
      // Optional: Remove existing accounts before seeding
      await AccountModel.removeAll();

      const seededAccounts = [];
      for (const account of defaultChartAccounts) {
        const created = await AccountModel.create(account);
        seededAccounts.push(created);
      }

      res.json({
        message: "Default chart of accounts seeded successfully",
        seededCount: seededAccounts.length
      });
    } catch (err) {
      console.error("Seeding error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Get all accounts
  async getAll(req, res) {
    try {
      const accounts = await AccountModel.findAll();
      res.json(accounts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const account = await AccountModel.create(req.body);
      res.status(201).json(account);
    } catch (err) {
      console.error("Create account error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const account = await AccountModel.findById(req.params.id);
      if (!account) return res.status(404).json({ error: "Account not found" });
      res.json(account);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const account = await AccountModel.update(req.params.id, req.body);
      if (!account) return res.status(404).json({ error: "Account not found" });
      res.json(account);
    } catch (err) {
      console.error("Update account error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await AccountModel.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Account not found" });
      res.json({ message: "Account deleted successfully" });
    } catch (err) {
      console.error("Delete account error:", err);
      res.status(500).json({ error: err.message });
    }
  }
};
