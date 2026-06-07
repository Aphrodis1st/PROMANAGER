import { ReportsService } from "../../services/assetManagement/reports.service.js";
import { createAssetResourceController } from "./createAssetResource.controller.js";
export const ReportsController = createAssetResourceController("reports", ReportsService);
