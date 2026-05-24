import { getServiceOrganization } from '../utils/authCookies.js';

/**
 * Resolve the tenant organization name for a service workspace.
 * Falls back to user.company for stock accounts registered before org context was stored.
 */
export function getWorkspaceOrganization(service, user = null) {
  const fromSession = getServiceOrganization(service);
  if (fromSession?.name) return fromSession;

  if (service === 'stock' && user?.company) {
    return {
      id: user.id,
      name: user.company,
      serviceId: 'stock',
      serviceTitle: 'Stock Management',
    };
  }

  return null;
}

export function getWorkspaceTitle(service, user = null) {
  const org = getWorkspaceOrganization(service, user);
  return org?.name || org?.serviceTitle || 'Workspace';
}

export function getServiceLabel(service, user = null) {
  const org = getWorkspaceOrganization(service, user);
  return org?.serviceTitle || 'Management';
}
