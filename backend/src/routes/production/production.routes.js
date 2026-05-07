// src/routes/production/production.routes.js
import express from "express";
import { ProductionController } from "../../controllers/production/production.controller.js";

const router = express.Router();

// --- 🧩 PLANS ---
router.post("/plans", ProductionController.createPlan);
router.get("/plans", ProductionController.listPlans);
router.get("/plans/:id", ProductionController.getPlan);
router.put("/plans/:id", ProductionController.updatePlan);
router.put("/plans/:id/approve", ProductionController.approvePlan);

// --- ⚙️ CYCLES ---
router.get("/cycles", ProductionController.listCycles);
router.post("/cycles/start", ProductionController.startCycle);
router.post("/cycles/complete", ProductionController.completeCycle);
router.post("/cycles/migrate-to-inventory", ProductionController.migrateToInventory);
console.log("🔥 /cycles/complete route hit");

// --- 📦 FINISHED GOODS ---
router.get("/finished-goods", ProductionController.listFinishedGoods);

// --- 🔍 QUALITY INSPECTION ---
router.post("/inspections", ProductionController.createInspection);
router.get("/inspections", ProductionController.getInspections);

// --- 📊 REPORTS ---
router.get("/summary", ProductionController.getProductionSummary);

export default router;
