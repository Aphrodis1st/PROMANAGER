import { DocumentsModel } from "../../models/assetManagement/documents.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const DocumentsService = createAssetResourceService(DocumentsModel);
