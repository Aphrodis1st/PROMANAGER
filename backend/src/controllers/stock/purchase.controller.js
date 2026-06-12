import { PurchaseModel } from "../../models/stock/purchase.model.js";
import { SupplierInvoiceModel } from "../../models/stock/supplierInvoice.model.js";
import JournalModel from "../../models/stock/journal.model.js";
import { postPurchaseJournal } from "../../services/stockPurchaseJournal.service.js";

export const PurchaseController = {
  // CREATE PURCHASE (Increases Inventory - IAS 2 Compliant)
  async create(req, res) {
    try {
      console.log('📥 [PURCHASE] Creating purchase with data:', JSON.stringify(req.body, null, 2));
      const purchase = await PurchaseModel.create(req.body);
      const journalResult = await postPurchaseJournal({
        purchase,
        purchaseId: purchase.id,
        sourceType: "purchase",
        userId: req.user?.id || null,
      });
      console.log('✅ [PURCHASE] Purchase created successfully with inventory increase');
      res.status(201).json({
        ...purchase,
        journalEntryId: journalResult.journalEntry?.id || null,
      });
    } catch (err) {
      console.error('❌ [PURCHASE] Error creating purchase:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const purchases = await PurchaseModel.findAll();
      res.json(purchases);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async syncJournals(req, res) {
    try {
      const [supplierInvoices, purchases] = await Promise.all([
        SupplierInvoiceModel.findAll(),
        PurchaseModel.findAll(),
      ]);
      const results = [];

      for (const invoice of supplierInvoices) {
        if (!invoice?.id || invoice.status === "rejected") {
          results.push({ sourceType: "supplierInvoice", id: invoice?.id || null, skipped: true, reason: "not postable" });
          continue;
        }

        const result = await postPurchaseJournal({
          purchase: invoice,
          purchaseId: invoice.id,
          sourceType: "supplierInvoice",
          userId: invoice.userId || null,
        });

        results.push({
          sourceType: "supplierInvoice",
          id: invoice.id,
          created: result.created,
          journalEntryId: result.journalEntry?.id || null,
        });
      }

      for (const purchase of purchases) {
        if (!purchase?.id) {
          results.push({ sourceType: "purchase", id: null, skipped: true, reason: "missing id" });
          continue;
        }

        const result = await postPurchaseJournal({
          purchase,
          purchaseId: purchase.id,
          sourceType: "purchase",
          userId: purchase.userId || null,
        });

        results.push({
          sourceType: "purchase",
          id: purchase.id,
          created: result.created,
          journalEntryId: result.journalEntry?.id || null,
        });
      }

      res.json({
        message: "Purchase journals synchronized",
        totalPurchases: supplierInvoices.length + purchases.length,
        created: results.filter((item) => item.created).length,
        skipped: results.filter((item) => !item.created).length,
        results,
      });
    } catch (err) {
      console.error("Purchase journal sync error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const purchase = await PurchaseModel.findById(req.params.id);
      if (!purchase) return res.status(404).json({ message: "Purchase not found" });
      res.json(purchase);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
  try {
    console.log("[UPDATE] Invoice ID:", req.params.id, "Update body:", req.body);
    
    // Find the existing invoice first
    const existing = await SupplierInvoiceModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Merge the existing data with the new fields
    const updatedData = { ...existing, ...req.body };

    // Make sure items and totals are preserved if not included in update
    if (!req.body.items) {
      updatedData.items = existing.items;
    }
    if (!req.body.totalAmount) {
      updatedData.totalAmount = existing.totalAmount;
    }
    if (!req.body.supplierId) {
      updatedData.supplierId = existing.supplierId;
    }

    const updatedInvoice = await SupplierInvoiceModel.update(req.params.id, updatedData);

    console.log("✅ [UPDATE] Updated invoice:", updatedInvoice);
    res.json(updatedInvoice);
  } catch (err) {
    console.error("❌ [UPDATE] Error:", err);
    res.status(500).json({ error: err.message });
  }
},


  async remove(req, res) {
    try {
      await PurchaseModel.remove(req.params.id);
      await JournalModel.removeBySource("purchase", req.params.id);
      res.json({ message: "Purchase deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
