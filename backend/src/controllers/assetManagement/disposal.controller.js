import { DisposalService } from "../../services/assetManagement/disposal.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const DisposalController = createAssetResourceController("disposal", DisposalService);
