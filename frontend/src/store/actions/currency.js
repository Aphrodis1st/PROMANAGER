import baseAPI from '../../utils/config/api.js';
import { listTag } from '../helpers/crud.js';

const currencyApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencies: builder.query({
      query: () => '/currency',
      providesTags: [listTag('Currency')],
    }),

    getActiveCurrencies: builder.query({
      query: () => '/currency/active',
      providesTags: [listTag('Currency')],
    }),

    getCurrencyById: builder.query({
      query: (id) => `/currency/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Currency', id }],
    }),

    createCurrency: builder.mutation({
      query: (body) => ({ url: '/currency', method: 'POST', body }),
      invalidatesTags: [listTag('Currency')],
    }),

    updateCurrency: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/currency/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('Currency')],
    }),

    deleteCurrency: builder.mutation({
      query: (id) => ({ url: `/currency/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag('Currency')],
    }),

    initializeCurrencies: builder.mutation({
      query: () => ({ url: '/currency/initialize', method: 'POST' }),
      invalidatesTags: [listTag('Currency')],
    }),

    setDefaultCurrency: builder.mutation({
      query: (body) => ({ url: '/currency/default', method: 'POST', body }),
      invalidatesTags: ['Currency'],
    }),

    getDefaultCurrency: builder.query({
      query: ({ organizationId, moduleType }) =>
        `/currency/default/${organizationId}/${moduleType}`,
    }),

    getOrganizationCurrencySettings: builder.query({
      query: ({ organizationId, moduleType }) =>
        `/currency/settings/${organizationId}/${moduleType}`,
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetActiveCurrenciesQuery,
  useGetCurrencyByIdQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
  useInitializeCurrenciesMutation,
  useSetDefaultCurrencyMutation,
  useGetDefaultCurrencyQuery,
  useGetOrganizationCurrencySettingsQuery,
} = currencyApi;

export default currencyApi;
