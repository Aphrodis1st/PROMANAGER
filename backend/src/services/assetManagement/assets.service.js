import { AssetsModel } from "../../models/assetManagement/assets.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const AssetsService = createAssetResourceService(AssetsModel);
