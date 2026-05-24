import { db } from '../../utils/firebase.js';
import { HospitalAdmin } from '../models/superAdmin/hospitalAdmin.model.js';
import { HRAdmin } from '../models/superAdmin/hrAdmin.model.js';

const ALLOWED_STATUS = new Set(['active', 'inactive']);

export function normalizeUserStatus(status) {
  return ALLOWED_STATUS.has(status) ? status : 'active';
}

export async function syncServiceAccountStatus({ serviceId, userId, organizationId }, status) {
  if (!userId) return;

  const normalized = normalizeUserStatus(status);
  const isActive = normalized === 'active';

  switch (serviceId) {
    case 'hospital':
      await HospitalAdmin.updateStatus(userId, normalized);
      break;
    case 'hr':
      await HRAdmin.updateStatus(userId, normalized);
      break;
    case 'pharmacy':
      await db().collection('users').doc(userId).update({
        status: normalized,
        isActive,
        updatedAt: new Date(),
      });
      break;
    case 'ngo':
      await db().collection('ngo_users').doc(userId).update({
        accountStatus: isActive ? 'Active' : 'Inactive',
        updatedAt: new Date(),
      });
      break;
    case 'property':
      await db().collection('propertyStaff').doc(userId).update({
        status: normalized,
        isActive,
        updatedAt: new Date(),
      });
      break;
    case 'stock':
      await db().collection('users').doc(userId).update({
        isActive,
        accountDisabled: !isActive,
        updatedAt: new Date(),
      });
      break;
    default:
      break;
  }

  if (!organizationId) return;

  const orgUpdates = { status: normalized, updatedAt: new Date() };
  const orgCollections = {
    hospital: 'hospitals',
    pharmacy: 'pharmacies',
    hr: 'hrOrganizations',
    ngo: 'ngos',
    property: 'propertyOrganizations',
  };

  const collection = orgCollections[serviceId];
  if (collection) {
    await db().collection(collection).doc(organizationId).update(orgUpdates).catch(() => {});
  }
}
