import { AuditsService } from "../../services/assetManagement/audits.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const AuditsController = createAssetResourceController("audits", AuditsService);
