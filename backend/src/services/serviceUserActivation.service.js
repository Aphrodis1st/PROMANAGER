import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../../utils/firebase.js';
import { sendMail, buildServiceActivationEmail } from '../utils/mailer.js';
import { HospitalAdmin } from '../models/superAdmin/hospitalAdmin.model.js';
import { HRAdmin } from '../models/superAdmin/hrAdmin.model.js';
import { hashPassword as hashStockPassword, updateUser as updateStockUser } from '../models/stock/user.model.js';
import { hashPassword as hashPharmacyPassword } from '../models/user.model.js';
import { syncServiceAccountStatus } from './userStatusSync.service.js';
import {
  isServiceUserRole,
  getLoginPathForRole,
  roleMatchesService,
  CREDENTIAL_TTL_DAYS,
} from '../config/serviceUserRoles.config.js';

export function generateServiceCredentialsPassword() {
  return crypto.randomBytes(12).toString('base64url').slice(0, 16);
}

function getCredentialExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CREDENTIAL_TTL_DAYS);
  return expiresAt;
}

function getAccountHolder(record) {
  return record.registrant?.is_manager
    ? record.registrant
    : record.manager || record.registrant;
}

async function applyCredentialsToAccount({ serviceId, userId }, plainPassword, expiresAt) {
  if (!userId) return;

  const credentialFields = {
    credentialsExpiresAt: expiresAt,
    mustChangePassword: true,
    updatedAt: new Date(),
  };

  switch (serviceId) {
    case 'hospital': {
      const hash = await bcrypt.hash(plainPassword, 10);
      await HospitalAdmin.update(userId, {
        password: hash,
        status: 'active',
        ...credentialFields,
      });
      break;
    }
    case 'hr': {
      const hash = await bcrypt.hash(plainPassword, 10);
      await HRAdmin.update(userId, {
        password: hash,
        status: 'active',
        isActive: true,
        ...credentialFields,
      });
      break;
    }
    case 'pharmacy': {
      const hash = await hashPharmacyPassword(plainPassword);
      await db().collection('users').doc(userId).update({
        passwordHash: hash,
        status: 'active',
        isActive: true,
        ...credentialFields,
      });
      break;
    }
    case 'stock': {
      const hash = await hashStockPassword(plainPassword);
      await updateStockUser(userId, {
        passwordHash: hash,
        isActive: true,
        accountDisabled: false,
        ...credentialFields,
      });
      break;
    }
    case 'property': {
      const hash = await bcrypt.hash(plainPassword, 10);
      await db().collection('propertyStaff').doc(userId).update({
        passwordHash: hash,
        status: 'active',
        isActive: true,
        ...credentialFields,
      });
      break;
    }
    case 'ngo':
      await db().collection('ngo_users').doc(userId).update({
        accountStatus: 'Active',
        passwordHash: await bcrypt.hash(plainPassword, 10),
        ...credentialFields,
      });
      break;
    default:
      break;
  }
}

function shouldProvision(record, previous) {
  const status = record.status || 'inactive';
  const roleName = record.role?.role_name;

  if (status !== 'active' || !roleName || !isServiceUserRole(roleName)) {
    return false;
  }

  if (!roleMatchesService(roleName, record.serviceId)) {
    return false;
  }

  const roleId = record.role?.role_id;
  const prevRoleId = previous?.role?.role_id;
  const wasActive = (previous?.status || 'inactive') === 'active';

  if (!record.activationEmailSentAt) return true;
  if (!wasActive && status === 'active') return true;
  if (roleId && roleId !== prevRoleId) return true;

  return false;
}

/**
 * When a service registration is active and has a service admin role,
 * issue 3-day credentials and send the congratulations email.
 */
export async function tryProvisionServiceUser(record, { previous = null } = {}) {
  if (!shouldProvision(record, previous)) {
    return { provisioned: false };
  }

  const roleName = record.role.role_name;
  if (!roleMatchesService(roleName, record.serviceId)) {
    throw Object.assign(
      new Error(`Role ${roleName} cannot be assigned to ${record.serviceId} registrations.`),
      { status: 400 },
    );
  }

  const accountHolder = getAccountHolder(record);
  if (!accountHolder?.email) {
    throw Object.assign(new Error('No account email found for this registration.'), { status: 400 });
  }

  const plainPassword = generateServiceCredentialsPassword();
  const expiresAt = getCredentialExpiry();
  const loginPath = getLoginPathForRole(roleName);

  await syncServiceAccountStatus(
    {
      serviceId: record.serviceId,
      userId: record.userId,
      organizationId: record.organizationId,
    },
    'active',
  );

  await applyCredentialsToAccount(
    { serviceId: record.serviceId, userId: record.userId },
    plainPassword,
    expiresAt,
  );

  const emailContent = buildServiceActivationEmail({
    recipientName: accountHolder.name,
    organizationName: record.organizationName,
    roleName,
    loginPath,
    email: accountHolder.email,
    temporaryPassword: plainPassword,
    expiresAt,
  });

  let emailSent = false;
  try {
    const result = await sendMail({
      to: accountHolder.email,
      ...emailContent,
    });
    emailSent = result.sent === true;
  } catch (err) {
    console.error('[serviceUserActivation] Email failed:', err.message);
  }

  await db().collection('service_registrations').doc(record.id).update({
    activationEmailSentAt: new Date(),
    credentialsExpiresAt: expiresAt,
    credentialsIssuedAt: new Date(),
    assignedLoginPath: loginPath,
    emailSent: emailSent || record.emailSent,
    updatedAt: new Date(),
  });

  return {
    provisioned: true,
    emailSent,
    credentialsExpiresAt: expiresAt,
    loginPath,
  };
}

export function assertCanAssignRole(existing, nextStatus) {
  const status = nextStatus ?? existing.status ?? 'inactive';
  if (status !== 'active') {
    throw Object.assign(new Error('Activate the user before assigning a role.'), { status: 400 });
  }
}

export function assertServiceRoleValid(roleName, serviceId) {
  if (!isServiceUserRole(roleName)) {
    throw Object.assign(new Error('Select a valid service admin role.'), { status: 400 });
  }
  if (!roleMatchesService(roleName, serviceId)) {
    throw Object.assign(
      new Error(`Role ${roleName} is not valid for this service registration.`),
      { status: 400 },
    );
  }
}
