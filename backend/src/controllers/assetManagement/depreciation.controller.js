import { DepreciationService } from "../../services/assetManagement/depreciation.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const DepreciationController = createAssetResourceController("depreciation", DepreciationService);
