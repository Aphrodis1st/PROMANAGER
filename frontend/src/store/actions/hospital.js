import baseAPI from '../../utils/config/api.js';
import { crud } from '../helpers/crud.js';

const hospitalPath = (segment) => `/hospital/${segment}`;

const hospitalApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    ...crud(builder, {
      plural: 'HospitalPatients',
      singular: 'HospitalPatient',
      path: hospitalPath('patients'),
      tag: 'HospitalPatient',
    }),
    ...crud(builder, {
      plural: 'HospitalAppointments',
      singular: 'HospitalAppointment',
      path: hospitalPath('appointments'),
      tag: 'HospitalAppointment',
    }),
    ...crud(builder, {
      plural: 'HospitalWards',
      singular: 'HospitalWard',
      path: hospitalPath('wards'),
      tag: 'HospitalWard',
    }),
    ...crud(builder, {
      plural: 'HospitalDoctors',
      singular: 'HospitalDoctor',
      path: hospitalPath('doctors'),
      tag: 'HospitalDoctor',
    }),
    ...crud(builder, {
      plural: 'HospitalDepartments',
      singular: 'HospitalDepartment',
      path: hospitalPath('departments'),
      tag: 'HospitalDepartment',
    }),
    ...crud(builder, {
      plural: 'HospitalInsuranceProviders',
      singular: 'HospitalInsuranceProvider',
      path: hospitalPath('insurance-providers'),
      tag: 'HospitalInsurance',
    }),
    ...crud(builder, {
      plural: 'HospitalPrescriptions',
      singular: 'HospitalPrescription',
      path: hospitalPath('prescriptions'),
      tag: 'HospitalPrescription',
    }),
    ...crud(builder, {
      plural: 'HospitalSpecializations',
      singular: 'HospitalSpecialization',
      path: hospitalPath('specializations'),
      tag: 'HospitalSpecialization',
    }),
    ...crud(builder, {
      plural: 'HospitalAdmissions',
      singular: 'HospitalAdmission',
      path: hospitalPath('admissions'),
      tag: 'HospitalAdmission',
    }),
    ...crud(builder, {
      plural: 'HospitalSurgeryRecords',
      singular: 'HospitalSurgeryRecord',
      path: hospitalPath('surgery-records'),
      tag: 'HospitalSurgery',
    }),
    ...crud(builder, {
      plural: 'HospitalTreatmentPlans',
      singular: 'HospitalTreatmentPlan',
      path: hospitalPath('treatment-plans'),
      tag: 'HospitalTreatmentPlan',
    }),

    getHospitalBillings: builder.query({
      query: () => hospitalPath('billing'),
      providesTags: [{ type: 'HospitalBilling', id: 'LIST' }],
    }),

    getHospitalBillingByPatient: builder.query({
      query: (patientId) => hospitalPath(`billing/patient/${patientId}`),
      providesTags: ['HospitalBilling'],
    }),

    createHospitalBilling: builder.mutation({
      query: (body) => ({
        url: hospitalPath('billing'),
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HospitalBilling', id: 'LIST' }],
    }),

    markHospitalBillingPaid: builder.mutation({
      query: (id) => ({
        url: hospitalPath(`billing/${id}/pay`),
        method: 'PUT',
      }),
      invalidatesTags: ['HospitalBilling'],
    }),

    deleteHospitalBilling: builder.mutation({
      query: (id) => ({
        url: hospitalPath(`billing/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HospitalBilling', id: 'LIST' }],
    }),

    getHospitalLabTests: builder.query({
      query: () => hospitalPath('lab'),
      providesTags: [{ type: 'HospitalLab', id: 'LIST' }],
    }),

    getHospitalLabByPatient: builder.query({
      query: (patientId) => hospitalPath(`lab/patient/${patientId}`),
    }),

    createHospitalLabTest: builder.mutation({
      query: (body) => ({ url: hospitalPath('lab'), method: 'POST', body }),
      invalidatesTags: [{ type: 'HospitalLab', id: 'LIST' }],
    }),

    updateHospitalLabTest: builder.mutation({
      query: ({ id, ...body }) => ({
        url: hospitalPath(`lab/${id}`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HospitalLab'],
    }),

    deleteHospitalLabTest: builder.mutation({
      query: (id) => ({
        url: hospitalPath(`lab/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HospitalLab', id: 'LIST' }],
    }),

    getHospitalLabOrders: builder.query({
      query: () => hospitalPath('lab/orders'),
    }),

    getHospitalLabOrderById: builder.query({
      query: (id) => hospitalPath(`lab/orders/${id}`),
    }),

    createHospitalLabOrder: builder.mutation({
      query: (body) => ({
        url: hospitalPath('lab/orders'),
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HospitalLab'],
    }),

    updateHospitalLabOrderResults: builder.mutation({
      query: ({ orderId, ...body }) => ({
        url: hospitalPath(`lab/orders/${orderId}/results`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HospitalLab'],
    }),

    getHospitalMedicalRecords: builder.query({
      query: () => hospitalPath('medical-records'),
      providesTags: [{ type: 'HospitalMedicalRecord', id: 'LIST' }],
    }),

    getHospitalMedicalRecordById: builder.query({
      query: (id) => hospitalPath(`medical-records/${id}`),
    }),

    getHospitalMedicalRecordsByPatient: builder.query({
      query: (patientId) => hospitalPath(`medical-records/patient/${patientId}`),
    }),

    createHospitalMedicalRecord: builder.mutation({
      query: (body) => ({
        url: hospitalPath('medical-records'),
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'HospitalMedicalRecord', id: 'LIST' }],
    }),

    updateHospitalMedicalRecord: builder.mutation({
      query: ({ id, ...body }) => ({
        url: hospitalPath(`medical-records/${id}`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HospitalMedicalRecord'],
    }),

    deleteHospitalMedicalRecord: builder.mutation({
      query: (id) => ({
        url: hospitalPath(`medical-records/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HospitalMedicalRecord', id: 'LIST' }],
    }),

    getHospitalSurgeryRecordsByPatient: builder.query({
      query: (patientId) => hospitalPath(`surgery-records/patient/${patientId}`),
    }),

    getHospitalTreatmentPlansByPatient: builder.query({
      query: (patientId) => hospitalPath(`treatment-plans/patient/${patientId}`),
    }),

    getHospitalPrescriptionsByPatient: builder.query({
      query: (patientId) => hospitalPath(`prescriptions/patient/${patientId}`),
    }),

    dischargeHospitalAdmission: builder.mutation({
      query: ({ id, ...body }) => ({
        url: hospitalPath(`admissions/${id}/discharge`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HospitalAdmission'],
    }),

    getHospitalVitalSignsByPatient: builder.query({
      query: (patientId) => hospitalPath(`vital-signs/patient/${patientId}`),
      providesTags: ['HospitalVitalSign'],
    }),

    getHospitalLatestVitalSigns: builder.query({
      query: (patientId) =>
        hospitalPath(`vital-signs/patient/${patientId}/latest`),
    }),

    createHospitalVitalSign: builder.mutation({
      query: (body) => ({
        url: hospitalPath('vital-signs'),
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HospitalVitalSign'],
    }),

    updateHospitalVitalSign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: hospitalPath(`vital-signs/${id}`),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HospitalVitalSign'],
    }),

    deleteHospitalVitalSign: builder.mutation({
      query: (id) => ({
        url: hospitalPath(`vital-signs/${id}`),
        method: 'DELETE',
      }),
      invalidatesTags: ['HospitalVitalSign'],
    }),
  }),
});

export const {
  useGetHospitalPatientsQuery,
  useGetHospitalPatientByIdQuery,
  useCreateHospitalPatientMutation,
  useUpdateHospitalPatientMutation,
  useDeleteHospitalPatientMutation,
  useGetHospitalAppointmentsQuery,
  useGetHospitalAppointmentByIdQuery,
  useCreateHospitalAppointmentMutation,
  useUpdateHospitalAppointmentMutation,
  useDeleteHospitalAppointmentMutation,
  useGetHospitalWardsQuery,
  useGetHospitalWardByIdQuery,
  useCreateHospitalWardMutation,
  useUpdateHospitalWardMutation,
  useDeleteHospitalWardMutation,
  useGetHospitalDoctorsQuery,
  useGetHospitalDoctorByIdQuery,
  useCreateHospitalDoctorMutation,
  useUpdateHospitalDoctorMutation,
  useDeleteHospitalDoctorMutation,
  useGetHospitalDepartmentsQuery,
  useGetHospitalDepartmentByIdQuery,
  useCreateHospitalDepartmentMutation,
  useUpdateHospitalDepartmentMutation,
  useDeleteHospitalDepartmentMutation,
  useGetHospitalInsuranceProvidersQuery,
  useGetHospitalInsuranceProviderByIdQuery,
  useCreateHospitalInsuranceProviderMutation,
  useUpdateHospitalInsuranceProviderMutation,
  useDeleteHospitalInsuranceProviderMutation,
  useGetHospitalPrescriptionsQuery,
  useGetHospitalPrescriptionByIdQuery,
  useCreateHospitalPrescriptionMutation,
  useUpdateHospitalPrescriptionMutation,
  useDeleteHospitalPrescriptionMutation,
  useGetHospitalSpecializationsQuery,
  useGetHospitalSpecializationByIdQuery,
  useCreateHospitalSpecializationMutation,
  useUpdateHospitalSpecializationMutation,
  useDeleteHospitalSpecializationMutation,
  useGetHospitalAdmissionsQuery,
  useGetHospitalAdmissionByIdQuery,
  useCreateHospitalAdmissionMutation,
  useUpdateHospitalAdmissionMutation,
  useDeleteHospitalAdmissionMutation,
  useGetHospitalSurgeryRecordsQuery,
  useGetHospitalSurgeryRecordByIdQuery,
  useCreateHospitalSurgeryRecordMutation,
  useUpdateHospitalSurgeryRecordMutation,
  useDeleteHospitalSurgeryRecordMutation,
  useGetHospitalTreatmentPlansQuery,
  useGetHospitalTreatmentPlanByIdQuery,
  useCreateHospitalTreatmentPlanMutation,
  useUpdateHospitalTreatmentPlanMutation,
  useDeleteHospitalTreatmentPlanMutation,
  useGetHospitalBillingsQuery,
  useGetHospitalBillingByPatientQuery,
  useCreateHospitalBillingMutation,
  useMarkHospitalBillingPaidMutation,
  useDeleteHospitalBillingMutation,
  useGetHospitalLabTestsQuery,
  useGetHospitalLabByPatientQuery,
  useCreateHospitalLabTestMutation,
  useUpdateHospitalLabTestMutation,
  useDeleteHospitalLabTestMutation,
  useGetHospitalLabOrdersQuery,
  useGetHospitalLabOrderByIdQuery,
  useCreateHospitalLabOrderMutation,
  useUpdateHospitalLabOrderResultsMutation,
  useGetHospitalMedicalRecordsQuery,
  useGetHospitalMedicalRecordByIdQuery,
  useGetHospitalMedicalRecordsByPatientQuery,
  useCreateHospitalMedicalRecordMutation,
  useUpdateHospitalMedicalRecordMutation,
  useDeleteHospitalMedicalRecordMutation,
  useGetHospitalSurgeryRecordsByPatientQuery,
  useGetHospitalTreatmentPlansByPatientQuery,
  useGetHospitalPrescriptionsByPatientQuery,
  useDischargeHospitalAdmissionMutation,
  useGetHospitalVitalSignsByPatientQuery,
  useGetHospitalLatestVitalSignsQuery,
  useCreateHospitalVitalSignMutation,
  useUpdateHospitalVitalSignMutation,
  useDeleteHospitalVitalSignMutation,
} = hospitalApi;

export default hospitalApi;
