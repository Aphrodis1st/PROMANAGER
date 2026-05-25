import { getAnyAuthToken, getServiceToken } from '../../utils/authCookies.js';

const PATH_SERVICE_MAP = [
  ['/ngo', 'ngo'],
  ['/hospital', 'hospital'],
  ['/hr', 'hr'],
  ['/pharmacy', 'pharmacy'],
  ['/stock', 'stock'],
  ['/super-admin', 'superAdmin'],
  ['/property', 'property'],
];

const ENDPOINT_SERVICE_PATTERNS = [
  ['Ngo', 'ngo'],
  ['Hospital', 'hospital'],
  ['Hr', 'hr'],
  ['Pharmacy', 'pharmacy'],
  ['Stock', 'stock'],
  ['SuperAdmin', 'superAdmin'],
  ['Property', 'property'],
];

function resolveServiceFromEndpoint(endpoint) {
  const endpointName = typeof endpoint === 'string'
    ? endpoint
    : endpoint?.endpointName || endpoint?.type || '';

  for (const [pattern, service] of ENDPOINT_SERVICE_PATTERNS) {
    if (endpointName.includes(pattern)) return service;
  }
  return null;
}

function resolveServiceFromPath() {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  for (const [prefix, service] of PATH_SERVICE_MAP) {
    if (path.startsWith(prefix)) return service;
  }
  return null;
}

export const getAuthToken = (reduxToken, endpoint) => {
  if (reduxToken) return reduxToken;

  const service =
    resolveServiceFromEndpoint(endpoint) ||
    resolveServiceFromPath();

  if (service) {
    const serviceToken = getServiceToken(service);
    if (serviceToken) return serviceToken;
  }

  const fromCookies = getAnyAuthToken();
  if (fromCookies) return fromCookies;

  const keys = [
    'token',
    'hospitalToken',
    'hrToken',
    'stockToken',
    'ngo_token',
    'fb_token',
  ];
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

export const getStockAuthToken = () =>
  getServiceToken('stock') || localStorage.getItem('token');
