import baseAPI from '../../utils/config/api.js';

const extractReport = (data) => {
  if (data?.report) return data.report;
  throw new Error(data?.message || 'Invalid report data received');
};

const hospitalReportsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getHospitalReportDepartments: builder.query({
      query: () => '/hospital/departments',
      transformResponse: (data) => data?.departments || [],
      providesTags: ['HospitalDepartments'],
    }),
    getPatientReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/hospital/reports/patients',
        params: { startDate, endDate },
      }),
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
    getDepartmentReport: builder.query({
      query: ({ startDate, endDate, departmentId }) => ({
        url: '/hospital/reports/departments',
        params: {
          startDate,
          endDate,
          ...(departmentId ? { departmentId } : {}),
        },
      }),
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
    getFinancialReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/hospital/reports/financial',
        params: { startDate, endDate },
      }),
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
    getAuditReport: builder.query({
      query: () => '/hospital/reports/audit',
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
    getLabReport: builder.query({
      query: () => '/hospital/reports/lab',
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
    getMedicalRecordReport: builder.query({
      query: () => '/hospital/reports/medical-records',
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
    getProfessionalReport: builder.query({
      query: () => '/hospital/reports/generate',
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
    getDashboardReport: builder.query({
      query: ({ period }) => ({
        url: '/hospital/reports/dashboard',
        params: { period },
      }),
      transformResponse: extractReport,
      providesTags: ['HospitalReports'],
    }),
  }),
});

export const {
  useGetHospitalReportDepartmentsQuery,
  useLazyGetPatientReportQuery,
  useLazyGetDepartmentReportQuery,
  useLazyGetFinancialReportQuery,
  useLazyGetAuditReportQuery,
  useLazyGetLabReportQuery,
  useLazyGetMedicalRecordReportQuery,
  useLazyGetProfessionalReportQuery,
  useLazyGetDashboardReportQuery,
} = hospitalReportsApi;

export default hospitalReportsApi;
