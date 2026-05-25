import baseAPI from '../../utils/config/api.js';
import { listTag } from '../helpers/crud.js';

const adminPath = (segment) => `/hospital/admin${segment}`;

const hospitalAdminApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getHospitalAdminDashboard: builder.query({
      query: () => adminPath('/dashboard'),
      providesTags: ['HospitalAdmin'],
    }),

    getHospitalAdminUsers: builder.query({
      query: () => adminPath('/users'),
      providesTags: [listTag('HospitalAdmin')],
    }),

    createHospitalAdminUser: builder.mutation({
      query: (body) => ({ url: adminPath('/users'), method: 'POST', body }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    updateHospitalAdminUser: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: adminPath(`/users/${userId}`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    deleteHospitalAdminUser: builder.mutation({
      query: (userId) => ({
        url: adminPath(`/users/${userId}`),
        method: 'DELETE',
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    assignHospitalAdminUserRole: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: adminPath(`/users/${userId}/role`),
        method: 'POST',
        body,
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    changeHospitalAdminUserRole: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: adminPath(`/users/${userId}/role`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    resetHospitalAdminUserPassword: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: adminPath(`/users/${userId}/reset-password`),
        method: 'POST',
        body,
      }),
    }),

    toggleHospitalAdminUserAccess: builder.mutation({
      query: (userId) => ({
        url: adminPath(`/users/${userId}/toggle-access`),
        method: 'POST',
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    updateHospitalAdminUserPermissions: builder.mutation({
      query: ({ userId, permissions }) => ({
        url: adminPath(`/users/${userId}/permissions`),
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    setHospitalAdminPartialPassword: builder.mutation({
      query: ({ userId, ...body }) => ({
        url: adminPath(`/users/${userId}/partial-password`),
        method: 'POST',
        body,
      }),
    }),

    bulkUpdateHospitalAdminUserStatus: builder.mutation({
      query: (body) => ({
        url: adminPath('/users/bulk/status'),
        method: 'POST',
        body,
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    bulkDeleteHospitalAdminUsers: builder.mutation({
      query: (body) => ({
        url: adminPath('/users/bulk/delete'),
        method: 'POST',
        body,
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    getHospitalAdminDepartments: builder.query({
      query: () => adminPath('/departments'),
      providesTags: [{ type: 'HospitalDepartment', id: 'ADMIN_LIST' }],
    }),

    createHospitalAdminDepartment: builder.mutation({
      query: (body) => ({
        url: adminPath('/departments'),
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HospitalDepartment', id: 'ADMIN_LIST' }],
    }),

    updateHospitalAdminDepartment: builder.mutation({
      query: ({ deptId, ...body }) => ({
        url: adminPath(`/departments/${deptId}`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'HospitalDepartment', id: 'ADMIN_LIST' }],
    }),

    deleteHospitalAdminDepartment: builder.mutation({
      query: (deptId) => ({
        url: adminPath(`/departments/${deptId}`),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HospitalDepartment', id: 'ADMIN_LIST' }],
    }),

    assignHospitalDepartmentHead: builder.mutation({
      query: ({ deptId, userId }) => ({
        url: adminPath(`/departments/${deptId}/head`),
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: [{ type: 'HospitalDepartment', id: 'ADMIN_LIST' }],
    }),

    getHospitalAdminStaff: builder.query({
      query: () => adminPath('/staff'),
    }),

    getHospitalAdminStaffByDepartment: builder.query({
      query: (deptId) => adminPath(`/departments/${deptId}/staff`),
    }),

    assignHospitalAdminStaffToDepartment: builder.mutation({
      query: ({ staffId, ...body }) => ({
        url: adminPath(`/staff/${staffId}/department`),
        method: 'POST',
        body,
      }),
    }),

    getHospitalAdminPatients: builder.query({
      query: () => adminPath('/patients'),
      providesTags: [{ type: 'HospitalPatient', id: 'ADMIN_LIST' }],
    }),

    getHospitalAdminAppointments: builder.query({
      query: () => adminPath('/appointments'),
      providesTags: [{ type: 'HospitalAppointment', id: 'ADMIN_LIST' }],
    }),

    createHospitalSubAdmin: builder.mutation({
      query: (body) => ({
        url: adminPath('/sub-admin'),
        method: 'POST',
        body,
      }),
      invalidatesTags: [listTag('HospitalAdmin')],
    }),

    getHospitalAdminAccessControl: builder.query({
      query: () => adminPath('/access-control'),
    }),

    getHospitalProfessionalRoles: builder.query({
      query: () => adminPath('/roles'),
    }),
  }),
});

export const {
  useGetHospitalAdminDashboardQuery,
  useGetHospitalAdminUsersQuery,
  useCreateHospitalAdminUserMutation,
  useUpdateHospitalAdminUserMutation,
  useDeleteHospitalAdminUserMutation,
  useAssignHospitalAdminUserRoleMutation,
  useChangeHospitalAdminUserRoleMutation,
  useResetHospitalAdminUserPasswordMutation,
  useToggleHospitalAdminUserAccessMutation,
  useUpdateHospitalAdminUserPermissionsMutation,
  useSetHospitalAdminPartialPasswordMutation,
  useBulkUpdateHospitalAdminUserStatusMutation,
  useBulkDeleteHospitalAdminUsersMutation,
  useGetHospitalAdminDepartmentsQuery,
  useCreateHospitalAdminDepartmentMutation,
  useUpdateHospitalAdminDepartmentMutation,
  useDeleteHospitalAdminDepartmentMutation,
  useAssignHospitalDepartmentHeadMutation,
  useGetHospitalAdminStaffQuery,
  useGetHospitalAdminStaffByDepartmentQuery,
  useAssignHospitalAdminStaffToDepartmentMutation,
  useGetHospitalAdminPatientsQuery,
  useGetHospitalAdminAppointmentsQuery,
  useCreateHospitalSubAdminMutation,
  useGetHospitalAdminAccessControlQuery,
  useGetHospitalProfessionalRolesQuery,
} = hospitalAdminApi;

export default hospitalAdminApi;
