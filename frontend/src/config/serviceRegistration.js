import {
  Package,
  Building2,
  Pill,
  Users,
  HeartHandshake,
  Home,
} from 'lucide-react';
import { registerService } from '../services/serviceRegistration.service.js';
import { setServiceAuth } from '../utils/authCookies.js';

import { CENTRAL_LOGIN_PATH } from './loginRedirect.js';

export const SERVICE_REGISTRATION = {
  stock: {
    id: 'stock',
    title: 'Stock Management',
    subtitle: 'Set up your inventory and sales workspace.',
    icon: Package,
    loginPath: CENTRAL_LOGIN_PATH,
    successRedirect: '/stock',
  },
  hospital: {
    id: 'hospital',
    title: 'Hospital Management',
    subtitle: 'Register your hospital or clinic to get started.',
    icon: Building2,
    loginPath: CENTRAL_LOGIN_PATH,
    successRedirect: CENTRAL_LOGIN_PATH,
  },
  pharmacy: {
    id: 'pharmacy',
    title: 'Pharmacy Services',
    subtitle: 'Register your pharmacy or dispensary.',
    icon: Pill,
    loginPath: CENTRAL_LOGIN_PATH,
    successRedirect: CENTRAL_LOGIN_PATH,
  },
  hr: {
    id: 'hr',
    title: 'HR & Payroll',
    subtitle: 'Register your organization for HR and payroll.',
    icon: Users,
    loginPath: CENTRAL_LOGIN_PATH,
    successRedirect: CENTRAL_LOGIN_PATH,
  },
  ngo: {
    id: 'ngo',
    title: 'NGO Management',
    subtitle: 'Register your NGO, church, or humanitarian organization.',
    icon: HeartHandshake,
    loginPath: CENTRAL_LOGIN_PATH,
    successRedirect: '/ngo/dashboard',
  },
  property: {
    id: 'property',
    title: 'Property Management',
    subtitle: 'Register your property management business.',
    icon: Home,
    loginPath: CENTRAL_LOGIN_PATH,
    successRedirect: '/property',
  },
};

export const SERVICE_IDS = Object.keys(SERVICE_REGISTRATION);

export const SERVICE_OPTIONS = SERVICE_IDS.map((id) => ({
  value: id,
  label: SERVICE_REGISTRATION[id].title,
}));

export function getServiceRegistration(serviceId) {
  return SERVICE_REGISTRATION[serviceId] ?? null;
}

export async function submitServiceRegistration(serviceId, formData) {
  const config = getServiceRegistration(serviceId);
  if (!config) {
    throw new Error('Invalid service selected.');
  }

  const result = await registerService({ ...formData, serviceId });

  if (result?.token) {
    const authService = SERVICE_IDS.includes(serviceId) ? serviceId : 'stock';
    setServiceAuth(authService, { token: result.token, user: result.user ?? null });
  }

  return result;
}
