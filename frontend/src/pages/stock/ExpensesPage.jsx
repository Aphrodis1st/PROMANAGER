import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useStock } from '../../context/stockContext';
import { usePurchase } from '../../context/PurchaseContext';
import { usePayment } from '../../context/PaymentContext';
import StockTable from '../../components/stock/StockTable';
import { formatCurrency, supportedCurrencies } from '../../utils/format';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Chip, 
  IconButton, 
  Tooltip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  TrendingDown, 
  Receipt, 
  Payment, 
  MonetizationOn,
  Business,
  DateRange,
  Close as CloseIcon,
  PersonAdd,
  AccountBalance,
  Visibility,
  CheckCircle
} from '@mui/icons-material';

export default function ExpensesPage() {
  const { expenses, loading, addExpense, removeExpense, refreshExpenses, updateExpense, setExpenses } =
    useExpenses();
  const { accountSettings, loading: accountsLoading, getById } = useStock();
  const { suppliers, addSupplier } = usePurchase();
  const { addPayment } = usePayment();

  const [formVisible, setFormVisible] = useState(false);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [bulkPayModalOpen, setBulkPayModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useState('');
  const [expenseInvoices, setExpenseInvoices] = useState([]);
  
  const [form, setForm] = useState({
    expenseAccount: '',
    expenseAccountName: '',
    paymentAccount: '',
    paymentAccountName: '',
    supplierId: '',
    supplierName: '',
    supplierAddress: '',
    supplierContact: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    currency: 'RWF',
    expenseDate: new Date().toISOString().slice(0, 10),
    status: 'pending',
    paymentType: 'accrual'
  });

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact: '',
    email: '',
    tin: '',
    company: '',
    location: '',
  });

  // Calculate KPI metrics
  const totalExpenses = expenses?.length || 0;
  const totalExpenseValue = expenses?.reduce((sum, exp) => sum + (Number(exp.totalAmount) || 0), 0) || 0;
  const thisMonthExpenses = expenses?.filter(exp => {
    const expDate = new Date(exp.date || exp.expenseDate);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  })?.length || 0;
  const avgExpenseValue = totalExpenses > 0 ? totalExpenseValue / totalExpenses : 0;
  const pendingExpenses = expenses?.filter(exp => exp.status === 'pending')?.length || 0;

  // Update totalAmount when quantity or unitPrice changes
  useEffect(() => {
    const q = Number(form.quantity) || 0;
    const p = Number(form.unitPrice) || 0;
    setForm((prev) => ({ ...prev, totalAmount: q * p }));
  }, [form.quantity, form.unitPrice]);

  // Create expense invoices from expenses for payment tracking
  useEffect(() => {
    const invoices = expenses?.map(exp => ({
      ...exp,
      id: exp.id,
      supplierId: exp.supplierId,
      totalAmount: exp.totalAmount,
      status: exp.status || 'pending',
      supplier: suppliers?.find(s => s.id === exp.supplierId)
    })) || [];
    setExpenseInvoices(invoices);
  }, [expenses, suppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    setSupplierForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!supplierForm.name) return alert('Supplier name required');
    
    try {
      const newSupplier = await addSupplier(supplierForm);
      setForm(prev => ({ ...prev, supplierId: newSupplier.id, supplierName: newSupplier.name }));
      setSupplierForm({
        name: '',
        contact: '',
        email: '',
        tin: '',
        company: '',
        location: '',
      });
      setAddSupplierOpen(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.expenseAccount) return alert('Please select an Expense Account.');
    if (!form.paymentAccount) return alert('Please select a Payment Account.');
    if (!form.supplierId && !form.supplierName) return alert('Please select or add a supplier.');

    try {
      const expenseData = {
        ...form,
        supplierName: form.supplierName || suppliers?.find(s => s.id === form.supplierId)?.name,
        status: 'pending', // Ensure status is set
        date: form.expenseDate // Make sure date field is properly mapped
      };
      
      await addExpense(expenseData);
      setForm({
        expenseAccount: '',
        expenseAccountName: '',
        paymentAccount: '',
        paymentAccountName: '',
        supplierId: '',
        supplierName: '',
        supplierAddress: '',
        supplierContact: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
        currency: 'RWF',
        expenseDate: new Date().toISOString().slice(0, 10),
        status: 'pending',
        paymentType: 'accrual'
      });
      setFormVisible(false);
      refreshExpenses();
    } catch (err) {
      console.error('❌ Expense submission failed:', err);
      alert(
        'Failed to save expense: ' + (err.response?.data?.error || err.message)
      );
    }
  };

  const handlePayExpense = async () => {
    if (!selectedPaymentAccount || !selectedExpense) {
      alert('Select payment account first.');
      return;
    }

    try {
      console.log('💳 Processing single expense payment...', selectedExpense);
      
      // Create payment record
      const paymentData = {
        date: new Date().toISOString(),
        amount: selectedExpense.totalAmount,
        paymentType: 'supplier',
        relatedId: selectedExpense.supplierId,
        expenseId: selectedExpense.id,
        method: 'cash',
        cashOrBankAccountId: selectedPaymentAccount,
        description: `Payment for Expense: ${selectedExpense.description}`,
        inventoryLines: [{
          accountId: selectedExpense.expenseAccount || selectedExpense.expenseAccountId,
          accountName: selectedExpense.expenseAccountName,
          amount: selectedExpense.totalAmount
        }]
      };

      await addPayment(paymentData);
      console.log('✅ Payment record created successfully');
      
      // Update local state immediately (no backend call)
      setExpenses(prev => 
        prev.map(exp => 
          exp.id === selectedExpense.id 
            ? { ...exp, status: 'paid' }
            : exp
        )
      );
      
      console.log('✅ Local expense status updated to paid');
      
      // Close modal
      setPayModalOpen(false);
      setSelectedExpense(null);
      setSelectedPaymentAccount('');
      
      console.log('✅ Single expense payment processed successfully');
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('🔥 Payment failed:', error);
      alert(`Payment failed: ${error.message || 'Unknown error'}`);
    }
  };

  const handleBulkPayment = async () => {
    if (!selectedPaymentAccount || selectedExpenses.length === 0) {
      alert('Select payment account and expenses first.');
      return;
    }

    try {
      console.log('💳 Processing bulk expense payment...', selectedExpenses);
      
      const totalAmount = selectedExpenses.reduce((sum, exp) => sum + Number(exp.totalAmount), 0);
      
      // Create inventory lines for all expenses
      const inventoryLines = selectedExpenses.map(exp => ({
        accountId: exp.expenseAccount || exp.expenseAccountId,
        accountName: exp.expenseAccountName,
        amount: exp.totalAmount,
        expenseId: exp.id
      }));

      // Create bulk payment record
      const paymentData = {
        date: new Date().toISOString(),
        amount: totalAmount,
        paymentType: 'bulk_supplier',
        method: 'cash',
        cashOrBankAccountId: selectedPaymentAccount,
        description: `Bulk payment for ${selectedExpenses.length} expenses`,
        inventoryLines,
        expenseIds: selectedExpenses.map(exp => exp.id)
      };

      await addPayment(paymentData);
      console.log('✅ Bulk payment record created successfully');
      
      // Update local state immediately for all selected expenses (no backend calls)
      const expenseIds = selectedExpenses.map(exp => exp.id);
      setExpenses(prev => 
        prev.map(exp => 
          expenseIds.includes(exp.id)
            ? { ...exp, status: 'paid' }
            : exp
        )
      );
      
      console.log(`✅ All ${selectedExpenses.length} expense statuses updated locally`);
      
      // Close modal
      setBulkPayModalOpen(false);
      setSelectedExpenses([]);
      setSelectedPaymentAccount('');
      
      console.log('✅ Bulk expense payment processed successfully');
      alert(`Bulk payment for ${selectedExpenses.length} expenses processed successfully!`);
    } catch (error) {
      console.error('🔥 Bulk payment failed:', error);
      alert(`Bulk payment failed: ${error.message || 'Unknown error'}`);
    }
  };

  const handleExpenseSelection = (expense, isSelected) => {
    if (isSelected) {
      setSelectedExpenses(prev => [...prev, expense]);
    } else {
      setSelectedExpenses(prev => prev.filter(exp => exp.id !== expense.id));
    }
  };

  const selectAllPendingExpenses = () => {
    const pendingExpenses = expenses?.filter(exp => exp.status === 'pending' || !exp.status) || [];
    setSelectedExpenses(pendingExpenses);
  };

  const clearSelection = () => {
    setSelectedExpenses([]);
  };

  const fields = [
    { name: 'expenseAccountName', label: 'Expense Account' },
    { name: 'supplierName', label: 'Supplier' },
    { name: 'description', label: 'Description' },
    { name: 'totalAmount', label: 'Total', type: 'currency' },
    { name: 'currency', label: 'Currency' },
    { name: 'status', label: 'Status' },
    { name: 'date', label: 'Date' },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Professional Dashboard Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
          Expense Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Track and manage business expenses with supplier payments
        </Typography>
      </Box>

      {/* KPI Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {totalExpenses}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Expenses
                  </Typography>
                </Box>
                <Receipt sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {formatCurrency(totalExpenseValue, 'RWF')}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Value
                  </Typography>
                </Box>
                <MonetizationOn sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {pendingExpenses}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pending Payments
                  </Typography>
                </Box>
                <DateRange sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {formatCurrency(avgExpenseValue, 'RWF')}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Average Value
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Content: Expense List */}
        <Grid item xs={12} lg={formVisible ? 8 : 12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Expenses</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {selectedExpenses.length > 0 && (
                  <>
                    <Chip 
                      label={`${selectedExpenses.length} selected`} 
                      color="primary" 
                      onDelete={clearSelection}
                    />
                    <Button
                      variant="contained"
                      startIcon={<Payment />}
                      onClick={() => setBulkPayModalOpen(true)}
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: 'success.main',
                        '&:hover': { bgcolor: 'success.dark' }
                      }}
                    >
                      Pay Selected ({selectedExpenses.length})
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  onClick={selectAllPendingExpenses}
                  sx={{ borderRadius: 2 }}
                >
                  Select All Pending
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setFormVisible(!formVisible)}
                  sx={{ borderRadius: 2 }}
                >
                  Add Expense
                </Button>
              </Box>
            </Box>
            
            {/* Enhanced Expenses Table with Selection and Payment Actions */}
            <Box sx={{ overflowX: 'auto' }}>
              <table className='w-full text-sm border min-w-[900px] table-auto bg-white rounded-lg overflow-hidden'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='border px-3 py-2 text-left font-semibold text-gray-700'>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectAllPendingExpenses();
                          } else {
                            clearSelection();
                          }
                        }}
                        checked={selectedExpenses.length > 0 && selectedExpenses.length === expenses?.filter(exp => exp.status === 'pending' || !exp.status)?.length}
                        className="rounded"
                      />
                    </th>
                    {fields.map((field) => (
                      <th key={field.name} className='border px-3 py-2 text-left font-semibold text-gray-700'>
                        {field.label}
                      </th>
                    ))}
                    <th className='border px-3 py-2 text-left font-semibold text-gray-700'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses?.map((expense, idx) => {
                    const isSelected = selectedExpenses.some(exp => exp.id === expense.id);
                    const isPending = expense.status === 'pending' || !expense.status;
                    
                    return (
                      <tr 
                        key={expense.id} 
                        className={`${
                          idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } ${isSelected ? 'ring-2 ring-blue-200 bg-blue-50' : ''}`}
                      >
                        <td className='border px-3 py-2'>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleExpenseSelection(expense, e.target.checked)}
                            disabled={!isPending}
                            className="rounded"
                          />
                        </td>
                        {fields.map((field) => (
                          <td key={field.name} className='border px-3 py-2 text-gray-800'>
                            {field.name === 'totalAmount' ? (
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatCurrency(expense[field.name], expense.currency || 'RWF')}
                              </Typography>
                            ) : field.name === 'status' ? (
                              <Chip 
                                label={expense[field.name] || 'pending'} 
                                size="small"
                                color={expense[field.name] === 'paid' ? 'success' : 'warning'}
                                sx={{ minWidth: 70 }}
                              />
                            ) : (
                              expense[field.name] || '-'
                            )}
                          </td>
                        ))}
                        <td className='border px-3 py-2'>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => setSelectedExpense(expense)}
                                sx={{ color: 'primary.main' }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {isPending && (
                              <Tooltip title="Pay Expense">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedExpense(expense);
                                    setPayModalOpen(true);
                                  }}
                                  sx={{ color: 'success.main' }}
                                >
                                  <Payment fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {expense.status === 'paid' && (
                              <Tooltip title="Paid">
                                <IconButton size="small" disabled>
                                  <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Summary Section */}
              {selectedExpenses.length > 0 && (
                <Paper elevation={1} sx={{ mt: 2, p: 2, bgcolor: '#f0f9ff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Selected Expenses Summary
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Total: {formatCurrency(
                        selectedExpenses.reduce((sum, exp) => sum + Number(exp.totalAmount), 0),
                        'RWF'
                      )}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {selectedExpenses.length} expense(s) selected for payment
                  </Typography>
                </Paper>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Professional Add Expense Form */}
        {formVisible && (
          <Grid item xs={12} lg={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxHeight: '80vh', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Add Expense
                </Typography>
                <IconButton onClick={() => setFormVisible(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Supplier Selection & Add New Supplier */}
                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: '#f8fafc' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Supplier</Typography>
                        <Button
                          size="small"
                          startIcon={<PersonAdd />}
                          onClick={() => setAddSupplierOpen(true)}
                          sx={{ textTransform: 'none' }}
                        >
                          Add New
                        </Button>
                      </Box>
                      <FormControl fullWidth>
                        <InputLabel>Select Supplier</InputLabel>
                        <Select
                          value={form.supplierId}
                          onChange={(e) => {
                            const supplier = suppliers?.find(s => s.id === e.target.value);
                            setForm(prev => ({
                              ...prev,
                              supplierId: e.target.value,
                              supplierName: supplier?.name || '',
                              supplierContact: supplier?.contact || '',
                              supplierAddress: supplier?.location || ''
                            }));
                          }}
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value=''>Select Supplier</MenuItem>
                          {suppliers?.map((supplier) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                              {supplier.name} - {supplier.company}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>

                  {/* Expense Account */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Expense Account</InputLabel>
                      <Select
                        name='expenseAccount'
                        value={form.expenseAccount}
                        onChange={(e) => {
                          const acc = accountSettings.find(
                            (a) => a.id === e.target.value
                          );
                          setForm((prev) => ({
                            ...prev,
                            expenseAccount: acc?.id,
                            expenseAccountName: acc?.name,
                          }));
                        }}
                        required
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value=''>Select Expense Account</MenuItem>
                        {accountSettings
                          .filter((a) => a.category?.toLowerCase() === 'expenses')
                          .map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                              {a.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Payment Account */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Account</InputLabel>
                      <Select
                        name='paymentAccount'
                        value={form.paymentAccount}
                        onChange={(e) => {
                          const acc = accountSettings.find(
                            (a) => a.id === e.target.value
                          );
                          setForm((prev) => ({
                            ...prev,
                            paymentAccount: acc?.id,
                            paymentAccountName: acc?.name,
                          }));
                        }}
                        required
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value=''>Select Payment Account</MenuItem>
                        {accountSettings
                          .filter((a) =>
                            ['assets', 'cash', 'bank'].includes(
                              a.category?.toLowerCase()
                            )
                          )
                          .map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                              {a.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Manual Supplier Fields (if no supplier selected) */}
                  {!form.supplierId && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Supplier Name"
                          name='supplierName'
                          value={form.supplierName}
                          onChange={handleChange}
                          required={!form.supplierId}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Supplier Contact"
                          name='supplierContact'
                          value={form.supplierContact}
                          onChange={handleChange}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Supplier Address"
                          name='supplierAddress'
                          value={form.supplierAddress}
                          onChange={handleChange}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name='description'
                      value={form.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  {/* Quantity, Unit Price, Total */}
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type='number'
                      name='quantity'
                      value={form.quantity}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Unit Price"
                      type='number'
                      name='unitPrice'
                      value={form.unitPrice}
                      onChange={handleChange}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Total Amount"
                      value={formatCurrency(form.totalAmount, form.currency)}
                      InputProps={{ readOnly: true }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          bgcolor: '#f8fafc'
                        } 
                      }}
                    />
                  </Grid>

                  {/* Currency, Date & Payment Type */}
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        name='currency'
                        value={form.currency}
                        onChange={handleChange}
                        sx={{ borderRadius: 2 }}
                      >
                        {supportedCurrencies.map((cur) => (
                          <MenuItem key={cur} value={cur}>
                            {cur}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Expense Date"
                      type='date'
                      name='expenseDate'
                      value={form.expenseDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Type</InputLabel>
                      <Select
                        name='paymentType'
                        value={form.paymentType}
                        onChange={handleChange}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value='accrual'>Accrual</MenuItem>
                        <MenuItem value='cash'>Cash</MenuItem>
                        <MenuItem value='bank'>Bank</MenuItem>
                        <MenuItem value='check'>Check</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type='submit'
                      variant='contained'
                      fullWidth
                      size='large'
                      sx={{ 
                        py: 1.5, 
                        borderRadius: 2,
                        bgcolor: 'success.main',
                        '&:hover': { bgcolor: 'success.dark' }
                      }}
                    >
                      Save Expense
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        )}
      </Grid>
      {/* Bulk Payment Modal */}
      <Dialog open={bulkPayModalOpen} onClose={() => setBulkPayModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment />
            Bulk Payment for Multiple Expenses
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Payment Summary */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {formatCurrency(
                  selectedExpenses.reduce((sum, exp) => sum + Number(exp.totalAmount), 0),
                  'RWF'
                )}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total amount for {selectedExpenses.length} selected expenses
              </Typography>
            </Paper>

            {/* Selected Expenses List */}
            <Paper elevation={1} sx={{ mb: 3, maxHeight: 300, overflowY: 'auto' }}>
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Selected Expenses</Typography>
              </Box>
              {selectedExpenses.map((expense, idx) => (
                <Box 
                  key={expense.id} 
                  sx={{ 
                    p: 2, 
                    borderBottom: idx < selectedExpenses.length - 1 ? '1px solid #e2e8f0' : 'none',
                    bgcolor: idx % 2 === 0 ? '#f9fafb' : 'white'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {expense.supplierName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {expense.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        {expense.expenseAccountName}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="body2">
                        {expense.date || expense.expenseDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'right' }}>
                        {formatCurrency(expense.totalAmount, expense.currency)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Paper>
            
            {/* Payment Account Selection */}
            <FormControl fullWidth>
              <InputLabel>Select Payment Account</InputLabel>
              <Select
                value={selectedPaymentAccount}
                onChange={(e) => setSelectedPaymentAccount(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=''>-- Select Account --</MenuItem>
                {accountSettings
                  .filter((a) => ['assets', 'cash', 'bank'].includes(a.category?.toLowerCase()))
                  .map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalance fontSize="small" />
                        {acc.name}
                      </Box>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setBulkPayModalOpen(false);
              setSelectedExpenses([]);
              setSelectedPaymentAccount('');
            }}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBulkPayment}
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'success.main', 
              '&:hover': { bgcolor: 'success.dark' },
              borderRadius: 2,
              px: 4
            }}
          >
            Process Payment ({formatCurrency(
              selectedExpenses.reduce((sum, exp) => sum + Number(exp.totalAmount), 0),
              'RWF'
            )})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Supplier Dialog */}
      <Dialog open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business />
            Add New Supplier
          </Box>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddSupplier}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supplier Name"
                  name='name'
                  value={supplierForm.name}
                  onChange={handleSupplierChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name='company'
                  value={supplierForm.company}
                  onChange={handleSupplierChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name='email'
                  type='email'
                  value={supplierForm.email}
                  onChange={handleSupplierChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact"
                  name='contact'
                  value={supplierForm.contact}
                  onChange={handleSupplierChange}
                  placeholder='+250 789999999'
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name='location'
                  value={supplierForm.location}
                  onChange={handleSupplierChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="TIN"
                  name='tin'
                  value={supplierForm.tin}
                  onChange={handleSupplierChange}
                  placeholder='999999999'
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSupplierOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSupplier} variant="contained" sx={{ borderRadius: 2 }}>
            Add Supplier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Payment Modal */}
      <Dialog open={payModalOpen} onClose={() => setPayModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment />
            Pay Single Expense
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedExpense && (
            <Box sx={{ mt: 2 }}>
              {/* Expense Details Card */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatCurrency(selectedExpense.totalAmount, selectedExpense.currency)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Payment for: {selectedExpense.supplierName}
                </Typography>
              </Paper>
              
              <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f8fafc' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Expense Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Supplier</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedExpense.supplierName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatCurrency(selectedExpense.totalAmount, selectedExpense.currency)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Date</Typography>
                    <Typography variant="body1">{selectedExpense.date || selectedExpense.expenseDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Account</Typography>
                    <Typography variant="body1">{selectedExpense.expenseAccountName}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{selectedExpense.description}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <FormControl fullWidth>
                <InputLabel>Select Payment Account</InputLabel>
                <Select
                  value={selectedPaymentAccount}
                  onChange={(e) => setSelectedPaymentAccount(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value=''>-- Select Account --</MenuItem>
                  {accountSettings
                    .filter((a) => ['assets', 'cash', 'bank'].includes(a.category?.toLowerCase()))
                    .map((acc) => (
                      <MenuItem key={acc.id} value={acc.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountBalance fontSize="small" />
                          {acc.name}
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setPayModalOpen(false);
              setSelectedExpense(null);
              setSelectedPaymentAccount('');
            }}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePayExpense}
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'success.main', 
              '&:hover': { bgcolor: 'success.dark' },
              borderRadius: 2,
              px: 4
            }}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
