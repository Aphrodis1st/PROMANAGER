import { normalizeRoleName } from './serviceUserRoles.js';
import { getDefaultNgoPath } from './ngoNavigationScopes.js';

export const CENTRAL_LOGIN_PATH = '/login';

export const STOCK_ROLES = new Set([
  'SUPER_ADMIN',
  'ADMIN',
  'DIRECTOR_MANAGER',
  'PRODUCTION_MANAGER',
  'FINANCE_MANAGER',
  'SALE_MANAGER',
  'MARKETTING_MANAGER',
  'ACCOUNTANT',
  'STOCK_KEEPER',
  'PROCUREMENT',
  'SALES',
  'GUEST',
  'STOCK_ADMIN',
]);

const ROLE_DASHBOARD_PATHS = {
  SUPER_ADMIN: '/super-admin/dashboard',
  HOSPITAL_ADMIN: '/hospital/admin/dashboard',
  hospital_admin: '/hospital/admin/dashboard',
  admin: '/hospital/admin/dashboard',
  doctor: '/hospital/doctor/dashboard',
  nurse: '/hospital/nurse/dashboard',
  receptionist: '/hospital/receptionist/dashboard',
  HR_ADMIN: '/hr/dashboard',
  hr_admin: '/hr/dashboard',
  PAYROLL_ADMIN: '/hr/dashboard',
  PHARMACY_ADMIN: '/pharmacy/doctors',
  PHARMACY: '/pharmacy/doctors',
  STOCK_ADMIN: '/stock',
  NGO_ADMIN: '/ngo/dashboard',
  PROPERTY_ADMIN: '/property',
  PROPERT_ADMIN: '/property',
  DOCTOR: '/prescription',
  PATIENT: '/',
  CALLCENTER: '/pharmacy/callcenter',
};

const SERVICE_DEFAULT_PATHS = {
  superAdmin: '/super-admin/dashboard',
  stock: '/stock',
  hospital: '/hospital/admin/dashboard',
  hr: '/hr/dashboard',
  pharmacy: '/pharmacy/doctors',
  ngo: '/ngo/dashboard',
  property: '/property',
  general: '/',
};

export function resolveUserRoleName(user) {
  if (!user) return '';
  if (typeof user.role === 'object' && user.role?.role_name) return user.role.role_name;
  return user.role || user.roleName || '';
}

export function getRedirectPathForRole(roleName, service) {
  const raw = typeof roleName === 'object' ? roleName?.role_name : roleName;
  const normalized = normalizeRoleName(raw || roleName);

  if (ROLE_DASHBOARD_PATHS[normalized]) return ROLE_DASHBOARD_PATHS[normalized];
  if (ROLE_DASHBOARD_PATHS[raw]) return ROLE_DASHBOARD_PATHS[raw];
  if (STOCK_ROLES.has(normalized)) return '/stock';
  if (service && SERVICE_DEFAULT_PATHS[service]) return SERVICE_DEFAULT_PATHS[service];
  return '/';
}

export function getRedirectPathFromLoginResult(result) {
  if (result?.redirectPath) return result.redirectPath;
  if (result?.service === 'ngo' && result?.user) {
    return getDefaultNgoPath(result.user);
  }
  const roleName = result?.role || resolveUserRoleName(result?.user);
  return getRedirectPathForRole(roleName, result?.service);
}
