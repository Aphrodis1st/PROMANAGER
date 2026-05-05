import express from "express";
import { InventoryController } from "../../controllers/stock/inventory.controller.js";

const router = express.Router();

router.get("/report", InventoryController.getInventoryReport);
router.post("/update-opening-stocks", InventoryController.updateOpeningStocks);

export default router;
