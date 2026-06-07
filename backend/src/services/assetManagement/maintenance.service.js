import { MaintenanceModel } from "../../models/assetManagement/maintenance.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const MaintenanceService = createAssetResourceService(MaintenanceModel);
