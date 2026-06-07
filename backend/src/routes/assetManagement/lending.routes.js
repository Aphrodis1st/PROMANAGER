import { LendingController } from "../../controllers/assetManagement/lending.controller.js";
import { createAssetResourceRouter } from "./createAssetResource.routes.js";
export default createAssetResourceRouter(LendingController);
