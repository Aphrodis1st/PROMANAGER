import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import StockTable from '../../components/stock/StockTable';

export default function CustomerPage() {
  const { customers, loading, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useCustomer();
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formWidth, setFormWidth] = useState(45);
  const [formHeight, setFormHeight] = useState(65);

  const [form, setForm] = useState({
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const resetForm = () => {
    setForm({
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
    setEditingId(null);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'creditLimit' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      return alert('Name, email, and phone are required.');
    }

    try {
      if (editMode) {
        await updateCustomer(editingId, form);
        alert('Customer updated successfully!');
      } else {
        await addCustomer(form);
        alert('Customer created successfully!');
      }
      resetForm();
      setFormVisible(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditingId(customer.id);
    setEditMode(true);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        alert('Customer deleted successfully!');
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Phone' },
    { name: 'address', label: 'Address' },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'postalCode', label: 'Postal Code' },
    { name: 'country', label: 'Country' },
    { name: 'taxId', label: 'Tax ID' },
    { name: 'creditLimit', label: 'Credit Limit', type: 'currency' },
    { name: 'paymentTerms', label: 'Payment Terms' },
    { name: 'status', label: 'Status' },
  ];

  return (
    <div className='bg-gray-50 min-h-screen p-6'>
      {/* Form Panel */}
      {formVisible && (
        <div
          style={{ width: `${formWidth}%`, height: `${formHeight}vh` }}
          className='ml-auto mb-6 bg-white shadow-2xl border border-gray-200 rounded-2xl p-6 transition-all duration-300 overflow-y-auto'
        >
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            {editMode ? 'Edit Customer' : 'Add New Customer'}
          </h2>

          <div className='flex gap-4 mb-4 text-sm text-gray-600'>
            <div>
              <label>Width: {formWidth}%</label>
              <input
                type='range'
                min='20'
                max='50'
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
                max='80'
                value={formHeight}
                onChange={(e) => setFormHeight(e.target.value)}
                className='w-32 ml-2'
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
              <input
                name='name'
                value={form.name}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
              <input
                name='email'
                type='email'
                value={form.email}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Phone *</label>
              <input
                name='phone'
                value={form.phone}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Tax ID</label>
              <input
                name='taxId'
                value={form.taxId}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>

            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
              <input
                name='address'
                value={form.address}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
              <input
                name='city'
                value={form.city}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
              <input
                name='state'
                value={form.state}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Postal Code</label>
              <input
                name='postalCode'
                value={form.postalCode}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Country</label>
              <input
                name='country'
                value={form.country}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Credit Limit</label>
              <input
                name='creditLimit'
                type='number'
                value={form.creditLimit}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                step='0.01'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Payment Terms</label>
              <select
                name='paymentTerms'
                value={form.paymentTerms}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              >
                <option value='Net 30'>Net 30</option>
                <option value='Net 60'>Net 60</option>
                <option value='Net 90'>Net 90</option>
                <option value='Due on Receipt'>Due on Receipt</option>
                <option value='2/10 Net 30'>2/10 Net 30</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
              <select
                name='status'
                value={form.status}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
              >
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='suspended'>Suspended</option>
              </select>
            </div>

            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label>
              <textarea
                name='notes'
                value={form.notes}
                onChange={handleChange}
                className='border w-full p-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
                rows='3'
              />
            </div>

            <div className='col-span-2 flex justify-between gap-3 mt-4'>
              <button
                type='submit'
                className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {editMode ? 'Update Customer' : 'Save Customer'}
              </button>

              <button
                type='button'
                onClick={() => {
                  setFormVisible(false);
                  resetForm();
                }}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Panel */}
      <div className='bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
              <svg className='w-8 h-8 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 00-22 0v2h2v-2z' />
              </svg>
              Customer Management
            </h1>
            <button
              onClick={() => {
                setFormVisible(!formVisible);
                resetForm();
              }}
              className='bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              Add Customer
            </button>
          </div>

          <div className='relative'>
            <svg className='absolute left-3 top-3 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            <input
              type='text'
              placeholder='Search by name, email, or phone...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-100 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Name</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Email</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Phone</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>City</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Credit Limit</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Status</th>
                <th className='px-6 py-3 text-center text-sm font-semibold text-gray-700'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='7' className='px-6 py-8 text-center text-gray-500'>
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan='7' className='px-6 py-8 text-center text-gray-500'>
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className='border-b border-gray-200 hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{customer.name}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{customer.email}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{customer.phone}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{customer.city || '-'}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{customer.creditLimit || 0}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : customer.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <div className='flex justify-center gap-2'>
                        <button
                          onClick={() => handleEdit(customer)}
                          className='p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all'
                          title='Edit'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className='p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-all'
                          title='Delete'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length > 0 && (
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600'>
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        )}
      </div>
    </div>
  );
}
