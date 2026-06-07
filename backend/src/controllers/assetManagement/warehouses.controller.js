import { WarehousesService } from "../../services/assetManagement/warehouses.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const WarehousesController = createAssetResourceController("warehouses", WarehousesService);
