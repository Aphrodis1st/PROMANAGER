import { SettingsModel } from "../../models/assetManagement/settings.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const SettingsService = createAssetResourceService(SettingsModel);
