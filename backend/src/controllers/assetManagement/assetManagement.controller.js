import { AssetManagementModel } from "../../models/assetManagement/assetManagement.model.js";

const ok = (res, data = {}, message = "OK") => res.json({ success: true, message, data });
const created = (res, data = {}, message = "Created") => res.status(201).json({ success: true, message, data });

const handleError = (res, err, label) => {
  console.error(`AssetManagement ${label} error:`, err);
  const status = err.message?.startsWith("Invalid asset management module") ? 400 : 500;
  return res.status(status).json({ success: false, error: err.message || "Request failed" });
};

const moduleKey = (req) => req.params.module;

export const AssetManagementController = {
  async getModules(_req, res) {
    return ok(res, { modules: AssetManagementModel.modules });
  },

  async dashboard(_req, res) {
    try {
      const [modules, financials] = await Promise.all([
        AssetManagementModel.dashboard(),
        AssetManagementModel.assetFinancialSummary(),
      ]);

      return ok(res, { modules, financials }, "Asset management dashboard loaded");
    } catch (err) {
      return handleError(res, err, "dashboard");
    }
  },

  async list(req, res) {
    try {
      const rows = await AssetManagementModel.findAll(moduleKey(req), req.query);
      return ok(res, { [moduleKey(req)]: rows, items: rows });
    } catch (err) {
      return handleError(res, err, "list");
    }
  },

  async getById(req, res) {
    try {
      const item = await AssetManagementModel.findById(moduleKey(req), req.params.id);
      if (!item) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, { item });
    } catch (err) {
      return handleError(res, err, "getById");
    }
  },

  async create(req, res) {
    try {
      const item = await AssetManagementModel.create(moduleKey(req), req.body);
      return created(res, { item }, "Asset management record created");
    } catch (err) {
      return handleError(res, err, "create");
    }
  },

  async update(req, res) {
    try {
      const item = await AssetManagementModel.update(moduleKey(req), req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, { item }, "Asset management record updated");
    } catch (err) {
      return handleError(res, err, "update");
    }
  },

  async remove(req, res) {
    try {
      const deleted = await AssetManagementModel.remove(moduleKey(req), req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, {}, "Asset management record deleted");
    } catch (err) {
      return handleError(res, err, "remove");
    }
  },

  async verifyAsset(req, res) {
    try {
      const item = await AssetManagementModel.update("assets", req.params.id, {
        verificationStatus: "verified",
        verifiedAt: new Date().toISOString(),
        verifiedBy: req.body.verifiedBy || req.user?.email || req.user?.name || "system",
      });
      if (!item) return res.status(404).json({ success: false, error: "Asset not found" });
      return ok(res, { item }, "Asset verified");
    } catch (err) {
      return handleError(res, err, "verifyAsset");
    }
  },

  async stockReceipt(req, res) {
    try {
      const item = await AssetManagementModel.findById("inventory", req.params.id);
      if (!item) return res.status(404).json({ success: false, error: "Inventory item not found" });

      const quantity = Number(req.body.quantity || 0);
      const updated = await AssetManagementModel.update("inventory", req.params.id, {
        quantity: Number(item.quantity || 0) + quantity,
        lastReceiptAt: new Date().toISOString(),
        lastReceiptQuantity: quantity,
        status: "active",
      });
      return ok(res, { item: updated }, "Stock receipt posted");
    } catch (err) {
      return handleError(res, err, "stockReceipt");
    }
  },

  async stockIssue(req, res) {
    try {
      const item = await AssetManagementModel.findById("inventory", req.params.id);
      if (!item) return res.status(404).json({ success: false, error: "Inventory item not found" });

      const quantity = Number(req.body.quantity || 0);
      const nextQuantity = Number(item.quantity || 0) - quantity;
      if (nextQuantity < 0) return res.status(400).json({ success: false, error: "Insufficient inventory quantity" });

      const updated = await AssetManagementModel.update("inventory", req.params.id, {
        quantity: nextQuantity,
        lastIssueAt: new Date().toISOString(),
        lastIssueQuantity: quantity,
        status: nextQuantity <= Number(item.reorderLevel || 0) ? "below_reorder" : item.status,
      });
      return ok(res, { item: updated }, "Stock issue posted");
    } catch (err) {
      return handleError(res, err, "stockIssue");
    }
  },

  async approveTransfer(req, res) {
    return AssetManagementController.transition(req, res, "transfers", "approved", { approvalStatus: "approved", approvedAt: new Date().toISOString() });
  },

  async dispatchTransfer(req, res) {
    return AssetManagementController.transition(req, res, "transfers", "in_transit", { dispatchedAt: new Date().toISOString() });
  },

  async receiveTransfer(req, res) {
    return AssetManagementController.transition(req, res, "transfers", "completed", { receivedAt: new Date().toISOString() });
  },

  async startMaintenance(req, res) {
    return AssetManagementController.transition(req, res, "maintenance", "in_progress", { startedAt: new Date().toISOString() });
  },

  async completeMaintenance(req, res) {
    return AssetManagementController.transition(req, res, "maintenance", "completed", {
      completedAt: new Date().toISOString(),
      actualCost: Number(req.body.actualCost || req.body.cost || 0),
    });
  },

  async closeAudit(req, res) {
    return AssetManagementController.transition(req, res, "audits", "closed", { closedAt: new Date().toISOString() });
  },

  async postDepreciation(req, res) {
    try {
      const assets = await AssetManagementModel.findAll("assets");
      const monthKey = req.body.monthKey || new Date().toISOString().slice(0, 7);
      const entries = [];

      for (const asset of assets) {
        const cost = Number(asset.cost || asset.purchaseCost || 0);
        const usefulLifeMonths = Math.max(1, Number(asset.usefulLifeYears || 5) * 12);
        const monthlyDepreciation = cost / usefulLifeMonths;
        if (monthlyDepreciation <= 0) continue;

        const entry = await AssetManagementModel.create("depreciation", {
          assetId: asset.id,
          assetName: asset.assetName || asset.name,
          monthKey,
          assetCost: cost,
          monthlyDepreciation,
          accumulatedDepreciation: Number(asset.accumulatedDepreciation || 0) + monthlyDepreciation,
          bookValue: cost - (Number(asset.accumulatedDepreciation || 0) + monthlyDepreciation),
          status: "posted",
          postingStatus: "posted",
        });
        entries.push(entry);

        await AssetManagementModel.update("assets", asset.id, {
          accumulatedDepreciation: Number(asset.accumulatedDepreciation || 0) + monthlyDepreciation,
          bookValue: cost - (Number(asset.accumulatedDepreciation || 0) + monthlyDepreciation),
          lastDepreciationMonth: monthKey,
        });
      }

      return ok(res, { entries }, `Depreciation posted for ${entries.length} assets`);
    } catch (err) {
      return handleError(res, err, "postDepreciation");
    }
  },

  async approveDisposal(req, res) {
    return AssetManagementController.transition(req, res, "disposal", "approved", { approvalStatus: "approved", approvedAt: new Date().toISOString() });
  },

  async completeDisposal(req, res) {
    return AssetManagementController.transition(req, res, "disposal", "completed", { completedAt: new Date().toISOString() });
  },

  async markNotificationRead(req, res) {
    return AssetManagementController.transition(req, res, "notifications", "read", { readAt: new Date().toISOString() });
  },

  async resolveNotification(req, res) {
    return AssetManagementController.transition(req, res, "notifications", "resolved", { resolvedAt: new Date().toISOString() });
  },

  async transition(req, res, moduleName, status, extra = {}) {
    try {
      const item = await AssetManagementModel.transition(moduleName, req.params.id, status, extra);
      if (!item) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, { item }, "Status updated");
    } catch (err) {
      return handleError(res, err, "transition");
    }
  },
};
