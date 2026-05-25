import bcrypt from 'bcryptjs';
import { db } from '../../utils/firebase.js';
import { NGOUser } from '../models/ngo/user.model.js';
import { Organization } from '../models/ngo/organization.model.js';
import { sendMail, buildServiceActivationEmail } from '../utils/mailer.js';
import { generateServiceCredentialsPassword } from './serviceUserActivation.service.js';
import { CENTRAL_LOGIN_PATH, CREDENTIAL_TTL_DAYS } from '../config/serviceUserRoles.config.js';

function getCredentialExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CREDENTIAL_TTL_DAYS);
  return expiresAt;
}

function stripPasswordHash(user) {
  if (!user) return user;
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Issue temporary login credentials for an NGO staff member and email them.
 */
export async function provisionNgoStaffCredentials(userId, { activate = true } = {}) {
  const user = await NGOUser.getById(userId);
  if (!user) {
    throw Object.assign(new Error('Staff member not found'), { status: 404 });
  }
  if (!user.email) {
    throw Object.assign(new Error('Staff email is required'), { status: 400 });
  }

  const blockedStatuses = new Set(['Suspended', 'Locked']);
  if (blockedStatuses.has(user.accountStatus)) {
    return {
      user: stripPasswordHash(user),
      emailSent: false,
      emailError: `Credentials email was not sent because account status is ${user.accountStatus}.`,
      skipped: true,
    };
  }

  const plainPassword = generateServiceCredentialsPassword();
  const expiresAt = getCredentialExpiry();
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  let organizationName = 'your organization';
  if (user.organizationId) {
    const org = await Organization.getById(user.organizationId);
    if (org?.name) organizationName = org.name;
  }

  const updates = {
    passwordHash,
    credentialsExpiresAt: expiresAt,
    credentialsIssuedAt: new Date(),
    mustChangePassword: true,
    updatedAt: new Date(),
  };

  if (activate && (!user.accountStatus || user.accountStatus === 'Invited')) {
    updates.accountStatus = 'Active';
  }

  await db().collection('ngo_users').doc(userId).update(updates);

  const emailContent = buildServiceActivationEmail({
    recipientName: user.fullName || user.email,
    organizationName,
    roleName: user.roleName || 'NGO Staff',
    loginPath: CENTRAL_LOGIN_PATH,
    email: user.email,
    temporaryPassword: plainPassword,
    expiresAt,
  });

  let emailSent = false;
  let emailError = null;
  try {
    const result = await sendMail({ to: user.email, ...emailContent });
    emailSent = result.sent === true;
    if (!emailSent) {
      emailError = result.reason || 'Email was not sent';
    }
  } catch (err) {
    emailError = err.message;
    console.error('[ngoStaffProvisioning] Email failed:', err.message);
  }

  await db()
    .collection('ngo_users')
    .doc(userId)
    .update({
      invitationEmailSentAt: new Date(),
      invitationEmailSent: emailSent,
      updatedAt: new Date(),
    })
    .catch(() => {});

  const updatedUser = await NGOUser.getById(userId);
  return {
    user: stripPasswordHash(updatedUser),
    emailSent,
    emailError,
    credentialsExpiresAt: expiresAt,
  };
}
