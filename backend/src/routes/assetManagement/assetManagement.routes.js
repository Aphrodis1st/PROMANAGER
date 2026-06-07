import express from "express";
import { AssetManagementController } from "../../controllers/assetManagement/assetManagement.controller.js";
import assetsRoutes from "./assets.routes.js";
import settingsRoutes from "./settings.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import warehousesRoutes from "./warehouses.routes.js";
import scanningRoutes from "./scanning.routes.js";
import transfersRoutes from "./transfers.routes.js";
import lendingRoutes from "./lending.routes.js";
import maintenanceRoutes from "./maintenance.routes.js";
import auditsRoutes from "./audits.routes.js";
import depreciationRoutes from "./depreciation.routes.js";
import disposalRoutes from "./disposal.routes.js";
import documentsRoutes from "./documents.routes.js";
import reportsRoutes from "./reports.routes.js";

const router = express.Router();

router.get("/modules", AssetManagementController.getModules);
router.get("/dashboard", AssetManagementController.dashboard);

router.use("/assets", assetsRoutes);
router.use("/settings", settingsRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/warehouses", warehousesRoutes);
router.use("/scanning", scanningRoutes);
router.use("/transfers", transfersRoutes);
router.use("/lending", lendingRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/audits", auditsRoutes);
router.use("/depreciation", depreciationRoutes);
router.use("/disposal", disposalRoutes);
router.use("/documents", documentsRoutes);
router.use("/reports", reportsRoutes);

router.post("/assets/:id/verify", AssetManagementController.verifyAsset);

router.post("/inventory/:id/receipt", AssetManagementController.stockReceipt);
router.post("/inventory/:id/issue", AssetManagementController.stockIssue);

router.post("/transfers/:id/approve", AssetManagementController.approveTransfer);
router.post("/transfers/:id/dispatch", AssetManagementController.dispatchTransfer);
router.post("/transfers/:id/receive", AssetManagementController.receiveTransfer);

router.post("/maintenance/:id/start", AssetManagementController.startMaintenance);
router.post("/maintenance/:id/complete", AssetManagementController.completeMaintenance);

router.post("/audits/:id/close", AssetManagementController.closeAudit);

router.post("/depreciation/post", AssetManagementController.postDepreciation);

router.post("/disposal/:id/approve", AssetManagementController.approveDisposal);
router.post("/disposal/:id/complete", AssetManagementController.completeDisposal);

router.post("/notifications/:id/read", AssetManagementController.markNotificationRead);
router.post("/notifications/:id/resolve", AssetManagementController.resolveNotification);

router.get("/:module", AssetManagementController.list);
router.post("/:module", AssetManagementController.create);
router.get("/:module/:id", AssetManagementController.getById);
router.put("/:module/:id", AssetManagementController.update);
router.patch("/:module/:id", AssetManagementController.update);
router.delete("/:module/:id", AssetManagementController.remove);

export default router;
