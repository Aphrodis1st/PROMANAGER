import { ScanningModel } from "../../models/assetManagement/scanning.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const ScanningService = createAssetResourceService(ScanningModel);
