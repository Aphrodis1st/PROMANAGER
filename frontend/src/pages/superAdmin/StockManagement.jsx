import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import { superAdminService } from '../../services/hospitalService';

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newStock, setNewStock] = useState({
    name: '',
    location: '',
    contactInfo: { phone: '', email: '' },
    subscriptionPlan: 'basic',
    featuresEnabled: []
  });

  const availableFeatures = [
    { id: 'inventory', name: 'Inventory Management', category: 'Stock Management' },
    { id: 'purchases', name: 'Purchases', category: 'Stock Management' },
    { id: 'sales', name: 'Customer/Sales', category: 'Stock Management' },
    { id: 'dispense', name: 'Dispense', category: 'Stock Management' },
    { id: 'transfers', name: 'Transfers', category: 'Stock Management' },
    { id: 'adjustments', name: 'Stock Adjustments', category: 'Stock Management' },
    { id: 'returns', name: 'Returns', category: 'Stock Management' },
    { id: 'invoice', name: 'Invoice Management', category: 'Stock Management' },
    { id: 'production_plan', name: 'Production Planning', category: 'Production' },
    { id: 'production_cycle', name: 'Production Cycle', category: 'Production' },
    { id: 'finished_goods', name: 'Finished Goods', category: 'Production' },
    { id: 'production_cost', name: 'Production Cost', category: 'Production' },
    { id: 'material_consumption', name: 'Material Consumption', category: 'Production' },
    { id: 'production_reports', name: 'Production Reports', category: 'Production' },
    { id: 'general_journal', name: 'General Journal', category: 'Accounting' },
    { id: 'expenses', name: 'Expenses', category: 'Accounting' },
    { id: 'fixed_assets', name: 'Fixed Assets', category: 'Accounting' },
    { id: 'chart_of_accounts', name: 'Chart of Accounts', category: 'Accounting' },
    { id: 'reports_dashboard', name: 'Reports Dashboard', category: 'Reports' },
    { id: 'trial_balance', name: 'Trial Balance', category: 'Reports' },
    { id: 'financial_reports', name: 'Financial Reports', category: 'Reports' },
    { id: 'stock_reports', name: 'Stock Reports', category: 'Reports' },
    { id: 'product_settings', name: 'Product Settings', category: 'Settings' },
    { id: 'user_settings', name: 'User Settings', category: 'Settings' }
  ];

  const subscriptionPlans = [
    { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-800' },
    { value: 'premium', label: 'Premium', color: 'bg-blue-100 text-blue-800' },
    { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
  ];

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await superAdminService.getAllStocks();
      console.log('📦 Fetched stocks response:', response);
      if (response.success) {
        console.log('✅ Stocks data:', response.data);
        setStocks(response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStock = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.createStock(newStock);
      if (response.success) {
        setStocks([...stocks, response.data]);
        setShowCreateModal(false);
        setNewStock({
          name: '',
          location: '',
          contactInfo: { phone: '', email: '' },
          subscriptionPlan: 'basic',
          featuresEnabled: []
        });
      }
    } catch (error) {
      console.error('Error creating stock:', error);
    }
  };

  const handleStatusChange = async (stockId, newStatus) => {
    try {
      const response = await superAdminService.updateStockStatus(stockId, newStatus);
      if (response.success) {
        setStocks(stocks.map(s => 
          s.id === stockId ? { ...s, status: newStatus } : s
        ));
      }
    } catch (error) {
      console.error('Error updating stock status:', error);
    }
  };

  const handleUpdateFeatures = async (stockId, features) => {
    try {
      const response = await superAdminService.updateStockFeatures(stockId, features);
      if (response.success) {
        setStocks(stocks.map(s => 
          s.id === stockId ? { ...s, featuresEnabled: features } : s
        ));
        setShowFeaturesModal(false);
      }
    } catch (error) {
      console.error('Error updating stock features:', error);
    }
  };

  const handleSoftDelete = async (stockId) => {
    if (window.confirm('Are you sure you want to soft delete this stock? It can be recovered later.')) {
      try {
        await superAdminService.softDeleteStock(stockId);
        fetchStocks();
      } catch (error) {
        console.error('Error soft deleting stock:', error);
      }
    }
  };

  const handleHardDelete = async (stockId) => {
    if (window.confirm('Are you sure you want to permanently delete this stock? This action cannot be undone.')) {
      try {
        await superAdminService.hardDeleteStock(stockId);
        setStocks(stocks.filter(s => s.id !== stockId));
      } catch (error) {
        console.error('Error hard deleting stock:', error);
      }
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
            <p className="text-gray-600 mt-1">Manage all stock entities in the system ({stocks.length} total)</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Stock</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stocks by name, location, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks
            .filter((stock) => {
              const search = searchTerm.toLowerCase();
              return (
                stock.name?.toLowerCase().includes(search) ||
                stock.location?.toLowerCase().includes(search) ||
                stock.contactInfo?.email?.toLowerCase().includes(search) ||
                stock.contactInfo?.phone?.toLowerCase().includes(search)
              );
            })
            .map((stock) => (
            <div key={stock.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{stock.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{stock.location}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    stock.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stock.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="text-sm font-medium">{stock.contactInfo?.email}</p>
                    <p className="text-sm font-medium">{stock.contactInfo?.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Subscription:</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      subscriptionPlans.find(p => p.value === stock.subscriptionPlan)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {stock.subscriptionPlan}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Features ({stock.featuresEnabled?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1">
                      {stock.featuresEnabled?.slice(0, 3).map((featureId) => {
                        const feature = availableFeatures.find(f => f.id === featureId);
                        return (
                          <span key={featureId} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {feature?.name || featureId}
                          </span>
                        );
                      })}
                      {stock.featuresEnabled?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{stock.featuresEnabled.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(
                      stock.id, 
                      stock.status === 'active' ? 'suspended' : 'active'
                    )}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      stock.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {stock.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedStock(stock);
                      setShowFeaturesModal(true);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium"
                  >
                    Features
                  </button>
                  
                  <button
                    onClick={() => handleSoftDelete(stock.id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-xs font-medium"
                  >
                    Soft Delete
                  </button>
                  
                  <button
                    onClick={() => handleHardDelete(stock.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stocks.filter((stock) => {
          const search = searchTerm.toLowerCase();
          return (
            stock.name?.toLowerCase().includes(search) ||
            stock.location?.toLowerCase().includes(search) ||
            stock.contactInfo?.email?.toLowerCase().includes(search) ||
            stock.contactInfo?.phone?.toLowerCase().includes(search)
          );
        }).length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 font-bold text-blue-600">🔍</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {searchTerm ? 'No stocks match your search' : 'No stocks found'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first stock entity to get started'}
            </p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Stock</h2>
            <form onSubmit={handleCreateStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Name</label>
                <input
                  type="text"
                  required
                  value={newStock.name}
                  onChange={(e) => setNewStock({...newStock, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newStock.location}
                  onChange={(e) => setNewStock({...newStock, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newStock.contactInfo.email}
                  onChange={(e) => setNewStock({
                    ...newStock, 
                    contactInfo: {...newStock.contactInfo, email: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newStock.contactInfo.phone}
                  onChange={(e) => setNewStock({
                    ...newStock, 
                    contactInfo: {...newStock.contactInfo, phone: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={newStock.subscriptionPlan}
                  onChange={(e) => setNewStock({...newStock, subscriptionPlan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {subscriptionPlans.map(plan => (
                    <option key={plan.value} value={plan.value}>{plan.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeaturesModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 my-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage Features</h2>
                <p className="text-gray-600 mt-1">{selectedStock.name}</p>
              </div>
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedStock.featuresEnabled?.length || 0} of {availableFeatures.length} features enabled
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStock({
                    ...selectedStock,
                    featuresEnabled: availableFeatures.map(f => f.id)
                  })}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedStock({
                    ...selectedStock,
                    featuresEnabled: []
                  })}
                  className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {['Stock Management', 'Production', 'Accounting', 'Reports', 'Settings'].map(category => {
                const categoryFeatures = availableFeatures.filter(f => f.category === category);
                if (categoryFeatures.length === 0) return null;
                
                return (
                  <div key={category} className="mb-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-2 px-2 py-1 bg-gray-100 rounded">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categoryFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedStock.featuresEnabled?.includes(feature.id) || false}
                            onChange={(e) => {
                              const updatedFeatures = e.target.checked
                                ? [...(selectedStock.featuresEnabled || []), feature.id]
                                : (selectedStock.featuresEnabled || []).filter(f => f !== feature.id);
                              setSelectedStock({...selectedStock, featuresEnabled: updatedFeatures});
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {feature.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex space-x-3 pt-4 border-t mt-4">
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateFeatures(selectedStock.id, selectedStock.featuresEnabled)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Features
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default StockManagement;
