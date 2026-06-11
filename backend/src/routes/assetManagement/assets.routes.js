import express from "express";
import { AssetsController } from "../../controllers/assetManagement/assets.controller.js";

const router = express.Router();

router.get("/verify", AssetsController.verifyByQuery);
router.post("/scan", AssetsController.scan);
router.post("/profile", AssetsController.profileFromQr);

router.get("/", AssetsController.list);
router.post("/", AssetsController.create);
router.get("/:id/qr", AssetsController.getQrImage);
router.post("/:id/receive", AssetsController.receiveIntoInventory);
router.post("/:id/generate-qr", AssetsController.generateQr);
router.post("/:id/qr/email", AssetsController.emailQr);
router.get("/:id", AssetsController.getById);
router.put("/:id", AssetsController.update);
router.patch("/:id", AssetsController.update);
router.delete("/:id", AssetsController.remove);
router.post("/:id/status", AssetsController.transition);

export default router;
