import { MaintenanceController } from "../../controllers/assetManagement/maintenance.controller.js";
import { createAssetResourceRouter } from "./createAssetResource.routes.js";
export default createAssetResourceRouter(MaintenanceController);
