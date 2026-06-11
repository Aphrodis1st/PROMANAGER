import { ScanningService } from "../../services/assetManagement/scanning.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";

const baseController = createAssetResourceController("scanning", ScanningService);

const handleError = (res, err, label) => {
  console.error(`Scanning ${label} error:`, err);
  return res.status(err.statusCode || 500).json({ success: false, error: err.message || "Request failed" });
};

export const ScanningController = {
  ...baseController,

  async scan(req, res) {
    try {
      const qrPayload = String(req.body?.qrPayload || "").trim();
      if (!qrPayload) {
        return res.status(400).json({ success: false, error: "Missing QR payload." });
      }

      const result = await ScanningService.scan(req.params.id, {
        qrPayload,
        scannedBy: req.body?.scannedBy || req.user?.email || req.user?.name,
        markVerified: req.body?.markVerified === true,
      });

      return res.json({ success: true, ...result });
    } catch (err) {
      return handleError(res, err, "scan");
    }
  },
};
