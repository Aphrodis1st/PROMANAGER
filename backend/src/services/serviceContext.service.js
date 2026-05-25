import { Hospital } from '../models/superAdmin/hospital.model.js';
import { HROrganization } from '../models/superAdmin/hrOrganization.model.js';
import { Pharmacy } from '../models/superAdmin/pharmacy.model.js';
import { PropertyOrganization } from '../models/superAdmin/propertyOrganization.model.js';
import { Organization as NGOOrganization } from '../models/ngo/organization.model.js';

const SERVICE_TITLES = {
  stock: 'Stock Management',
  hospital: 'Hospital Management',
  pharmacy: 'Pharmacy Services',
  hr: 'HR & Payroll',
  ngo: 'NGO Management',
  property: 'Property Management',
};

export function formatOrganizationContext(org, serviceId) {
  if (!org) return null;

  const name =
    org.name ||
    org.company ||
    org.contactInfo?.name ||
    '';

  if (!name) return null;

  return {
    id: org.id || null,
    name,
    serviceId,
    serviceTitle: SERVICE_TITLES[serviceId] || serviceId,
    location: org.location || org.city || org.address || org.contactInfo?.address || '',
    status: org.status || 'active',
  };
}

export async function resolveServiceOrganization(serviceId, user = {}) {
  switch (serviceId) {
    case 'hospital': {
      const hospitalId = user.hospitalId;
      if (!hospitalId) return null;
      const hospital = await Hospital.getById(hospitalId);
      return formatOrganizationContext(hospital, 'hospital');
    }
    case 'hr': {
      const organizationId = user.organizationId;
      if (!organizationId) return null;
      const organization = await HROrganization.getById(organizationId);
      return formatOrganizationContext(organization, 'hr');
    }
    case 'pharmacy': {
      const pharmacyId = user.pharmacyId;
      if (!pharmacyId) return null;
      const pharmacy = await Pharmacy.getById(pharmacyId);
      return formatOrganizationContext(pharmacy, 'pharmacy');
    }
    case 'stock': {
      const company = user.company?.trim();
      if (!company) return null;
      return formatOrganizationContext({ id: user.id, name: company, status: user.isActive ? 'active' : 'pending' }, 'stock');
    }
    case 'ngo': {
      const organizationId = user.organizationId;
      if (!organizationId) return null;
      const organization = await NGOOrganization.getById(organizationId);
      return formatOrganizationContext(organization, 'ngo');
    }
    case 'property': {
      const organizationId = user.organizationId;
      if (!organizationId) return null;
      const organization = await PropertyOrganization.getById(organizationId);
      return formatOrganizationContext(organization, 'property');
    }
    default:
      return null;
  }
}
