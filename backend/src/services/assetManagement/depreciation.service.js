import { DepreciationModel } from "../../models/assetManagement/depreciation.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const DepreciationService = createAssetResourceService(DepreciationModel);
