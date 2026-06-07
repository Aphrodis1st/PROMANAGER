import { WarehousesModel } from "../../models/assetManagement/warehouses.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const WarehousesService = createAssetResourceService(WarehousesModel);
