import { MaintenanceService } from "../../services/assetManagement/maintenance.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const MaintenanceController = createAssetResourceController("maintenance", MaintenanceService);
