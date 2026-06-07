import { LendingModel } from "../../models/assetManagement/lending.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";

const baseService = createAssetResourceService(LendingModel);

export const LENDING_STATUSES = ["pending request", "authorized", "approved", "rejected"];

const statusAliases = {
  pending: "pending request",
  requested: "pending request",
  "pending-request": "pending request",
  "pending request": "pending request",
  autized: "authorized",
  authorised: "authorized",
  authorized: "authorized",
  aproved: "approved",
  approved: "approved",
  rejected: "rejected",
};

const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const normalizeStatus = (status) => {
  const key = String(status || "").trim().toLowerCase();
  const normalized = statusAliases[key];
  if (!normalized) {
    throw badRequest(`Invalid lending status. Allowed statuses: ${LENDING_STATUSES.join(", ")}`);
  }
  return normalized;
};

const normalizeLoan = (data = {}, { requireAsset = false } = {}) => {
  if (requireAsset && !data.assetId) throw badRequest("assetId is required");
  if (requireAsset && !data.borrower) throw badRequest("borrower is required");
  if (requireAsset && !data.returnDate) throw badRequest("returnDate is required");

  const status = normalizeStatus(data.status || data.approvalStatus || "pending request");
  return {
    ...data,
    status,
    approvalStatus: status,
    requestedAt: data.requestedAt || new Date().toISOString(),
  };
};

export const LendingService = {
  ...baseService,

  create(data) {
    return baseService.create(normalizeLoan(data, { requireAsset: true }));
  },

  update(id, data) {
    const payload = data.status || data.approvalStatus ? normalizeLoan(data) : data;
    return baseService.update(id, payload);
  },

  transition(id, status, extra = {}) {
    const normalized = normalizeStatus(status);
    return baseService.transition(id, normalized, {
      ...extra,
      approvalStatus: normalized,
      statusUpdatedAt: new Date().toISOString(),
    });
  },
};
