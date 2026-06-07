import { AuditsModel } from "../../models/assetManagement/audits.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const AuditsService = createAssetResourceService(AuditsModel);
