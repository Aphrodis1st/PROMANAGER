import { TransfersModel } from "../../models/assetManagement/transfers.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const TransfersService = createAssetResourceService(TransfersModel);
