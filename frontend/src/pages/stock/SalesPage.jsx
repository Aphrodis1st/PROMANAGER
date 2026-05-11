import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock, useStockCurrency } from '../../context/stockContext';
import { useSales } from '../../context/SalesContext';
import { usePurchase } from '../../context/PurchaseContext';
import { useCustomer } from '../../context/CustomerContext';
import { inventoryService } from '../../services/stock.service';
import StockTable from '../../components/stock/StockTable';
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';

export default function SalesPage() {
  const navigate = useNavigate();
  const {
    productSettings,
    accountSettings,
    loading,
    getProductStock,
    dispenses,
  } = useStock();

  const { formatAmount, currency } = useStockCurrency();
  const { sales, addSale } = useSales();
  const { purchases } = usePurchase();
  const [inventoryData, setInventoryData] = useState([]);

  const createJournalEntry = async (entry) => {
    // Journal entry logic moved to context
    console.log('Journal entry:', entry);
  };

  const { customers, fetchCustomers, addCustomer } = useCustomer();
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    taxId: '',
    creditLimit: 0,
    paymentTerms: 'Net 30',
    status: 'active',
    notes: '',
  });

  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    storeLocation: '',
    productCategory: '',
    paymentAccountId: '',
    revenueAccountId: '',
    taxPayableAccountId: '',
  });

  // Multi-item cart
  const [cartItems, setCartItems] = useState([]);
  const [editingCartIndex, setEditingCartIndex] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await inventoryService.getReport(new Date().toISOString().split('T')[0]);
        setInventoryData(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
    fetchCustomers();
  }, []);

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
      storeLocation: '',
      productCategory: '',
      paymentAccountId: '',
      revenueAccountId: '',
      taxPayableAccountId: '',
    });
    setEditingId(null);
    setEditMode(false);
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email || !newCustomerForm.phone) {
      return alert('Please fill in Name, Email, and Phone');
    }
    try {
      const created = await addCustomer(newCustomerForm);
      setSelectedCustomerId(created.id);
      setShowCustomerForm(false);
      setNewCustomerForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        taxId: '',
        creditLimit: 0,
        paymentTerms: 'Net 30',
        status: 'active',
        notes: '',
      });
      alert('Customer created successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === 'productId') {
      const selected = productSettings.find((ps) => ps.id === value);
      if (selected) {
        // Calculate expiry date if shelf life is set
        let calculatedExpiryDate = '';
        if (selected.trackExpiryDate && selected.defaultShelfLife) {
          const today = new Date();
          const shelfLife = Number(selected.defaultShelfLife);
          const unit = selected.defaultShelfLifeUnit;
          
          if (unit === 'Days') {
            today.setDate(today.getDate() + shelfLife);
          } else if (unit === 'Months') {
            today.setMonth(today.getMonth() + shelfLife);
          } else if (unit === 'Years') {
            today.setFullYear(today.getFullYear() + shelfLife);
          }
          
          calculatedExpiryDate = today.toISOString().split('T')[0];
        }
        
        // Calculate warranty expiry if warranty is set
        let calculatedWarranty = '';
        if (selected.trackWarranty && selected.defaultWarrantyPeriod) {
          calculatedWarranty = `${selected.defaultWarrantyPeriod} ${selected.defaultWarrantyUnit}`;
        }
        
        // Get selling price from inventory data (includes finished goods prices) or fallback to product settings
        const inventoryItem = inventoryData.find(i => i.id === value);
        const isFinishedGood = inventoryItem?.isFinishedGood || selected.isFinishedGood || false;
        const sellingPrice = inventoryItem?.sellingPrice || selected.defaultSellingPrice || 0;
        
        console.log('🔍 Product selection:', {
          productId: value,
          productName: selected.name,
          isFinishedGood,
          inventorySellingPrice: inventoryItem?.sellingPrice,
          settingsSellingPrice: selected.defaultSellingPrice,
          finalSellingPrice: sellingPrice
        });
        
        updatedForm = {
          ...updatedForm,
          productName: selected.name,
          type: selected.type,
          storeLocation: selected.mainOrSub || selected.storeLocation,
          productCategory: selected.productCategory || selected.storeCategory,
          qualityGrade: selected.quality,
          tax: selected.tax || 0,
          unit: selected.unit || 'Kg',
          unitPrice: sellingPrice,
          discount: selected.defaultDiscount || 0,
          expirationDate: calculatedExpiryDate,
          warranty: calculatedWarranty,
          isFinishedGood: isFinishedGood,
        };
      }
    }

    const quantity = Number(updatedForm.quantity) || 0;
    const price = Number(updatedForm.unitPrice) || 0;
    const discount = Number(updatedForm.discount) || 0;
    const tax = Number(updatedForm.tax) || 0;

    const subtotal = quantity * price;
    const discountAmount = discount > 1 ? discount : subtotal * (discount / 100);
    const taxAmount = tax > 1 ? tax : subtotal * (tax / 100);
    updatedForm.totalPrice = subtotal - discountAmount + taxAmount;

    setForm(updatedForm);
  };

  // Add current form item to cart
  // Add current form item to cart
  const addToCart = () => {
    if (!form.productId) return alert('Please select a product.');

    // Check inventory availability
    const availableStock = getProductStock(form.productId);
    const quantity = Number(form.quantity) || 0;
    
    if (availableStock <= 0) {
      return alert('Cannot add to cart: Product is out of stock.');
    }
    
    if (quantity > availableStock) {
      return alert(`Cannot add to cart: Only ${availableStock} units available in inventory.`);
    }
    const unitPrice = Number(form.unitPrice) || 0;
    const discount = Number(form.discount) || 0;
    const tax = Number(form.tax) || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = discount > 1 ? discount : subtotal * (discount / 100);
    const taxAmount = tax > 1 ? tax : subtotal * (tax / 100);
    const totalPrice = subtotal - discountAmount + taxAmount;

    const item = {
      productId: form.productId,
      productName: form.productName || 'N/A',
      description: form.description || '',
      unit: form.unit || 'Kg',
      quantity,
      unitPrice,
      discount,
      tax,
      totalPrice,
      batchNumber: form.batchNumber,
      expirationDate: form.expirationDate,
      qualityGrade: form.qualityGrade,
      warranty: form.warranty,
      serialNumber: form.serialNumber,
      storeLocation: form.storeLocation,
      productCategory: form.productCategory,
      paymentAccountId: form.paymentAccountId,
      revenueAccountId: form.revenueAccountId,
      taxPayableAccountId: form.taxPayableAccountId,
    };

    if (editingCartIndex !== null) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[editingCartIndex] = item;
      setCartItems(updatedCart);
      setEditingCartIndex(null);
    } else {
      // Add new item
      setCartItems([...cartItems, item]);
    }
    
    resetForm();
  };


  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
    if (editingCartIndex === index) {
      setEditingCartIndex(null);
      resetForm();
    }
  };

  const editCartItem = (index) => {
    const item = cartItems[index];
    setForm({
      productId: item.productId,
      productName: item.productName,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      discount: item.discount,
      tax: item.tax,
      totalPrice: item.totalPrice,
      batchNumber: item.batchNumber,
      expirationDate: item.expirationDate,
      qualityGrade: item.qualityGrade,
      warranty: item.warranty,
      serialNumber: item.serialNumber,
      storeLocation: item.storeLocation,
      productCategory: item.productCategory,
      paymentAccountId: item.paymentAccountId,
      revenueAccountId: item.revenueAccountId,
      taxPayableAccountId: item.taxPayableAccountId,
    });
    setEditingCartIndex(index);
  };

  const cancelEditCart = () => {
    setEditingCartIndex(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return alert('Add at least one item to cart.');

    const firstItem = cartItems[0];
    if (!firstItem.paymentAccountId || !firstItem.revenueAccountId) {
      return alert('Select payment & revenue account in first item.');
    }

    try {
      console.log('Cart items before save:', cartItems);
      
      // Map cart items exactly as the invoice expects
      const itemsForSave = cartItems.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        description: i.description,
        quantity: i.quantity,
        unit: i.unit,
        unitPrice: i.unitPrice,
        discount: i.discount,
        tax: i.tax,
        totalPrice: i.totalPrice,
        batchNumber: i.batchNumber,
        expirationDate: i.expirationDate,
        qualityGrade: i.qualityGrade,
        warranty: i.warranty,
        serialNumber: i.serialNumber,
        storeLocation: i.storeLocation,
        productCategory: i.productCategory,
      }));

      console.log('Items for save:', itemsForSave);

      const totalPrice = itemsForSave.reduce((acc, i) => acc + Number(i.totalPrice), 0);

      const saleData = {
        items: itemsForSave,
        totalPrice,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Sale data to save:', saleData);

      const saved = await addSale(saleData);
      
      console.log('Saved sale:', saved);

      // Journal entry
      const taxAmount = cartItems.reduce((acc, i) => acc + Number(i.tax || 0), 0);
      const revenueAmount = totalPrice - taxAmount;

      const journalLines = [
        { accountId: firstItem.paymentAccountId, type: 'debit', amount: totalPrice },
        { accountId: firstItem.revenueAccountId, type: 'credit', amount: revenueAmount },
      ];

      if (taxAmount > 0 && firstItem.taxPayableAccountId) {
        journalLines.push({
          accountId: firstItem.taxPayableAccountId,
          type: 'credit',
          amount: taxAmount,
        });
      }

      await createJournalEntry({
        type: 'sale',
        date: new Date().toISOString(),
        description: 'Multi-item sale',
        referenceId: saved.id,
        lines: journalLines,
      });

      navigate(`/stock/invoice/${saved.id}`, { state: { sale: saved } });
      setCartItems([]);
      resetForm();
      setFormVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormVisible(true);
    setEditMode(true);
    setEditingId(item.id);
    setForm(item);
  };

  const handleRowClick = (sale) => {
    navigate(`/stock/invoice/${sale.id}`, { state: { sale } });
  };

  const fields = [
    { name: 'productName', label: 'Item/Service' },
    { name: 'description', label: 'Desc' },
    { name: 'quantity', label: 'Q' },
    { name: 'unit', label: 'Unit' },
    { name: 'unitPrice', label: 'Price', type: 'currency' },
    { name: 'discount', label: 'Disc' },
    { name: 'totalPrice', label: 'Total', type: 'currency' },
    { name: 'batchNumber', label: 'Batch No' },
    { name: 'expirationDate', label: 'Expiry' },
    { name: 'qualityGrade', label: 'Quality' },
    { name: 'warranty', label: 'Warranty' },
    { name: 'serialNumber', label: 'Serial No' },
    { name: 'storeLocation', label: 'Store Location' },
    { name: 'productCategory', label: 'Category' },
  ];

  // Flatten sales data for display
  const flattenedSales = sales.flatMap(sale => {
    console.log('Processing sale:', sale);
    
    if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
      // Multi-item sale - create a row for each item
      const flattened = sale.items.map((item, index) => {
        console.log(`Item ${index}:`, item);
        return {
          ...item,
          id: `${sale.id}-${index}`,
          saleId: sale.id,
          date: sale.date || sale.createdAt,
          productName: item.productName || '-',
          description: item.description || '-',
          quantity: item.quantity || 0,
          unit: item.unit || '-',
          unitPrice: item.unitPrice || 0,
          discount: item.discount || 0,
          totalPrice: item.totalPrice || 0,
          batchNumber: item.batchNumber || '-',
          expirationDate: item.expirationDate || '-',
          qualityGrade: item.qualityGrade || '-',
          warranty: item.warranty || '-',
          serialNumber: item.serialNumber || '-',
          storeLocation: item.storeLocation || '-',
          productCategory: item.productCategory || '-',
        };
      });
      console.log('Flattened items:', flattened);
      return flattened;
    } else {
      // Single item sale (legacy format)
      return [{
        ...sale,
        productName: sale.productName || '-',
        description: sale.description || '-',
        quantity: sale.quantity || 0,
        unit: sale.unit || '-',
        unitPrice: sale.unitPrice || 0,
        discount: sale.discount || 0,
        totalPrice: sale.totalPrice || 0,
        batchNumber: sale.batchNumber || '-',
        expirationDate: sale.expirationDate || '-',
        qualityGrade: sale.qualityGrade || '-',
        warranty: sale.warranty || '-',
        serialNumber: sale.serialNumber || '-',
        storeLocation: sale.storeLocation || '-',
        productCategory: sale.productCategory || '-',
      }];
    }
  });

  console.log('Final flattened sales:', flattenedSales);

  // Calculate dashboard metrics
  const totalSales = flattenedSales.length;
  const totalRevenue = flattenedSales.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const totalQuantity = flattenedSales.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div className='bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 min-h-screen p-6'>
      {/* Professional Dashboard Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900 flex items-center gap-3'>
              <div className='p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              Sales Management
            </h1>
            <p className='text-gray-600 mt-2 ml-12'>Track and manage all your sales transactions</p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-gray-600'>Last Updated</p>
            <p className='text-lg font-semibold text-gray-800'>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className='grid grid-cols-4 gap-4'>
          <div className='bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Total Sales</p>
                <p className='text-3xl font-bold text-gray-900 mt-2'>{totalSales}</p>
              </div>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-3'>Transactions recorded</p>
          </div>

          <div className='bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Total Revenue</p>
                <p className='text-3xl font-bold text-green-600 mt-2'><CurrencyDisplay amount={totalRevenue} showSymbol={false} /></p>
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-3'>Total amount generated</p>
          </div>

          <div className='bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Avg Order Value</p>
                <p className='text-3xl font-bold text-purple-600 mt-2'><CurrencyDisplay amount={avgOrderValue} showSymbol={false} /></p>
              </div>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-3'>Average per transaction</p>
          </div>

          <div className='bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>Total Quantity</p>
                <p className='text-3xl font-bold text-orange-600 mt-2'>{totalQuantity.toLocaleString()}</p>
              </div>
              <div className='p-3 bg-orange-100 rounded-lg'>
                <svg className='w-6 h-6 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                </svg>
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-3'>Units sold</p>
          </div>
        </div>
      </div>

      {/* Customer Selection Section */}
      <div className='mb-6 bg-white shadow-lg rounded-xl border border-gray-200 p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
            <svg className='w-6 h-6 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 00-22 0v2h2v-2z' />
            </svg>
            Customer Information
          </h3>
          <button
            onClick={() => navigate('/stock/customers')}
            className='text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
            </svg>
            Manage Customers
          </button>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Select Customer</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
            >
              <option value=''>-- Select a Customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>&nbsp;</label>
            <button
              onClick={() => setShowCustomerForm(!showCustomerForm)}
              className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              New Customer
            </button>
          </div>
        </div>

        {/* Selected Customer Info */}
        {selectedCustomerId && (() => {
          const selected = customers.find(c => c.id === selectedCustomerId);
          return selected ? (
            <div className='mt-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-lg'>
              <div className='grid grid-cols-4 gap-4'>
                <div>
                  <p className='text-xs text-gray-600 font-medium'>Name</p>
                  <p className='text-sm font-bold text-gray-800'>{selected.name}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 font-medium'>Email</p>
                  <p className='text-sm font-bold text-gray-800'>{selected.email}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 font-medium'>Phone</p>
                  <p className='text-sm font-bold text-gray-800'>{selected.phone}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 font-medium'>Status</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    selected.status === 'active' ? 'bg-green-200 text-green-800' :
                    selected.status === 'inactive' ? 'bg-gray-200 text-gray-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {selected.status}
                  </span>
                </div>
              </div>
              {selected.creditLimit > 0 && (
                <div className='mt-3 pt-3 border-t border-teal-200'>
                  <p className='text-xs text-gray-600 font-medium'>Credit Limit</p>
                  <p className='text-sm font-bold text-teal-700'>{selected.creditLimit}</p>
                </div>
              )}
            </div>
          ) : null;
        })()}
      </div>

      {/* Create New Customer Form */}
      {showCustomerForm && (
        <div className='mb-6 bg-white shadow-2xl border border-gray-200 rounded-2xl p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Create New Customer</h3>
            <button
              onClick={() => setShowCustomerForm(false)}
              className='text-gray-500 hover:text-gray-700'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          <form onSubmit={handleCreateCustomer} className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
              <input
                type='text'
                value={newCustomerForm.name}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, name: e.target.value})}
                className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
              <input
                type='email'
                value={newCustomerForm.email}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, email: e.target.value})}
                className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Phone *</label>
              <input
                type='text'
                value={newCustomerForm.phone}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, phone: e.target.value})}
                className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
              <input
                type='text'
                value={newCustomerForm.city}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, city: e.target.value})}
                className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>
            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
              <input
                type='text'
                value={newCustomerForm.address}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, address: e.target.value})}
                className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Credit Limit</label>
              <input
                type='number'
                value={newCustomerForm.creditLimit}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, creditLimit: Number(e.target.value)})}
                className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                step='0.01'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Payment Terms</label>
              <select
                value={newCustomerForm.paymentTerms}
                onChange={(e) => setNewCustomerForm({...newCustomerForm, paymentTerms: e.target.value})}
                className='w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              >
                <option value='Net 30'>Net 30</option>
                <option value='Net 60'>Net 60</option>
                <option value='Net 90'>Net 90</option>
                <option value='Due on Receipt'>Due on Receipt</option>
              </select>
            </div>
            <div className='col-span-2 flex gap-3'>
              <button
                type='submit'
                className='flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                Create Customer
              </button>
              <button
                type='button'
                onClick={() => setShowCustomerForm(false)}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {formVisible && (
        <div
          style={{ width: `${formWidth}%`, height: `${formHeight}vh` }}
          className='ml-auto mb-6 bg-white shadow-2xl border border-gray-200 rounded-2xl p-6 transition-all duration-300 overflow-y-auto'
        >
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            {editMode ? 'Edit Sale' : 'Add New Sale'}
          </h2>

          <div className='flex gap-4 mb-4 text-sm text-gray-600'>
            <div>
              <label>Width: {formWidth}%</label>
              <input
                type='range'
                min='20'
                max='35'
                value={formWidth}
                onChange={(e) => setFormWidth(e.target.value)}
                className='w-32 ml-2'
              />
            </div>
            <div>
              <label>Height: {formHeight}vh</label>
              <input
                type='range'
                min='30'
                max='45'
                value={formHeight}
                onChange={(e) => setFormHeight(e.target.value)}
                className='w-32 ml-2'
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-3'>
            {/* --- ALL YOUR ORIGINAL FORM FIELDS REMAIN EXACTLY --- */}
            <div className='col-span-3'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Item / Service</label>
              <select
                name='productId'
                value={form.productId}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              >
                <option value=''>Select Product</option>
                {productSettings.map((ps) => (
                  <option key={ps.id} value={ps.id}>{ps.name}</option>
                ))}
              </select>
              
              {/* Professional Inventory Information Display */}
              {form.productId && (() => {
                const selectedProduct = productSettings.find(p => p.id === form.productId);
                const inventoryItem = inventoryData.find(i => i.id === form.productId);
                const openingStock = Number(selectedProduct?.openingStock) || 0;
                const currentStock = Number(selectedProduct?.currentStock) || 0;
                const availableStock = getProductStock(form.productId);
                const reorderLevel = Number(selectedProduct?.reorderLevel) || 10;
                const isLowStock = availableStock < reorderLevel;
                const isOutOfStock = availableStock <= 0;
                
                const purchased = inventoryItem?.purchasedQty || 0;
                const sold = inventoryItem?.soldQty || 0;
                const production = inventoryItem?.productionQty || 0;
                const stockValue = availableStock * (Number(selectedProduct?.defaultSellingPrice) || 0);
                
                return (
                  <div className='mt-3 p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 rounded-xl shadow-lg'>
                    {/* Header Section */}
                    <div className='flex items-center justify-between mb-3 pb-3 border-b-2 border-blue-200'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-blue-600 rounded-lg'>
                          <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                          </svg>
                        </div>
                        <div>
                          <h4 className='text-base font-bold text-gray-800'>Inventory Information</h4>
                          <p className='text-xs text-gray-600'>Real-time stock data from inventory system</p>
                        </div>
                      </div>
                      
                      <div className={
                        `px-4 py-2 rounded-full font-bold text-base shadow-md ${
                          isOutOfStock 
                            ? 'bg-red-500 text-white border-2 border-red-700'
                            : isLowStock
                            ? 'bg-orange-500 text-white border-2 border-orange-700'
                            : 'bg-green-500 text-white border-2 border-green-700'
                        }`
                      }>
                        {availableStock.toLocaleString()} {selectedProduct?.unit || 'Units'}
                      </div>
                    </div>
                    
                    {/* Stock Details Grid */}
                    <div className='grid grid-cols-5 gap-3 mb-3'>
                      <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
                        <div className='flex items-center gap-2 mb-1'>
                          <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          <span className='text-xs font-medium text-gray-600'>Opening Stock</span>
                        </div>
                        <p className='text-lg font-bold text-gray-800'>{openingStock.toLocaleString()}</p>
                      </div>
                      
                      <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
                        <div className='flex items-center gap-2 mb-1'>
                          <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                          </svg>
                          <span className='text-xs font-medium text-gray-600'>Purchased</span>
                        </div>
                        <p className='text-lg font-bold text-green-600'>+{purchased.toLocaleString()}</p>
                      </div>
                      
                      <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
                        <div className='flex items-center gap-2 mb-1'>
                          <svg className='w-4 h-4 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' />
                          </svg>
                          <span className='text-xs font-medium text-gray-600'>Production</span>
                        </div>
                        <p className='text-lg font-bold text-teal-600'>+{production.toLocaleString()}</p>
                      </div>
                      
                      <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
                        <div className='flex items-center gap-2 mb-1'>
                          <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                          </svg>
                          <span className='text-xs font-medium text-gray-600'>Sold</span>
                        </div>
                        <p className='text-lg font-bold text-red-600'>-{sold.toLocaleString()}</p>
                      </div>
                      
                      <div className='bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
                        <div className='flex items-center gap-2 mb-1'>
                          <svg className='w-4 h-4 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                          </svg>
                          <span className='text-xs font-medium text-gray-600'>Reorder Level</span>
                        </div>
                        <p className='text-lg font-bold text-orange-600'>{reorderLevel.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className='grid grid-cols-3 gap-3 mb-3'>
                      {(() => {
                        const invItem = inventoryData.find(i => i.id === form.productId);
                        const displayPrice = invItem?.sellingPrice || selectedProduct?.defaultSellingPrice || 0;
                        const isFinishedGood = invItem?.isFinishedGood || selectedProduct?.isFinishedGood || false;
                        const priceSource = isFinishedGood ? '🏭 Finished Good' : (invItem?.sellingPrice ? 'From Inventory' : 'From Settings');
                        
                        return displayPrice > 0 && (
                          <div className={`bg-white p-2 rounded-lg border-2 shadow-sm ${
                            isFinishedGood ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                          }`}>
                            <div className='flex items-center gap-2'>
                              <svg className='w-4 h-4 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                              </svg>
                              <div>
                                <p className='text-xs text-gray-600'>Selling Price</p>
                                <p className={`text-sm font-bold ${
                                  isFinishedGood ? 'text-purple-700' : 'text-teal-700'
                                }`}><CurrencyDisplay amount={displayPrice} /></p>
                                <p className={`text-xs italic font-medium ${
                                  isFinishedGood ? 'text-purple-600' : 'text-gray-500'
                                }`}>{priceSource}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      
                      <div className='bg-white p-2 rounded-lg border border-gray-200 shadow-sm'>
                        <div className='flex items-center gap-2'>
                          <svg className='w-4 h-4 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
                          </svg>
                          <div>
                            <p className='text-xs text-gray-600'>Stock Value</p>
                            <p className='text-sm font-bold text-purple-700'><CurrencyDisplay amount={stockValue} /></p>
                          </div>
                        </div>
                      </div>
                      
                      {selectedProduct?.storeLocation && (
                        <div className='bg-white p-2 rounded-lg border border-gray-200 shadow-sm'>
                          <div className='flex items-center gap-2'>
                            <svg className='w-4 h-4 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            <div>
                              <p className='text-xs text-gray-600'>Location</p>
                              <p className='text-sm font-bold text-indigo-700'>{selectedProduct.storeLocation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Alerts */}
                    {isOutOfStock && (
                      <div className='flex items-center gap-2 text-sm text-white bg-red-600 px-3 py-2 rounded-lg shadow-md'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                        </svg>
                        <span className='font-bold'>⚠️ OUT OF STOCK - Cannot proceed with sale</span>
                      </div>
                    )}
                    
                    {!isOutOfStock && isLowStock && (
                      <div className='flex items-center gap-2 text-sm text-white bg-orange-600 px-3 py-2 rounded-lg shadow-md'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                        </svg>
                        <span className='font-bold'>⚠️ LOW STOCK WARNING - Only {availableStock} units remaining (Reorder at {reorderLevel})</span>
                      </div>
                    )}
                    
                    {!isOutOfStock && !isLowStock && (
                      <div className='flex items-center gap-2 text-sm text-white bg-green-600 px-3 py-2 rounded-lg shadow-md'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <span className='font-bold'>✓ STOCK AVAILABLE - Ready for sale</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Quantity</label>
              <input
                name='quantity'
                value={form.quantity}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
                type='number'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Unit</label>
              <input
                name='unit'
                value={form.unit}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
                Unit Price (Selling)
                {form.productId && (() => {
                  const invItem = inventoryData.find(i => i.id === form.productId);
                  const selectedProd = productSettings.find(p => p.id === form.productId);
                  const isFinishedGood = invItem?.isFinishedGood || selectedProd?.isFinishedGood || false;
                  const hasInventoryPrice = invItem?.sellingPrice > 0;
                  const hasSettingsPrice = selectedProd?.defaultSellingPrice > 0;
                  
                  if (isFinishedGood && hasInventoryPrice) {
                    return (
                      <span className='text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-semibold'>
                        🏭 Finished Good
                      </span>
                    );
                  } else if (hasInventoryPrice) {
                    return (
                      <span className='text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>
                        From Inventory
                      </span>
                    );
                  } else if (hasSettingsPrice) {
                    return (
                      <span className='text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full'>
                        From Settings
                      </span>
                    );
                  }
                  return null;
                })()}
              </label>
              <input
                name='unitPrice'
                value={form.unitPrice}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                type='number'
                step='0.01'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
                Discount
                {form.productId && productSettings.find(p => p.id === form.productId)?.defaultDiscount > 0 && (
                  <span className='text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full'>
                    Default
                  </span>
                )}
              </label>
              <input
                name='discount'
                value={form.discount}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                type='number'
                step='0.01'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Tax</label>
              <input
                name='tax'
                value={form.tax}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
                type='number'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Batch Number</label>
              <input
                name='batchNumber'
                value={form.batchNumber}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
                Expiration Date
                {form.expirationDate && (
                  <span className='text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full'>
                    Auto-calculated
                  </span>
                )}
              </label>
              <input
                name='expirationDate'
                value={form.expirationDate}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                type='date'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Quality Grade</label>
              <input
                name='qualityGrade'
                value={form.qualityGrade}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
                Warranty
                {form.warranty && (
                  <span className='text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full'>
                    Default
                  </span>
                )}
              </label>
              <input
                name='warranty'
                value={form.warranty}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                placeholder='e.g., 12 Months'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Serial Number</label>
              <input
                name='serialNumber'
                value={form.serialNumber}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              />
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Payment Account</label>
              <select
                name='paymentAccountId'
                value={form.paymentAccountId}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              >
                <option value=''>Select Account</option>
                {accountSettings.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Revenue Account</label>
              <select
                name='revenueAccountId'
                value={form.revenueAccountId}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              >
                <option value=''>Select Revenue Account</option>
                {accountSettings
                  .filter((acc) => acc.name.toLowerCase().includes('revenue'))
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
              </select>
            </div>

            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Tax Payable Account</label>
              <select
                name='taxPayableAccountId'
                value={form.taxPayableAccountId}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              >
                <option value=''>Select Tax Account (optional)</option>
                {accountSettings
                  .filter((acc) => acc.name.toLowerCase().includes('tax'))
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
              </select>
            </div>
            <div className='col-span-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
              <input
                name='description'
                value={form.description}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg'
              />
            </div>

            <div className='col-span-3 text-right font-semibold text-gray-800'>
              Total: <CurrencyDisplay amount={form.totalPrice || 0} />
            </div>

            <div className='col-span-3 flex justify-between gap-3 mt-2'>
              <button
                type='button'
                onClick={addToCart}
                disabled={form.productId && getProductStock(form.productId) <= 0}
                className={
                  `px-6 py-2 rounded-lg font-medium transition-all shadow-md ${
                    form.productId && getProductStock(form.productId) <= 0
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : editingCartIndex !== null
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`
                }
              >
                {editingCartIndex !== null ? (
                  <span className='flex items-center gap-2'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                    </svg>
                    Update Item
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                    </svg>
                    Add to Cart
                  </span>
                )}
              </button>

              {editingCartIndex !== null && (
                <button
                  type='button'
                  onClick={cancelEditCart}
                  className='bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md'
                >
                  Cancel Edit
                </button>
              )}

              <button
                type='submit'
                disabled={cartItems.length === 0}
                className='bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md'
              >
                <span className='flex items-center gap-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  {editMode ? 'Update Sale' : 'Save Sale'}
                </span>
              </button>

              <button
                type='button'
                onClick={() => {
                  setFormVisible(false);
                  setEditingCartIndex(null);
                  resetForm();
                }}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition-all shadow-md'
              >
                <span className='flex items-center gap-2'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                  Cancel
                </span>
              </button>
            </div>
          </form>

          {cartItems.length > 0 && (
            <div className='mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm'>
              <div className='flex justify-between items-center mb-3'>
                <h3 className='font-semibold text-gray-800 text-lg flex items-center gap-2'>
                  <svg className='w-5 h-5 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                  </svg>
                  Cart Items ({cartItems.length})
                </h3>
                {editingCartIndex !== null && (
                  <button
                    onClick={cancelEditCart}
                    className='text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-white transition-colors'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                    Cancel Edit
                  </button>
                )}
              </div>
              
              <div className='space-y-2'>
                {cartItems.map((item, i) => (
                  <div
                    key={i}
                    className={`
                      flex items-center justify-between p-3 rounded-lg transition-all
                      ${
                        editingCartIndex === i
                          ? 'bg-blue-50 border-2 border-blue-400 shadow-md'
                          : 'bg-white border border-gray-200 hover:border-teal-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='font-semibold text-gray-800'>{item.productName}</span>
                        {editingCartIndex === i && (
                          <span className='text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium'>
                            Editing
                          </span>
                        )}
                      </div>
                      <div className='text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1'>
                        <span className='flex items-center gap-1'>
                          <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14' />
                          </svg>
                          Qty: <strong>{item.quantity}</strong> {item.unit}
                        </span>
                        <span className='flex items-center gap-1'>
                          <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          @ <CurrencyDisplay amount={item.unitPrice} showSymbol={false} />
                        </span>
                        {item.discount > 0 && (
                          <span className='text-orange-600 flex items-center gap-1'>
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                            </svg>
                            Disc: {item.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className='flex items-center gap-3'>
                      <div className='text-right'>
                        <div className='text-lg font-bold text-teal-700'>
                          <CurrencyDisplay amount={item.totalPrice} />
                        </div>
                      </div>
                      
                      <div className='flex gap-1'>
                        <button
                          onClick={() => editCartItem(i)}
                          disabled={editingCartIndex !== null && editingCartIndex !== i}
                          className={
                            `p-2 rounded-lg transition-all ${
                              editingCartIndex === i
                                ? 'bg-blue-500 text-white shadow-md'
                                : editingCartIndex !== null
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow-md'
                            }`
                          }
                          title='Edit item'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => removeFromCart(i)}
                          className='p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all hover:shadow-md'
                          title='Remove item'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className='mt-4 pt-4 border-t border-gray-300'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600 font-medium'>Cart Total:</span>
                  <span className='text-2xl font-bold text-teal-700'>
                    <CurrencyDisplay amount={cartItems.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0)} />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Professional Sales Table Section */}
      <div className='bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
        <div className='bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
            </svg>
            <div>
              <h2 className='text-2xl font-bold text-white'>Sales Records</h2>
              <p className='text-teal-100 text-sm'>Complete transaction history</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFormVisible(!formVisible);
              resetForm();
            }}
            className='bg-white hover:bg-gray-100 text-teal-600 px-6 py-3 rounded-lg font-semibold transition-all shadow-md flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
            New Sale
          </button>
        </div>
        <StockTable
          title=''
          data={flattenedSales}
          fields={fields}
          updateItem={(id, data) => updateItem('sale', id, data)}
          deleteItem={(id) => deleteItem('sale', id)}
          loading={loading}
          onEdit={handleEdit}
          onAdd={() => {
            setFormVisible(!formVisible);
            resetForm();
          }}
          onRowClick={(item) => {
            // Navigate to the original sale, not the flattened item
            const originalSale = sales.find(s => s.id === item.saleId || s.id === item.id);
            if (originalSale) {
              handleRowClick(originalSale);
            }
          }}
        />
      </div>
    </div>
  );
}
