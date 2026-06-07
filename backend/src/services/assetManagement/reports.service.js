import { ReportsModel } from "../../models/assetManagement/reports.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
export const ReportsService = createAssetResourceService(ReportsModel);
