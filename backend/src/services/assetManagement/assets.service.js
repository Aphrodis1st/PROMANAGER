import crypto from "crypto";
import QRCode from "qrcode";
import { AssetsModel } from "../../models/assetManagement/assets.model.js";
import { AssetManagementModel } from "../../models/assetManagement/assetManagement.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
import { buildAssetVerifyUrl, parseAssetQrPayload } from "../../utils/assetQr.js";
import { sendAssetQrEmail } from "../email.service.js";

const baseService = createAssetResourceService(AssetsModel);

const badRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });

const stripToken = (asset) => {
  if (!asset) return asset;
  const { assetToken, ...safe } = asset;
  return safe;
};

const ensureAssetQrFields = async (asset, { regenerate = false } = {}) => {
  if (!asset) return null;

  const needsQr = regenerate || !asset.qrPayload || !asset.assetToken;
  if (!needsQr) {
    return asset;
  }

  const assetToken = regenerate || !asset.assetToken ? crypto.randomUUID() : asset.assetToken;
  const qrPayload = buildAssetVerifyUrl(asset.id, assetToken);

  return AssetsModel.update(asset.id, {
    assetToken,
    qrPayload,
    qrCode: qrPayload,
    qrGeneratedAt: new Date().toISOString(),
  });
};

const matchesAssetTag = (asset, assetTag) => {
  if (!assetTag) return false;
  const tag = String(assetTag).trim().toLowerCase();
  const candidates = [asset.tagNumber, asset.code, asset.assetCode, asset.assetTag].filter(Boolean);
  return candidates.some((value) => String(value).trim().toLowerCase() === tag);
};

const resolveAssetFromPayload = async (qrPayload) => {
  const parsed = parseAssetQrPayload(qrPayload);
  if (!parsed) {
    throw badRequest("Invalid QR payload. Scan a valid asset label or use the in-app scanner.");
  }

  let asset = null;

  if (parsed.assetId) {
    asset = await AssetsModel.findById(parsed.assetId);
  }

  if (!asset && parsed.assetTag) {
    const rows = await AssetsModel.findAll({ search: parsed.assetTag });
    asset = rows.find((row) => matchesAssetTag(row, parsed.assetTag)) || null;
  }

  if (!asset) {
    throw badRequest("Asset was not found.");
  }

  if (parsed.assetToken && String(asset.assetToken || "") !== parsed.assetToken) {
    throw badRequest("Asset token mismatch.");
  }

  return asset;
};

const buildHistoryEntry = (action, previous, current, changedBy = "system") => {
  const changedAt = new Date().toISOString();
  const summaryParts = [];

  if (previous.assetStatus !== current.assetStatus) {
    summaryParts.push(`status ${previous.assetStatus || "-"} to ${current.assetStatus || "-"}`);
  }
  if (previous.availability !== current.availability) {
    summaryParts.push(`availability ${previous.availability || "-"} to ${current.availability || "-"}`);
  }
  if (previous.branchLocation !== current.branchLocation || previous.warehouseLocation !== current.warehouseLocation) {
    summaryParts.push(`location ${previous.branchLocation || "-"} to ${current.branchLocation || "-"}`);
  }

  return {
    id: `history-${changedAt}`,
    action,
    summary: summaryParts.length
      ? `Updated ${current.assetName || current.name || "asset"}: ${summaryParts.join(", ")}.`
      : `Updated ${current.assetName || current.name || "asset"}.`,
    changedAt,
    changedBy,
    previousSnapshot: previous,
    currentSnapshot: current,
  };
};

const snapshotAsset = (asset) => ({
  assetName: asset.assetName || asset.name || "",
  assetTag: asset.tagNumber || asset.code || asset.assetCode || "",
  receiver: asset.receiver || asset.custodianName || asset.assignedTo || asset.firstReceiver || "-",
  branch: asset.branchLocation || asset.branch || "-",
  warehouse: asset.warehouseLocation || asset.warehouse || "-",
  floor: asset.floorLocation || asset.floor || "-",
  room: asset.roomLocation || asset.room || "-",
  standGroup: asset.standGroupLocation || asset.standGroup || "-",
  block: asset.blockLocation || asset.block || "-",
  qrLocationPayload: asset.qrPayload || asset.qrCode || "-",
  assetStatus: asset.assetStatus || asset.status || "-",
  availability: asset.availability || "-",
});

export const AssetsService = {
  ...baseService,

  create: async (data) => {
    const item = await baseService.create(data);
    return stripToken(item);
  },

  getById: async (id) => {
    const item = await baseService.getById(id);
    return stripToken(item);
  },

  list: async (filters = {}) => {
    const items = await baseService.list(filters);
    return items.map(stripToken);
  },

  update: async (id, data) => {
    const payload = { ...data };
    delete payload.assetToken;
    delete payload.qrPayload;
    delete payload.qrCode;
    const item = await baseService.update(id, payload);
    return stripToken(item);
  },

  generateQr: async (id, { regenerate = false } = {}) => {
    const asset = await AssetsModel.findById(id);
    if (!asset) return null;
    const updated = await ensureAssetQrFields(asset, { regenerate });
    return stripToken(updated);
  },

  getQrImage: async (id, { format = "png" } = {}) => {
    const asset = await AssetsModel.findById(id);
    if (!asset) return null;

    const withQr = await ensureAssetQrFields(asset);
    const qrPayload = withQr.qrPayload;

    if (format === "json" || format === "dataUrl") {
      const dataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 320 });
      return {
        assetId: withQr.id,
        assetCode: withQr.code || withQr.assetCode,
        assetName: withQr.assetName || withQr.name,
        qrPayload,
        dataUrl,
      };
    }

    const buffer = await QRCode.toBuffer(qrPayload, { margin: 1, width: 320, type: "png" });
    return { buffer, qrPayload, asset: stripToken(withQr) };
  },

  verifyByToken: async (assetId, assetToken) => {
    const asset = await AssetsModel.findById(assetId);
    if (!asset || String(asset.assetToken || "") !== String(assetToken || "").trim()) {
      return null;
    }
    return stripToken(asset);
  },

  getPublicProfile: async (assetId, assetToken) => {
    const asset = await AssetsModel.findById(assetId);
    if (!asset || String(asset.assetToken || "") !== String(assetToken || "").trim()) {
      return null;
    }

    const tagNumber = asset.tagNumber || asset.code || asset.assetCode || "";
    const assetName = asset.assetName || asset.name || "";

    const matchesAsset = (record = {}) =>
      record.assetId === assetId ||
      (tagNumber && (record.assetTag === tagNumber || record.assetCode === tagNumber || record.tagNumber === tagNumber)) ||
      (assetName && record.assetName === assetName);

    const [transfers, maintenance, audits, lending, depreciation, disposal, documents] = await Promise.all([
      AssetManagementModel.findAll("transfers"),
      AssetManagementModel.findAll("maintenance"),
      AssetManagementModel.findAll("audits"),
      AssetManagementModel.findAll("lending"),
      AssetManagementModel.findAll("depreciation"),
      AssetManagementModel.findAll("disposal"),
      AssetManagementModel.findAll("documents"),
    ]);

    const relatedTransfers = transfers.filter(matchesAsset);
    const relatedMaintenance = maintenance.filter(matchesAsset);
    const relatedAudits = audits.filter(matchesAsset);
    const relatedLending = lending.filter(matchesAsset);
    const relatedDepreciation = depreciation.filter(matchesAsset);
    const relatedDisposal = disposal.filter(matchesAsset);
    const relatedDocuments = documents.filter(matchesAsset);

    const registerHistory = Array.isArray(asset.history) ? asset.history : [];

    const toIso = (value) => {
      if (!value) return "";
      if (value?.toDate) return value.toDate().toISOString();
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
    };

    const workflowTimeline = [
      ...registerHistory.map((entry) => ({
        id: entry.id || `history-${entry.changedAt}`,
        type: "Register",
        action: entry.action || "Updated",
        title: entry.action || "Asset update",
        summary: entry.summary || "",
        occurredAt: toIso(entry.changedAt),
        payload: entry,
      })),
      ...relatedTransfers.map((entry) => ({
        id: entry.id,
        type: "Transfer",
        action: entry.status || "Transfer",
        title: entry.transferNumber || entry.code || "Asset transfer",
        summary: entry.summary || entry.justification || `Transfer for ${assetName || tagNumber}`,
        occurredAt: toIso(entry.createdAt || entry.dispatchedAt || entry.receivedAt),
        payload: entry,
      })),
      ...relatedMaintenance.map((entry) => ({
        id: entry.id,
        type: "Maintenance",
        action: entry.status || "Maintenance",
        title: entry.title || entry.code || "Maintenance job",
        summary: entry.description || entry.notes || `Maintenance for ${assetName || tagNumber}`,
        occurredAt: toIso(entry.createdAt || entry.startedAt || entry.completedAt),
        payload: entry,
      })),
      ...relatedAudits.map((entry) => ({
        id: entry.id,
        type: "Audit",
        action: entry.status || "Audit",
        title: entry.auditNumber || entry.code || "Audit session",
        summary: entry.notes || entry.summary || `Audit check for ${assetName || tagNumber}`,
        occurredAt: toIso(entry.createdAt || entry.closedAt),
        payload: entry,
      })),
      ...relatedLending.map((entry) => ({
        id: entry.id,
        type: "Lending",
        action: entry.status || "Lending",
        title: entry.loanNumber || entry.code || "Lending record",
        summary: entry.purpose || entry.notes || `Loan record for ${assetName || tagNumber}`,
        occurredAt: toIso(entry.createdAt || entry.loanDate),
        payload: entry,
      })),
      ...relatedDepreciation.map((entry) => ({
        id: entry.id,
        type: "Depreciation",
        action: entry.status || "Depreciation",
        title: entry.monthKey || entry.code || "Depreciation entry",
        summary: `Depreciation posted for ${assetName || tagNumber}`,
        occurredAt: toIso(entry.createdAt || entry.monthKey),
        payload: entry,
      })),
      ...relatedDisposal.map((entry) => ({
        id: entry.id,
        type: "Disposal",
        action: entry.status || "Disposal",
        title: entry.disposalNumber || entry.code || "Disposal request",
        summary: entry.reason || entry.notes || `Disposal workflow for ${assetName || tagNumber}`,
        occurredAt: toIso(entry.createdAt || entry.completedAt),
        payload: entry,
      })),
    ].sort((a, b) => new Date(b.occurredAt || 0).getTime() - new Date(a.occurredAt || 0).getTime());

    await AssetsModel.update(assetId, {
      lastQrScan: new Date().toISOString(),
      scanCount: Number(asset.scanCount || 0) + 1,
    }).catch(() => {});

    const safeAsset = stripToken(asset);

    return {
      asset: {
        id: safeAsset.id,
        tagNumber: safeAsset.tagNumber || safeAsset.code || safeAsset.assetCode,
        code: safeAsset.code || safeAsset.assetCode,
        assetName: safeAsset.assetName || safeAsset.name,
        model: safeAsset.model,
        brand: safeAsset.brand,
        supplier: safeAsset.supplier,
        batch: safeAsset.batch,
        quantity: safeAsset.quantity,
        price: safeAsset.price,
        guaranteePeriod: safeAsset.guaranteePeriod,
        receivedDate: safeAsset.receivedDate,
        firstReceiver: safeAsset.firstReceiver,
        branchLocation: safeAsset.branchLocation,
        warehouseLocation: safeAsset.warehouseLocation,
        floorLocation: safeAsset.floorLocation,
        roomLocation: safeAsset.roomLocation,
        standGroupLocation: safeAsset.standGroupLocation,
        blockLocation: safeAsset.blockLocation,
        currentStore: safeAsset.currentStore,
        previousStore: safeAsset.previousStore,
        assetStatus: safeAsset.assetStatus || safeAsset.status,
        availability: safeAsset.availability,
        verificationStatus: safeAsset.verificationStatus,
        lastQrScan: safeAsset.lastQrScan,
        scannedBy: safeAsset.scannedBy,
        qrPayload: safeAsset.qrPayload || safeAsset.qrCode || "",
        createdAt: safeAsset.createdAt,
        updatedAt: safeAsset.updatedAt,
      },
      history: registerHistory,
      timeline: workflowTimeline,
      related: {
        transfers: relatedTransfers,
        maintenance: relatedMaintenance,
        audits: relatedAudits,
        lending: relatedLending,
        depreciation: relatedDepreciation,
        disposal: relatedDisposal,
        documents: relatedDocuments,
      },
    };
  },

  getProfileFromQrPayload: async (qrPayload) => {
    const asset = await resolveAssetFromPayload(qrPayload);
    const profile = await AssetsService.getPublicProfile(asset.id, asset.assetToken);
    if (!profile) {
      throw badRequest("Asset profile could not be loaded.");
    }
    return profile;
  },

  receiveIntoInventory: async (assetId, data = {}, scannedBy = "system") => {
    const asset = await AssetsModel.findById(assetId);
    if (!asset) {
      return null;
    }

    const previousSnapshot = snapshotAsset(asset);
    const updatePayload = {
      assetStatus: data.assetStatus || "Received",
      availability: data.availability || "Available",
      branchLocation: data.branchLocation ?? asset.branchLocation,
      warehouseLocation: data.warehouseLocation ?? asset.warehouseLocation,
      floorLocation: data.floorLocation ?? asset.floorLocation,
      roomLocation: data.roomLocation ?? asset.roomLocation,
      standGroupLocation: data.standGroupLocation ?? asset.standGroupLocation,
      blockLocation: data.blockLocation ?? asset.blockLocation,
      currentStore: data.currentStore ?? asset.currentStore,
      receiver: data.receiver ?? asset.receiver ?? asset.custodianName,
      receivedDate: data.receivedDate || new Date().toISOString().slice(0, 10),
      lastScannedAt: new Date().toISOString(),
      lastScannedBy: scannedBy,
      scanCount: Number(asset.scanCount || 0) + 1,
      verificationStatus: "verified",
      verifiedAt: new Date().toISOString(),
      verifiedBy: scannedBy,
    };

    const currentSnapshot = snapshotAsset({ ...asset, ...updatePayload });
    const history = Array.isArray(asset.history) ? [...asset.history] : [];
    history.unshift(buildHistoryEntry("Updated", previousSnapshot, currentSnapshot, scannedBy));

    const updated = await AssetsModel.update(assetId, {
      ...updatePayload,
      history,
    });

    return stripToken(updated);
  },

  scan: async ({ qrPayload, scanSessionId, scannedBy, markVerified = false } = {}) => {
    const asset = await resolveAssetFromPayload(qrPayload);

    const scanCount = Number(asset.scanCount || 0) + 1;
    const updatePayload = {
      lastScannedAt: new Date().toISOString(),
      lastScannedBy: scannedBy || "system",
      scanCount,
    };

    if (markVerified) {
      updatePayload.verificationStatus = "verified";
      updatePayload.verifiedAt = new Date().toISOString();
      updatePayload.verifiedBy = scannedBy || "system";
    }

    const updated = await AssetsModel.update(asset.id, updatePayload);

    if (scanSessionId) {
      const session = await AssetManagementModel.findById("scanning", scanSessionId);
      if (session) {
        const matchedCount = Number(session.matchedCount || 0) + 1;
        const scanSessionCount = Number(session.scanCount || 0) + 1;
        await AssetManagementModel.update("scanning", scanSessionId, {
          scanCount: scanSessionCount,
          matchedCount,
          lastScanAt: new Date().toISOString(),
          lastScannedAssetId: asset.id,
          status: session.status === "pending" ? "in_progress" : session.status,
        });
      }
    }

    return {
      ok: true,
      message: `Asset ${updated.code || updated.assetCode || updated.id} validated.`,
      asset: stripToken(updated),
    };
  },

  emailQr: async (id, { to, name } = {}) => {
    const asset = await AssetsModel.findById(id);
    if (!asset) return null;

    const withQr = await ensureAssetQrFields(asset);
    const recipient = String(to || withQr.custodianEmail || withQr.assignedEmail || "").trim();
    if (!recipient) {
      throw badRequest("Recipient email is required.");
    }

    const qrDataUrl = await QRCode.toDataURL(withQr.qrPayload, { margin: 1, width: 260 });
    const contentBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const assetCode = withQr.code || withQr.assetCode || withQr.id;
    const assetName = withQr.assetName || withQr.name || "Asset";

    const result = await sendAssetQrEmail({
      to: recipient,
      name: name || withQr.custodianName || withQr.assignedTo || "Asset custodian",
      assetName,
      assetCode,
      qrAttachment: {
        filename: `${assetCode}.png`,
        content: Buffer.from(contentBase64, "base64"),
      },
    });

    return { asset: stripToken(withQr), email: result };
  },
};
