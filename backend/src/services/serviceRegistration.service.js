import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '../../utils/firebase.js';
import { sendMail, buildRegistrantIsManagerEmail, buildRegistrantNotManagerEmail, buildManagerAdminEmail } from '../utils/mailer.js';
import {
  getUserByEmail as getStockUserByEmail,
  createUser as createStockUser,
  hashPassword as hashStockPassword,
} from '../models/stock/user.model.js';
import { getUserByEmail as getPharmacyUserByEmail, createUser as createPharmacyUser, hashPassword as hashPharmacyPassword } from '../models/user.model.js';
import { Hospital } from '../models/superAdmin/hospital.model.js';
import { HospitalAdmin } from '../models/superAdmin/hospitalAdmin.model.js';
import { Pharmacy } from '../models/superAdmin/pharmacy.model.js';
import { HROrganization } from '../models/superAdmin/hrOrganization.model.js';
import { HRAdmin } from '../models/superAdmin/hrAdmin.model.js';
import { NGO } from '../models/superAdmin/ngo.model.js';
import { Organization as NGOOrganization } from '../models/ngo/organization.model.js';
import { NGOUser } from '../models/ngo/user.model.js';
import { PropertyOrganization } from '../models/superAdmin/propertyOrganization.model.js';
import { createStaff as createPropertyStaff } from '../models/property/staff.model.js';
import { logAudit } from '../models/stock/audit.model.js';

const SERVICE_TITLES = {
  stock: 'Stock Management',
  hospital: 'Hospital Management',
  pharmacy: 'Pharmacy Services',
  hr: 'HR & Payroll',
  ngo: 'NGO Management',
  property: 'Property Management',
};

export function generateTempPassword() {
  return crypto.randomBytes(12).toString('base64url').slice(0, 16);
}

export function resolveRegistrant(formData) {
  return {
    name: formData.fullName?.trim(),
    email: formData.email?.trim().toLowerCase(),
    phone: formData.phone?.trim(),
    is_manager: Boolean(formData.is_manager),
  };
}

export function resolveManagerAccount(formData) {
  if (formData.is_manager) {
    const { name, email, phone } = resolveRegistrant(formData);
    return { name, email, phone };
  }

  return {
    name: formData.managerFullName?.trim(),
    email: formData.managerEmail?.trim().toLowerCase(),
    phone: formData.managerPhone?.trim(),
  };
}

function buildOrgContactInfo(manager, organizationName) {
  return {
    name: organizationName,
    email: manager.email,
    phone: manager.phone,
    contactPerson: manager.name,
  };
}

async function saveRegistrationRecord(payload) {
  const docRef = await db().collection('service_registrations').add({
    ...payload,
    createdAt: new Date(),
  });
  return docRef.id;
}

async function createStockAccount({ manager, organizationName, description, registrant, password }) {
  const existing = await getStockUserByEmail(manager.email);
  if (existing) throw Object.assign(new Error('An account with this manager email already exists.'), { status: 409 });

  const passwordHash = await hashStockPassword(password);
  const user = await createStockUser({
    name: manager.name,
    email: manager.email,
    passwordHash,
    phone: manager.phone,
    role: 'ADMIN',
    extra: {
      company: organizationName,
      description: description || undefined,
      is_manager: registrant.is_manager,
      isActive: false,
      accountDisabled: true,
      ...(!registrant.is_manager && {
        registeredBy: registrant.name,
        registeredByEmail: registrant.email,
        registeredByPhone: registrant.phone,
      }),
    },
  });

  await logAudit({ actorId: user.id, action: 'USER_REGISTER', meta: { email: user.email, role: user.role, source: 'service_registration' } });

  return { userId: user.id, user };
}

async function createHospitalAccount({ manager, organizationName, description, password }) {
  const existing = await HospitalAdmin.getByEmail(manager.email);
  if (existing) throw Object.assign(new Error('An account with this manager email already exists.'), { status: 409 });

  const hospital = await Hospital.create({
    name: organizationName,
    location: '',
    contactInfo: buildOrgContactInfo(manager, organizationName),
    subscriptionPlan: 'basic',
    featuresEnabled: [],
    status: 'pending',
  });

  const admin = await HospitalAdmin.create({
    email: manager.email,
    password,
    hospitalId: hospital.id,
    entityType: 'hospital',
    status: 'pending',
  });

  return { userId: admin.id, organizationId: hospital.id, user: admin };
}

async function createPharmacyAccount({ manager, organizationName, description, password }) {
  const existing = await getPharmacyUserByEmail(manager.email);
  if (existing) throw Object.assign(new Error('An account with this manager email already exists.'), { status: 409 });

  const pharmacy = await Pharmacy.create({
    name: organizationName,
    location: '',
    contactInfo: buildOrgContactInfo(manager, organizationName),
    subscriptionPlan: 'basic',
    featuresEnabled: [],
    status: 'pending',
  });

  const passwordHash = await hashPharmacyPassword(password);
  const user = await createPharmacyUser({
    name: manager.name,
    email: manager.email,
    passwordHash,
    phone: manager.phone,
    role: 'PHARMACY',
  });

  await db().collection('users').doc(user.id).update({ pharmacyId: pharmacy.id });

  return { userId: user.id, organizationId: pharmacy.id, user: { ...user, pharmacyId: pharmacy.id } };
}

async function createHRAccount({ manager, organizationName, description, password }) {
  const existing = await HRAdmin.getByEmail(manager.email);
  if (existing) throw Object.assign(new Error('An account with this manager email already exists.'), { status: 409 });

  const organization = await HROrganization.create({
    name: organizationName,
    location: '',
    contactInfo: buildOrgContactInfo(manager, organizationName),
    subscriptionPlan: 'basic',
    featuresEnabled: [],
    status: 'pending',
  });

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await HRAdmin.create({
    name: manager.name,
    email: manager.email,
    password: passwordHash,
    phone: manager.phone,
    organizationId: organization.id,
    role: 'admin',
    status: 'pending',
  });

  return { userId: admin.id, organizationId: organization.id, user: admin };
}

async function createNGOAccount({ manager, organizationName, description, password }) {
  const ngoSnapshot = await db()
    .collection('ngo_users')
    .where('email', '==', manager.email)
    .limit(1)
    .get();
  if (!ngoSnapshot.empty) {
    throw Object.assign(new Error('An account with this manager email already exists.'), { status: 409 });
  }

  const ngo = await NGO.create({
    name: organizationName,
    location: '',
    contactInfo: buildOrgContactInfo(manager, organizationName),
    subscriptionPlan: 'basic',
    featuresEnabled: [],
    status: 'pending',
  });

  const org = await NGOOrganization.create({
    name: organizationName,
    email: manager.email,
    phone: manager.phone,
    mission: description || undefined,
    status: 'pending',
  });

  const user = await NGOUser.create({
    organizationId: org.id,
    fullName: manager.name,
    email: manager.email,
    phone: manager.phone,
    jobTitle: 'Manager',
    roleName: 'Administrator',
    accountStatus: 'Invited',
    notes: description || '',
  });

  return { userId: user.id, organizationId: org.id, ngoId: ngo.id, user };
}

async function createPropertyAccount({ manager, organizationName, description, password }) {
  const staffSnapshot = await db()
    .collection('propertyStaff')
    .where('email', '==', manager.email)
    .limit(1)
    .get();
  if (!staffSnapshot.empty) {
    throw Object.assign(new Error('An account with this manager email already exists.'), { status: 409 });
  }

  const organization = await PropertyOrganization.create({
    name: organizationName,
    location: '',
    contactInfo: buildOrgContactInfo(manager, organizationName),
    subscriptionPlan: 'basic',
    featuresEnabled: [],
    status: 'pending',
  });

  const passwordHash = await bcrypt.hash(password, 10);
  const staff = await createPropertyStaff({
    organizationId: organization.id,
    name: manager.name,
    email: manager.email,
    phone: manager.phone,
    role: 'admin',
    status: 'pending',
    passwordHash,
    description: description || '',
  });

  return { userId: staff.id, organizationId: organization.id, user: staff };
}

const SERVICE_CREATORS = {
  stock: createStockAccount,
  hospital: createHospitalAccount,
  pharmacy: createPharmacyAccount,
  hr: createHRAccount,
  ngo: createNGOAccount,
  property: createPropertyAccount,
};

async function sendRegistrationEmails({
  registrant,
  manager,
  serviceId,
  serviceTitle,
  organizationName,
  registrationId,
  pending,
  usedGeneratedPassword,
  password,
}) {
  const emailMeta = { serviceId, registrationId, organizationName };
  const results = { registrant: { sent: false }, manager: { sent: false } };

  async function trySend(to, content) {
    try {
      return await sendMail({ to, ...content });
    } catch (err) {
      console.error('[serviceRegistration] Failed to send email:', err.message);
      return { sent: false };
    }
  }

  if (registrant.is_manager) {
    const content = buildRegistrantIsManagerEmail({
      registrantName: registrant.name,
      serviceTitle,
      ...emailMeta,
    });
    results.registrant = await trySend(registrant.email, content);
    results.manager = results.registrant;
  } else {
    const registrantContent = buildRegistrantNotManagerEmail({
      registrantName: registrant.name,
      serviceTitle,
      managerName: manager.name,
      ...emailMeta,
    });
    const managerContent = buildManagerAdminEmail({
      managerName: manager.name,
      serviceTitle,
      registrantName: registrant.name,
      temporaryPassword: usedGeneratedPassword && !pending ? password : undefined,
      pendingReview: pending,
      ...emailMeta,
    });

    results.registrant = await trySend(registrant.email, registrantContent);
    results.manager = await trySend(manager.email, managerContent);
  }

  return results;
}

export async function registerService(formData) {
  const serviceId = formData.serviceId;
  if (!SERVICE_CREATORS[serviceId]) {
    throw Object.assign(new Error('Invalid service selected.'), { status: 400 });
  }

  const registrant = resolveRegistrant(formData);
  const manager = resolveManagerAccount(formData);
  if (!manager.name || !manager.email) {
    throw Object.assign(new Error('Manager name and email are required.'), { status: 400 });
  }

  const organizationName = formData.organizationName?.trim();
  const description = formData.description?.trim();
  const passwordFromForm = formData.password?.trim();
  const password = passwordFromForm || generateTempPassword();
  const usedGeneratedPassword = !passwordFromForm;

  const createAccount = SERVICE_CREATORS[serviceId];
  const result = await createAccount({
    manager,
    organizationName,
    description,
    registrant,
    password,
  });

  const serviceTitle = SERVICE_TITLES[serviceId];
  const pending = true;

  const registrationId = await saveRegistrationRecord({
    serviceId,
    organizationName,
    description,
    registrant,
    ...(!registrant.is_manager && { manager }),
    userId: result.userId,
    organizationId: result.organizationId || null,
    emailSent: false,
    status: 'inactive',
  });

  const emailResults = await sendRegistrationEmails({
    registrant,
    manager,
    serviceId,
    serviceTitle,
    organizationName,
    registrationId,
    pending,
    usedGeneratedPassword,
    password,
  });

  const emailSent =
    emailResults.registrant.sent === true || emailResults.manager.sent === true;

  const response = {
    success: true,
    pending,
    registrationId,
    emailSent,
    registrantEmailSent: emailResults.registrant.sent === true,
    managerEmailSent: emailResults.manager.sent === true,
    managerEmail: manager.email,
    registrantEmail: registrant.email,
  };

  return response;
}
