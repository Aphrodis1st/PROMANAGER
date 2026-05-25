import baseAPI from '../../utils/config/api.js';
import { crud } from '../helpers/crud.js';

const propertyApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    ...crud(builder, {
      plural: 'Properties',
      singular: 'Property',
      path: '/property/properties',
      tag: 'Property',
    }),
    ...crud(builder, {
      plural: 'PropertyUnits',
      singular: 'PropertyUnit',
      path: '/property/units',
      tag: 'PropertyUnit',
    }),
    ...crud(builder, {
      plural: 'PropertyTenants',
      singular: 'PropertyTenant',
      path: '/property/tenants',
      tag: 'PropertyTenant',
    }),
    ...crud(builder, {
      plural: 'PropertyLeases',
      singular: 'PropertyLease',
      path: '/property/leases',
      tag: 'PropertyLease',
    }),
    ...crud(builder, {
      plural: 'PropertyBillingRecords',
      singular: 'PropertyBillingRecord',
      path: '/property/billing',
      tag: 'PropertyBilling',
    }),
    ...crud(builder, {
      plural: 'PropertyMaintenanceRequests',
      singular: 'PropertyMaintenanceRequest',
      path: '/property/maintenance',
      tag: 'PropertyMaintenance',
    }),
    ...crud(builder, {
      plural: 'PropertyStaffMembers',
      singular: 'PropertyStaffMember',
      path: '/property/staff',
      tag: 'PropertyStaff',
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetPropertyUnitsQuery,
  useGetPropertyUnitByIdQuery,
  useCreatePropertyUnitMutation,
  useUpdatePropertyUnitMutation,
  useDeletePropertyUnitMutation,
  useGetPropertyTenantsQuery,
  useGetPropertyTenantByIdQuery,
  useCreatePropertyTenantMutation,
  useUpdatePropertyTenantMutation,
  useDeletePropertyTenantMutation,
  useGetPropertyLeasesQuery,
  useGetPropertyLeaseByIdQuery,
  useCreatePropertyLeaseMutation,
  useUpdatePropertyLeaseMutation,
  useDeletePropertyLeaseMutation,
  useGetPropertyBillingRecordsQuery,
  useGetPropertyBillingRecordByIdQuery,
  useCreatePropertyBillingRecordMutation,
  useUpdatePropertyBillingRecordMutation,
  useDeletePropertyBillingRecordMutation,
  useGetPropertyMaintenanceRequestsQuery,
  useGetPropertyMaintenanceRequestByIdQuery,
  useCreatePropertyMaintenanceRequestMutation,
  useUpdatePropertyMaintenanceRequestMutation,
  useDeletePropertyMaintenanceRequestMutation,
  useGetPropertyStaffMembersQuery,
  useGetPropertyStaffMemberByIdQuery,
  useCreatePropertyStaffMemberMutation,
  useUpdatePropertyStaffMemberMutation,
  useDeletePropertyStaffMemberMutation,
} = propertyApi;

export default propertyApi;
