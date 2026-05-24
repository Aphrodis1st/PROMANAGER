import baseAPI from '../../utils/config/api.js';
import { crud } from '../helpers/crud.js';

const pharmacyApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    ...crud(builder, {
      plural: 'Pharmacies',
      singular: 'Pharmacy',
      path: '/pharmacies',
      tag: 'Pharmacy',
    }),

    searchPharmacies: builder.query({
      query: (params) => ({ url: '/pharmacies/search', params }),
      providesTags: [{ type: 'Pharmacy', id: 'LIST' }],
    }),

    getPharmacyPrescriptions: builder.query({
      query: (pharmacyId) => `/pharmacies/${pharmacyId}/prescriptions`,
      providesTags: ['Prescription'],
    }),

    updatePharmacyPrescriptionStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/pharmacies/prescriptions/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Prescription'],
    }),

    createPrescription: builder.mutation({
      query: (body) => ({ url: '/prescriptions', method: 'POST', body }),
      invalidatesTags: ['Prescription'],
    }),

    getPharmacyMinePrescriptions: builder.query({
      query: () => '/prescriptions/pharmacy/mine',
      providesTags: ['Prescription'],
    }),

    updatePrescriptionStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/prescriptions/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Prescription'],
    }),

    setPrescriptionPrice: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/prescriptions/${id}/price`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Prescription'],
    }),

    markPrescriptionPaid: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/prescriptions/${id}/paid`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Prescription'],
    }),

    getActiveCalls: builder.query({
      query: () => '/callcenter/active',
      providesTags: ['CallCenter'],
    }),

    getCallProviders: builder.query({
      query: (type) => ({
        url: '/callcenter/providers',
        params: { type },
      }),
    }),

    requestCall: builder.mutation({
      query: (body) => ({ url: '/callcenter/request', method: 'POST', body }),
      invalidatesTags: ['CallCenter'],
    }),

    acceptCall: builder.mutation({
      query: (id) => ({ url: `/callcenter/${id}/accept`, method: 'PATCH' }),
      invalidatesTags: ['CallCenter'],
    }),

    acceptCallByCallCenter: builder.mutation({
      query: (id) => ({
        url: `/callcenter/${id}/accept-callcenter`,
        method: 'PATCH',
      }),
      invalidatesTags: ['CallCenter'],
    }),

    endCall: builder.mutation({
      query: (id) => ({ url: `/callcenter/${id}/end`, method: 'PATCH' }),
      invalidatesTags: ['CallCenter'],
    }),
  }),
});

export const {
  useGetPharmaciesQuery,
  useGetPharmacyByIdQuery,
  useCreatePharmacyMutation,
  useUpdatePharmacyMutation,
  useDeletePharmacyMutation,
  useSearchPharmaciesQuery,
  useLazySearchPharmaciesQuery,
  useGetPharmacyPrescriptionsQuery,
  useUpdatePharmacyPrescriptionStatusMutation,
  useCreatePrescriptionMutation,
  useGetPharmacyMinePrescriptionsQuery,
  useUpdatePrescriptionStatusMutation,
  useSetPrescriptionPriceMutation,
  useMarkPrescriptionPaidMutation,
  useGetActiveCallsQuery,
  useGetCallProvidersQuery,
  useRequestCallMutation,
  useAcceptCallMutation,
  useAcceptCallByCallCenterMutation,
  useEndCallMutation,
} = pharmacyApi;

export default pharmacyApi;
