import { ScanningService } from "../../services/assetManagement/scanning.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const ScanningController = createAssetResourceController("scanning", ScanningService);
