import { SupplierInvoiceModel } from "../../models/stock/supplierInvoice.model.js";
import JournalModel from "../../models/stock/journal.model.js";
import { postPurchaseJournal } from "../../services/stockPurchaseJournal.service.js";

export const SupplierInvoiceController = {
  async create(req, res) {
    try {
      console.log("📥 [CREATE] Request body:", req.body);
      const invoice = await SupplierInvoiceModel.create(req.body);
      const journalResult = await postPurchaseJournal({
        purchase: invoice,
        purchaseId: invoice.id,
        sourceType: "supplierInvoice",
        userId: req.user?.id || null,
      });
      console.log("✅ [CREATE] Created invoice:", invoice);
      res.status(201).json({
        ...invoice,
        journalEntryId: journalResult.journalEntry?.id || null,
      });
    } catch (err) {
      console.error("❌ [CREATE] Error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      console.log("📥 [GET ALL] Fetching all invoices");
      const invoices = await SupplierInvoiceModel.findAll();
      console.log(`✅ [GET ALL] Found ${invoices.length} invoices`);
      res.json(invoices);
    } catch (err) {
      console.error("❌ [GET ALL] Error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      console.log("[GET BY ID] Invoice ID:", req.params.id);
      const invoice = await SupplierInvoiceModel.findById(req.params.id);
      if (!invoice) {
        console.warn("⚠️ [GET BY ID] Invoice not found:", req.params.id);
        return res.status(404).json({ message: "Invoice not found" });
      }
      console.log("✅ [GET BY ID] Found invoice:", invoice);
      res.json(invoice);
    } catch (err) {
      console.error("❌ [GET BY ID] Error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getBySupplier(req, res) {
    try {
      console.log("[GET BY SUPPLIER] Supplier ID:", req.params.supplierId);
      const invoices = await SupplierInvoiceModel.findBySupplier(req.params.supplierId);
      console.log(`✅ [GET BY SUPPLIER] Found ${invoices.length} invoices`);
      res.json(invoices);
    } catch (err) {
      console.error("❌ [GET BY SUPPLIER] Error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      console.log("[UPDATE] Invoice ID:", req.params.id, "Update body:", req.body);
      const existing = await SupplierInvoiceModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const updatedInvoice = await SupplierInvoiceModel.update(req.params.id, {
        ...existing,
        ...req.body,
      });

      console.log("[UPDATE] Updated invoice:", updatedInvoice);
      res.json(updatedInvoice);
    } catch (err) {
      console.error("[UPDATE] Error:", err);
      res.status(500).json({ error: err.message });
    }
  },


  async remove(req, res) {
    try {
      console.log("[REMOVE] Invoice ID:", req.params.id);
      await SupplierInvoiceModel.remove(req.params.id);
      await JournalModel.removeBySource("supplierInvoice", req.params.id);
      console.log("✅ [REMOVE] Invoice deleted:", req.params.id);
      res.json({ message: "Invoice deleted" });
    } catch (err) {
      console.error("❌ [REMOVE] Error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
