import admin from 'firebase-admin';
import { db } from '../../../utils/firebase.js';
import {
  normalizeUserStatus,
  syncServiceAccountStatus,
} from '../../services/userStatusSync.service.js';

const COLLECTION = 'service_registrations';

const SERVICE_TITLES = {
  stock: 'Stock Management',
  hospital: 'Hospital Management',
  pharmacy: 'Pharmacy Services',
  hr: 'HR & Payroll',
  ngo: 'NGO Management',
  property: 'Property Management',
};

function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

function normalizePerson(data) {
  if (!data) return undefined;
  return stripUndefined({
    name: data.name?.trim(),
    email: data.email?.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    is_manager: data.is_manager,
  });
}

export class ServiceRegistration {
  static getServiceTitle(serviceId) {
    return SERVICE_TITLES[serviceId] || serviceId || 'Unknown';
  }

  static toListItem(record) {
    const accountHolder = record.registrant?.is_manager
      ? record.registrant
      : record.manager || record.registrant;

    return {
      id: record.id,
      source: 'service_registration',
      name: accountHolder?.name || record.organizationName || '—',
      email: accountHolder?.email || '',
      phone: accountHolder?.phone || '',
      serviceId: record.serviceId,
      serviceTitle: this.getServiceTitle(record.serviceId),
      organizationName: record.organizationName || '',
      description: record.description || '',
      registrant: record.registrant || null,
      manager: record.manager || null,
      userId: record.userId || null,
      organizationId: record.organizationId || null,
      emailSent: record.emailSent ?? false,
      role: record.role || null,
      status: record.status || 'inactive',
      credentialsExpiresAt: record.credentialsExpiresAt || null,
      activationEmailSentAt: record.activationEmailSentAt || null,
      assignedLoginPath: record.assignedLoginPath || null,
      createdAt: record.createdAt || null,
    };
  }

  static async getAll() {
    const snapshot = await db().collection(COLLECTION).get();
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? new Date(a.createdAt || 0).getTime();
        const bTime = b.createdAt?.toMillis?.() ?? new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });
  }

  static async getById(id) {
    const doc = await db().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, updates) {
    const existing = await this.getById(id);
    if (!existing) {
      throw Object.assign(new Error('Registration not found.'), { status: 404 });
    }

    const cleaned = stripUndefined({
      organizationName: updates.organizationName?.trim(),
      description: updates.description?.trim(),
      registrant: updates.registrant ? normalizePerson(updates.registrant) : undefined,
      manager: updates.manager ? normalizePerson(updates.manager) : undefined,
      role: updates.role,
      status: updates.status ? normalizeUserStatus(updates.status) : undefined,
      updatedAt: new Date(),
    });

    if (cleaned.registrant) {
      cleaned.registrant.is_manager = Boolean(
        updates.registrant?.is_manager ?? existing.registrant?.is_manager,
      );
      if (cleaned.registrant.is_manager) {
        cleaned.manager = admin.firestore.FieldValue.delete();
      }
    }

    await db().collection(COLLECTION).doc(id).update(cleaned);

    if (cleaned.status) {
      await syncServiceAccountStatus(
        {
          serviceId: existing.serviceId,
          userId: existing.userId,
          organizationId: existing.organizationId,
        },
        cleaned.status,
      );
    }

    return this.getById(id);
  }

  static async delete(id) {
    const existing = await this.getById(id);
    if (!existing) {
      throw Object.assign(new Error('Registration not found.'), { status: 404 });
    }
    await db().collection(COLLECTION).doc(id).delete();
  }
}
