import express from "express";
import { TaxController } from "../../controllers/stock/tax.controller.js";
import { stockAuth } from "../../middleware/stock/auth.js";

const router = express.Router();

// Tax Configuration Routes
router.post("/", stockAuth, TaxController.createTax);
router.get("/", stockAuth, TaxController.getAllTaxes);
router.get("/active", stockAuth, TaxController.getActiveTaxes);
router.get("/:id", stockAuth, TaxController.getTaxById);
router.put("/:id", stockAuth, TaxController.updateTax);
router.delete("/:id", stockAuth, TaxController.deleteTax);

// Tax Group Routes
router.post("/groups", stockAuth, TaxController.createTaxGroup);
router.get("/groups/all", stockAuth, TaxController.getAllTaxGroups);
router.put("/groups/:id", stockAuth, TaxController.updateTaxGroup);
router.delete("/groups/:id", stockAuth, TaxController.deleteTaxGroup);

// Tax Report Routes
router.get("/transactions/all", stockAuth, TaxController.getTaxTransactions);
router.get("/reports/by-type", stockAuth, TaxController.getTaxReport);
router.get("/reports/summary", stockAuth, TaxController.getTaxSummary);

export default router;
