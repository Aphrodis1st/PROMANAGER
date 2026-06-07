import { DisposalModel } from "../../models/assetManagement/disposal.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const DisposalService = createAssetResourceService(DisposalModel);
