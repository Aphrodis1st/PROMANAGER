import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock } from '../../context/stockContext';
import { useSales } from '../../context/SalesContext';
import StockTable from '../../components/stock/StockTable';

export default function SalesPage() {
  const navigate = useNavigate();
  const {
    productSettings,
    accountSettings,
    loading,
    getProductStock,
  } = useStock();

  const { sales, addSale } = useSales();

  const createJournalEntry = async (entry) => {
    // Journal entry logic moved to context
    console.log('Journal entry:', entry);
  };

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
        
        updatedForm = {
          ...updatedForm,
          productName: selected.name,
          type: selected.type,
          storeLocation: selected.mainOrSub || selected.storeLocation,
          productCategory: selected.productCategory || selected.storeCategory,
          qualityGrade: selected.quality,
          tax: selected.tax || 0,
          unit: selected.unit || 'Kg',
          unitPrice: selected.defaultSellingPrice || 0,
          discount: selected.defaultDiscount || 0,
          expirationDate: calculatedExpiryDate,
          warranty: calculatedWarranty,
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

    const quantity = Number(form.quantity) || 0;
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

  return (
    <div className='bg-gray-50 min-h-screen p-6'>
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
            <div className='col-span-1'>
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
                Unit Price
                {form.productId && productSettings.find(p => p.id === form.productId)?.defaultSellingPrice > 0 && (
                  <span className='text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full'>
                    Default
                  </span>
                )}
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
              Total: ${form.totalPrice || '0.00'}
            </div>

            <div className='col-span-3 flex justify-between gap-3 mt-2'>
              <button
                type='button'
                onClick={addToCart}
                className={
                  `px-6 py-2 rounded-lg font-medium transition-all shadow-md ${
                    editingCartIndex !== null
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
                          @ RWF {Number(item.unitPrice).toLocaleString()}
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
                          RWF {Number(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    RWF {cartItems
                      .reduce((sum, i) => sum + Number(i.totalPrice || 0), 0)
                      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className='bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden'>
        <StockTable
          title='Sales'
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
