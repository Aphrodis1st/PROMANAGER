import { AssetsService } from "../../services/assetManagement/assets.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const AssetsController = createAssetResourceController("assets", AssetsService);
