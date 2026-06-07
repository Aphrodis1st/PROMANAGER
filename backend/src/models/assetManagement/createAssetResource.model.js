import { AssetManagementModel } from "./assetManagement.model.js";

export const createAssetResourceModel = (moduleName) => ({
  moduleName,
  create: (data) => AssetManagementModel.create(moduleName, data),
  findAll: (filters = {}) => AssetManagementModel.findAll(moduleName, filters),
  findById: (id) => AssetManagementModel.findById(moduleName, id),
  update: (id, data) => AssetManagementModel.update(moduleName, id, data),
  remove: (id) => AssetManagementModel.remove(moduleName, id),
  transition: (id, status, extra = {}) => AssetManagementModel.transition(moduleName, id, status, extra),
});
