import { DocumentsController } from "../../controllers/assetManagement/documents.controller.js";
import { createAssetResourceRouter } from "./createAssetResource.routes.js";
export default createAssetResourceRouter(DocumentsController);
