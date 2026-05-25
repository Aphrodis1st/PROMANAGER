/** Platform roles used for service registrations (created by SUPER_ADMIN). */
export const SERVICE_USER_ROLE_NAMES = new Set([
  'HOSPITAL_ADMIN',
  'HR_ADMIN',
  'PAYROLL_ADMIN',
  'PHARMACY_ADMIN',
  'PROPERT_ADMIN',
  'PROPERTY_ADMIN',
  'STOCK_ADMIN',
  'NGO_ADMIN',
]);

export const CENTRAL_LOGIN_PATH = '/login';

export const ROLE_LOGIN_PATHS = {
  HOSPITAL_ADMIN: CENTRAL_LOGIN_PATH,
  HR_ADMIN: CENTRAL_LOGIN_PATH,
  PAYROLL_ADMIN: CENTRAL_LOGIN_PATH,
  PHARMACY_ADMIN: CENTRAL_LOGIN_PATH,
  PROPERT_ADMIN: CENTRAL_LOGIN_PATH,
  PROPERTY_ADMIN: CENTRAL_LOGIN_PATH,
  STOCK_ADMIN: CENTRAL_LOGIN_PATH,
  NGO_ADMIN: CENTRAL_LOGIN_PATH,
};

/** Which platform roles may be assigned per registration serviceId */
export const SERVICE_ID_ALLOWED_ROLES = {
  hospital: ['HOSPITAL_ADMIN'],
  stock: ['STOCK_ADMIN'],
  pharmacy: ['PHARMACY_ADMIN'],
  hr: ['HR_ADMIN', 'PAYROLL_ADMIN'],
  property: ['PROPERT_ADMIN', 'PROPERTY_ADMIN'],
  ngo: ['NGO_ADMIN'],
};

export const CREDENTIAL_TTL_DAYS = 3;

export function normalizeRoleName(name) {
  return (name || '').trim().toUpperCase().replace(/\s+/g, '_');
}

export function isServiceUserRole(roleName) {
  const normalized = normalizeRoleName(roleName);
  return SERVICE_USER_ROLE_NAMES.has(normalized);
}

export function getLoginPathForRole(roleName) {
  const key = normalizeRoleName(roleName);
  return ROLE_LOGIN_PATHS[key] || CENTRAL_LOGIN_PATH;
}

const SERVICE_ID_ROLE_ALIASES = {
  hospital: ['HOSPITAL_ADMIN', 'HOSPITAL'],
  stock: ['STOCK_ADMIN', 'STOCK'],
  pharmacy: ['PHARMACY_ADMIN', 'PHARMACY'],
  hr: ['HR_ADMIN', 'PAYROLL_ADMIN', 'HR'],
  property: ['PROPERT_ADMIN', 'PROPERTY_ADMIN', 'PROPERTY', 'PROPERT'],
  ngo: ['NGO_ADMIN', 'NGO'],
};

export function roleMatchesService(roleName, serviceId) {
  const normalized = normalizeRoleName(roleName);
  const key = (serviceId || '').toLowerCase();
  const allowed = new Set([
    ...(SERVICE_ID_ALLOWED_ROLES[key] || []).map(normalizeRoleName),
    ...(SERVICE_ID_ROLE_ALIASES[key] || []).map(normalizeRoleName),
  ]);

  if (allowed.has(normalized)) return true;

  // Lenient match: NGO_ADMIN for ngo, HOSPITAL_ADMIN for hospital, etc.
  const servicePrefix = key.replace(/[^a-z]/g, '').toUpperCase();
  if (servicePrefix && normalized.startsWith(servicePrefix)) {
    return isServiceUserRole(normalized);
  }

  return false;
}
