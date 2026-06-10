import React, { useState, useEffect } from 'react';
import { useStock, useStockCurrency } from '../../context/stockContext';
import { usePurchase } from '../../context/PurchaseContext';
import { usePayment } from '../../context/PaymentContext';
import { supplierInvoiceService } from '../../services/stock.service';
import StockTable from '../../components/stock/StockTable';

import { Button, Typography, Box, Grid, Paper, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon, TrendingUp, ShoppingCart, Receipt, Payment, Visibility, CheckCircle, Cancel, MonetizationOn } from '@mui/icons-material';
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';
import AddPurchaseModal from '../../components/modals/AddPurchaseModal';

function AddSupplierForm({ onAdd }) {
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact: '',
    email: '',
    tin: '',
    company: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierForm({ ...supplierForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierForm.name) return alert('Supplier name required');
    onAdd(supplierForm);
    setSupplierForm({
      name: '',
      contact: '',
      email: '',
      tin: '',
      company: '',
      location: '',
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <input
              name='name'
              value={supplierForm.name}
              onChange={handleChange}
              placeholder='Supplier Name'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              name='company'
              value={supplierForm.company}
              onChange={handleChange}
              placeholder='Company Name'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              name='email'
              value={supplierForm.email}
              onChange={handleChange}
              placeholder='Email'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              name='location'
              value={supplierForm.location}
              onChange={handleChange}
              placeholder='Location'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              name='contact'
              value={supplierForm.contact}
              onChange={handleChange}
              placeholder='+250 789999999'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              name='tin'
              value={supplierForm.tin}
              onChange={handleChange}
              placeholder='TIN:999999999'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Add Supplier
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default function PurchasesPage() {
  const {
    getById,
    productSettings,
    accountSettings,
    loading,
  } = useStock();

  const { formatAmount } = useStockCurrency();

  const {
    purchases,
    suppliers,
    invoices,
    addSupplier,
    addPurchase,
    addInvoice,
    updateInvoice,
    approveInvoice,
  } = usePurchase();

  const { addPayment } = usePayment();

  const [formVisible, setFormVisible] = useState(true);
  const [formWidth, setFormWidth] = useState(45);
  const [formHeight, setFormHeight] = useState(65);

  const [form, setForm] = useState({
    productId: '',
    productName: '',
    description: '',
    quantity: 1,
    unit: 'Kg',
    unitPrice: 0,
    discount: 0,
    tax: 0,
    totalPrice: 0,
    batchNumber: '',
    expirationDate: '',
    qualityGrade: '',
    warranty: '',
    serialNumber: '',
    storeCategory: 'Online',
    storeLocation: '',
    inventoryAccountId: '',
    type: '',
    openingStock: 0,
    paymentType: 'accrual',
    supplierId: '',
  });

  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useState('');
  const [localInvoices, setLocalInvoices] = useState([]);
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, invoice: null, action: 'view' });

  // Calculate KPI metrics
  const totalPurchases = purchases?.length || 0;
  const totalPurchaseValue = purchases?.reduce((sum, p) => sum + (Number(p.totalPrice) || 0), 0) || 0;
  const pendingInvoices = invoices?.filter(inv => inv.status === 'pending')?.length || 0;
  const paidInvoices = invoices?.filter(inv => inv.status === 'paid')?.length || 0;
  const paymentAccounts = (accountSettings || []).filter((account) => {
    const name = String(account.name || account.accountName || '').toLowerCase();
    const category = String(account.category || account.accountType || account.type || '').toLowerCase();
    const subCategory = String(account.subCategory || account.subType || '').toLowerCase();
    const statement = String(account.statement || '').toLowerCase();
    const status = String(account.status || 'active').toLowerCase();
    const code = Number(account.code);
    const searchable = [name, category, subCategory, statement, String(account.code || '').toLowerCase()].join(' ');
    const isCurrentAssetCashCode = Number.isFinite(code) && code >= 1000 && code < 1010;
    const hasPaymentName = /(cash|bank|petty|checking|savings|mobile money|wallet|cash equivalent|transit)/i.test(searchable);
    const hasBlockedName = /(inventory|stock|receivable|payable|loan|liabilit|tax|vat|revenue|income|expense|cogs|equity|depreciation|prepaid|fixed asset|property|plant|equipment)/i.test(searchable);

    if (status === 'inactive' || status === 'disabled') return false;
    if (hasBlockedName) return false;
    if (!category.includes('asset')) return false;
    if (statement && !statement.includes('balance sheet')) return false;
    if (!subCategory.includes('current') && !isCurrentAssetCashCode) return false;
    if (!hasPaymentName && !account.isCash && !account.isPaymentAccount && !account.isBankAccount && !isCurrentAssetCashCode) return false;

    return true;
  });

  const getPaymentMethodFromAccount = (accountId) => {
    const account = paymentAccounts.find((item) => String(item.id) === String(accountId));
    const name = String(account?.name || account?.accountName || '').toLowerCase();
    if (name.includes('bank') || name.includes('checking') || name.includes('savings')) return 'bank';
    return 'cash';
  };

  const calculateTotalPrice = ({ quantity, unitPrice, discount, tax }) => {
    const q = Number(quantity) || 0;
    const price = Number(unitPrice) || 0;
    const d = Number(discount) || 0;
    const t = Number(tax) || 0;

    const subtotal = q * price;
    const discountAmount = d > 1 ? d : subtotal * (d / 100);
    const taxAmount = t > 1 ? t : subtotal * (t / 100);

    return +(subtotal - discountAmount + taxAmount).toFixed(2);
  };

  useEffect(() => {
    setLocalInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    if (!selectedPaymentAccount) return;
    const stillValidPaymentAccount = paymentAccounts.some((account) => String(account.id) === String(selectedPaymentAccount));
    if (!stillValidPaymentAccount) {
      setSelectedPaymentAccount('');
    }
  }, [paymentAccounts, selectedPaymentAccount]);

  const resetForm = () => {
    setForm({
      productId: '',
      productName: '',
      description: '',
      quantity: 1,
      unit: 'Kg',
      unitPrice: 0,
      discount: 0,
      tax: 0,
      totalPrice: 0,
      batchNumber: '',
      expirationDate: '',
      qualityGrade: '',
      warranty: '',
      serialNumber: '',
      storeCategory: 'Online',
      storeLocation: '',
      inventoryAccountId: '',
      type: '',
      openingStock: 0,
      paymentType: 'accrual',
      supplierId: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === 'productId') {
      const selected = productSettings.find((ps) => ps.id === value);
      if (selected) {
        updatedForm = {
          ...updatedForm,
          productName: selected.name,
          storeCategory: selected.storeCategory || 'Online',
          qualityGrade: selected.quality,
          tax: selected.tax || 0,
          inventoryAccountId: selected.inventoryAccountId || '',
          type: selected.type,
          storeLocation: selected.mainOrSub || '',
          openingStock: selected.openingStock || 0,
        };
      }
    }

    updatedForm.totalPrice = calculateTotalPrice(updatedForm);

    setForm(updatedForm);
  };

  const addItemToInvoice = () => {
    if (!form.productId) return alert('Please select product.');
    if (!form.supplierId) return alert('Please select supplier.');

    // Calculate totalPrice before adding
    const totalPrice = calculateTotalPrice(form);

    const newItem = { ...form, id: Date.now(), totalPrice };
    setInvoiceItems((prev) => [...prev, newItem]);
    resetForm();
  };

  const submitInvoice = async () => {
    if (invoiceItems.length === 0) return alert('Add products first');

    const selectedSupplier = suppliers.find(
      (sup) => sup.id === invoiceItems[0].supplierId
    );

    const invoiceTotal = invoiceItems.reduce(
      (sum, i) => sum + Number(i.totalPrice),
      0
    );

   const newInvoice = {
  supplierId: selectedSupplier?.id || '',
  totalAmount: invoiceTotal,
  items: invoiceItems.map((i) => {
    // Find the actual account ID
    const account = accountSettings.find(acc => acc.id === i.inventoryAccountId || acc.name === i.inventoryAccountId);
    return {
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unit: i.unit,
      unitPrice: i.unitPrice,
      discount: i.discount,
      tax: i.tax,
      totalPrice: i.totalPrice,
      batchNo: i.batchNo || '',
      expiry: i.expiry || '',
      quality: i.quality || '',
      warranty: i.warranty || '',
      serialNo: i.serialNo || '',
      storeLocation: i.storeLocation,
      storeCategory: i.storeCategory,
      inventoryAccountId: account?.id || '',  // ✅ Use ID
      inventoryAccountName: account?.name || 'Unknown Account',
      type: i.type || 'Product',
      openingStock: i.openingStock || 0,
    };
  }),
  status: 'pending',
  createdAt: new Date().toISOString(),
  paymentType: invoiceItems[0]?.paymentType || 'accrual',
};

    const savedInvoice = await addInvoice(newInvoice);
    // 2️⃣ Save each invoice item as a purchase
    for (const item of invoiceItems) {
      const purchasesData = {
        ...item,
        supplierId: savedInvoice.supplierId,
        invoiceId: savedInvoice.id,
        createdAt: new Date().toISOString(),
      };
      await addPurchase(purchasesData);
    }


    setInvoiceItems([]);
    setFormVisible(false);

    console.log('✅ Invoice created with items:', savedInvoice);
  };

  const handleInvoiceAction = async (invoiceId, action) => {
  try {
    const invoice = localInvoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    // If user wants to pay, open the modal instead of updating status
    if (action === 'pay') {
      setInvoiceToPay(invoice);
      setPayModalOpen(true);
      return;
    }

    // For approve/reject actions, update invoice status
    const response = await updateInvoice(invoiceId, { status: action });
    const updatedInvoice = response?.data || response;

    // Update local state
    setLocalInvoices(prev =>
      prev.map(inv => (inv.id === invoiceId ? updatedInvoice : inv))
    );

    if (selectedInvoice?.id === invoiceId) {
      setSelectedInvoice(updatedInvoice);
    }

    console.log(`✅ Invoice ${action}d successfully:`, invoiceId);
  } catch (error) {
    console.error(error);
    alert('Error updating invoice status');
  }
};



 const confirmPayment = async (invoiceOverride = null) => {
  console.log("➡️ [confirmPayment] Payment confirmation started...");

  const activeInvoice = invoiceOverride || invoiceToPay;

  if (!selectedPaymentAccount || !activeInvoice) {
    alert("Select payment account first.");
    return;
  }

  if (!paymentAccounts.some((account) => String(account.id) === String(selectedPaymentAccount))) {
    alert("Select a valid cash or bank payment account from Chart of Accounts.");
    return;
  }

  try {
    const existingInvoice = activeInvoice?.id
      ? localInvoices.find((invoice) => String(invoice.id) === String(activeInvoice.id))
      : null;
    let invoiceData = existingInvoice || activeInvoice;

    if (!Array.isArray(invoiceData?.items) || invoiceData.items.length === 0) {
      const invoiceRes = await supplierInvoiceService.getById(activeInvoice.id);
      invoiceData = invoiceRes?.data || invoiceRes;
    }

    if (!invoiceData || !Array.isArray(invoiceData.items) || invoiceData.items.length === 0) {
      alert("Invoice has no items to process.");
      return;
    }

    // Prepare inventory lines for journal
    const inventoryMap = {};
    invoiceData.items.forEach((item) => {
      let accountId = item.inventoryAccountId;

      if (!accountId && item.inventoryAccountName) {
        const account = accountSettings.find(acc => acc.name === item.inventoryAccountName);
        if (account) accountId = account.id;
      }

      if (!accountId) {
        console.warn(`⚠️ Skipping item ${item.productName}: no valid inventory account`);
        return;
      }

      const itemTotal = Number(item.totalPrice || item.total) ||
        (Number(item.unitPrice || 0) * Number(item.quantity || 0) - Number(item.discount || 0) + Number(item.tax || 0));

      if (!inventoryMap[accountId]) {
        const account = accountSettings.find(acc => acc.id === accountId);
        inventoryMap[accountId] = {
          accountId,
          accountName: account?.name || 'Unknown Account',
          amount: 0,
        };
      }

      inventoryMap[accountId].amount += itemTotal;
    });

    const inventoryLines = Object.values(inventoryMap);
    if (inventoryLines.length === 0) {
      alert('No inventory accounts found in invoice items');
      return;
    }

    const totalAmount = inventoryLines.reduce((sum, l) => sum + l.amount, 0);

    // 1️⃣ Create payment (journal handled automatically)
    const paymentData = {
      date: new Date().toISOString(),
      amount: totalAmount,
      paymentType: "supplier",
      relatedId: invoiceData.supplierId,
      invoiceId: invoiceData.id,
      method: getPaymentMethodFromAccount(selectedPaymentAccount),
      cashOrBankAccountId: selectedPaymentAccount,
      description: `Payment for Invoice #${invoiceData.number || invoiceData.id}`,
      inventoryLines,
    };

    const savedPayment = await addPayment(paymentData);
    console.log("✅ Payment saved:", savedPayment);

    // 2️⃣ Update invoice status to paid
    await updateInvoice(invoiceData.id, { status: "paid" });

    // 3️⃣ Add purchases for each invoice item
    for (const item of invoiceData.items) {
      const accountId = item.inventoryAccountId || accountSettings.find(acc => acc.name === item.inventoryAccountName)?.id;

      if (!accountId) continue;

      await addPurchase({
        ...item,
        invoiceId: invoiceData.id,
        supplierId: invoiceData.supplierId,
        totalPrice: item.totalPrice || (item.unitPrice * item.quantity),
        inventoryAccountId: accountId,
        paymentAccountId: selectedPaymentAccount,
        date: invoiceData.date || new Date().toISOString(),
        description: `Purchases from invoice ${invoiceData.id}`,
      });

      console.log(`📥 Purchases added for product: ${item.productName}`);
    }

    // 4️⃣ Reset modal and selection
    setInvoiceToPay(null);
    setSelectedPaymentAccount("");
    setPayModalOpen(false);
    setActionDialog({ open: false, invoice: null, action: 'view' });

    console.log("✅ Payment + Purchases + Journal processed successfully");
  } catch (err) {
    console.error("🔥 Payment failed:", err);
    alert("Payment failed. Check console.");
  }
};


  const fields = [
    { name: 'productName', label: 'Item/Service' },
    { name: 'description', label: 'Description' },
    { name: 'quantity', label: 'Qty' },
    { name: 'unit', label: 'Unit' },
    { name: 'unitPrice', label: 'Unit Price' },
    { name: 'discount', label: 'Discount' },
    { name: 'tax', label: 'Tax' },
    { name: 'totalPrice', label: 'Total' },
    { name: 'batchNumber', label: 'Batch No' },
    { name: 'expirationDate', label: 'Expiry' },
    { name: 'qualityGrade', label: 'Quality' },
    { name: 'warranty', label: 'Warranty' },
    { name: 'serialNumber', label: 'Serial No' },
    { name: 'storeLocation', label: 'Store Location' },
    { name: 'storeCategory', label: 'Store Category' },
    { name: 'inventoryAccountId', label: 'Inventory Account' },
    { name: 'type', label: 'Type' },
    { name: 'openingStock', label: 'Opening Stock' },
  ];

  const storeCategories = [
    'Online',
    'Raw Materials',
    'Finished Products',
    'Service',
  ];
  const paymentTypes = ['accrual', 'cash', 'bank', 'check', 'credit'];

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
          Purchase Management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left: Invoice Details & List */}
        <Grid item xs={12} lg={12} sx={{ order: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {false && selectedInvoice && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      Invoice #{selectedInvoice.id}
                    </Typography>
                    <Chip 
                      label={selectedInvoice.status} 
                      color={selectedInvoice.status === 'paid' ? 'success' : selectedInvoice.status === 'approved' ? 'primary' : 'warning'}
                      sx={{ mr: 1 }}
                    />
                    <Chip label={selectedInvoice.paymentType} variant="outlined" />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Supplier</Typography>
                    <Typography variant="body2">{selectedInvoice.supplier?.name || 'N/A'}</Typography>
                    <Typography variant="body2">{selectedInvoice.supplier?.company}</Typography>
                    <Typography variant="body2">{selectedInvoice.supplier?.contact}</Typography>
                    <Typography variant="body2">{selectedInvoice.supplier?.email}</Typography>
                    <Typography variant="body2">{selectedInvoice.supplier?.tin}</Typography>
                    <Typography variant="body2">{selectedInvoice.supplier?.location}</Typography>
                  </Box>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <table className='w-full text-sm border min-w-[1200px] table-auto bg-white rounded-lg overflow-hidden'>
                    <thead className='bg-gray-100'>
                      <tr>
                        {fields.map((f) => (
                          <th key={f.name} className='border px-3 py-2 text-left font-semibold text-gray-700'>
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedInvoice.items || []).map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          {fields.map((f) => (
                            <td key={f.name} className='border px-3 py-2 text-gray-800'>
                              {item[f.name]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            )}

            {true && (
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>Purchases History</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>All supplier purchases and invoice payment status.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`${localInvoices.length} Invoices`} size="small" />
                    <Chip label={`${pendingInvoices} Pending`} color="warning" size="small" />
                    <Chip label={`${paidInvoices} Paid`} color="success" size="small" />
                  </Box>
                </Box>
                <Box sx={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <table className='w-full text-sm min-w-[980px] table-auto bg-white'>
                    <thead>
                      <tr>
                        <th className='px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b'>Purchase / Invoice</th>
                        <th className='px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b'>Supplier</th>
                        <th className='px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b'>Products</th>
                        <th className='px-4 py-3 text-right font-semibold text-slate-600 bg-slate-50 border-b'>Total</th>
                        <th className='px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b'>Payment Type</th>
                        <th className='px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b'>Status</th>
                        <th className='px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localInvoices?.length ? localInvoices.map((inv, idx) => {
                        const total =
                          inv.total ??
                          (inv.items?.reduce(
                            (sum, i) => sum + Number(i.totalPrice || 0),
                            0
                          ) ||
                            0);
                        const supplier = suppliers.find((sup) => sup.id === inv.supplierId) || inv.supplier || {};
                        const products = (inv.items || []).map((item) => item.productName || item.name).filter(Boolean);
                        return (
                          <tr key={inv.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                            <td className='px-4 py-3 border-b border-slate-100'>
                              <button type="button" onClick={() => setActionDialog({ open: true, invoice: inv, action: 'view' })} className='font-semibold text-slate-900 hover:text-teal-700'>
                                #{inv.invoiceNumber || inv.number || inv.id}
                              </button>
                              <div className='text-xs text-slate-500'>{inv.invoiceDate || inv.date || inv.createdAt || ''}</div>
                            </td>
                            <td className='px-4 py-3 border-b border-slate-100'>
                              <div className='font-medium text-slate-900'>{supplier.name || 'N/A'}</div>
                              <div className='text-xs text-slate-500'>{supplier.company || supplier.email || supplier.contact || ''}</div>
                            </td>
                            <td className='px-4 py-3 border-b border-slate-100 text-slate-700'>
                              {products[0] || 'No products'}
                              {products.length > 1 ? ` +${products.length - 1}` : ''}
                            </td>
                            <td className='px-4 py-3 border-b border-slate-100 text-right font-bold text-slate-900'>
                              <CurrencyDisplay amount={total} />
                            </td>
                            <td className='px-4 py-3 border-b border-slate-100'>
                              <Chip label={inv.paymentType} size="small" variant="outlined" />
                            </td>
                            <td className='px-4 py-3 border-b border-slate-100'>
                              <Chip 
                                label={inv.status} 
                                size="small"
                                color={inv.status === 'paid' ? 'success' : inv.status === 'approved' ? 'primary' : 'warning'}
                              />
                            </td>
                            <td className='px-4 py-3 border-b border-slate-100'>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => setActionDialog({ open: true, invoice: inv, action: 'view' })}
                                    sx={{ color: 'primary.main' }}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {inv.status === 'pending' && (
                                  <>
                                    <Tooltip title="Approve">
                                      <IconButton
                                        size="small"
                                        onClick={() => setActionDialog({ open: true, invoice: inv, action: 'approved' })}
                                        sx={{ color: 'success.main' }}
                                      >
                                        <CheckCircle fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject">
                                      <IconButton
                                        size="small"
                                        onClick={() => setActionDialog({ open: true, invoice: inv, action: 'rejected' })}
                                        sx={{ color: 'error.main' }}
                                      >
                                        <Cancel fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                {inv.status === 'approved' && (
                                  <Tooltip title="Pay Invoice">
                                    <IconButton
                                      size="small"
                                      onClick={() => setActionDialog({ open: true, invoice: inv, action: 'pay' })}
                                      sx={{ color: 'success.main' }}
                                    >
                                      <Payment fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                            No purchase history found. Add purchase items above and submit the invoice.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {false && payModalOpen && invoiceToPay && (
                    <Paper elevation={2} sx={{ mt: 3, p: 3, bgcolor: '#f8fafc' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Pay Invoice #{invoiceToPay.id}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Select Payment Account
                        </Typography>
                        <select
                          value={selectedPaymentAccount}
                          onChange={(e) => setSelectedPaymentAccount(e.target.value)}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        >
                          <option value=''>-- Select Account --</option>
                          {paymentAccounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.code ? `${acc.code} - ${acc.name}` : acc.name}
                            </option>
                          ))}
                        </select>
                        {paymentAccounts.length === 0 && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#b45309', mt: 1 }}>
                            No payment accounts found. Add an active cash or bank account in Chart of Accounts.
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setPayModalOpen(false);
                            setInvoiceToPay(null);
                            setSelectedPaymentAccount('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={confirmPayment}
                          sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                        >
                          Confirm Payment
                        </Button>
                      </Box>
                    </Paper>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Right: Purchase Form */}
        {formVisible && (
          <Grid item xs={12} lg={12} sx={{ order: 1 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxHeight: '80vh', overflowY: 'auto' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Add Purchase / Invoice
              </Typography>

              {/* Supplier selection & AddSupplierForm */}
              <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f8fafc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Supplier</Typography>
                  <Button
                    size="small"
                    onClick={() => setAddSupplierOpen(!addSupplierOpen)}
                    sx={{ textTransform: 'none' }}
                  >
                    {addSupplierOpen ? 'Hide' : 'Add New'}
                  </Button>
                </Box>
                <select
                  name='supplierId'
                  value={form.supplierId}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-2'
                >
                  <option value=''>Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
                {addSupplierOpen && (
                  <AddSupplierForm
                    onAdd={async (newSupplier) => {
                      const added = await addSupplier(newSupplier);
                      setForm({ ...form, supplierId: added.id });
                      setAddSupplierOpen(false);
                    }}
                  />
                )}
              </Paper>

              {/* Purchase Form Fields */}
              <form>
                <Grid container spacing={2}>
                  {fields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.name}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                        {field.label}
                      </Typography>
                      {field.name === 'productName' ? (
                        <select
                          name='productId'
                          value={form.productId}
                          onChange={handleChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        >
                          <option value=''>Select Product</option>
                          {productSettings.map((ps) => (
                            <option key={ps.id} value={ps.id}>
                              {ps.name}
                            </option>
                          ))}
                        </select>
                      ) : field.name === 'storeCategory' ? (
                        <select
                          name='storeCategory'
                          value={form.storeCategory}
                          onChange={handleChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        >
                          {storeCategories.map((cat) => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : field.name === 'inventoryAccountId' ? (
                        <select
                          name='inventoryAccountId'
                          value={form.inventoryAccountId}
                          onChange={handleChange}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        >
                          <option value=''>Select Inventory Account</option>
                          {accountSettings.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          type={
                            [
                              'quantity',
                              'unitPrice',
                              'discount',
                              'tax',
                              'openingStock',
                            ].includes(field.name)
                              ? 'number'
                              : 'text'
                          }
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        />
                      )}
                    </Grid>
                  ))}

                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#374151' }}>
                      Payment Type
                    </Typography>
                    <select
                      name='paymentType'
                      value={form.paymentType}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    >
                      {paymentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'right', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total: <CurrencyDisplay amount={form.totalPrice || 0} />
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={addItemToInvoice}
                        sx={{ borderRadius: 2 }}
                      >
                        Add to Invoice
                      </Button>
                      <Button
                        variant="contained"
                        onClick={submitInvoice}
                        sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, borderRadius: 2 }}
                      >
                        Submit Invoice
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          resetForm();
                          setInvoiceItems([]);
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        Clear Form
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>

              {invoiceItems.length > 0 && (
                <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Invoice Items (Draft)</Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table className='w-full text-sm border min-w-[1200px] table-auto bg-white rounded-lg overflow-hidden'>
                      <thead className='bg-gray-100'>
                        <tr>
                          {fields.map((f) => (
                            <th key={f.name} className='border px-3 py-2 text-left font-semibold text-gray-700'>
                              {f.label}
                            </th>
                          ))}
                          <th className='border px-3 py-2 text-left font-semibold text-gray-700'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            {fields.map((f) => (
                              <td key={f.name} className='border px-3 py-2 text-gray-800'>
                                {item[f.name]}
                              </td>
                            ))}
                            <td className='border px-3 py-2'>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setInvoiceItems((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                                sx={{ color: 'error.main' }}
                              >
                                <Cancel fontSize="small" />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total: <CurrencyDisplay amount={invoiceItems.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0)} />
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={actionDialog.open}
        onClose={() => {
          setActionDialog({ open: false, invoice: null, action: 'view' });
          setSelectedPaymentAccount('');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, bgcolor: '#0f766e', color: 'white' }}>
          {actionDialog.action === 'pay' ? 'Confirm Payment' : actionDialog.action === 'approved' ? 'Approve Purchase' : actionDialog.action === 'rejected' ? 'Reject Purchase' : 'Purchase Details'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {actionDialog.invoice && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Invoice</Typography>
                  <Typography sx={{ fontWeight: 800 }}>#{actionDialog.invoice.invoiceNumber || actionDialog.invoice.number || actionDialog.invoice.id}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={actionDialog.invoice.status || 'pending'} size="small" color={actionDialog.invoice.status === 'paid' ? 'success' : actionDialog.invoice.status === 'approved' ? 'primary' : 'warning'} />
                  </Box>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    <CurrencyDisplay amount={Number(actionDialog.invoice.totalAmount || actionDialog.invoice.total || (actionDialog.invoice.items || []).reduce((sum, item) => sum + Number(item.totalPrice || 0), 0))} />
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <table className="w-full text-sm min-w-[760px] bg-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 bg-slate-50 border-b">Product</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600 bg-slate-50 border-b">Qty</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600 bg-slate-50 border-b">Unit Price</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600 bg-slate-50 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(actionDialog.invoice.items || []).map((item, index) => (
                      <tr key={`${item.productId || item.productName || 'item'}-${index}`}>
                        <td className="px-4 py-3 border-b border-slate-100 font-semibold">{item.productName || item.name || '-'}</td>
                        <td className="px-4 py-3 border-b border-slate-100 text-right">{item.quantity || 0}</td>
                        <td className="px-4 py-3 border-b border-slate-100 text-right"><CurrencyDisplay amount={Number(item.unitPrice || 0)} /></td>
                        <td className="px-4 py-3 border-b border-slate-100 text-right font-bold"><CurrencyDisplay amount={Number(item.totalPrice || 0)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              {actionDialog.action === 'pay' && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>Payment Account</Typography>
                  <select
                    value={selectedPaymentAccount}
                    onChange={(event) => setSelectedPaymentAccount(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select cash or bank account</option>
                    {paymentAccounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.code ? `${account.code} - ${account.name}` : account.name}</option>
                    ))}
                  </select>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f8fafc' }}>
          <Button
            onClick={() => {
              setActionDialog({ open: false, invoice: null, action: 'view' });
              setSelectedPaymentAccount('');
            }}
          >
            Close
          </Button>
          {actionDialog.action === 'approved' && <Button variant="contained" onClick={() => handleInvoiceAction(actionDialog.invoice.id, 'approved')} sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' } }}>Approve</Button>}
          {actionDialog.action === 'rejected' && <Button variant="contained" color="error" onClick={() => handleInvoiceAction(actionDialog.invoice.id, 'rejected')}>Reject</Button>}
          {actionDialog.action === 'pay' && <Button variant="contained" onClick={() => confirmPayment(actionDialog.invoice)} sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}>Confirm Payment</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
