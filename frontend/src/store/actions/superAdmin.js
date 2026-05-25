import baseAPI from '../../utils/config/api.js';
import { crud, listTag } from '../helpers/crud.js';

const saPath = (segment) => `/super-admin/${segment}`;

export const unwrapSuperAdminData = (response) => {
  if (response && typeof response === 'object' && 'success' in response) {
    if (response.success === false) {
      throw new Error(response.error || response.message || 'Request failed');
    }
    return response.data;
  }
  return response;
};

export const getSuperAdminErrorMessage = (error, fallback) =>
  error?.data?.error || error?.data?.message || error?.message || fallback;

const entityCrud = (builder, plural, singular, segment, tag) =>
  crud(builder, {
    plural,
    singular,
    path: saPath(segment),
    tag,
    transformResponse: unwrapSuperAdminData,
  });

const superAdminApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboardStats: builder.query({
      query: () => saPath('dashboard/stats'),
      transformResponse: unwrapSuperAdminData,
      providesTags: ['SuperAdmin'],
    }),

    getSuperAdminSystemActivity: builder.query({
      query: () => saPath('dashboard/activity'),
      transformResponse: unwrapSuperAdminData,
    }),

    getSuperAdminSystemSettings: builder.query({
      query: () => saPath('dashboard/settings'),
      transformResponse: unwrapSuperAdminData,
    }),

    ...entityCrud(builder, 'SuperAdminHospitals', 'SuperAdminHospital', 'hospitals', 'SuperAdmin'),
    ...entityCrud(
      builder,
      'SuperAdminHospitalAdmins',
      'SuperAdminHospitalAdmin',
      'hospital-admins',
      'SuperAdmin',
    ),
    ...entityCrud(builder, 'SuperAdminStocks', 'SuperAdminStock', 'stocks', 'SuperAdmin'),
    ...entityCrud(builder, 'SuperAdminPharmacies', 'SuperAdminPharmacy', 'pharmacies', 'SuperAdmin'),
    ...entityCrud(
      builder,
      'SuperAdminHROrganizations',
      'SuperAdminHROrganization',
      'hr-organizations',
      'SuperAdmin',
    ),
    ...entityCrud(builder, 'SuperAdminNGOs', 'SuperAdminNGO', 'ngos', 'SuperAdmin'),
    ...entityCrud(
      builder,
      'SuperAdminPropertyOrganizations',
      'SuperAdminPropertyOrganization',
      'property-organizations',
      'SuperAdmin',
    ),

    getSuperAdminRoles: builder.query({
      query: () => saPath('roles'),
      transformResponse: unwrapSuperAdminData,
      providesTags: [{ type: 'SuperAdmin', id: 'ROLES' }],
    }),

    createSuperAdminRole: builder.mutation({
      query: (body) => ({ url: saPath('roles'), method: 'POST', body }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'ROLES' }],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminRole: builder.mutation({
      query: ({ id, ...body }) => ({ url: saPath(`roles/${id}`), method: 'PATCH', body }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'ROLES' }],
      transformResponse: unwrapSuperAdminData,
    }),

    deleteSuperAdminRole: builder.mutation({
      query: (id) => ({ url: saPath(`roles/${id}`), method: 'DELETE' }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'ROLES' }],
      transformResponse: unwrapSuperAdminData,
    }),

    addSuperAdminSubRole: builder.mutation({
      query: ({ roleId, name }) => ({
        url: saPath(`roles/${roleId}/sub-roles`),
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'ROLES' }],
      transformResponse: unwrapSuperAdminData,
    }),

    removeSuperAdminSubRole: builder.mutation({
      query: ({ roleId, subRoleId }) => ({
        url: saPath(`roles/${roleId}/sub-roles/${subRoleId}`),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'ROLES' }],
      transformResponse: unwrapSuperAdminData,
    }),

    getSuperAdminPlatformUsers: builder.query({
      query: () => saPath('platform-users'),
      transformResponse: unwrapSuperAdminData,
      providesTags: [{ type: 'SuperAdmin', id: 'PLATFORM_USERS' }],
    }),

    createSuperAdminPlatformUser: builder.mutation({
      query: (body) => ({ url: saPath('platform-users'), method: 'POST', body }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'PLATFORM_USERS' }],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminPlatformUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: saPath(`platform-users/${id}`),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'PLATFORM_USERS' }],
      transformResponse: unwrapSuperAdminData,
    }),

    deleteSuperAdminPlatformUser: builder.mutation({
      query: (id) => ({ url: saPath(`platform-users/${id}`), method: 'DELETE' }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'PLATFORM_USERS' }],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminServiceRegistration: builder.mutation({
      query: ({ id, ...body }) => ({
        url: saPath(`service-registrations/${id}`),
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'PLATFORM_USERS' }],
      transformResponse: unwrapSuperAdminData,
    }),

    deleteSuperAdminServiceRegistration: builder.mutation({
      query: (id) => ({
        url: saPath(`service-registrations/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SuperAdmin', id: 'PLATFORM_USERS' }],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminHospitalStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: saPath(`hospitals/${id}/status`),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminHospitalFeatures: builder.mutation({
      query: ({ id, features }) => ({
        url: saPath(`hospitals/${id}/features`),
        method: 'PATCH',
        body: { features },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    softDeleteSuperAdminHospital: builder.mutation({
      query: (id) => ({
        url: saPath(`hospitals/${id}/soft-delete`),
        method: 'PATCH',
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    getSuperAdminHospitalAdminsByHospital: builder.query({
      query: (hospitalId) => saPath(`hospital-admins/hospital/${hospitalId}`),
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminHospitalAdminStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: saPath(`hospital-admins/${id}/status`),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    resetSuperAdminHospitalAdminPassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: saPath(`hospital-admins/${id}/reset-password`),
        method: 'PATCH',
        body: { newPassword },
      }),
      transformResponse: unwrapSuperAdminData,
    }),

    trackSuperAdminHospitalAdminActivity: builder.mutation({
      query: (id) => ({
        url: saPath(`hospital-admins/${id}/track-activity`),
        method: 'PATCH',
      }),
      transformResponse: unwrapSuperAdminData,
    }),

    reassignSuperAdminHospitalAdmin: builder.mutation({
      query: ({ adminId, hospitalId }) => ({
        url: saPath(`hospital-admins/${adminId}/hospital`),
        method: 'PATCH',
        body: { hospitalId, docId: adminId },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminStockStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: saPath(`stocks/${id}/status`),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminStockFeatures: builder.mutation({
      query: ({ id, features }) => ({
        url: saPath(`stocks/${id}/features`),
        method: 'PATCH',
        body: { features },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    softDeleteSuperAdminStock: builder.mutation({
      query: (id) => ({
        url: saPath(`stocks/${id}/soft-delete`),
        method: 'PATCH',
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminPharmacyStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: saPath(`pharmacies/${id}/status`),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminPharmacyFeatures: builder.mutation({
      query: ({ id, features }) => ({
        url: saPath(`pharmacies/${id}/features`),
        method: 'PATCH',
        body: { features },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    softDeleteSuperAdminPharmacy: builder.mutation({
      query: (id) => ({
        url: saPath(`pharmacies/${id}/soft-delete`),
        method: 'PATCH',
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminHROrganizationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: saPath(`hr-organizations/${id}/status`),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminHROrganizationFeatures: builder.mutation({
      query: ({ id, features }) => ({
        url: saPath(`hr-organizations/${id}/features`),
        method: 'PATCH',
        body: { features },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminNGOStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: saPath(`ngos/${id}/status`),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminNGOFeatures: builder.mutation({
      query: ({ id, features }) => ({
        url: saPath(`ngos/${id}/features`),
        method: 'PATCH',
        body: { features },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    softDeleteSuperAdminNGO: builder.mutation({
      query: (id) => ({
        url: saPath(`ngos/${id}/soft-delete`),
        method: 'PATCH',
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminPropertyOrganizationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: saPath(`property-organizations/${id}/status`),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    updateSuperAdminPropertyOrganizationFeatures: builder.mutation({
      query: ({ id, features }) => ({
        url: saPath(`property-organizations/${id}/features`),
        method: 'PATCH',
        body: { features },
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    softDeleteSuperAdminPropertyOrganization: builder.mutation({
      query: (id) => ({
        url: saPath(`property-organizations/${id}/soft-delete`),
        method: 'PATCH',
      }),
      invalidatesTags: [listTag('SuperAdmin')],
      transformResponse: unwrapSuperAdminData,
    }),

    getSuperAdminPayroll: builder.query({
      query: () => saPath('payroll'),
      transformResponse: unwrapSuperAdminData,
      providesTags: [listTag('HrPayroll')],
    }),

    getSuperAdminPayrollByOrganization: builder.query({
      query: (organizationId) => saPath(`payroll/organization/${organizationId}`),
      transformResponse: unwrapSuperAdminData,
    }),
  }),
});

export const {
  useGetSuperAdminDashboardStatsQuery,
  useGetSuperAdminSystemActivityQuery,
  useGetSuperAdminSystemSettingsQuery,
  useGetSuperAdminHospitalsQuery,
  useGetSuperAdminHospitalByIdQuery,
  useCreateSuperAdminHospitalMutation,
  useUpdateSuperAdminHospitalMutation,
  useDeleteSuperAdminHospitalMutation,
  useGetSuperAdminHospitalAdminsQuery,
  useGetSuperAdminHospitalAdminByIdQuery,
  useCreateSuperAdminHospitalAdminMutation,
  useUpdateSuperAdminHospitalAdminMutation,
  useDeleteSuperAdminHospitalAdminMutation,
  useGetSuperAdminStocksQuery,
  useGetSuperAdminStockByIdQuery,
  useCreateSuperAdminStockMutation,
  useUpdateSuperAdminStockMutation,
  useDeleteSuperAdminStockMutation,
  useGetSuperAdminPharmaciesQuery,
  useGetSuperAdminPharmacyByIdQuery,
  useCreateSuperAdminPharmacyMutation,
  useUpdateSuperAdminPharmacyMutation,
  useDeleteSuperAdminPharmacyMutation,
  useGetSuperAdminHROrganizationsQuery,
  useGetSuperAdminHROrganizationByIdQuery,
  useCreateSuperAdminHROrganizationMutation,
  useUpdateSuperAdminHROrganizationMutation,
  useDeleteSuperAdminHROrganizationMutation,
  useGetSuperAdminNGOsQuery,
  useGetSuperAdminNGOByIdQuery,
  useCreateSuperAdminNGOMutation,
  useUpdateSuperAdminNGOMutation,
  useDeleteSuperAdminNGOMutation,
  useGetSuperAdminPropertyOrganizationsQuery,
  useGetSuperAdminPropertyOrganizationByIdQuery,
  useCreateSuperAdminPropertyOrganizationMutation,
  useUpdateSuperAdminPropertyOrganizationMutation,
  useDeleteSuperAdminPropertyOrganizationMutation,
  useUpdateSuperAdminHospitalStatusMutation,
  useUpdateSuperAdminHospitalFeaturesMutation,
  useSoftDeleteSuperAdminHospitalMutation,
  useGetSuperAdminHospitalAdminsByHospitalQuery,
  useUpdateSuperAdminHospitalAdminStatusMutation,
  useResetSuperAdminHospitalAdminPasswordMutation,
  useTrackSuperAdminHospitalAdminActivityMutation,
  useReassignSuperAdminHospitalAdminMutation,
  useUpdateSuperAdminStockStatusMutation,
  useUpdateSuperAdminStockFeaturesMutation,
  useSoftDeleteSuperAdminStockMutation,
  useUpdateSuperAdminPharmacyStatusMutation,
  useUpdateSuperAdminPharmacyFeaturesMutation,
  useSoftDeleteSuperAdminPharmacyMutation,
  useUpdateSuperAdminHROrganizationStatusMutation,
  useUpdateSuperAdminHROrganizationFeaturesMutation,
  useUpdateSuperAdminNGOStatusMutation,
  useUpdateSuperAdminNGOFeaturesMutation,
  useSoftDeleteSuperAdminNGOMutation,
  useUpdateSuperAdminPropertyOrganizationStatusMutation,
  useUpdateSuperAdminPropertyOrganizationFeaturesMutation,
  useSoftDeleteSuperAdminPropertyOrganizationMutation,
  useGetSuperAdminPayrollQuery,
  useGetSuperAdminPayrollByOrganizationQuery,
  useGetSuperAdminRolesQuery,
  useCreateSuperAdminRoleMutation,
  useUpdateSuperAdminRoleMutation,
  useDeleteSuperAdminRoleMutation,
  useAddSuperAdminSubRoleMutation,
  useRemoveSuperAdminSubRoleMutation,
  useGetSuperAdminPlatformUsersQuery,
  useCreateSuperAdminPlatformUserMutation,
  useUpdateSuperAdminPlatformUserMutation,
  useDeleteSuperAdminPlatformUserMutation,
  useUpdateSuperAdminServiceRegistrationMutation,
  useDeleteSuperAdminServiceRegistrationMutation,
} = superAdminApi;

export default superAdminApi;
