import { TransfersService } from "../../services/assetManagement/transfers.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const TransfersController = createAssetResourceController("transfers", TransfersService);
