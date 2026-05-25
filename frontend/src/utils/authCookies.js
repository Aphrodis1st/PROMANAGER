import Cookies from 'js-cookie';

const COOKIE_OPTIONS = { expires: 7, sameSite: 'Lax', path: '/' };

/** @typedef {'stock' | 'hospital' | 'hr' | 'pharmacy' | 'ngo' | 'property' | 'superAdmin'} AuthService */

export const CENTRAL_LOGIN_PATH = '/login';

export const AUTH_SERVICES = {
  stock: {
    loginPath: CENTRAL_LOGIN_PATH,
    tokenCookie: 'pm_stock_token',
    userCookie: 'pm_stock_user',
    legacyTokenKey: 'token',
    legacyUserKey: 'user',
  },
  hospital: {
    loginPath: CENTRAL_LOGIN_PATH,
    tokenCookie: 'pm_hospital_token',
    userCookie: 'pm_hospital_user',
    legacyTokenKey: 'hospitalToken',
    legacyUserKey: 'hospitalAdmin',
  },
  hr: {
    loginPath: CENTRAL_LOGIN_PATH,
    tokenCookie: 'pm_hr_token',
    userCookie: 'pm_hr_user',
    legacyTokenKey: 'hrToken',
    legacyUserKey: 'hrAdmin',
  },
  pharmacy: {
    loginPath: CENTRAL_LOGIN_PATH,
    tokenCookie: 'pm_pharmacy_token',
    userCookie: 'pm_pharmacy_user',
    legacyTokenKey: 'pharmacyToken',
    legacyUserKey: 'pharmacyUser',
  },
  ngo: {
    loginPath: CENTRAL_LOGIN_PATH,
    tokenCookie: 'pm_ngo_token',
    userCookie: 'pm_ngo_user',
    legacyTokenKey: 'ngo_token',
    legacyUserKey: null,
  },
  property: {
    loginPath: CENTRAL_LOGIN_PATH,
    tokenCookie: 'pm_property_token',
    userCookie: 'pm_property_user',
    legacyTokenKey: 'propertyToken',
    legacyUserKey: null,
  },
  superAdmin: {
    loginPath: CENTRAL_LOGIN_PATH,
    tokenCookie: 'pm_super_admin_token',
    userCookie: 'pm_super_admin_user',
    legacyTokenKey: 'superAdminToken',
    legacyUserKey: 'superAdminUser',
  },
};

const configFor = (service) => {
  const cfg = AUTH_SERVICES[service];
  if (!cfg) throw new Error(`Unknown auth service: ${service}`);
  return cfg;
};

export const getServiceLoginPath = (service) => configFor(service).loginPath;

export const setServiceAuth = (service, { token, user = null, organization = null }) => {
  if (!token) return;
  const cfg = configFor(service);
  Cookies.set(cfg.tokenCookie, token, COOKIE_OPTIONS);
  if (user != null) {
    Cookies.set(cfg.userCookie, JSON.stringify(user), COOKIE_OPTIONS);
  }
  localStorage.setItem(cfg.legacyTokenKey, token);
  if (user != null && cfg.legacyUserKey) {
    localStorage.setItem(cfg.legacyUserKey, JSON.stringify(user));
  }
  if (organization != null) {
    localStorage.setItem(`${service}_organization`, JSON.stringify(organization));
  }
};

export const clearServiceAuth = (service) => {
  const cfg = configFor(service);
  Cookies.remove(cfg.tokenCookie, { path: '/' });
  Cookies.remove(cfg.userCookie, { path: '/' });
  localStorage.removeItem(cfg.legacyTokenKey);
  localStorage.removeItem(`${service}_organization`);
  if (cfg.legacyUserKey) {
    localStorage.removeItem(cfg.legacyUserKey);
  }
};

const readLegacyToken = (cfg) => {
  const direct = localStorage.getItem(cfg.legacyTokenKey);
  if (direct) return direct;
  if (cfg.legacyTokenKey === 'token' || cfg.legacyTokenKey === 'ngo_token' || cfg.legacyTokenKey === 'propertyToken') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getServiceToken = (service) => {
  const cfg = configFor(service);
  const fromCookie = Cookies.get(cfg.tokenCookie);
  if (fromCookie) return fromCookie;

  if (service === 'stock') {
    try {
      const legacyUser = localStorage.getItem('user');
      if (legacyUser && JSON.parse(legacyUser)?.legacyRole === 'super_admin') {
        return null;
      }
    } catch {
      /* ignore */
    }
  }

  const fromStorage = readLegacyToken(cfg);
  if (fromStorage) {
    Cookies.set(cfg.tokenCookie, fromStorage, COOKIE_OPTIONS);
    return fromStorage;
  }

  // Migrate older super-admin sessions that used shared `token` / `user` keys
  if (service === 'superAdmin') {
    const legacyToken = localStorage.getItem('token');
    const legacyUser = localStorage.getItem('user');
    if (legacyToken) {
      try {
        const parsed = legacyUser ? JSON.parse(legacyUser) : null;
        const role = parsed?.legacyRole || parsed?.role?.role_name || parsed?.role;
        if (String(role).toLowerCase() === 'super_admin') {
          setServiceAuth('superAdmin', { token: legacyToken, user: parsed });
          return legacyToken;
        }
      } catch {
        /* ignore */
      }
    }
  }

  return null;
};

export const getServiceUser = (service) => {
  const cfg = configFor(service);
  const raw = Cookies.get(cfg.userCookie);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!cfg.legacyUserKey) return null;
  const stored = localStorage.getItem(cfg.legacyUserKey);
  if (!stored) return null;
  try {
    const user = JSON.parse(stored);
    Cookies.set(cfg.userCookie, stored, COOKIE_OPTIONS);
    return user;
  } catch {
    return null;
  }
};

export const getServiceOrganization = (service) => {
  const stored = localStorage.getItem(`${service}_organization`);
  if (!stored) {
    if (service === 'hospital') {
      const legacy = localStorage.getItem('hospital');
      if (legacy) {
        try {
          const hospital = JSON.parse(legacy);
          return hospital?.name
            ? { id: hospital.id, name: hospital.name, serviceId: 'hospital', serviceTitle: 'Hospital Management' }
            : null;
        } catch {
          return null;
        }
      }
    }
    if (service === 'hr') {
      const legacy = localStorage.getItem('hrOrganization');
      if (legacy) {
        try {
          const org = JSON.parse(legacy);
          return org?.name
            ? { id: org.id, name: org.name, serviceId: 'hr', serviceTitle: 'HR & Payroll' }
            : null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setServiceOrganization = (service, organization) => {
  if (organization == null) {
    localStorage.removeItem(`${service}_organization`);
    return;
  }
  localStorage.setItem(`${service}_organization`, JSON.stringify(organization));
};

export const isServiceAuthenticated = (service) => Boolean(getServiceToken(service));

/** First matching service with a valid session (for shared API token helpers). */
export const getAnyAuthToken = () => {
  const order = ['superAdmin', 'stock', 'hospital', 'hr', 'pharmacy', 'ngo', 'property'];
  for (const service of order) {
    const token = getServiceToken(service);
    if (token) return token;
  }
  return null;
};
