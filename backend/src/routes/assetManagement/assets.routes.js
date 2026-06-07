import { AssetsController } from "../../controllers/assetManagement/assets.controller.js";
import { createAssetResourceRouter } from "./createAssetResource.routes.js";
export default createAssetResourceRouter(AssetsController);
