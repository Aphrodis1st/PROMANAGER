import { SettingsService } from "../../services/assetManagement/settings.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const SettingsController = createAssetResourceController("settings", SettingsService);
