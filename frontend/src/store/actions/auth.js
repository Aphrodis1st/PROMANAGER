import baseAPI from '../../utils/config/api.js';

const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // General auth (/auth)
    unifiedLogin: builder.mutation({
      query: (body) => ({ url: '/auth/unified-login', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    refreshAuthToken: builder.mutation({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body }),
    }),
    getAuthMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    // Stock auth (/stock/auth)
    stockRegister: builder.mutation({
      query: (body) => ({ url: '/stock/auth/register', method: 'POST', body }),
    }),
    stockLogin: builder.mutation({
      query: (body) => ({ url: '/stock/auth/login', method: 'POST', body }),
    }),
    stockLogout: builder.mutation({
      query: () => ({ url: '/stock/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    getStockMe: builder.query({
      query: () => '/stock/auth/me',
      providesTags: ['Auth'],
    }),
    stockForgotPassword: builder.mutation({
      query: (body) => ({ url: '/stock/auth/forgot-password', method: 'POST', body }),
    }),
    stockResetPassword: builder.mutation({
      query: (body) => ({ url: '/stock/auth/reset-password', method: 'POST', body }),
    }),
    stockRefreshToken: builder.mutation({
      query: (body) => ({ url: '/stock/auth/refresh', method: 'POST', body }),
    }),

    // Hospital auth
    hospitalLogin: builder.mutation({
      query: (body) => ({ url: '/hospital/auth/login', method: 'POST', body }),
    }),
    hospitalCompletePassword: builder.mutation({
      query: (body) => ({ url: '/hospital/auth/complete-password', method: 'POST', body }),
    }),
    updateHospitalProfile: builder.mutation({
      query: (body) => ({ url: '/hospital/auth/profile', method: 'PUT', body }),
      invalidatesTags: ['Auth'],
    }),
    changeHospitalPassword: builder.mutation({
      query: (body) => ({ url: '/hospital/auth/password', method: 'PUT', body }),
    }),
    updateHospitalSettings: builder.mutation({
      query: (body) => ({ url: '/hospital/auth/settings', method: 'PUT', body }),
    }),
    getHospitalAnalytics: builder.query({
      query: (timeRange = '7d') => ({
        url: '/hospital/auth/analytics',
        params: { timeRange },
      }),
    }),

    // HR auth
    hrLogin: builder.mutation({
      query: (body) => ({ url: '/hr/auth/login', method: 'POST', body }),
    }),
  }),
});

export const {
  useUnifiedLoginMutation,
  useLoginMutation,
  useRegisterMutation,
  useRefreshAuthTokenMutation,
  useGetAuthMeQuery,
  useLazyGetAuthMeQuery,
  useStockRegisterMutation,
  useStockLoginMutation,
  useStockLogoutMutation,
  useGetStockMeQuery,
  useStockForgotPasswordMutation,
  useStockResetPasswordMutation,
  useStockRefreshTokenMutation,
  useHospitalLoginMutation,
  useHospitalCompletePasswordMutation,
  useUpdateHospitalProfileMutation,
  useChangeHospitalPasswordMutation,
  useUpdateHospitalSettingsMutation,
  useGetHospitalAnalyticsQuery,
  useHrLoginMutation,
} = authApi;

export default authApi;
