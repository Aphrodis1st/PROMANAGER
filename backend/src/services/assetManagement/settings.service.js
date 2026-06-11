import crypto from "crypto";
import { SettingsModel } from "../../models/assetManagement/settings.model.js";
import { createAssetResourceService } from "./createAssetResource.service.js";
import { createUser, getUserByEmail, hashPassword } from "../../models/stock/user.model.js";
import { sendBranchAdminWelcomeEmail } from "../email.service.js";

const baseService = createAssetResourceService(SettingsModel);

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const stripSensitiveFields = (setting) => {
  if (!setting) return setting;
  const { assignedAdminPassword, ...safe } = setting;
  return safe;
};

const generateBranchCode = async () => {
  const existing = await SettingsModel.findAll({ type: "Branches" });
  const usedCodes = new Set(existing.map((branch) => String(branch.code || "").toUpperCase()));

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const code = `BR-${suffix}`;
    if (!usedCodes.has(code)) return code;
  }

  throw new Error("Could not generate a unique branch code. Please try again.");
};

const generateTemporaryPassword = () =>
  `Branch@${crypto.randomBytes(2).toString("hex").toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

const validateBranchInput = (data) => {
  const name = String(data.name || "").trim();
  const policy = String(data.policy || "").trim();
  const assignedAdminName = String(data.assignedAdminName || "").trim();
  const assignedAdminEmail = normalizeEmail(data.assignedAdminEmail);

  if (!name) throw Object.assign(new Error("Branch name is required."), { statusCode: 400 });
  if (!assignedAdminName) throw Object.assign(new Error("Branch admin name is required."), { statusCode: 400 });
  if (!assignedAdminEmail) throw Object.assign(new Error("Branch admin email is required."), { statusCode: 400 });

  return { name, policy, assignedAdminName, assignedAdminEmail };
};

const createBranch = async (data) => {
  const { name, policy, assignedAdminName, assignedAdminEmail } = validateBranchInput(data);
  const existingUser = await getUserByEmail(assignedAdminEmail);
  if (existingUser) {
    throw Object.assign(new Error("A user with this branch admin email already exists."), { statusCode: 400 });
  }

  const code = await generateBranchCode();
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  const branch = await SettingsModel.create({
    section: "Branch Setup",
    type: "Branches",
    name,
    code,
    policy,
    usefulLife: 0,
    depreciationMethod: "No Depreciation",
    status: "Draft",
    assignedAdminName,
    assignedAdminEmail,
    accountId: "",
  });

  const adminUser = await createUser({
    name: assignedAdminName,
    email: assignedAdminEmail,
    passwordHash,
    role: "STOCK_KEEPER",
    department: "Warehouse",
    extra: {
      organizationId: branch.id,
      isBranchAdmin: true,
      mustChangePassword: true,
    },
  });

  const savedBranch = await SettingsModel.update(branch.id, {
    assignedAdminUserId: adminUser.id,
  });

  try {
    await sendBranchAdminWelcomeEmail({
      email: assignedAdminEmail,
      name: assignedAdminName,
      branchName: name,
      branchCode: code,
      temporaryPassword,
    });
  } catch (error) {
    console.error("Failed to send branch admin welcome email:", error);
  }

  return stripSensitiveFields(savedBranch);
};

const updateBranch = async (id, data, existing) => {
  const payload = { ...data };
  delete payload.assignedAdminPassword;
  delete payload.code;
  delete payload.status;

  if (payload.assignedAdminEmail !== undefined) {
    payload.assignedAdminEmail = normalizeEmail(payload.assignedAdminEmail);
  }

  if (payload.name !== undefined) payload.name = String(payload.name).trim();
  if (payload.policy !== undefined) payload.policy = String(payload.policy).trim();
  if (payload.assignedAdminName !== undefined) payload.assignedAdminName = String(payload.assignedAdminName).trim();

  const updated = await SettingsModel.update(id, payload);
  return stripSensitiveFields(updated);
};

export const SettingsService = {
  list: async (filters = {}) => {
    const items = await baseService.list(filters);
    return items.map(stripSensitiveFields);
  },

  getById: async (id) => {
    const item = await baseService.getById(id);
    return stripSensitiveFields(item);
  },

  create: async (data) => {
    if (data?.type === "Branches") {
      return createBranch(data);
    }
    const item = await baseService.create(data);
    return stripSensitiveFields(item);
  },

  update: async (id, data) => {
    const existing = await SettingsModel.findById(id);
    if (existing?.type === "Branches") {
      return updateBranch(id, data, existing);
    }
    const item = await baseService.update(id, data);
    return stripSensitiveFields(item);
  },

  remove: baseService.remove,
  transition: baseService.transition,
};
