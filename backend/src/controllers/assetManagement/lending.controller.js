import { LendingService } from "../../services/assetManagement/lending.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const LendingController = createAssetResourceController("lending", LendingService);
