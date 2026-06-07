import { InventoryService } from "../../services/assetManagement/inventory.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const InventoryController = createAssetResourceController("inventory", InventoryService);
