import { setServiceAuth } from './authCookies.js';
import { getRedirectPathFromLoginResult } from '../config/loginRedirect.js';

function resolveOrganization(result) {
  if (result.organization) return result.organization;
  if (result.hospital) {
    return {
      id: result.hospital.id,
      name: result.hospital.name,
      serviceId: 'hospital',
      serviceTitle: 'Hospital Management',
      location: result.hospital.location || '',
    };
  }
  return null;
}

/**
 * Persist unified login response into the correct service session.
 * Returns the path to navigate to after login.
 */
export function applyUnifiedLogin(result, { hospitalLogin, hospitalAuthLogin, hrLogin, stockLoginState } = {}) {
  if (result.requiresPasswordCompletion) {
    return {
      requiresPasswordCompletion: true,
      service: result.service,
      partialToken: result.partialToken,
      redirectPath: null,
    };
  }

  if (!result.success || !result.token) {
    throw new Error(result.message || result.error || 'Login failed');
  }

  const { service, token, user, admin, hospital } = result;
  const sessionUser = user || admin;
  const organization = resolveOrganization(result);

  switch (service) {
    case 'superAdmin':
      setServiceAuth('superAdmin', {
        token,
        user: { ...sessionUser, legacyRole: 'super_admin' },
      });
      break;

    case 'hospital':
      setServiceAuth('hospital', { token, user: admin || sessionUser, organization });
      if (hospital) localStorage.setItem('hospital', JSON.stringify(hospital));
      if (admin || sessionUser) {
        localStorage.setItem('hospitalAdmin', JSON.stringify(admin || sessionUser));
      }
      hospitalLogin?.(token, admin || sessionUser);
      hospitalAuthLogin?.({
        token,
        admin: admin || sessionUser,
        user: sessionUser,
        hospital,
      });
      break;

    case 'hr':
      setServiceAuth('hr', { token, user: admin || sessionUser, organization });
      if (organization) localStorage.setItem('hrOrganization', JSON.stringify(organization));
      if (admin || sessionUser) {
        localStorage.setItem('hrAdmin', JSON.stringify(admin || sessionUser));
      }
      hrLogin?.(result);
      break;

    case 'pharmacy':
      setServiceAuth('pharmacy', { token, user: sessionUser, organization });
      break;

    case 'ngo':
      setServiceAuth('ngo', { token, user: sessionUser, organization });
      localStorage.setItem('ngo_token', token);
      break;

    case 'property':
      setServiceAuth('property', { token, user: sessionUser, organization });
      break;

    case 'stock':
    default:
      setServiceAuth('stock', { token, user: sessionUser, organization });
      stockLoginState?.(token, sessionUser);
      if (sessionUser) localStorage.setItem('user', JSON.stringify(sessionUser));
      break;
  }

  return {
    requiresPasswordCompletion: false,
    service,
    redirectPath: getRedirectPathFromLoginResult(result),
    organization,
  };
}
