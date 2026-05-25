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

export const SERVICE_ID_ALLOWED_ROLES = {
  hospital: ['HOSPITAL_ADMIN'],
  stock: ['STOCK_ADMIN'],
  pharmacy: ['PHARMACY_ADMIN'],
  hr: ['HR_ADMIN', 'PAYROLL_ADMIN'],
  property: ['PROPERT_ADMIN', 'PROPERTY_ADMIN'],
  ngo: ['NGO_ADMIN'],
};

/** Map serviceId → roles when naming differs from SERVICE_ID_ALLOWED_ROLES */
const SERVICE_ID_ROLE_ALIASES = {
  hospital: ['HOSPITAL_ADMIN', 'HOSPITAL'],
  stock: ['STOCK_ADMIN', 'STOCK'],
  pharmacy: ['PHARMACY_ADMIN', 'PHARMACY'],
  hr: ['HR_ADMIN', 'PAYROLL_ADMIN', 'HR'],
  property: ['PROPERT_ADMIN', 'PROPERTY_ADMIN', 'PROPERTY', 'PROPERT'],
  ngo: ['NGO_ADMIN', 'NGO'],
};

export function normalizeRoleName(name) {
  return (name || '').trim().toUpperCase().replace(/\s+/g, '_');
}

export function isServiceUserRole(roleName) {
  const normalized = normalizeRoleName(roleName);
  if (SERVICE_USER_ROLE_NAMES.has(normalized)) return true;
  return /_(ADMIN|MANAGER)$/.test(normalized) && normalized !== 'SUPER_ADMIN';
}

export function isServiceAdminRole(role) {
  const name = normalizeRoleName(role?.role_name);
  if (name === 'SUPER_ADMIN') return false;
  return isServiceUserRole(name);
}

/**
 * All service admin roles for the Assign role dropdown (includes NGO_ADMIN).
 */
export function getServiceAdminRoles(allRoles) {
  return (allRoles || []).filter(isServiceAdminRole);
}

/**
 * Roles for a service registration — shows every service admin role so NGO_ADMIN,
 * HOSPITAL_ADMIN, STOCK_ADMIN, etc. are always available. Highlights matching roles first.
 */
export function rolesForServiceRegistration(serviceId, allRoles) {
  const pool = getServiceAdminRoles(allRoles);
  if (!serviceId || pool.length === 0) return pool;

  const key = String(serviceId).toLowerCase();
  const allowedNames = new Set([
    ...(SERVICE_ID_ALLOWED_ROLES[key] || []).map(normalizeRoleName),
    ...(SERVICE_ID_ROLE_ALIASES[key] || []).map(normalizeRoleName),
  ]);

  if (allowedNames.size === 0) return pool;

  const matched = pool.filter((role) => allowedNames.has(normalizeRoleName(role.role_name)));
  const rest = pool.filter((role) => !allowedNames.has(normalizeRoleName(role.role_name)));

  return [...matched, ...rest];
}
