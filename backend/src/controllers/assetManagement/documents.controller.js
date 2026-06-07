import { DocumentsService } from "../../services/assetManagement/documents.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const DocumentsController = createAssetResourceController("documents", DocumentsService);
