import baseAPI from '../../utils/config/api.js';
import { crud, listTag } from '../helpers/crud.js';

const hrApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    ...crud(builder, {
      plural: 'HrOrganizations',
      singular: 'HrOrganization',
      path: '/hr/organizations',
      tag: 'HrOrganization',
    }),
    ...crud(builder, {
      plural: 'HrEmployees',
      singular: 'HrEmployee',
      path: '/hr/employees',
      tag: 'HrEmployee',
    }),
    ...crud(builder, {
      plural: 'HrDepartments',
      singular: 'HrDepartment',
      path: '/hr/departments',
      tag: 'HrDepartment',
    }),
    ...crud(builder, {
      plural: 'HrShifts',
      singular: 'HrShift',
      path: '/hr/shifts',
      tag: 'HrShift',
    }),
    ...crud(builder, {
      plural: 'HrContracts',
      singular: 'HrContract',
      path: '/hr/contracts',
      tag: 'HrContract',
    }),
    ...crud(builder, {
      plural: 'HrPerformanceReviews',
      singular: 'HrPerformanceReview',
      path: '/hr/performance',
      tag: 'HrPerformance',
    }),

    getHrDashboard: builder.query({
      query: (params) => ({ url: '/hr/dashboard', params }),
      providesTags: ['HrDashboard'],
    }),

    getHrAttendance: builder.query({
      query: (params) => ({ url: '/hr/attendance', params }),
      providesTags: [listTag('HrAttendance')],
    }),

    checkInHrAttendance: builder.mutation({
      query: (body) => ({ url: '/hr/attendance/check-in', method: 'POST', body }),
      invalidatesTags: [listTag('HrAttendance')],
    }),

    checkOutHrAttendance: builder.mutation({
      query: (id) => ({
        url: `/hr/attendance/${id}/check-out`,
        method: 'PUT',
      }),
      invalidatesTags: [listTag('HrAttendance')],
    }),

    getHrLeaves: builder.query({
      query: (params) => ({ url: '/hr/leaves', params }),
      providesTags: [listTag('HrLeave')],
    }),

    createHrLeave: builder.mutation({
      query: (body) => ({ url: '/hr/leaves', method: 'POST', body }),
      invalidatesTags: [listTag('HrLeave')],
    }),

    approveHrLeave: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/hr/leaves/${id}/approve`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('HrLeave')],
    }),

    rejectHrLeave: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/hr/leaves/${id}/reject`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('HrLeave')],
    }),

    getHrPayroll: builder.query({
      query: (params) => ({ url: '/hr/payroll', params }),
      providesTags: [listTag('HrPayroll')],
    }),

    getHrPayrollByOrganization: builder.query({
      query: ({ organizationId, month, year }) => ({
        url: `/hr/payroll/organization/${organizationId}`,
        params: { month, year },
      }),
      providesTags: [listTag('HrPayroll')],
    }),

    processHrPayroll: builder.mutation({
      query: (body) => ({ url: '/hr/payroll/process', method: 'POST', body }),
      invalidatesTags: [listTag('HrPayroll')],
    }),

    generateHrPayroll: builder.mutation({
      query: (body) => ({ url: '/hr/payroll/generate', method: 'POST', body }),
      invalidatesTags: [listTag('HrPayroll')],
    }),
  }),
});

export const {
  useGetHrOrganizationsQuery,
  useGetHrOrganizationByIdQuery,
  useCreateHrOrganizationMutation,
  useUpdateHrOrganizationMutation,
  useDeleteHrOrganizationMutation,
  useGetHrEmployeesQuery,
  useGetHrEmployeeByIdQuery,
  useCreateHrEmployeeMutation,
  useUpdateHrEmployeeMutation,
  useDeleteHrEmployeeMutation,
  useGetHrDepartmentsQuery,
  useGetHrDepartmentByIdQuery,
  useCreateHrDepartmentMutation,
  useUpdateHrDepartmentMutation,
  useDeleteHrDepartmentMutation,
  useGetHrShiftsQuery,
  useGetHrShiftByIdQuery,
  useCreateHrShiftMutation,
  useUpdateHrShiftMutation,
  useDeleteHrShiftMutation,
  useGetHrContractsQuery,
  useGetHrContractByIdQuery,
  useCreateHrContractMutation,
  useUpdateHrContractMutation,
  useDeleteHrContractMutation,
  useGetHrPerformanceReviewsQuery,
  useGetHrPerformanceReviewByIdQuery,
  useCreateHrPerformanceReviewMutation,
  useUpdateHrPerformanceReviewMutation,
  useDeleteHrPerformanceReviewMutation,
  useGetHrDashboardQuery,
  useGetHrAttendanceQuery,
  useCheckInHrAttendanceMutation,
  useCheckOutHrAttendanceMutation,
  useGetHrLeavesQuery,
  useCreateHrLeaveMutation,
  useApproveHrLeaveMutation,
  useRejectHrLeaveMutation,
  useGetHrPayrollQuery,
  useGetHrPayrollByOrganizationQuery,
  useProcessHrPayrollMutation,
  useGenerateHrPayrollMutation,
} = hrApi;

export default hrApi;
