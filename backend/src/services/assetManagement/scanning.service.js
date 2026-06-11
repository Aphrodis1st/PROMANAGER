import { ScanningModel } from "../../models/assetManagement/scanning.model.js";
import { AssetsService } from "./assets.service.js";
import { createAssetResourceService } from "./createAssetResource.service.js";

const baseService = createAssetResourceService(ScanningModel);

export const ScanningService = {
  ...baseService,

  scan: async (scanSessionId, { qrPayload, scannedBy, markVerified = false } = {}) => {
    return AssetsService.scan({
      qrPayload,
      scanSessionId,
      scannedBy,
      markVerified,
    });
  },
};
