import { InventoryModel } from "../../models/assetManagement/inventory.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const InventoryService = createAssetResourceService(InventoryModel);
