import { SettingsController } from "../../controllers/assetManagement/settings.controller.js";
import { createAssetResourceRouter } from "./createAssetResource.routes.js";
export default createAssetResourceRouter(SettingsController);
