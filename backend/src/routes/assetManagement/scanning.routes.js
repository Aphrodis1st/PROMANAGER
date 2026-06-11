import express from "express";
import { ScanningController } from "../../controllers/assetManagement/scanning.controller.js";

const router = express.Router();

router.get("/", ScanningController.list);
router.post("/", ScanningController.create);
router.post("/:id/scan", ScanningController.scan);
router.get("/:id", ScanningController.getById);
router.put("/:id", ScanningController.update);
router.patch("/:id", ScanningController.update);
router.delete("/:id", ScanningController.remove);
router.post("/:id/status", ScanningController.transition);

export default router;
