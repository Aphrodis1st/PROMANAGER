import { InventoryController } from "../../controllers/assetManagement/inventory.controller.js";
import { createAssetResourceRouter } from "./createAssetResource.routes.js";
export default createAssetResourceRouter(InventoryController);
