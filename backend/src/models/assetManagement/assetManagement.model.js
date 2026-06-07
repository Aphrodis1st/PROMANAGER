import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const MODULES = {
  settings: {
    collection: "assetSettings",
    codePrefix: "SET",
    defaults: { status: "Active", section: "Asset Type Setup", type: "Asset Types" },
    numericFields: ["usefulLife"],
  },
  assets: {
    collection: "assetMasterRecords",
    codePrefix: "AST",
    defaults: {
      status: "active",
      lifecycleStatus: "registered",
      category: "",
      subcategory: "",
      locationName: "",
      departmentName: "",
      custodianName: "",
      warrantyStatus: "unknown",
      verificationStatus: "pending",
    },
    numericFields: ["cost", "purchaseCost", "bookValue", "salvageValue", "usefulLifeYears"],
  },
  inventory: {
    collection: "assetInventoryItems",
    codePrefix: "INV",
    defaults: { status: "active", unit: "pcs", locationName: "", binCode: "", valuationMethod: "FIFO" },
    numericFields: ["quantity", "reorderLevel", "unitCost", "totalValue", "damagedQuantity", "expiredQuantity"],
  },
  warehouses: {
    collection: "assetWarehouses",
    codePrefix: "WH",
    defaults: { status: "active", type: "warehouse", managerName: "", utilizationRate: 0 },
    numericFields: ["capacity", "occupiedBins", "totalBins", "utilizationRate"],
  },
  scanning: {
    collection: "assetScanSessions",
    codePrefix: "SCN",
    defaults: { status: "pending", scanType: "qr", syncStatus: "online" },
    numericFields: ["scanCount", "matchedCount", "exceptionCount", "accuracyRate"],
  },
  transfers: {
    collection: "assetTransferRequests",
    codePrefix: "TRF",
    defaults: { status: "requested", priority: "normal", approvalStatus: "pending" },
    numericFields: ["assetCount"],
  },
  lending: {
    collection: "assetLendingRecords",
    codePrefix: "LND",
    defaults: { status: "pending request", approvalStatus: "pending request", returnStatus: "pending return", priority: "normal" },
    numericFields: ["assetCount", "loanValue", "damageCost", "estimatedCost"],
  },
  maintenance: {
    collection: "assetMaintenanceJobs",
    codePrefix: "MNT",
    defaults: { status: "open", maintenanceType: "corrective", priority: "normal" },
    numericFields: ["estimatedCost", "actualCost", "laborCost", "partsCost"],
  },
  audits: {
    collection: "assetAuditSessions",
    codePrefix: "AUD",
    defaults: { status: "planned", auditType: "physical", exceptionStatus: "none" },
    numericFields: ["plannedCount", "verifiedCount", "missingCount", "damagedCount", "exceptionCount"],
  },
  depreciation: {
    collection: "assetDepreciationEntries",
    codePrefix: "DEP",
    defaults: { status: "draft", method: "straight_line", postingStatus: "pending" },
    numericFields: ["assetCost", "monthlyDepreciation", "accumulatedDepreciation", "bookValue"],
  },
  disposal: {
    collection: "assetDisposalRequests",
    codePrefix: "DSP",
    defaults: { status: "requested", disposalMethod: "write_off", approvalStatus: "pending" },
    numericFields: ["assetCount", "bookValue", "saleValue", "gainLoss"],
  },
  documents: {
    collection: "assetDocuments",
    codePrefix: "DOC",
    defaults: { status: "active", documentType: "general", version: 1 },
    numericFields: ["version", "fileSize"],
  },
  reports: {
    collection: "assetReports",
    codePrefix: "RPT",
    defaults: { status: "ready", reportType: "asset_register", format: "pdf" },
    numericFields: ["runCount"],
  },
  workflows: {
    collection: "assetWorkflows",
    codePrefix: "WF",
    defaults: { status: "active", workflowType: "approval", priority: "normal" },
    numericFields: ["stepCount", "slaHours", "escalationCount"],
  },
  notifications: {
    collection: "assetNotifications",
    codePrefix: "NTF",
    defaults: { status: "unread", priority: "normal", channel: "in_app" },
    numericFields: [],
  },
};

const moduleNames = Object.keys(MODULES);

const getModuleConfig = (moduleName) => {
  const config = MODULES[moduleName];
  if (!config) {
    const allowed = moduleNames.join(", ");
    throw new Error(`Invalid asset management module "${moduleName}". Allowed modules: ${allowed}`);
  }
  return config;
};

const collectionFor = (moduleName) => db().collection(getModuleConfig(moduleName).collection);

const cleanValue = (value) => {
  if (Array.isArray(value)) return value.map(cleanValue).filter((item) => item !== undefined);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.entries(value).reduce((acc, [key, item]) => {
      const cleaned = cleanValue(item);
      if (cleaned !== undefined) acc[key] = cleaned;
      return acc;
    }, {});
  }
  return value === undefined ? undefined : value;
};

const sanitize = (data = {}, moduleName, { includeDefaults = true } = {}) => {
  const config = getModuleConfig(moduleName);
  const payload = cleanValue(includeDefaults ? { ...config.defaults, ...data } : { ...data });

  for (const field of config.numericFields || []) {
    if (payload[field] !== undefined && payload[field] !== null && payload[field] !== "") {
      payload[field] = Number(payload[field]) || 0;
    }
  }

  return payload;
};

const buildCode = (config, docId) => `${config.codePrefix}-${docId.slice(0, 6).toUpperCase()}`;

const matchesFilters = (item, filters = {}) => {
  return Object.entries(filters).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    if (["limit", "page", "search"].includes(key)) return true;
    return String(item[key] || "").toLowerCase() === String(value).toLowerCase();
  });
};

export const AssetManagementModel = {
  modules: moduleNames,

  async create(moduleName, data) {
    const config = getModuleConfig(moduleName);
    const collection = collectionFor(moduleName);
    const doc = collection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const payload = sanitize(data, moduleName);

    payload.id = doc.id;
    payload.code = payload.code || payload.assetCode || buildCode(config, doc.id);
    payload.createdAt = timestamp;
    payload.updatedAt = timestamp;

    await doc.set(payload);
    return { id: doc.id, ...payload };
  },

  async findAll(moduleName, filters = {}) {
    const snap = await collectionFor(moduleName).orderBy("createdAt", "desc").get();
    let rows = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      rows = rows.filter((row) =>
        [row.name, row.assetName, row.title, row.code, row.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q))
      );
    }

    rows = rows.filter((row) => matchesFilters(row, filters));

    const limit = Number(filters.limit) || 0;
    return limit > 0 ? rows.slice(0, limit) : rows;
  },

  async findById(moduleName, id) {
    const doc = await collectionFor(moduleName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(moduleName, id, data) {
    const ref = collectionFor(moduleName).doc(id);
    const existing = await ref.get();
    if (!existing.exists) return null;

    const payload = sanitize(data, moduleName, { includeDefaults: false });
    delete payload.id;
    delete payload.createdAt;
    payload.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await ref.set(payload, { merge: true });
    return this.findById(moduleName, id);
  },

  async remove(moduleName, id) {
    const ref = collectionFor(moduleName).doc(id);
    const existing = await ref.get();
    if (!existing.exists) return false;
    await ref.delete();
    return true;
  },

  async transition(moduleName, id, status, extra = {}) {
    return this.update(moduleName, id, {
      ...extra,
      status,
      statusChangedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  },

  async dashboard() {
    const result = {};

    for (const moduleName of moduleNames) {
      const rows = await this.findAll(moduleName);
      result[moduleName] = {
        total: rows.length,
        active: rows.filter((row) => ["active", "open", "in_progress", "requested"].includes(row.status)).length,
        pending: rows.filter((row) =>
          ["pending", "requested", "planned", "draft", "unread"].includes(row.status) ||
          ["pending"].includes(row.approvalStatus)
        ).length,
        critical: rows.filter((row) => ["critical", "high"].includes(row.priority)).length,
      };
    }

    return result;
  },

  async assetFinancialSummary() {
    const assets = await this.findAll("assets");
    const depreciation = await this.findAll("depreciation");
    const cost = assets.reduce((sum, asset) => sum + Number(asset.cost || asset.purchaseCost || 0), 0);
    const accumulated = depreciation.reduce((sum, entry) => sum + Number(entry.monthlyDepreciation || 0), 0);

    return {
      totalAssets: assets.length,
      totalCost: cost,
      accumulatedDepreciation: accumulated,
      netBookValue: cost - accumulated,
      verifiedAssets: assets.filter((asset) => asset.verificationStatus === "verified").length,
      missingLabels: assets.filter((asset) => !asset.qrCode && !asset.barcode).length,
    };
  },
};
