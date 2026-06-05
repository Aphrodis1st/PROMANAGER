import express from "express";
import { AssetManagementController } from "../../controllers/assetManagement/assetManagement.controller.js";

const router = express.Router();

router.get("/modules", AssetManagementController.getModules);
router.get("/dashboard", AssetManagementController.dashboard);

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
