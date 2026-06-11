import { AssetsService } from "../../services/assetManagement/assets.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";

const baseController = createAssetResourceController("assets", AssetsService);

const handleError = (res, err, label) => {
  console.error(`Assets ${label} error:`, err);
  return res.status(err.statusCode || 500).json({ success: false, error: err.message || "Request failed" });
};

export const AssetsController = {
  ...baseController,

  async generateQr(req, res) {
    try {
      const regenerate = req.body?.regenerate === true || req.query?.regenerate === "true";
      const item = await AssetsService.generateQr(req.params.id, { regenerate });
      if (!item) return res.status(404).json({ success: false, error: "Asset not found" });
      return res.json({ success: true, message: "Asset QR generated", data: { item } });
    } catch (err) {
      return handleError(res, err, "generateQr");
    }
  },

  async getQrImage(req, res) {
    try {
      const format = String(req.query.format || "png").toLowerCase();
      const result = await AssetsService.getQrImage(req.params.id, { format });
      if (!result) return res.status(404).json({ success: false, error: "Asset not found" });

      if (format === "json" || format === "dataUrl") {
        return res.json({ success: true, data: result });
      }

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `inline; filename="${result.asset?.code || result.asset?.id || "asset"}.png"`);
      return res.send(result.buffer);
    } catch (err) {
      return handleError(res, err, "getQrImage");
    }
  },

  async verifyByQuery(req, res) {
    try {
      const assetId = String(req.query.id || req.query.assetId || "").trim();
      const assetToken = String(req.query.token || req.query.t || "").trim();
      if (!assetId || !assetToken) {
        return res.status(400).json({ success: false, error: "Missing asset id or token." });
      }

      const profile = await AssetsService.getPublicProfile(assetId, assetToken);
      if (!profile) {
        return res.status(404).json({ success: false, error: "Asset not found or token mismatch." });
      }

      return res.json({
        success: true,
        message: "Asset verified",
        data: profile,
      });
    } catch (err) {
      return handleError(res, err, "verifyByQuery");
    }
  },

  async scan(req, res) {
    try {
      const qrPayload = String(req.body?.qrPayload || "").trim();
      if (!qrPayload) {
        return res.status(400).json({ success: false, error: "Missing QR payload." });
      }

      const result = await AssetsService.scan({
        qrPayload,
        scanSessionId: req.body?.scanSessionId,
        scannedBy: req.body?.scannedBy || req.user?.email || req.user?.name,
        markVerified: req.body?.markVerified === true,
      });

      return res.json({ success: true, ...result });
    } catch (err) {
      return handleError(res, err, "scan");
    }
  },

  async profileFromQr(req, res) {
    try {
      const qrPayload = String(req.body?.qrPayload || req.query?.qrPayload || "").trim();
      if (!qrPayload) {
        return res.status(400).json({ success: false, error: "Missing QR payload." });
      }

      const profile = await AssetsService.getProfileFromQrPayload(qrPayload);
      return res.json({
        success: true,
        message: "Asset profile loaded",
        data: profile,
      });
    } catch (err) {
      return handleError(res, err, "profileFromQr");
    }
  },

  async receiveIntoInventory(req, res) {
    try {
      const item = await AssetsService.receiveIntoInventory(
        req.params.id,
        req.body || {},
        req.body?.scannedBy || req.user?.email || req.user?.name || "system"
      );
      if (!item) {
        return res.status(404).json({ success: false, error: "Asset not found" });
      }
      return res.json({
        success: true,
        message: "Asset added to inventory",
        data: { item },
      });
    } catch (err) {
      return handleError(res, err, "receiveIntoInventory");
    }
  },

  async emailQr(req, res) {
    try {
      const result = await AssetsService.emailQr(req.params.id, {
        to: req.body?.to,
        name: req.body?.name,
      });
      if (!result) return res.status(404).json({ success: false, error: "Asset not found" });

      if (result.email?.skipped) {
        return res.status(503).json({
          success: false,
          error: "Email is not configured. Set MAILTRAP_TOKEN in your environment.",
        });
      }

      return res.json({
        success: true,
        message: "Asset QR email sent",
        data: result,
      });
    } catch (err) {
      return handleError(res, err, "emailQr");
    }
  },
};
