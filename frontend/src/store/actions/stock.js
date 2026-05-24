import baseAPI from '../../utils/config/api.js';
import { crud, listTag } from '../helpers/crud.js';

const stockResource = (builder, plural, singular, path, tag) =>
  crud(builder, { plural, singular, path: `/stock/${path}`, tag });

const stockApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    ...stockResource(builder, 'StockProducts', 'StockProduct', 'product', 'StockProduct'),
    ...stockResource(builder, 'StockPurchases', 'StockPurchase', 'purchase', 'StockPurchase'),
    ...stockResource(builder, 'StockSales', 'StockSale', 'sales', 'StockSale'),
    ...stockResource(builder, 'StockDispenses', 'StockDispense', 'dispense', 'StockDispense'),
    ...stockResource(builder, 'StockTransfers', 'StockTransfer', 'transfer', 'StockTransfer'),
    ...stockResource(builder, 'StockJournals', 'StockJournal', 'journal', 'StockJournal'),
    ...stockResource(builder, 'StockExpenses', 'StockExpense', 'expenses', 'StockExpense'),
    ...stockResource(builder, 'StockSuppliers', 'StockSupplier', 'supplier', 'StockSupplier'),
    ...stockResource(builder, 'StockCustomers', 'StockCustomer', 'customer', 'StockCustomer'),
    ...stockResource(
      builder,
      'StockProductSettings',
      'StockProductSetting',
      'product-settings',
      'StockProductSetting',
    ),
    ...stockResource(
      builder,
      'StockAccountSettings',
      'StockAccountSetting',
      'account-settings',
      'StockAccountSetting',
    ),
    ...stockResource(builder, 'StockGlAccounts', 'StockGlAccount', 'gl-accounts', 'StockGlAccount'),

    getStockAll: builder.query({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const types = ['product', 'purchase', 'sales', 'dispense', 'transfer'];
        const results = await Promise.all(
          types.map((type) => baseQuery(`/stock/${type}`)),
        );
        const failed = results.find((r) => r.error);
        if (failed) return { error: failed.error };
        const [products, purchases, sales, dispenses, transfers] = results.map((r) => r.data);
        return { data: { products, purchases, sales, dispenses, transfers } };
      },
      providesTags: [
        listTag('StockProduct'),
        listTag('StockPurchase'),
        listTag('StockSale'),
        listTag('StockDispense'),
        listTag('StockTransfer'),
      ],
    }),

    getStockFixedAssets: builder.query({
      query: () => '/stock/fixed-assets',
      providesTags: [listTag('StockFixedAsset')],
    }),

    createStockFixedAsset: builder.mutation({
      query: (body) => ({ url: '/stock/fixed-assets', method: 'POST', body }),
      invalidatesTags: [listTag('StockFixedAsset')],
    }),

    deleteStockFixedAsset: builder.mutation({
      query: (id) => ({ url: `/stock/fixed-assets/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag('StockFixedAsset')],
    }),

    postStockDepreciation: builder.mutation({
      query: () => ({
        url: '/stock/fixed-assets/post-depreciation',
        method: 'POST',
      }),
      invalidatesTags: [listTag('StockFixedAsset')],
    }),

    getStockDepreciationSummary: builder.query({
      query: () => '/stock/fixed-assets/depreciation-summary',
    }),

    getStockInventoryReport: builder.query({
      query: (params) => ({ url: '/stock/inventory/report', params }),
      providesTags: ['StockInventory'],
    }),

    updateStockOpeningStocks: builder.mutation({
      query: () => ({
        url: '/stock/inventory/update-opening-stocks',
        method: 'POST',
      }),
      invalidatesTags: ['StockInventory'],
    }),

    getStockLedger: builder.query({
      query: (accountId) =>
        accountId ? `/stock/ledger/${accountId}` : '/stock/ledger',
    }),

    getStockTrialBalance: builder.query({
      query: () => '/stock/trialbalance',
    }),

    getStockIncomeStatement: builder.query({
      query: () => '/stock/income-statement',
    }),

    getStockBalanceSheet: builder.query({
      query: () => '/stock/balance-sheet',
    }),

    getStockCashFlow: builder.query({
      query: () => '/stock/cash-flow',
    }),

    getStockSupplierInvoices: builder.query({
      query: () => '/stock/supplier-invoices',
      providesTags: [listTag('StockSupplier')],
    }),

    getStockSupplierInvoiceById: builder.query({
      query: (id) => `/stock/supplier-invoices/${id}`,
    }),

    getStockSupplierInvoicesBySupplier: builder.query({
      query: (supplierId) => `/stock/supplier-invoices/supplier/${supplierId}`,
    }),

    createStockSupplierInvoice: builder.mutation({
      query: (body) => ({
        url: '/stock/supplier-invoices',
        method: 'POST',
        body,
      }),
      invalidatesTags: [listTag('StockSupplier')],
    }),

    updateStockSupplierInvoice: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/stock/supplier-invoices/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('StockSupplier')],
    }),

    deleteStockSupplierInvoice: builder.mutation({
      query: (id) => ({
        url: `/stock/supplier-invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [listTag('StockSupplier')],
    }),

    getStockCustomerInvoices: builder.query({
      query: () => '/stock/invoice',
      providesTags: [listTag('StockCustomer')],
    }),

    getStockCustomerInvoiceById: builder.query({
      query: (id) => `/stock/invoice/${id}`,
    }),

    getStockCustomerInvoicesByCustomer: builder.query({
      query: (customerId) => `/stock/invoice/customer/${customerId}`,
    }),

    createStockCustomerInvoice: builder.mutation({
      query: (body) => ({ url: '/stock/invoice', method: 'POST', body }),
      invalidatesTags: [listTag('StockCustomer')],
    }),

    updateStockCustomerInvoice: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/stock/invoice/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('StockCustomer')],
    }),

    deleteStockCustomerInvoice: builder.mutation({
      query: (id) => ({ url: `/stock/invoice/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag('StockCustomer')],
    }),

    getStockPayments: builder.query({
      query: () => '/stock/payment',
      providesTags: [listTag('StockPayment')],
    }),

    getStockPaymentById: builder.query({
      query: (id) => `/stock/payment/${id}`,
    }),

    createStockPayment: builder.mutation({
      query: (body) => ({ url: '/stock/payment', method: 'POST', body }),
      invalidatesTags: [listTag('StockPayment')],
    }),

    updateStockPayment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/stock/payment/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('StockPayment')],
    }),

    deleteStockPayment: builder.mutation({
      query: (id) => ({ url: `/stock/payment/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag('StockPayment')],
    }),

    getActiveStockTaxes: builder.query({
      query: () => '/stock/taxes/active',
      providesTags: [listTag('StockTax')],
    }),

    getStockTaxById: builder.query({
      query: (id) => `/stock/taxes/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'StockTax', id }],
    }),

    getStockTaxGroups: builder.query({
      query: () => '/stock/taxes/groups/all',
      providesTags: [listTag('StockTax')],
    }),

    getStockTaxes: builder.query({
      query: () => '/stock/taxes',
      providesTags: [listTag('StockTax')],
    }),

    createStockTax: builder.mutation({
      query: (body) => ({ url: '/stock/taxes', method: 'POST', body }),
      invalidatesTags: [listTag('StockTax')],
    }),

    updateStockTax: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/stock/taxes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [listTag('StockTax')],
    }),

    deleteStockTax: builder.mutation({
      query: (id) => ({ url: `/stock/taxes/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag('StockTax')],
    }),
  }),
});

export const {
  useGetStockProductsQuery,
  useGetStockProductByIdQuery,
  useCreateStockProductMutation,
  useUpdateStockProductMutation,
  useDeleteStockProductMutation,
  useGetStockPurchasesQuery,
  useGetStockPurchaseByIdQuery,
  useCreateStockPurchaseMutation,
  useUpdateStockPurchaseMutation,
  useDeleteStockPurchaseMutation,
  useGetStockSalesQuery,
  useGetStockSaleByIdQuery,
  useCreateStockSaleMutation,
  useUpdateStockSaleMutation,
  useDeleteStockSaleMutation,
  useGetStockDispensesQuery,
  useGetStockDispenseByIdQuery,
  useCreateStockDispenseMutation,
  useUpdateStockDispenseMutation,
  useDeleteStockDispenseMutation,
  useGetStockTransfersQuery,
  useGetStockTransferByIdQuery,
  useCreateStockTransferMutation,
  useUpdateStockTransferMutation,
  useDeleteStockTransferMutation,
  useGetStockJournalsQuery,
  useGetStockJournalByIdQuery,
  useCreateStockJournalMutation,
  useUpdateStockJournalMutation,
  useDeleteStockJournalMutation,
  useGetStockExpensesQuery,
  useGetStockExpenseByIdQuery,
  useCreateStockExpenseMutation,
  useUpdateStockExpenseMutation,
  useDeleteStockExpenseMutation,
  useGetStockSuppliersQuery,
  useGetStockSupplierByIdQuery,
  useCreateStockSupplierMutation,
  useUpdateStockSupplierMutation,
  useDeleteStockSupplierMutation,
  useGetStockCustomersQuery,
  useGetStockCustomerByIdQuery,
  useCreateStockCustomerMutation,
  useUpdateStockCustomerMutation,
  useDeleteStockCustomerMutation,
  useGetStockProductSettingsQuery,
  useGetStockProductSettingByIdQuery,
  useCreateStockProductSettingMutation,
  useUpdateStockProductSettingMutation,
  useDeleteStockProductSettingMutation,
  useGetStockAccountSettingsQuery,
  useGetStockAccountSettingByIdQuery,
  useCreateStockAccountSettingMutation,
  useUpdateStockAccountSettingMutation,
  useDeleteStockAccountSettingMutation,
  useGetStockGlAccountsQuery,
  useGetStockGlAccountByIdQuery,
  useCreateStockGlAccountMutation,
  useUpdateStockGlAccountMutation,
  useDeleteStockGlAccountMutation,
  useGetStockAllQuery,
  useGetStockFixedAssetsQuery,
  useCreateStockFixedAssetMutation,
  useDeleteStockFixedAssetMutation,
  usePostStockDepreciationMutation,
  useGetStockDepreciationSummaryQuery,
  useGetStockInventoryReportQuery,
  useUpdateStockOpeningStocksMutation,
  useGetStockLedgerQuery,
  useGetStockTrialBalanceQuery,
  useGetStockIncomeStatementQuery,
  useGetStockBalanceSheetQuery,
  useGetStockCashFlowQuery,
  useGetStockSupplierInvoicesQuery,
  useGetStockSupplierInvoiceByIdQuery,
  useGetStockSupplierInvoicesBySupplierQuery,
  useCreateStockSupplierInvoiceMutation,
  useUpdateStockSupplierInvoiceMutation,
  useDeleteStockSupplierInvoiceMutation,
  useGetStockCustomerInvoicesQuery,
  useGetStockCustomerInvoiceByIdQuery,
  useGetStockCustomerInvoicesByCustomerQuery,
  useCreateStockCustomerInvoiceMutation,
  useUpdateStockCustomerInvoiceMutation,
  useDeleteStockCustomerInvoiceMutation,
  useGetStockPaymentsQuery,
  useGetStockPaymentByIdQuery,
  useCreateStockPaymentMutation,
  useUpdateStockPaymentMutation,
  useDeleteStockPaymentMutation,
  useGetActiveStockTaxesQuery,
  useGetStockTaxByIdQuery,
  useGetStockTaxGroupsQuery,
  useGetStockTaxesQuery,
  useCreateStockTaxMutation,
  useUpdateStockTaxMutation,
  useDeleteStockTaxMutation,
} = stockApi;

export default stockApi;
